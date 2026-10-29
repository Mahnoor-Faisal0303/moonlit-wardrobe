"use client";

import { collection, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { exploreTabs, type Item } from "@/data/content";
import { getDb, getFirebaseStorage, isFirebaseConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { SelectField, TextField } from "./fields";
import { useItems } from "./ItemsProvider";
import { Button, ButtonLink } from "./ui";
import { useIsAdmin } from "./useIsAdmin";

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type Form = {
  name: string;
  category: string;
  price: string;
  discountedPrice: string;
  fabric: string;
  colour: string;
  description: string;
};

const emptyForm: Form = { name: "", category: exploreTabs[0], price: "", discountedPrice: "", fabric: "", colour: "", description: "" };

function validate(f: Form, files: File[]): string | null {
  if (!f.name.trim()) return "Enter the item name.";
  const price = Number(f.price);
  if (!f.price || !Number.isFinite(price) || price <= 0) return "Enter a valid price.";
  if (f.discountedPrice) {
    const d = Number(f.discountedPrice);
    if (!Number.isFinite(d) || d <= 0) return "Enter a valid discounted price, or leave it empty.";
    if (d >= price) return "The discounted price must be lower than the price.";
  }
  if (!f.fabric.trim()) return "Enter the fabric.";
  if (!f.colour.trim()) return "Enter the colour.";
  if (!f.description.trim()) return "Enter a description.";
  if (files.length === 0) return "Add at least one photo.";
  return null;
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center text-sm text-muted">{children}</div>;
}

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading, errorCode } = useIsAdmin();

  if (!isFirebaseConfigured) return <Notice>{NOT_CONFIGURED_MESSAGE}</Notice>;
  if (authLoading || loading) return <div className="mt-10 h-64 animate-pulse rounded-lg bg-surface-strong" aria-busy />;
  if (!user) {
    return (
      <Notice>
        <p>Sign in with an admin account to manage items.</p>
        <ButtonLink href="/signin" className="mt-5">Sign in</ButtonLink>
      </Notice>
    );
  }
  if (!isAdmin) {
    const denied = errorCode === "permission-denied";
    return (
      <Notice>
        <p className="font-medium text-fg">Your account does not have admin access.</p>
        <p className="mt-3">Signed in as {user.email}</p>
        <p className="mt-1">
          User ID: <code className="select-all break-all rounded bg-surface-strong px-1.5 py-0.5 text-xs text-fg">{user.userId}</code>
        </p>
        <p className="mt-4 text-xs leading-5">
          {denied
            ? "Firestore refused the check (permission-denied). Deploy the latest firestore.rules, which contain the admins rule, then reload this page."
            : errorCode
              ? `The admin check failed (${errorCode}). Check your connection and Firebase setup.`
              : "No document was found at admins/<User ID> in this project. The document ID must be exactly the User ID above."}
        </p>
      </Notice>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
      <AddItemForm userId={user.userId} />
      <ManageItems />
    </div>
  );
}

function AddItemForm({ userId }: { userId: string }) {
  const [form, setForm] = useState<Form>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const set = (key: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list);
    const bad = picked.find((f) => !f.type.startsWith("image/") || f.size > MAX_IMAGE_BYTES);
    if (bad) return setError(`"${bad.name}" must be an image under 5 MB.`);
    if (files.length + picked.length > MAX_IMAGES) return setError(`You can add up to ${MAX_IMAGES} photos.`);
    setError(null);
    setFiles((prev) => [...prev, ...picked]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const problem = validate(form, files);
    if (problem) return setError(problem);

    setError(null);
    setSaving(true);
    try {
      const itemRef = doc(collection(getDb(), "items"));
      const storage = getFirebaseStorage();
      const images = await Promise.all(
        files.map(async (file, i) => {
          const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const fileRef = ref(storage, `items/${itemRef.id}/${i}-${Date.now()}.${ext}`);
          await uploadBytes(fileRef, file, { contentType: file.type });
          return getDownloadURL(fileRef);
        }),
      );
      await setDoc(itemRef, {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        ...(form.discountedPrice ? { discountedPrice: Number(form.discountedPrice) } : {}),
        fabric: form.fabric.trim(),
        colour: form.colour.trim(),
        description: form.description.trim(),
        images,
        createdBy: userId,
        createdAt: serverTimestamp(),
      });
      setSuccess(`"${form.name.trim()}" was added.`);
      setForm(emptyForm);
      setFiles([]);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code.includes("unauthorized") || code.includes("permission")
          ? "Permission denied. Check that the Firestore and Storage rules are deployed and your account is listed as an admin."
          : "Could not save the item. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Add a new item</h2>

      <div className="mt-4 grid gap-x-6 sm:grid-cols-2">
        <TextField label="Item name" value={form.name} onChange={set("name")} className="sm:col-span-2" maxLength={80} />
        <SelectField label="Category" value={form.category} onChange={set("category")} className="mb-5">
          {exploreTabs.map((t) => <option key={t} value={t} className="bg-base">{t}</option>)}
        </SelectField>
        <div />
        <TextField label="Price (Rs.)" type="number" min="0" inputMode="decimal" value={form.price} onChange={set("price")} />
        <TextField label="Discounted price (optional)" type="number" min="0" inputMode="decimal" value={form.discountedPrice} onChange={set("discountedPrice")} />
        <TextField label="Fabric" value={form.fabric} onChange={set("fabric")} maxLength={40} />
        <TextField label="Colour" value={form.colour} onChange={set("colour")} maxLength={40} />
      </div>

      <label htmlFor="admin-description" className="mt-1 block text-xs text-muted">Description</label>
      <textarea
        id="admin-description"
        value={form.description}
        onChange={set("description")}
        rows={4}
        maxLength={600}
        className="mt-1 w-full rounded-md border border-line bg-transparent p-3 text-sm text-fg outline-none focus:border-primary"
      />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Photos ({files.length}/{MAX_IMAGES}). The first photo is the cover.</span>
          <label className="cursor-pointer rounded-md bg-surface-strong px-3 py-1.5 text-xs font-medium hover:bg-primary-soft">
            Choose photos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </label>
        </div>
        {files.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="relative aspect-[3/4] overflow-hidden rounded-md border border-line bg-surface-strong">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={previews[i]} alt={f.name} className="h-full w-full object-cover object-top" />
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                  aria-label={`Remove ${f.name}`}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white hover:bg-danger"
                >×</button>
                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] text-white">Cover</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p role="alert" className="mt-4 min-h-5 text-xs text-danger">{error}</p>
      <p role="status" className="min-h-5 text-xs text-accent">{success}</p>

      <Button type="submit" loading={saving} className="mt-2 w-full !py-3">{saving ? "Uploading…" : "Add item"}</Button>
    </form>
  );
}

function ManageItems() {
  const { items, loaded } = useItems();
  const custom = items.filter((i) => i.custom);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove(item: Item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setBusyId(item.id);
    setError(null);
    try {
      await deleteDoc(doc(getDb(), "items", item.id));
      // Photos are cleaned up best-effort; a leftover file is harmless.
      await Promise.allSettled(item.images.map((url) => deleteObject(ref(getFirebaseStorage(), url))));
    } catch {
      setError("Could not delete the item. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="h-fit rounded-lg border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Items you added</h2>
      <p className="mt-1 text-xs text-muted">The built-in sample items are not listed here.</p>
      <p role="alert" className="mt-2 min-h-5 text-xs text-danger">{error}</p>

      {!loaded ? (
        <div className="h-24 animate-pulse rounded bg-surface-strong" aria-busy />
      ) : custom.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No items yet. Add your first one.</p>
      ) : (
        <ul className="divide-y divide-line">
          {custom.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-surface-strong">
                {item.images[0] && <Image src={item.images[0]} alt="" fill sizes="48px" className="object-cover object-top" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/explore/${item.id}`} className="block truncate text-sm font-medium text-fg hover:text-accent">{item.name}</Link>
                <span className="text-[11px] text-muted">{item.category} · Rs. {item.discountedPrice ?? item.price}</span>
              </div>
              <button
                onClick={() => remove(item)}
                disabled={busyId === item.id}
                aria-label={`Delete ${item.name}`}
                title="Delete"
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger/15 hover:text-danger disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
