import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, Smartphone, QrCode, Copy, Download, CheckCircle2 } from "lucide-react";

export default function MfaSetupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"intro" | "scan" | "verify" | "backup">("intro");
  const [code, setCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [savedConfirmed, setSavedConfirmed] = useState(false);

  const { data: status } = useQuery<{ pendingMfa: boolean; setupNeeded: boolean; authenticated: boolean; username?: string }>({
    queryKey: ["/api/mfa/status"],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!status) return;
    if (!status.pendingMfa && !status.authenticated) setLocation("/login");
  }, [status, setLocation]);

  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/setup", {});
      return res.json();
    },
    onSuccess: (data: { qrCode: string; secret: string }) => {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("scan");
    },
    onError: (e: Error) => toast({ title: "Setup failed", description: e.message, variant: "destructive" }),
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mfa/verify-setup", { code });
      return res.json();
    },
    onSuccess: (data: { backupCodes: string[] }) => {
      setBackupCodes(data.backupCodes || []);
      setStep("backup");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mfa/status"] });
    },
    onError: (e: Error) => toast({ title: "Invalid code", description: e.message, variant: "destructive" }),
  });

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast({ title: "Copied", description: "Secret copied to clipboard" });
  };

  const downloadBackup = () => {
    const text = `Lamen Microfinance — Two-Factor Backup Codes\nUser: ${status?.username || ""}\nGenerated: ${new Date().toLocaleString()}\n\nEach code can be used once if you lose access to your authenticator app.\nStore these somewhere safe.\n\n${backupCodes.join("\n")}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lamen-mfi-backup-codes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const finish = () => setLocation("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100 dark:from-yellow-950/30 dark:via-green-950/30 dark:to-emerald-950/40 p-6">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Card className="w-full max-w-xl border-0 shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Up Two-Factor Authentication</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Required for all users. Adds a second layer of security to your account.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-5">
          {step === "intro" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                <Smartphone className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Step 1 — Install an authenticator app on your phone</p>
                  <p className="text-muted-foreground">Google Authenticator, Microsoft Authenticator, or Authy. All free.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                <QrCode className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Step 2 — Scan a QR code</p>
                  <p className="text-muted-foreground">We'll show a QR code. Open the app, tap "+", and scan it.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Step 3 — Enter the 6-digit code to confirm</p>
                  <p className="text-muted-foreground">You'll also get 10 backup codes — save them somewhere safe.</p>
                </div>
              </div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                onClick={() => setupMutation.mutate()}
                disabled={setupMutation.isPending}
                data-testid="button-start-mfa-setup"
              >
                {setupMutation.isPending ? "Preparing..." : "Get Started"}
              </Button>
            </div>
          )}

          {step === "scan" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg border bg-white dark:bg-card">
                {qrCode && <img src={qrCode} alt="MFA QR code" className="h-56 w-56" data-testid="img-mfa-qr" />}
                <p className="text-xs text-muted-foreground">Scan this with your authenticator app</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Can't scan? Enter this code manually:</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all" data-testid="text-mfa-secret">{secret}</code>
                  <Button variant="outline" size="sm" onClick={copySecret} data-testid="button-copy-secret">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep("verify")} data-testid="button-go-verify">
                I've added it — continue
              </Button>
            </div>
          )}

          {step === "verify" && (
            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); if (code) verifyMutation.mutate(); }}
            >
              <div className="space-y-2">
                <Label htmlFor="confirm-code">Enter the 6-digit code shown in your authenticator app</Label>
                <Input
                  id="confirm-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="123 456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                  autoFocus
                  data-testid="input-confirm-code"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                disabled={verifyMutation.isPending || code.length < 6}
                data-testid="button-confirm-mfa"
              >
                {verifyMutation.isPending ? "Verifying..." : "Confirm and Enable"}
              </Button>
              <button type="button" className="text-xs text-muted-foreground hover:underline w-full text-center" onClick={() => setStep("scan")}>
                ← Back to QR code
              </button>
            </form>
          )}

          {step === "backup" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 text-sm">
                <p className="font-semibold text-amber-800 dark:text-amber-300">Save your backup codes now</p>
                <p className="text-amber-700 dark:text-amber-400 mt-1">
                  Each code works once if you lose your phone. You won't see them again.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 rounded-lg border bg-muted/30 font-mono text-sm" data-testid="list-backup-codes">
                {backupCodes.map((c) => (
                  <div key={c} className="px-3 py-1.5 rounded bg-background border text-center">{c}</div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={downloadBackup} data-testid="button-download-backup">
                <Download className="h-4 w-4 mr-2" />
                Download as text file
              </Button>
              <div className="flex items-center gap-2">
                <Checkbox id="saved" checked={savedConfirmed} onCheckedChange={(v) => setSavedConfirmed(!!v)} data-testid="checkbox-saved" />
                <Label htmlFor="saved" className="text-sm font-normal cursor-pointer">
                  I've saved my backup codes somewhere safe
                </Label>
              </div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                disabled={!savedConfirmed}
                onClick={finish}
                data-testid="button-finish-mfa"
              >
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
