export default function Avatar3D() {
  return (
    <svg viewBox="0 0 200 380" className="h-auto w-44 drop-shadow-2xl sm:w-52" aria-hidden>
      <ellipse cx="100" cy="42" rx="44" ry="20" fill="#e8e0d2" />
      <rect x="62" y="40" width="76" height="22" rx="8" fill="#ddd3c2" />
      <ellipse cx="100" cy="84" rx="32" ry="34" fill="#e8998d" />
      <circle cx="88" cy="82" r="3" fill="#222" /><circle cx="112" cy="82" r="3" fill="#222" />
      <path d="M92 100q8 5 16 0" stroke="#b5574f" strokeWidth="2" fill="none" />
      <path d="M52 140q48-24 96 0l8 60-24 8H68l-24-8Z" fill="#f0b95a" />
      <path d="M78 136h44v76H78Z" fill="#fafafa" />
      <path d="M44 150q-14 40 20 54l70-4q28-8 18-50Z" fill="#f0b95a" opacity=".92" />
      <path d="M72 214h56l14 130h-34l-8-96-8 96H62Z" fill="#3b3b3b" />
      <rect x="56" y="340" width="40" height="18" rx="8" fill="#ebe3d3" />
      <rect x="108" y="340" width="40" height="18" rx="8" fill="#ebe3d3" />
    </svg>
  );
}
