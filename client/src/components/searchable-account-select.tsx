import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Account = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType?: string;
};

interface SearchableAccountSelectProps {
  accounts: Account[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function SearchableAccountSelect({
  accounts,
  value,
  onValueChange,
  placeholder = "Select account",
  disabled = false,
  className,
  "data-testid": testId,
}: SearchableAccountSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedAccount = accounts.find((acc) => acc.id === value);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    const query = searchQuery.toLowerCase();
    return accounts.filter(
      (acc) =>
        acc.accountCode.toLowerCase().includes(query) ||
        acc.accountName.toLowerCase().includes(query)
    );
  }, [accounts, searchQuery]);

  const handleSelect = (accountId: string) => {
    onValueChange(accountId);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("justify-between font-normal", className)}
          data-testid={testId}
        >
          <span className="truncate">
            {selectedAccount
              ? `${selectedAccount.accountCode} - ${selectedAccount.accountName}`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            data-testid={testId ? `${testId}-search` : undefined}
          />
        </div>
        <ScrollArea className="h-[250px]">
          {filteredAccounts.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No accounts found
            </div>
          ) : (
            <div className="p-1">
              {filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSelect(account.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === account.id && "bg-accent"
                  )}
                  data-testid={testId ? `${testId}-option-${account.accountCode}` : undefined}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === account.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-medium">{account.accountCode}</span>
                  <span className="mx-2">-</span>
                  <span className="truncate">{account.accountName}</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
