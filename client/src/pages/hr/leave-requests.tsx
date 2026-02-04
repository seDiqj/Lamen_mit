import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Plus, Check, X, Clock } from "lucide-react";
import type { LeaveRequest, Employee, LeaveType } from "@shared/schema";

type LeaveRequestWithRelations = LeaveRequest & {
  employee?: Employee;
  leaveType?: LeaveType;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function LeaveRequests() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const { data: leaveRequests, isLoading } = useQuery<LeaveRequestWithRelations[]>({
    queryKey: ["/api/hr/leave-requests"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/hr/employees"],
  });

  const { data: leaveTypes } = useQuery<LeaveType[]>({
    queryKey: ["/api/hr/leave-types"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const res = await apiRequest("POST", "/api/hr/leave-requests", { ...data, totalDays });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Leave request created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/leave-requests"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create leave request", description: error.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { id: string; status: string; rejectionReason?: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/leave-requests/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Leave request updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/leave-requests"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update leave request", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setFormData({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFormData({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" });
  };

  const handleSubmit = () => {
    if (!formData.employeeId || !formData.leaveTypeId || !formData.startDate || !formData.endDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ id, status: "rejected" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRequests = leaveRequests?.filter((req) => {
    return statusFilter === "all" || req.status === statusFilter;
  });

  const pendingCount = leaveRequests?.filter(r => r.status === "pending").length || 0;
  const approvedCount = leaveRequests?.filter(r => r.status === "approved").length || 0;
  const rejectedCount = leaveRequests?.filter(r => r.status === "rejected").length || 0;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <FileText className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Leave Requests</h1>
            <p className="text-muted-foreground text-sm">Manage employee leave requests</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-leave-request">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <CardTitle>All Leave Requests</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leave requests...</div>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} data-testid={`row-leave-request-${req.id}`}>
                    <TableCell>
                      <div className="font-medium">
                        {req.employee?.firstName} {req.employee?.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{req.leaveType?.name || "-"}</TableCell>
                    <TableCell>{formatDate(req.startDate)}</TableCell>
                    <TableCell>{formatDate(req.endDate)}</TableCell>
                    <TableCell>{req.totalDays}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[req.status || "pending"]}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{req.reason || "-"}</TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleApprove(req.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-100"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleReject(req.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No leave requests found. Click 'New Request' to create one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Employee *</Label>
              <Select 
                value={formData.employeeId} 
                onValueChange={(v) => setFormData({ ...formData, employeeId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.filter(e => e.employmentStatus === "active").map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Leave Type *</Label>
              <Select 
                value={formData.leaveTypeId} 
                onValueChange={(v) => setFormData({ ...formData, leaveTypeId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes?.filter(lt => lt.isActive).map((lt) => (
                    <SelectItem key={lt.id} value={lt.id}>
                      {lt.name} ({lt.daysPerYear} days/year)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date *</Label>
                <Input 
                  type="date"
                  value={formData.startDate} 
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date *</Label>
                <Input 
                  type="date"
                  value={formData.endDate} 
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Reason</Label>
              <Textarea 
                value={formData.reason} 
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Reason for leave"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
