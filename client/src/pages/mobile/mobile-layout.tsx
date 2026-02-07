import { useLocation } from "wouter";
import { Banknote, FileText, Calendar } from "lucide-react";
import lamenLogo from "@assets/LamenLogoonly_1770454661674.png";

const tabs = [
  { path: "/mobile/customers", label: "Active Financing", icon: Banknote },
  { path: "/mobile/financing", label: "New Application", icon: FileText },
  { path: "/mobile/repayments", label: "Repayments", icon: Calendar },
];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();

  return (
    <div className="flex flex-col h-[100dvh] bg-background" data-testid="mobile-layout">
      <header className="flex items-center gap-2 px-4 py-2 border-b bg-card sticky top-0 z-50" data-testid="mobile-header">
        <img src={lamenLogo} alt="Lamen" className="h-8 w-8 rounded-full object-cover" data-testid="img-mobile-logo" />
        <span className="font-semibold text-sm">Lamen Microfinance</span>
      </header>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <nav className="flex items-center justify-around border-t bg-card px-2 py-1 safe-area-bottom" data-testid="mobile-tab-bar">
        {tabs.map((tab) => {
          const isActive = location.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-testid={`tab-${tab.label.toLowerCase()}`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
