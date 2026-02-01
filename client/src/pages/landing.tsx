import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  BarChart3, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpeg" 
                alt="Lamen Microfinance" 
                className="h-10 w-auto"
                data-testid="img-logo"
              />
              <span className="font-semibold text-lg hidden sm:block">Lamen Microfinance</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                asChild
                data-testid="button-login"
              >
                <a href="/api/login">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-background py-20 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.15),transparent_50%)]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Trusted by Microfinance Institutions
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Modern Loan
                    <span className="block text-primary">Management System</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    Streamline your microfinance operations with our comprehensive loan management platform. 
                    Track loans, manage customers, and generate insightful reports with ease.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    asChild
                    className="text-base"
                    data-testid="button-get-started"
                  >
                    <a href="/api/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-base"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Active Loans</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$2M+</div>
                    <div className="text-sm text-muted-foreground">Disbursed</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">Recovery Rate</div>
                  </div>
                </div>
              </div>

              <div className="relative lg:pl-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
                        <div className="flex items-center gap-3 mb-4">
                          <img 
                            src="/logo.jpeg" 
                            alt="Lamen" 
                            className="h-12 w-auto rounded-md bg-white p-1"
                          />
                          <div>
                            <div className="font-semibold text-lg">Lamen Microfinance</div>
                            <div className="text-sm opacity-90">Institution Dashboard</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Total Portfolio</div>
                              <div className="text-sm text-muted-foreground">Active loans value</div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-primary">$1.2M</div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                              <Users className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">Customers</div>
                              <div className="text-sm text-muted-foreground">Total registered</div>
                            </div>
                          </div>
                          <div className="text-xl font-bold">324</div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">This Month</div>
                              <div className="text-sm text-muted-foreground">Collections</div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-primary">$85K</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to Manage Loans
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides comprehensive tools for every aspect of microfinance operations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Loan Management</h3>
                  <p className="text-muted-foreground">
                    Complete loan lifecycle management from application to closure with automated tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customer Database</h3>
                  <p className="text-muted-foreground">
                    Maintain detailed customer profiles with business information and guarantor details.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
                  <p className="text-muted-foreground">
                    Generate comprehensive reports and visualize key metrics with interactive charts.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Payment Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor installment payments, track late days, and manage collections efficiently.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                  <p className="text-muted-foreground">
                    Secure access control with User, Manager, and Admin roles for data protection.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-visible hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Export Options</h3>
                  <p className="text-muted-foreground">
                    Export data and reports in Excel and PDF formats for offline analysis and sharing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Lamen Microfinance Institution and experience streamlined loan management today.
            </p>
            <Button 
              size="lg" 
              asChild
              className="text-base"
              data-testid="button-cta-get-started"
            >
              <a href="/api/login">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpeg" 
                alt="Lamen" 
                className="h-8 w-auto"
              />
              <span className="text-sm text-muted-foreground">
                © 2024 Lamen Microfinance Institution
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Empowering Communities Through Finance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
