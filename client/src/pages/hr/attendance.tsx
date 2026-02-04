import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarCheck, Plus, Search, Edit } from "lucide-react";
import type { Attendance, Employee } from "@shared/schema";

type AttendanceWithEmployee = Attendance & {
  employee?: Employee;
};

const statusColors: Record<string, string> = {
  present: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  half_day: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  on_leave: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  holiday: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AttendancePage() {
  const { toast } = useToast();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    employeeId: "",
    date: today,
    status: "present" as string,
    notes: "",
  });

  const { data: attendanceRecords, isLoading } = useQuery<AttendanceWithEmployee[]>({
    queryKey: ["/api/hr/attendance", selectedDate],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/hr/employees"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/hr/attendance", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Attendance recorded successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/attendance"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to record attendance", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; status: string; notes: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/attendance/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Attendance updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/attendance"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update attendance", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setFormData({ employeeId: "", date: selectedDate, status: "present", notes: "" });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFormData({ employeeId: "", date: today, status: "present", notes: "" });
  };

  const handleSubmit = () => {
    if (!formData.employeeId) {
      toast({ title: "Please select an employee", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, status, notes: "" });
  };

  const filteredRecords = attendanceRecords?.filter((record) => {
    const empName = `${record.employee?.firstName || ""} ${record.employee?.lastName || ""}`.toLowerCase();
    return empName.includes(searchTerm.toLowerCase());
  });

  const presentCount = attendanceRecords?.filter(r => r.status === "present").length || 0;
  const absentCount = attendanceRecords?.filter(r => r.status === "absent").length || 0;
  const lateCount = attendanceRecords?.filter(r => r.status === "late").length || 0;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <CalendarCheck className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Attendance</h1>
            <p className="text-muted-foreground text-sm">Track daily employee attendance</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-attendance">
          <Plus className="h-4 w-4" /> Record Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{presentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold">{absentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold">{lateCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{attendanceRecords?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2 items-center">
              <Label>Date:</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
                data-testid="input-date"
              />
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading attendance records...</div>
          ) : filteredRecords && filteredRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {record.employee?.firstName?.[0]}{record.employee?.lastName?.[0]}
                        </div>
                        <span className="font-medium">
                          {record.employee?.firstName} {record.employee?.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={record.status || "present"}
                        onValueChange={(v) => handleStatusChange(record.id, v)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="half_day">Half Day</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</TableCell>
                    <TableCell>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</TableCell>
                    <TableCell>{record.workHours || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records for this date. Click 'Record Attendance' to add one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Attendance</DialogTitle>
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
              <Label>Date</Label>
              <Input 
                type="date"
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Input 
                value={formData.notes} 
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
