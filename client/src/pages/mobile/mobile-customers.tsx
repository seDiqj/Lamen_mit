import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Phone, MapPin, ChevronRight, User, LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useOfflineSync } from "@/hooks/use-offline-sync";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  phone?: string;
  gender?: string;
  province?: string;
  district?: string;
  village?: string;
};

export default function MobileCustomers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const isOnline = useNetworkStatus();
  useOfflineSync();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery<{ customers: Customer[]; total: number }>({
    queryKey: ["/api/customers", { search: debouncedSearch, page: 1, limit: 50 }],
  });

  const customers = data?.customers || [];
  const filtered = search
    ? customers.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          c.phone?.includes(search)
      )
    : customers;

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary-foreground/30">
              <img src="/logo.jpeg" alt="Lamen" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight" data-testid="text-header-title">Lamen MFI</h1>
              <p className="text-[10px] text-primary-foreground/70">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-primary-foreground/70" />
            ) : (
              <WifiOff className="h-4 w-4 text-yellow-300" />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 no-default-hover-elevate"
              onClick={() => logout()}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-primary-foreground text-foreground border-0"
            data-testid="input-search-customers"
          />
        </div>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No customers found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        ) : (
          filtered.map((customer) => (
            <Card
              key={customer.id}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => navigate(`/mobile/repayments?customerId=${customer.id}`)}
              data-testid={`card-customer-${customer.id}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate" data-testid={`text-customer-name-${customer.id}`}>
                        {customer.firstName} {customer.lastName}
                      </p>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {customer.gender === "female" ? "F" : "M"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {customer.phone && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                      )}
                      {(customer.district || customer.village) && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                          <MapPin className="h-3 w-3" />
                          {[customer.district, customer.village].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
