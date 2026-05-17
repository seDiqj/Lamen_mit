import { checkPassword, passwordStrengthLabel } from "@shared/password";
import { Check, X } from "lucide-react";

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = checkPassword(password);
  const { label, score } = passwordStrengthLabel(password);
  const barColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-600"];
  const labelColors = ["text-red-600", "text-orange-600", "text-yellow-600", "text-lime-600", "text-green-700"];
  const idx = Math.max(0, score - 1);
  return (
    <div className="space-y-2 mt-2" data-testid="password-strength">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded ${i < score ? barColors[idx] : "bg-muted"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${labelColors[idx]}`}>Strength: {label}</p>
      <ul className="space-y-1 text-xs">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-1.5 ${c.passed ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}>
            {c.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
