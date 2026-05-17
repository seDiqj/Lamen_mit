export const PASSWORD_EXPIRY_DAYS = 60;
export const PASSWORD_HISTORY_DEPTH = 5;

export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: true,
};

export const PASSWORD_RULE_DESCRIPTIONS = [
  "At least 8 characters",
  "One uppercase letter (A-Z)",
  "One lowercase letter (a-z)",
  "One number (0-9)",
  "One special character (!@#$%^&* etc.)",
];

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export function checkPassword(pw: string): PasswordCheck[] {
  const p = pw || "";
  return [
    { label: PASSWORD_RULE_DESCRIPTIONS[0], passed: p.length >= PASSWORD_RULES.minLength },
    { label: PASSWORD_RULE_DESCRIPTIONS[1], passed: /[A-Z]/.test(p) },
    { label: PASSWORD_RULE_DESCRIPTIONS[2], passed: /[a-z]/.test(p) },
    { label: PASSWORD_RULE_DESCRIPTIONS[3], passed: /[0-9]/.test(p) },
    { label: PASSWORD_RULE_DESCRIPTIONS[4], passed: /[^A-Za-z0-9]/.test(p) },
  ];
}

export function validatePassword(pw: string): { ok: true } | { ok: false; message: string } {
  const checks = checkPassword(pw);
  const failed = checks.filter((c) => !c.passed);
  if (failed.length === 0) return { ok: true };
  return {
    ok: false,
    message: `Password must include: ${failed.map((c) => c.label.toLowerCase()).join("; ")}.`,
  };
}

export function passwordStrengthLabel(pw: string): { label: string; score: number } {
  const passed = checkPassword(pw).filter((c) => c.passed).length;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return { label: labels[Math.max(0, passed - 1)] || "Very weak", score: passed };
}
