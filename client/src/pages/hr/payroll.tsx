import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Banknote,
  Plus,
  Edit,
  Trash2,
  Calculator,
  FileText,
  Calendar,
  Users,
  CircleDollarSign,
  TrendingUp,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Payroll() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("runs");
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);
  const [isDeductionDialogOpen, setIsDeductionDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [structureForm, setStructureForm] = useState({ name: "", minSalary: "", maxSalary: "", description: "" });
  const [allowanceForm, setAllowanceForm] = useState({ name: "", code: "", isPercentage: false, isTaxable: true, description: "" });
  const [deductionForm, setDeductionForm] = useState({ name: "", code: "", isPercentage: false, isMandatory: false, description: "" });
  const [runForm, setRunForm] = useState({ periodStart: "", periodEnd: "", name: "" });

  const { data: salaryStructures, isLoading: loadingStructures } = useQuery<any[]>({
    queryKey: ["/api/hr/payroll/salary-structures"],
  });

  const { data: allowanceTypes, isLoading: loadingAllowances } = useQuery<any[]>({
    queryKey: ["/api/hr/payroll/allowance-types"],
  });

  const { data: deductionTypes, isLoading: loadingDeductions } = useQuery<any[]>({
    queryKey: ["/api/hr/payroll/deduction-types"],
  });

  const { data: payrollRuns, isLoading: loadingRuns } = useQuery<any[]>({
    queryKey: ["/api/hr/payroll/runs"],
  });

  const createStructureMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/payroll/salary-structures/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/payroll/salary-structures", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Salary structure updated" : "Salary structure created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/payroll/salary-structures"] });
      setIsStructureDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save salary structure", description: error.message, variant: "destructive" });
    },
  });

  const createAllowanceMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/payroll/allowance-types/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/payroll/allowance-types", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Allowance type updated" : "Allowance type created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/payroll/allowance-types"] });
      setIsAllowanceDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save allowance type", description: error.message, variant: "destructive" });
    },
  });

  const createDeductionMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/payroll/deduction-types/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/payroll/deduction-types", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Deduction type updated" : "Deduction type created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/payroll/deduction-types"] });
      setIsDeductionDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save deduction type", description: error.message, variant: "destructive" });
    },
  });

  const createRunMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/hr/payroll/runs", data);
    },
    onSuccess: () => {
      toast({ title: "Payroll run created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/payroll/runs"] });
      setIsRunDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create payroll run", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const endpoints: Record<string, string> = {
        structure: `/api/hr/payroll/salary-structures/${id}`,
        allowance: `/api/hr/payroll/allowance-types/${id}`,
        deduction: `/api/hr/payroll/deduction-types/${id}`,
        run: `/api/hr/payroll/runs/${id}`,
      };
      return apiRequest("DELETE", endpoints[type]);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/payroll"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    },
  });

  const resetForms = () => {
    setStructureForm({ name: "", minSalary: "", maxSalary: "", description: "" });
    setAllowanceForm({ name: "", code: "", isPercentage: false, isTaxable: true, description: "" });
    setDeductionForm({ name: "", code: "", isPercentage: false, isMandatory: false, description: "" });
    setRunForm({ periodStart: "", periodEnd: "", name: "" });
    setEditingItem(null);
  };

  const handleEditStructure = (item: any) => {
    setEditingItem(item);
    setStructureForm({
      name: item.name,
      minSalary: item.minSalary?.toString() || "",
      maxSalary: item.maxSalary?.toString() || "",
      description: item.description || "",
    });
    setIsStructureDialogOpen(true);
  };

  const handleEditAllowance = (item: any) => {
    setEditingItem(item);
    setAllowanceForm({
      name: item.name,
      code: item.code || "",
      isPercentage: item.isPercentage || false,
      isTaxable: item.isTaxable ?? true,
      description: item.description || "",
    });
    setIsAllowanceDialogOpen(true);
  };

  const handleEditDeduction = (item: any) => {
    setEditingItem(item);
    setDeductionForm({
      name: item.name,
      code: item.code || "",
      isPercentage: item.isPercentage || false,
      isMandatory: item.isMandatory || false,
      description: item.description || "",
    });
    setIsDeductionDialogOpen(true);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Banknote className="h-8 w-8 text-primary" />
            Payroll Management
          </h1>
          <p className="text-muted-foreground">Manage salary structures, allowances, deductions, and payroll runs</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Runs</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollRuns?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Structures</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaryStructures?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Defined structures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allowance Types</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allowanceTypes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Types available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deduction Types</CardTitle>
            <MinusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deductionTypes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Types defined</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="runs" data-testid="tab-runs">Payroll Runs</TabsTrigger>
              <TabsTrigger value="structures" data-testid="tab-structures">Salary Structures</TabsTrigger>
              <TabsTrigger value="allowances" data-testid="tab-allowances">Allowances</TabsTrigger>
              <TabsTrigger value="deductions" data-testid="tab-deductions">Deductions</TabsTrigger>
            </TabsList>

            <TabsContent value="runs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payroll Runs</h3>
                <Button onClick={() => setIsRunDialogOpen(true)} data-testid="button-new-run">
                  <Plus className="h-4 w-4 mr-2" />
                  New Payroll Run
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run Number</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Gross</TableHead>
                    <TableHead>Total Net</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingRuns ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : payrollRuns?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No payroll runs yet</TableCell>
                    </TableRow>
                  ) : (
                    payrollRuns?.map((run) => (
                      <TableRow key={run.id} data-testid={`row-run-${run.id}`}>
                        <TableCell className="font-medium">{run.payrollNumber}</TableCell>
                        <TableCell>{run.periodStart} - {run.periodEnd}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[run.status] || statusColors.draft}>{run.status}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(run.totalGross)}</TableCell>
                        <TableCell>{formatCurrency(run.totalNet)}</TableCell>
                        <TableCell>{run.createdAt ? format(new Date(run.createdAt), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("run", run.id)} data-testid={`button-delete-run-${run.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="structures" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Salary Structures</h3>
                <Button onClick={() => { resetForms(); setIsStructureDialogOpen(true); }} data-testid="button-new-structure">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Structure
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Min Salary</TableHead>
                    <TableHead>Max Salary</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingStructures ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : salaryStructures?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No salary structures defined</TableCell>
                    </TableRow>
                  ) : (
                    salaryStructures?.map((structure) => (
                      <TableRow key={structure.id} data-testid={`row-structure-${structure.id}`}>
                        <TableCell className="font-medium">{structure.name}</TableCell>
                        <TableCell>{formatCurrency(structure.minSalary)}</TableCell>
                        <TableCell>{formatCurrency(structure.maxSalary)}</TableCell>
                        <TableCell className="max-w-xs truncate">{structure.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStructure(structure)} data-testid={`button-edit-structure-${structure.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("structure", structure.id)} data-testid={`button-delete-structure-${structure.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="allowances" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Allowance Types</h3>
                <Button onClick={() => { resetForms(); setIsAllowanceDialogOpen(true); }} data-testid="button-new-allowance">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allowance Type
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taxable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingAllowances ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : allowanceTypes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No allowance types defined</TableCell>
                    </TableRow>
                  ) : (
                    allowanceTypes?.map((type) => (
                      <TableRow key={type.id} data-testid={`row-allowance-${type.id}`}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.code}</TableCell>
                        <TableCell>{type.isPercentage ? "Percentage" : "Fixed"}</TableCell>
                        <TableCell>
                          <Badge variant={type.isTaxable ? "default" : "secondary"}>
                            {type.isTaxable ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditAllowance(type)} data-testid={`button-edit-allowance-${type.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("allowance", type.id)} data-testid={`button-delete-allowance-${type.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Deduction Types</h3>
                <Button onClick={() => { resetForms(); setIsDeductionDialogOpen(true); }} data-testid="button-new-deduction">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deduction Type
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDeductions ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : deductionTypes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No deduction types defined</TableCell>
                    </TableRow>
                  ) : (
                    deductionTypes?.map((type) => (
                      <TableRow key={type.id} data-testid={`row-deduction-${type.id}`}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.code}</TableCell>
                        <TableCell>{type.isPercentage ? "Percentage" : "Fixed"}</TableCell>
                        <TableCell>
                          <Badge variant={type.isMandatory ? "default" : "secondary"}>
                            {type.isMandatory ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditDeduction(type)} data-testid={`button-edit-deduction-${type.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("deduction", type.id)} data-testid={`button-delete-deduction-${type.id}`}>
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

      <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Salary Structure" : "Add Salary Structure"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={structureForm.name}
                onChange={(e) => setStructureForm({ ...structureForm, name: e.target.value })}
                placeholder="e.g., Grade A"
                data-testid="input-structure-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Salary (AFN)</Label>
                <Input
                  type="number"
                  value={structureForm.minSalary}
                  onChange={(e) => setStructureForm({ ...structureForm, minSalary: e.target.value })}
                  data-testid="input-structure-min"
                />
              </div>
              <div>
                <Label>Max Salary (AFN)</Label>
                <Input
                  type="number"
                  value={structureForm.maxSalary}
                  onChange={(e) => setStructureForm({ ...structureForm, maxSalary: e.target.value })}
                  data-testid="input-structure-max"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={structureForm.description}
                onChange={(e) => setStructureForm({ ...structureForm, description: e.target.value })}
                placeholder="Description"
                data-testid="input-structure-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStructureDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createStructureMutation.mutate({
                name: structureForm.name,
                minSalary: parseFloat(structureForm.minSalary) || null,
                maxSalary: parseFloat(structureForm.maxSalary) || null,
                description: structureForm.description || null,
              })}
              disabled={!structureForm.name || createStructureMutation.isPending}
              data-testid="button-save-structure"
            >
              {createStructureMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAllowanceDialogOpen} onOpenChange={setIsAllowanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Allowance Type" : "Add Allowance Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={allowanceForm.name}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, name: e.target.value })}
                  placeholder="e.g., Transport"
                  data-testid="input-allowance-name"
                />
              </div>
              <div>
                <Label>Code</Label>
                <Input
                  value={allowanceForm.code}
                  onChange={(e) => setAllowanceForm({ ...allowanceForm, code: e.target.value })}
                  placeholder="e.g., TRA"
                  data-testid="input-allowance-code"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={allowanceForm.isPercentage ? "percentage" : "fixed"}
                  onValueChange={(v) => setAllowanceForm({ ...allowanceForm, isPercentage: v === "percentage" })}
                >
                  <SelectTrigger data-testid="select-allowance-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Taxable</Label>
                <Select
                  value={allowanceForm.isTaxable ? "yes" : "no"}
                  onValueChange={(v) => setAllowanceForm({ ...allowanceForm, isTaxable: v === "yes" })}
                >
                  <SelectTrigger data-testid="select-allowance-taxable">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={allowanceForm.description}
                onChange={(e) => setAllowanceForm({ ...allowanceForm, description: e.target.value })}
                data-testid="input-allowance-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllowanceDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createAllowanceMutation.mutate({
                name: allowanceForm.name,
                code: allowanceForm.code || null,
                isPercentage: allowanceForm.isPercentage,
                isTaxable: allowanceForm.isTaxable,
                description: allowanceForm.description || null,
              })}
              disabled={!allowanceForm.name || createAllowanceMutation.isPending}
              data-testid="button-save-allowance"
            >
              {createAllowanceMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeductionDialogOpen} onOpenChange={setIsDeductionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Deduction Type" : "Add Deduction Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={deductionForm.name}
                  onChange={(e) => setDeductionForm({ ...deductionForm, name: e.target.value })}
                  placeholder="e.g., Tax"
                  data-testid="input-deduction-name"
                />
              </div>
              <div>
                <Label>Code</Label>
                <Input
                  value={deductionForm.code}
                  onChange={(e) => setDeductionForm({ ...deductionForm, code: e.target.value })}
                  placeholder="e.g., TAX"
                  data-testid="input-deduction-code"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={deductionForm.isPercentage ? "percentage" : "fixed"}
                  onValueChange={(v) => setDeductionForm({ ...deductionForm, isPercentage: v === "percentage" })}
                >
                  <SelectTrigger data-testid="select-deduction-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mandatory</Label>
                <Select
                  value={deductionForm.isMandatory ? "yes" : "no"}
                  onValueChange={(v) => setDeductionForm({ ...deductionForm, isMandatory: v === "yes" })}
                >
                  <SelectTrigger data-testid="select-deduction-mandatory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={deductionForm.description}
                onChange={(e) => setDeductionForm({ ...deductionForm, description: e.target.value })}
                data-testid="input-deduction-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeductionDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createDeductionMutation.mutate({
                name: deductionForm.name,
                code: deductionForm.code || null,
                isPercentage: deductionForm.isPercentage,
                isMandatory: deductionForm.isMandatory,
                description: deductionForm.description || null,
              })}
              disabled={!deductionForm.name || createDeductionMutation.isPending}
              data-testid="button-save-deduction"
            >
              {createDeductionMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payroll Run</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={runForm.name}
                onChange={(e) => setRunForm({ ...runForm, name: e.target.value })}
                placeholder="e.g., January 2024 Payroll"
                data-testid="input-run-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Period Start</Label>
                <Input
                  type="date"
                  value={runForm.periodStart}
                  onChange={(e) => setRunForm({ ...runForm, periodStart: e.target.value })}
                  data-testid="input-run-start"
                />
              </div>
              <div>
                <Label>Period End</Label>
                <Input
                  type="date"
                  value={runForm.periodEnd}
                  onChange={(e) => setRunForm({ ...runForm, periodEnd: e.target.value })}
                  data-testid="input-run-end"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createRunMutation.mutate({
                name: runForm.name,
                periodStart: runForm.periodStart,
                periodEnd: runForm.periodEnd,
                status: "draft",
              })}
              disabled={!runForm.periodStart || !runForm.periodEnd || createRunMutation.isPending}
              data-testid="button-save-run"
            >
              {createRunMutation.isPending ? "Creating..." : "Create Run"}
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
