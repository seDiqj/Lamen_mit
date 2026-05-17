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
import { Shield, KeyRound, ArrowLeft } from "lucide-react";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";

export default function MfaChallengePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);

  const { data: status } = useQuery<{ pendingMfa: boolean; setupNeeded: boolean; username?: string }>({
    queryKey: ["/api/mfa/status"],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status && !status.pendingMfa) {
      setLocation("/login");
    } else if (status?.setupNeeded) {
      setLocation("/mfa-setup");
    }
  }, [status, setLocation]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const body = useBackup ? { backupCode: code, trustDevice } : { code, trustDevice };
      const res = await apiRequest("POST", "/api/mfa/verify", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Verified", description: "Welcome back!" });
      setLocation("/");
    },
    onError: (err: Error) => {
      toast({ title: "Verification failed", description: err.message || "Invalid code", variant: "destructive" });
    },
  });

  const cancel = async () => {
    await apiRequest("POST", "/api/mfa/cancel", {});
    setLocation("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast({ title: "Required", description: "Please enter a code", variant: "destructive" });
      return;
    }
    verifyMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100 dark:from-yellow-950/30 dark:via-green-950/30 dark:to-emerald-950/40 p-6">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {status?.username ? <>Signed in as <span className="font-medium">{status.username}</span>. </> : null}
            {useBackup ? "Enter one of your backup codes." : "Enter the 6-digit code from your authenticator app."}
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={lamenLogo} alt="Lamen" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-sm font-medium">Lamen Microfinance</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mfa-code">{useBackup ? "Backup Code" : "Authentication Code"}</Label>
              <Input
                id="mfa-code"
                type="text"
                autoComplete="one-time-code"
                inputMode={useBackup ? "text" : "numeric"}
                placeholder={useBackup ? "ABCDE-12345" : "123 456"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 text-center text-lg tracking-widest font-mono"
                maxLength={useBackup ? 11 : 6}
                autoFocus
                data-testid="input-mfa-code"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="trust-device"
                checked={trustDevice}
                onCheckedChange={(v) => setTrustDevice(!!v)}
                data-testid="checkbox-trust-device"
              />
              <Label htmlFor="trust-device" className="text-sm font-normal cursor-pointer">
                Trust this device for 7 days
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
              disabled={verifyMutation.isPending}
              data-testid="button-verify-mfa"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify and Continue"}
            </Button>
          </form>
          <div className="flex items-center justify-between text-sm pt-2">
            <button
              type="button"
              className="text-primary hover:underline inline-flex items-center gap-1"
              onClick={() => { setUseBackup(!useBackup); setCode(""); }}
              data-testid="button-toggle-backup"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {useBackup ? "Use authenticator code instead" : "Use a backup code"}
            </button>
            <button
              type="button"
              className="text-muted-foreground hover:underline inline-flex items-center gap-1"
              onClick={cancel}
              data-testid="button-cancel-mfa"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
