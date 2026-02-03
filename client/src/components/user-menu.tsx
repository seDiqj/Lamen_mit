import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, KeyRound, LogOut, ChevronDown } from "lucide-react";
import { Link } from "wouter";

type UserRoleData = {
  role: string;
};

export function UserMenu() {
  const { user, logout, isLoggingOut } = useAuth();

  const { data: roleData } = useQuery<UserRoleData>({
    queryKey: ["/api/user/role"],
  });

  if (!user) return null;

  const initials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.username?.substring(0, 2).toUpperCase() || "U";

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username || "User";

  const roleLabel = roleData?.role 
    ? roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1).replace(/_/g, " ")
    : "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover-elevate focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          data-testid="button-user-menu"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none">{displayName}</span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/change-password" className="cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive cursor-pointer"
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
