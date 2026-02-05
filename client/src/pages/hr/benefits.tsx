import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

const benefitTypeColors: Record<string, string> = {
  health: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  dental: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  vision: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  life: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  retirement: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function Benefits() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plans");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    type: "health",
    description: "",
    coverage: "",
    employerContribution: "",
    employeeContribution: "",
    isActive: true,
  });

  const [enrollForm, setEnrollForm] = useState({
    employeeId: "",
    benefitPlanId: "",
    coverageLevel: "employee_only",
    startDate: "",
  });

  const { data: plans, isLoading: loadingPlans } = useQuery<any[]>({
    queryKey: ["/api/hr/benefits/plans"],
  });

  const { data: enrollments, isLoading: loadingEnrollments } = useQuery<any[]>({
    queryKey: ["/api/hr/benefits/enrollments"],
  });

  const { data: employees } = useQuery<any[]>({
    queryKey: ["/api/hr/employees"],
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/benefits/plans/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/benefits/plans", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Benefit plan updated" : "Benefit plan created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/benefits/plans"] });
      setIsPlanDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save benefit plan", description: error.message, variant: "destructive" });
    },
  });

  const createEnrollMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/hr/benefits/enrollments", data);
    },
    onSuccess: () => {
      toast({ title: "Employee enrolled in benefit" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/benefits/enrollments"] });
      setIsEnrollDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to enroll employee", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const endpoints: Record<string, string> = {
        plan: `/api/hr/benefits/plans/${id}`,
        enrollment: `/api/hr/benefits/enrollments/${id}`,
      };
      return apiRequest("DELETE", endpoints[type]);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/benefits"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    },
  });

  const resetForms = () => {
    setPlanForm({
      name: "",
      type: "health",
      description: "",
      coverage: "",
      employerContribution: "",
      employeeContribution: "",
      isActive: true,
    });
    setEnrollForm({
      employeeId: "",
      benefitPlanId: "",
      coverageLevel: "employee_only",
      startDate: "",
    });
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setEditingItem(plan);
    setPlanForm({
      name: plan.name,
      type: plan.type || "health",
      description: plan.description || "",
      coverage: plan.coverage || "",
      employerContribution: plan.employerContribution?.toString() || "",
      employeeContribution: plan.employeeContribution?.toString() || "",
      isActive: plan.isActive ?? true,
    });
    setIsPlanDialogOpen(true);
  };

  const formatCurrency = (amount: number | string | null) => {
    if (!amount) return "N/A";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-AF", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const activePlans = plans?.filter((p) => p.isActive).length || 0;
  const totalEnrollments = enrollments?.length || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Benefits Administration
          </h1>
          <p className="text-muted-foreground">Manage employee benefits and enrollments</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans}</div>
            <p className="text-xs text-muted-foreground">Benefit plans available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Employee enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Plans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total benefit plans</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="plans" data-testid="tab-plans">Benefit Plans</TabsTrigger>
              <TabsTrigger value="enrollments" data-testid="tab-enrollments">Enrollments</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Benefit Plans</h3>
                <Button onClick={() => { resetForms(); setIsPlanDialogOpen(true); }} data-testid="button-new-plan">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Employer Contribution</TableHead>
                    <TableHead>Employee Contribution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPlans ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : plans?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">No benefit plans defined</TableCell>
                    </TableRow>
                  ) : (
                    plans?.map((plan) => (
                      <TableRow key={plan.id} data-testid={`row-plan-${plan.id}`}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          <Badge className={benefitTypeColors[plan.type] || benefitTypeColors.other}>
                            {plan.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(plan.employerContribution)}</TableCell>
                        <TableCell>{formatCurrency(plan.employeeContribution)}</TableCell>
                        <TableCell>
                          <Badge variant={plan.isActive ? "default" : "secondary"}>
                            {plan.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)} data-testid={`button-edit-plan-${plan.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("plan", plan.id)} data-testid={`button-delete-plan-${plan.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Benefit Enrollments</h3>
                <Button onClick={() => { resetForms(); setIsEnrollDialogOpen(true); }} data-testid="button-new-enrollment">
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Employee
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Benefit Plan</TableHead>
                    <TableHead>Coverage Level</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEnrollments ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : enrollments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">No enrollments yet</TableCell>
                    </TableRow>
                  ) : (
                    enrollments?.map((enrollment) => (
                      <TableRow key={enrollment.id} data-testid={`row-enrollment-${enrollment.id}`}>
                        <TableCell className="font-medium">
                          {enrollment.employee?.firstName} {enrollment.employee?.lastName}
                        </TableCell>
                        <TableCell>{enrollment.benefitPlan?.name || "N/A"}</TableCell>
                        <TableCell className="capitalize">{enrollment.coverageLevel?.replace("_", " ")}</TableCell>
                        <TableCell>
                          {enrollment.startDate ? format(new Date(enrollment.startDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={enrollment.status === "active" ? "default" : "secondary"}>
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("enrollment", enrollment.id)} data-testid={`button-delete-enrollment-${enrollment.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Benefit Plan" : "Add Benefit Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Plan Name</Label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                placeholder="e.g., Standard Health Insurance"
                data-testid="input-plan-name"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={planForm.type}
                onValueChange={(v) => setPlanForm({ ...planForm, type: v })}
              >
                <SelectTrigger data-testid="select-plan-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="life">Life Insurance</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employer Contribution (AFN)</Label>
                <Input
                  type="number"
                  value={planForm.employerContribution}
                  onChange={(e) => setPlanForm({ ...planForm, employerContribution: e.target.value })}
                  data-testid="input-plan-employer"
                />
              </div>
              <div>
                <Label>Employee Contribution (AFN)</Label>
                <Input
                  type="number"
                  value={planForm.employeeContribution}
                  onChange={(e) => setPlanForm({ ...planForm, employeeContribution: e.target.value })}
                  data-testid="input-plan-employee"
                />
              </div>
            </div>
            <div>
              <Label>Coverage Details</Label>
              <Textarea
                value={planForm.coverage}
                onChange={(e) => setPlanForm({ ...planForm, coverage: e.target.value })}
                rows={2}
                data-testid="input-plan-coverage"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                rows={2}
                data-testid="input-plan-description"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={planForm.isActive ? "active" : "inactive"}
                onValueChange={(v) => setPlanForm({ ...planForm, isActive: v === "active" })}
              >
                <SelectTrigger data-testid="select-plan-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createPlanMutation.mutate({
                name: planForm.name,
                type: planForm.type,
                description: planForm.description || null,
                coverage: planForm.coverage || null,
                employerContribution: planForm.employerContribution ? parseFloat(planForm.employerContribution) : null,
                employeeContribution: planForm.employeeContribution ? parseFloat(planForm.employeeContribution) : null,
                isActive: planForm.isActive,
              })}
              disabled={!planForm.name || createPlanMutation.isPending}
              data-testid="button-save-plan"
            >
              {createPlanMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Employee in Benefit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select
                value={enrollForm.employeeId}
                onValueChange={(v) => setEnrollForm({ ...enrollForm, employeeId: v })}
              >
                <SelectTrigger data-testid="select-enroll-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Benefit Plan</Label>
              <Select
                value={enrollForm.benefitPlanId}
                onValueChange={(v) => setEnrollForm({ ...enrollForm, benefitPlanId: v })}
              >
                <SelectTrigger data-testid="select-enroll-plan">
                  <SelectValue placeholder="Select benefit plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans?.filter((p) => p.isActive).map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Coverage Level</Label>
              <Select
                value={enrollForm.coverageLevel}
                onValueChange={(v) => setEnrollForm({ ...enrollForm, coverageLevel: v })}
              >
                <SelectTrigger data-testid="select-enroll-coverage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee_only">Employee Only</SelectItem>
                  <SelectItem value="employee_spouse">Employee + Spouse</SelectItem>
                  <SelectItem value="employee_children">Employee + Children</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={enrollForm.startDate}
                onChange={(e) => setEnrollForm({ ...enrollForm, startDate: e.target.value })}
                data-testid="input-enroll-start"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createEnrollMutation.mutate({
                employeeId: enrollForm.employeeId,
                benefitPlanId: enrollForm.benefitPlanId,
                coverageLevel: enrollForm.coverageLevel,
                startDate: enrollForm.startDate || null,
                status: "active",
              })}
              disabled={!enrollForm.employeeId || !enrollForm.benefitPlanId || createEnrollMutation.isPending}
              data-testid="button-save-enrollment"
            >
              {createEnrollMutation.isPending ? "Enrolling..." : "Enroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && deleteMutation.mutate(itemToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
