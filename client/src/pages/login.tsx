import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Shield, Users, TrendingUp, Wallet, FileText, UserPlus } from "lucide-react";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupData, setSetupData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { data: setupStatus, isLoading: checkingSetup } = useQuery<{ setupNeeded: boolean }>({
    queryKey: ["/api/auth/setup-needed"],
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: typeof setupData) => {
      const res = await apiRequest("POST", "/api/auth/register", {
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/setup-needed"] });
      toast({
        title: "Admin Account Created",
        description: "Welcome to Lamen Microfinance!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData.firstName || !setupData.lastName || !setupData.username || !setupData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (setupData.password !== setupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (setupData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    setupMutation.mutate(setupData);
  };

  const features = [
    { icon: Users, title: "Customer Management", description: "Track customer information and business details" },
    { icon: Wallet, title: "Financing Processing", description: "Manage financing applications, approvals, and disbursements" },
    { icon: TrendingUp, title: "Payment Tracking", description: "Monitor installments and payment schedules" },
    { icon: FileText, title: "Comprehensive Reports", description: "Generate detailed financial reports" },
    { icon: Shield, title: "Role-Based Access", description: "Secure access control for different user levels" },
    { icon: Building2, title: "Branch Management", description: "Manage multiple branches and officers" },
  ];

  const showSetupForm = setupStatus?.setupNeeded || isSetupMode;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Company Description */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={lamenLogo}
              alt="Lamen Microfinance"
              className="h-16 w-16 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <h1 className="text-3xl font-bold">Lamen Microfinance</h1>
              <p className="text-primary-foreground/80">Institution</p>
            </div>
          </div>
          
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-md">
            Empowering communities through accessible financial services. Our comprehensive loan management system helps you serve customers efficiently and grow your microfinance operations.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover-elevate">
              <feature.icon className="h-6 w-6 mb-2 text-yellow-300" />
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-primary-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60 mt-8">
          Serving communities with trust and transparency
        </div>
      </div>

      {/* Right Side - Login/Setup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100 dark:from-yellow-950/30 dark:via-green-950/30 dark:to-emerald-950/40 p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-green-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400/20 to-yellow-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full blur-lg opacity-50" />
              <img
                src={lamenLogo}
                alt="Lamen Microfinance"
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mt-4">Lamen Microfinance</h1>
            <p className="text-muted-foreground">Institution</p>
          </div>

          {checkingSetup ? (
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : showSetupForm ? (
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-1 bg-gradient-to-r from-yellow-400 via-green-500 to-emerald-500 rounded-full mb-4" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Initial Setup</CardTitle>
                </div>
                <p className="text-muted-foreground">Create your administrator account</p>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSetupSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-medium">First Name *</Label>
                      <Input
                        id="firstName"
                        value={setupData.firstName}
                        onChange={(e) => setSetupData({ ...setupData, firstName: e.target.value })}
                        className="border-2 border-muted focus:border-primary transition-colors"
                        data-testid="input-setup-firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-medium">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={setupData.lastName}
                        onChange={(e) => setSetupData({ ...setupData, lastName: e.target.value })}
                        className="border-2 border-muted focus:border-primary transition-colors"
                        data-testid="input-setup-lastname"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupUsername" className="text-foreground font-medium">Username *</Label>
                    <Input
                      id="setupUsername"
                      value={setupData.username}
                      onChange={(e) => setSetupData({ ...setupData, username: e.target.value })}
                      className="border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-setup-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupEmail" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="setupEmail"
                      type="email"
                      value={setupData.email}
                      onChange={(e) => setSetupData({ ...setupData, email: e.target.value })}
                      className="border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-setup-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupPassword" className="text-foreground font-medium">Password *</Label>
                    <Input
                      id="setupPassword"
                      type="password"
                      value={setupData.password}
                      onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-setup-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={setupData.confirmPassword}
                      onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                      className="border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-setup-confirm-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={setupMutation.isPending}
                    data-testid="button-setup"
                  >
                    {setupMutation.isPending ? "Creating Account..." : "Create Admin Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-1 bg-gradient-to-r from-yellow-400 via-green-500 to-emerald-500 rounded-full mb-4" />
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Welcome Back</CardTitle>
                <p className="text-muted-foreground">Sign in to access your account</p>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11 border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border-2 border-muted focus:border-primary transition-colors"
                      data-testid="input-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm">
                    <Shield className="h-4 w-4" />
                    Contact administrator for access
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-xs text-muted-foreground mt-8 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full inline-block mx-auto w-full">
            Lamen Microfinance Institution Financing Management System
          </p>
        </div>
      </div>
    </div>
  );
}
