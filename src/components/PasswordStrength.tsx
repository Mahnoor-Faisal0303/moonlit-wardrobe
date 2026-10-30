import { passwordRules, passwordStrength } from "@/lib/validation";

const barColor = ["", "bg-danger", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

export default function PasswordStrength({ value }: { value: string }) {
  const { score, label } = passwordStrength(value);
  return (
    <div className="mt-4" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i <= score ? barColor[score] : "bg-line"}`} />
          ))}
        </div>
        <span className="w-12 text-right text-xs text-muted">{label}</span>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
        {passwordRules.map((r) => {
          const ok = r.test(value);
          return (
            <li key={r.id} className={ok ? "text-green-500" : "text-subtle"}>
              {ok ? "✓" : "○"} {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
