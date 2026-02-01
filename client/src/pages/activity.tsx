import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Filter,
  User,
  FileText,
  CreditCard,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ActivityLog } from "@shared/schema";

type ActivityLogWithUser = ActivityLog & {
  userName?: string;
  userEmail?: string;
  userImage?: string;
};

const actionIcons: Record<string, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Edit,
  view: Eye,
  delete: Settings,
  approve: FileText,
  disburse: CreditCard,
  payment: CreditCard,
};

const actionColors: Record<string, string> = {
  login: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  logout: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  create: "bg-green-500/10 text-green-700 dark:text-green-400",
  update: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  view: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  delete: "bg-red-500/10 text-red-700 dark:text-red-400",
  approve: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  disburse: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  payment: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
};

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery<{
    logs: ActivityLogWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/activity", search, actionFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (actionFilter && actionFilter !== "all") params.set("action", actionFilter);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/activity?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activity logs");
      return res.json();
    },
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action: string) => {
    const actionType = action.split("_")[0].toLowerCase();
    return actionIcons[actionType] || Settings;
  };

  const getActionColor = (action: string) => {
    const actionType = action.split("_")[0].toLowerCase();
    return actionColors[actionType] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-activity-title">Activity Log</h1>
          <p className="text-muted-foreground">
            Monitor all user activities and system events
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-activity">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or entity..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-activity"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-action-filter">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="disburse">Disburse</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : data?.logs && data.logs.length > 0 ? (
              data.logs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                return (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`log-${log.id}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={log.userImage || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {log.userName?.substring(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {log.userName || log.userEmail || "Unknown User"}
                        </span>
                        <Badge className={getActionColor(log.action)}>
                          <ActionIcon className="h-3 w-3 mr-1" />
                          {log.action.replace(/_/g, " ")}
                        </Badge>
                        {log.entityType && (
                          <Badge variant="outline">
                            {log.entityType}
                          </Badge>
                        )}
                      </div>
                      {log.details && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {log.details}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDate(log.createdAt)}</span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activity logs found</p>
              </div>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} logs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
