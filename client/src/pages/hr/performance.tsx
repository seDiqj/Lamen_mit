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
  Target,
  Plus,
  Edit,
  Trash2,
  ClipboardList,
  Award,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

const reviewStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  self_review: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  manager_review: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const goalStatusColors: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  exceeded: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  not_achieved: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Performance() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reviews");
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isCompetencyDialogOpen, setIsCompetencyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [periodForm, setPeriodForm] = useState({ name: "", startDate: "", endDate: "", isActive: true });
  const [reviewForm, setReviewForm] = useState({
    employeeId: "",
    periodId: "",
    reviewerId: "",
    status: "draft",
    overallRating: "",
    selfComments: "",
    managerComments: "",
  });
  const [goalForm, setGoalForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    targetDate: "",
    weight: "1",
    status: "not_started",
  });
  const [competencyForm, setCompetencyForm] = useState({
    name: "",
    description: "",
    category: "",
  });

  const { data: periods, isLoading: loadingPeriods } = useQuery<any[]>({
    queryKey: ["/api/hr/performance/periods"],
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery<any[]>({
    queryKey: ["/api/hr/performance/reviews"],
  });

  const { data: goals, isLoading: loadingGoals } = useQuery<any[]>({
    queryKey: ["/api/hr/performance/goals"],
  });

  const { data: competencies, isLoading: loadingCompetencies } = useQuery<any[]>({
    queryKey: ["/api/hr/performance/competencies"],
  });

  const { data: employees } = useQuery<any[]>({
    queryKey: ["/api/hr/employees"],
  });

  const createPeriodMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/performance/periods/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/performance/periods", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Period updated" : "Period created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/performance/periods"] });
      setIsPeriodDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save period", description: error.message, variant: "destructive" });
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/performance/reviews/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/performance/reviews", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Review updated" : "Review created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/performance/reviews"] });
      setIsReviewDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save review", description: error.message, variant: "destructive" });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/performance/goals/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/performance/goals", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Goal updated" : "Goal created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/performance/goals"] });
      setIsGoalDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save goal", description: error.message, variant: "destructive" });
    },
  });

  const createCompetencyMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/performance/competencies/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/performance/competencies", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Competency updated" : "Competency created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/performance/competencies"] });
      setIsCompetencyDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save competency", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const endpoints: Record<string, string> = {
        period: `/api/hr/performance/periods/${id}`,
        review: `/api/hr/performance/reviews/${id}`,
        goal: `/api/hr/performance/goals/${id}`,
        competency: `/api/hr/performance/competencies/${id}`,
      };
      return apiRequest("DELETE", endpoints[type]);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/performance"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    },
  });

  const resetForms = () => {
    setPeriodForm({ name: "", startDate: "", endDate: "", isActive: true });
    setReviewForm({
      employeeId: "",
      periodId: "",
      reviewerId: "",
      status: "draft",
      overallRating: "",
      selfComments: "",
      managerComments: "",
    });
    setGoalForm({
      employeeId: "",
      title: "",
      description: "",
      targetDate: "",
      weight: "1",
      status: "not_started",
    });
    setCompetencyForm({ name: "", description: "", category: "" });
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleEditPeriod = (period: any) => {
    setEditingItem(period);
    setPeriodForm({
      name: period.name,
      startDate: period.startDate || "",
      endDate: period.endDate || "",
      isActive: period.isActive ?? true,
    });
    setIsPeriodDialogOpen(true);
  };

  const handleEditGoal = (goal: any) => {
    setEditingItem(goal);
    setGoalForm({
      employeeId: goal.employeeId || "",
      title: goal.title,
      description: goal.description || "",
      targetDate: goal.targetDate || "",
      weight: goal.weight?.toString() || "1",
      status: goal.status || "not_started",
    });
    setIsGoalDialogOpen(true);
  };

  const handleEditCompetency = (comp: any) => {
    setEditingItem(comp);
    setCompetencyForm({
      name: comp.name,
      description: comp.description || "",
      category: comp.category || "",
    });
    setIsCompetencyDialogOpen(true);
  };

  const totalReviews = reviews?.length || 0;
  const completedReviews = reviews?.filter((r) => r.status === "completed").length || 0;
  const activeGoals = goals?.filter((g) => g.status === "in_progress").length || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Performance Management
          </h1>
          <p className="text-muted-foreground">Manage performance reviews, goals, and competencies</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">All performance reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews}</div>
            <p className="text-xs text-muted-foreground">Finished reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals}</div>
            <p className="text-xs text-muted-foreground">Goals in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competencies</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencies?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Defined competencies</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
              <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
              <TabsTrigger value="competencies" data-testid="tab-competencies">Competencies</TabsTrigger>
              <TabsTrigger value="periods" data-testid="tab-periods">Periods</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Performance Reviews</h3>
                <Button onClick={() => { resetForms(); setIsReviewDialogOpen(true); }} data-testid="button-new-review">
                  <Plus className="h-4 w-4 mr-2" />
                  New Review
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingReviews ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : reviews?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No reviews yet</TableCell>
                    </TableRow>
                  ) : (
                    reviews?.map((review) => (
                      <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                        <TableCell className="font-medium">
                          {review.employee?.firstName} {review.employee?.lastName}
                        </TableCell>
                        <TableCell>{review.period?.name || "N/A"}</TableCell>
                        <TableCell>
                          {review.reviewer
                            ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className={reviewStatusColors[review.status] || reviewStatusColors.draft}>
                            {review.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {review.overallRating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {review.overallRating}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("review", review.id)} data-testid={`button-delete-review-${review.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Performance Goals</h3>
                <Button onClick={() => { resetForms(); setIsGoalDialogOpen(true); }} data-testid="button-new-goal">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingGoals ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : goals?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">No goals defined</TableCell>
                    </TableRow>
                  ) : (
                    goals?.map((goal) => (
                      <TableRow key={goal.id} data-testid={`row-goal-${goal.id}`}>
                        <TableCell className="font-medium">
                          {employees?.find((e) => e.id === goal.employeeId)?.firstName || "N/A"}
                        </TableCell>
                        <TableCell>{goal.title}</TableCell>
                        <TableCell>
                          {goal.targetDate ? format(new Date(goal.targetDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{goal.weight || 1}</TableCell>
                        <TableCell>
                          <Badge className={goalStatusColors[goal.status] || goalStatusColors.not_started}>
                            {goal.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)} data-testid={`button-edit-goal-${goal.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("goal", goal.id)} data-testid={`button-delete-goal-${goal.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="competencies" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Competencies</h3>
                <Button onClick={() => { resetForms(); setIsCompetencyDialogOpen(true); }} data-testid="button-new-competency">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competency
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCompetencies ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : competencies?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No competencies defined</TableCell>
                    </TableRow>
                  ) : (
                    competencies?.map((comp) => (
                      <TableRow key={comp.id} data-testid={`row-competency-${comp.id}`}>
                        <TableCell className="font-medium">{comp.name}</TableCell>
                        <TableCell>{comp.category || "General"}</TableCell>
                        <TableCell className="max-w-xs truncate">{comp.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCompetency(comp)} data-testid={`button-edit-competency-${comp.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("competency", comp.id)} data-testid={`button-delete-competency-${comp.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="periods" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Review Periods</h3>
                <Button onClick={() => { resetForms(); setIsPeriodDialogOpen(true); }} data-testid="button-new-period">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPeriods ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : periods?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No periods defined</TableCell>
                    </TableRow>
                  ) : (
                    periods?.map((period) => (
                      <TableRow key={period.id} data-testid={`row-period-${period.id}`}>
                        <TableCell className="font-medium">{period.name}</TableCell>
                        <TableCell>
                          {period.startDate ? format(new Date(period.startDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {period.endDate ? format(new Date(period.endDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={period.isActive ? "default" : "secondary"}>
                            {period.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPeriod(period)} data-testid={`button-edit-period-${period.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("period", period.id)} data-testid={`button-delete-period-${period.id}`}>
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

      <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Period" : "Add Review Period"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={periodForm.name}
                onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
                placeholder="e.g., Q1 2024"
                data-testid="input-period-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={periodForm.startDate}
                  onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
                  data-testid="input-period-start"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={periodForm.endDate}
                  onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
                  data-testid="input-period-end"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={periodForm.isActive ? "active" : "inactive"}
                onValueChange={(v) => setPeriodForm({ ...periodForm, isActive: v === "active" })}
              >
                <SelectTrigger data-testid="select-period-status">
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
            <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createPeriodMutation.mutate({
                name: periodForm.name,
                startDate: periodForm.startDate || null,
                endDate: periodForm.endDate || null,
                isActive: periodForm.isActive,
              })}
              disabled={!periodForm.name || createPeriodMutation.isPending}
              data-testid="button-save-period"
            >
              {createPeriodMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Performance Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select
                value={reviewForm.employeeId}
                onValueChange={(v) => setReviewForm({ ...reviewForm, employeeId: v })}
              >
                <SelectTrigger data-testid="select-review-employee">
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
              <Label>Review Period</Label>
              <Select
                value={reviewForm.periodId}
                onValueChange={(v) => setReviewForm({ ...reviewForm, periodId: v })}
              >
                <SelectTrigger data-testid="select-review-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods?.map((period) => (
                    <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reviewer</Label>
              <Select
                value={reviewForm.reviewerId}
                onValueChange={(v) => setReviewForm({ ...reviewForm, reviewerId: v })}
              >
                <SelectTrigger data-testid="select-review-reviewer">
                  <SelectValue placeholder="Select reviewer" />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createReviewMutation.mutate({
                employeeId: reviewForm.employeeId,
                periodId: reviewForm.periodId || null,
                reviewerId: reviewForm.reviewerId || null,
                status: "draft",
              })}
              disabled={!reviewForm.employeeId || createReviewMutation.isPending}
              data-testid="button-save-review"
            >
              {createReviewMutation.isPending ? "Creating..." : "Create Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Goal" : "New Goal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select
                value={goalForm.employeeId}
                onValueChange={(v) => setGoalForm({ ...goalForm, employeeId: v })}
              >
                <SelectTrigger data-testid="select-goal-employee">
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
              <Label>Goal Title</Label>
              <Input
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g., Increase sales by 20%"
                data-testid="input-goal-title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                rows={3}
                data-testid="input-goal-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                  data-testid="input-goal-target"
                />
              </div>
              <div>
                <Label>Weight</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={goalForm.weight}
                  onChange={(e) => setGoalForm({ ...goalForm, weight: e.target.value })}
                  data-testid="input-goal-weight"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={goalForm.status}
                onValueChange={(v) => setGoalForm({ ...goalForm, status: v })}
              >
                <SelectTrigger data-testid="select-goal-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="exceeded">Exceeded</SelectItem>
                  <SelectItem value="not_achieved">Not Achieved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createGoalMutation.mutate({
                employeeId: goalForm.employeeId,
                title: goalForm.title,
                description: goalForm.description || null,
                targetDate: goalForm.targetDate || null,
                weight: parseInt(goalForm.weight) || 1,
                status: goalForm.status,
              })}
              disabled={!goalForm.title || !goalForm.employeeId || createGoalMutation.isPending}
              data-testid="button-save-goal"
            >
              {createGoalMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompetencyDialogOpen} onOpenChange={setIsCompetencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Competency" : "Add Competency"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={competencyForm.name}
                onChange={(e) => setCompetencyForm({ ...competencyForm, name: e.target.value })}
                placeholder="e.g., Communication"
                data-testid="input-competency-name"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={competencyForm.category}
                onChange={(e) => setCompetencyForm({ ...competencyForm, category: e.target.value })}
                placeholder="e.g., Soft Skills"
                data-testid="input-competency-category"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={competencyForm.description}
                onChange={(e) => setCompetencyForm({ ...competencyForm, description: e.target.value })}
                rows={3}
                data-testid="input-competency-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompetencyDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createCompetencyMutation.mutate({
                name: competencyForm.name,
                category: competencyForm.category || null,
                description: competencyForm.description || null,
              })}
              disabled={!competencyForm.name || createCompetencyMutation.isPending}
              data-testid="button-save-competency"
            >
              {createCompetencyMutation.isPending ? "Saving..." : "Save"}
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
