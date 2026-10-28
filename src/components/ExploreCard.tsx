import { Art, Verified } from "./ui";

export function EthIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 24 32" fill="currentColor" aria-hidden>
      <path d="M12 0 3 16l9 5.3L21 16 12 0Zm0 23.5-9-5.3L12 32l9-13.8-9 5.3Z" />
    </svg>
  );
}

export default function ExploreCard({ banner, avatar }: { banner: [string, string]; avatar: [string, string] }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
      <Art hue={banner} className="h-44 sm:h-48" />
      <div className="relative flex flex-col items-center px-6 pb-6 text-center">
        <Art hue={avatar} className="-mt-10 h-20 w-20 rounded-full border-2 border-base" />
        <h3 className="mt-3 flex items-center gap-2 text-base font-semibold">John Wick <Verified /></h3>
        <p className="mt-4 text-[11px] leading-6 text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac tempus nisi, mollis diam vulputate nec. Donec fringilla nunc cursus nulla id leo felis fringilla est.
        </p>
        <span className="mt-4 self-start text-accent"><EthIcon /></span>
      </div>
    </article>
  );
}
