import { brandLogos, stats } from "@/data/content";
import { Art, Button } from "./ui";

const tiles: { hue: [string, string]; span: string }[] = [
  { hue: ["#e9e4f5", "#6b5fd0"], span: "" },
  { hue: ["#f2b84b", "#3b3b8a"], span: "" },
  { hue: ["#1d2a44", "#05070f"], span: "row-span-2" },
  { hue: ["#c9a66b", "#3b1d6b"], span: "col-start-4 row-span-3" },
  { hue: ["#3a3a3a", "#0c0c0c"], span: "" },
  { hue: ["#7c3aed", "#2a0f6b"], span: "" },
  { hue: ["#4ade80", "#7c3aed"], span: "" },
];

export default function Hero() {
  return (
    <section className="container-x pt-8 pb-12">
      <div className="mb-10 flex justify-center gap-3">
        <button className="rounded-full bg-primary-soft px-5 py-1.5 text-[11px] ring-1 ring-primary">Main Collection</button>
        <button className="rounded-full bg-surface-strong px-5 py-1.5 text-[11px] text-muted">Creators Market</button>
      </div>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Clothes are the<br />Spirit of Fashion</h1>
          <p className="mt-4 max-w-sm text-[11px] text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit.</p>
          <div className="mt-5 flex gap-3"><Button>Explore Now</Button><Button variant="ghost">Create</Button></div>
          <dl className="mt-8 flex gap-8">
            {stats.map((s) => (
              <div key={s.label}><dt className="text-lg font-semibold">{s.value}</dt><dd className="text-[10px] text-subtle">{s.label}</dd></div>
            ))}
          </dl>
        </div>
        <div className="grid h-72 grid-cols-4 grid-rows-3 gap-2.5 md:h-80">
          {tiles.map((t, i) => <Art key={i} hue={t.hue} className={`rounded-lg ${t.span}`} />)}
        </div>
      </div>
      <div className="mt-20 flex flex-wrap items-center justify-around gap-8 text-3xl font-bold tracking-wide text-subtle">
        {brandLogos.map((b) => <span key={b} className="opacity-70">{b}</span>)}
      </div>
    </section>
  );
}
