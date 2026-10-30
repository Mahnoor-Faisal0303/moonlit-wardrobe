import { features } from "@/data/content";

const icons = {
  fabric: <path d="M4 5c4-2 12 2 16 0v14c-4 2-12-2-16 0V5Z" />,
  truck: <path d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  return: <path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3" />,
};

export default function Features() {
  return (
    <section className="container-x py-8">
      <div className="grid gap-8 rounded-xl border border-line bg-surface p-8 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center gap-2 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden>{icons[f.icon]}</svg>
            <h3 className="text-sm font-semibold text-fg">{f.title}</h3>
            <p className="max-w-[16rem] text-[11px] leading-5 text-muted">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
