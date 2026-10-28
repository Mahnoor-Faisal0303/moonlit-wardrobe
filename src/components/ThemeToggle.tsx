"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-strong text-sm hover:bg-primary-soft"
    >
      <span className="hidden [[data-theme=dark]_&]:inline">☾</span>
      <span className="hidden [[data-theme=light]_&]:inline">☀</span>
    </button>
  );
}
