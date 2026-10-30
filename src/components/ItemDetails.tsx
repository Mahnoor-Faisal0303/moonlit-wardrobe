type Piece = { title: string; line: string; fabric: string; colour: string };

export default function ItemDetails({ label, pieces, note }: { label: string; pieces: Piece[]; note: string }) {
  if (!label && pieces.length === 0 && !note) return null;
  return (
    <div className="mt-10">
      <h2 className="w-fit text-base text-fg underline underline-offset-4">DETAILS</h2>

      <div className="mt-6 space-y-5 text-sm leading-7 text-fg/80">
        {label && <p>{label}</p>}
        {pieces.map((p, i) => (
          <div key={i}>
            {p.title && <p>{p.title}</p>}
            {p.line && <p>{p.line}</p>}
            {p.fabric && <p>Fabric: {p.fabric}</p>}
            {p.colour && <p>Colour: {p.colour}</p>}
          </div>
        ))}
        {note && <p className="text-xs uppercase text-muted">{note}</p>}
      </div>
    </div>
  );
}
