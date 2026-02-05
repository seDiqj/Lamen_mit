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
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Eye,
  Search,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

const jobStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  open: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  on_hold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  closed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  filled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const applicantStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  screening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  interviewing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  offered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  withdrawn: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function Recruitment() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isApplicantDialogOpen, setIsApplicantDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    departmentId: "",
    positionId: "",
    employmentType: "full_time",
    location: "",
    salaryMin: "",
    salaryMax: "",
    closingDate: "",
    status: "draft",
  });

  const [applicantForm, setApplicantForm] = useState({
    jobPostingId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
    source: "",
    status: "new",
  });

  const [interviewForm, setInterviewForm] = useState({
    applicantId: "",
    scheduledDate: "",
    scheduledTime: "",
    type: "phone",
    location: "",
    notes: "",
  });

  const { data: jobs, isLoading: loadingJobs } = useQuery<any[]>({
    queryKey: ["/api/hr/recruitment/jobs"],
  });

  const { data: applicants, isLoading: loadingApplicants } = useQuery<any[]>({
    queryKey: ["/api/hr/recruitment/applicants"],
  });

  const { data: interviews, isLoading: loadingInterviews } = useQuery<any[]>({
    queryKey: ["/api/hr/recruitment/interviews"],
  });

  const { data: departments } = useQuery<any[]>({
    queryKey: ["/api/hr/departments"],
  });

  const { data: positions } = useQuery<any[]>({
    queryKey: ["/api/hr/positions"],
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/recruitment/jobs/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/recruitment/jobs", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Job posting updated" : "Job posting created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/recruitment/jobs"] });
      setIsJobDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save job posting", description: error.message, variant: "destructive" });
    },
  });

  const createApplicantMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/recruitment/applicants/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/recruitment/applicants", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Applicant updated" : "Applicant created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/recruitment/applicants"] });
      setIsApplicantDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save applicant", description: error.message, variant: "destructive" });
    },
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/recruitment/interviews/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/recruitment/interviews", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Interview updated" : "Interview scheduled" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/recruitment/interviews"] });
      setIsInterviewDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save interview", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const endpoints: Record<string, string> = {
        job: `/api/hr/recruitment/jobs/${id}`,
        applicant: `/api/hr/recruitment/applicants/${id}`,
        interview: `/api/hr/recruitment/interviews/${id}`,
      };
      return apiRequest("DELETE", endpoints[type]);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/recruitment"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    },
  });

  const resetForms = () => {
    setJobForm({
      title: "",
      description: "",
      requirements: "",
      departmentId: "",
      positionId: "",
      employmentType: "full_time",
      location: "",
      salaryMin: "",
      salaryMax: "",
      closingDate: "",
      status: "draft",
    });
    setApplicantForm({
      jobPostingId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      resumeUrl: "",
      coverLetter: "",
      source: "",
      status: "new",
    });
    setInterviewForm({
      applicantId: "",
      scheduledDate: "",
      scheduledTime: "",
      type: "phone",
      location: "",
      notes: "",
    });
    setEditingItem(null);
    setSelectedJob(null);
    setSelectedApplicant(null);
  };

  const handleEditJob = (job: any) => {
    setEditingItem(job);
    setJobForm({
      title: job.title,
      description: job.description || "",
      requirements: job.requirements || "",
      departmentId: job.departmentId || "",
      positionId: job.positionId || "",
      employmentType: job.employmentType || "full_time",
      location: job.location || "",
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      closingDate: job.closingDate || "",
      status: job.status || "draft",
    });
    setIsJobDialogOpen(true);
  };

  const handleAddApplicant = (job: any) => {
    setSelectedJob(job);
    setApplicantForm({ ...applicantForm, jobPostingId: job.id });
    setIsApplicantDialogOpen(true);
  };

  const handleScheduleInterview = (applicant: any) => {
    setSelectedApplicant(applicant);
    setInterviewForm({ ...interviewForm, applicantId: applicant.id });
    setIsInterviewDialogOpen(true);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const openJobs = jobs?.filter((j) => j.status === "open").length || 0;
  const totalApplicants = applicants?.length || 0;
  const pendingInterviews = interviews?.filter((i) => i.status === "scheduled").length || 0;

  const filteredJobs = jobs?.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplicants = applicants?.filter((a) =>
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Recruitment
          </h1>
          <p className="text-muted-foreground">Manage job postings, applicants, and interviews</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobs}</div>
            <p className="text-xs text-muted-foreground">Active job postings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInterviews}</div>
            <p className="text-xs text-muted-foreground">Scheduled interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All job postings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="jobs" data-testid="tab-jobs">Job Postings</TabsTrigger>
                <TabsTrigger value="applicants" data-testid="tab-applicants">Applicants</TabsTrigger>
                <TabsTrigger value="interviews" data-testid="tab-interviews">Interviews</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                    data-testid="input-search"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="jobs" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => { resetForms(); setIsJobDialogOpen(true); }} data-testid="button-new-job">
                  <Plus className="h-4 w-4 mr-2" />
                  New Job Posting
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingJobs ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredJobs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No job postings yet</TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs?.map((job) => (
                      <TableRow key={job.id} data-testid={`row-job-${job.id}`}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department?.name || "N/A"}</TableCell>
                        <TableCell className="capitalize">{job.employmentType?.replace("_", " ")}</TableCell>
                        <TableCell>
                          <Badge className={jobStatusColors[job.status] || jobStatusColors.draft}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.applicantCount || 0}</TableCell>
                        <TableCell>{job.closingDate ? format(new Date(job.closingDate), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleAddApplicant(job)} title="Add Applicant" data-testid={`button-add-applicant-${job.id}`}>
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditJob(job)} data-testid={`button-edit-job-${job.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("job", job.id)} data-testid={`button-delete-job-${job.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="applicants" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Job Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingApplicants ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredApplicants?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No applicants yet</TableCell>
                    </TableRow>
                  ) : (
                    filteredApplicants?.map((applicant) => (
                      <TableRow key={applicant.id} data-testid={`row-applicant-${applicant.id}`}>
                        <TableCell className="font-medium">{applicant.firstName} {applicant.lastName}</TableCell>
                        <TableCell>{applicant.email}</TableCell>
                        <TableCell>{applicant.phone || "N/A"}</TableCell>
                        <TableCell>{applicant.jobPosting?.title || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={applicantStatusColors[applicant.status] || applicantStatusColors.new}>
                            {applicant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{applicant.appliedAt ? format(new Date(applicant.appliedAt), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleScheduleInterview(applicant)} title="Schedule Interview" data-testid={`button-interview-${applicant.id}`}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("applicant", applicant.id)} data-testid={`button-delete-applicant-${applicant.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingInterviews ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : interviews?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No interviews scheduled</TableCell>
                    </TableRow>
                  ) : (
                    interviews?.map((interview) => (
                      <TableRow key={interview.id} data-testid={`row-interview-${interview.id}`}>
                        <TableCell className="font-medium">
                          {interview.applicant?.firstName} {interview.applicant?.lastName}
                        </TableCell>
                        <TableCell className="capitalize">{interview.type}</TableCell>
                        <TableCell>
                          {interview.scheduledDate ? format(new Date(interview.scheduledDate), "MMM d, yyyy") : "N/A"}
                          {interview.scheduledTime && ` at ${interview.scheduledTime}`}
                        </TableCell>
                        <TableCell>{interview.location || "N/A"}</TableCell>
                        <TableCell>
                          {interview.interviewer
                            ? `${interview.interviewer.firstName} ${interview.interviewer.lastName}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge>{interview.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("interview", interview.id)} data-testid={`button-delete-interview-${interview.id}`}>
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

      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Job Posting" : "New Job Posting"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label>Job Title</Label>
              <Input
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g., Senior Finance Officer"
                data-testid="input-job-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select
                  value={jobForm.departmentId}
                  onValueChange={(v) => setJobForm({ ...jobForm, departmentId: v })}
                >
                  <SelectTrigger data-testid="select-job-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Position</Label>
                <Select
                  value={jobForm.positionId}
                  onValueChange={(v) => setJobForm({ ...jobForm, positionId: v })}
                >
                  <SelectTrigger data-testid="select-job-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions?.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>{pos.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employment Type</Label>
                <Select
                  value={jobForm.employmentType}
                  onValueChange={(v) => setJobForm({ ...jobForm, employmentType: v })}
                >
                  <SelectTrigger data-testid="select-job-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={jobForm.status}
                  onValueChange={(v) => setJobForm({ ...jobForm, status: v })}
                >
                  <SelectTrigger data-testid="select-job-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="e.g., Kabul Office"
                data-testid="input-job-location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salary Min (AFN)</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMin}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                  data-testid="input-job-salary-min"
                />
              </div>
              <div>
                <Label>Salary Max (AFN)</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                  data-testid="input-job-salary-max"
                />
              </div>
            </div>
            <div>
              <Label>Closing Date</Label>
              <Input
                type="date"
                value={jobForm.closingDate}
                onChange={(e) => setJobForm({ ...jobForm, closingDate: e.target.value })}
                data-testid="input-job-closing"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={3}
                data-testid="input-job-description"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={3}
                data-testid="input-job-requirements"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createJobMutation.mutate({
                title: jobForm.title,
                description: jobForm.description || null,
                requirements: jobForm.requirements || null,
                departmentId: jobForm.departmentId || null,
                positionId: jobForm.positionId || null,
                employmentType: jobForm.employmentType,
                location: jobForm.location || null,
                salaryMin: jobForm.salaryMin ? parseFloat(jobForm.salaryMin) : null,
                salaryMax: jobForm.salaryMax ? parseFloat(jobForm.salaryMax) : null,
                closingDate: jobForm.closingDate || null,
                status: jobForm.status,
              })}
              disabled={!jobForm.title || createJobMutation.isPending}
              data-testid="button-save-job"
            >
              {createJobMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApplicantDialogOpen} onOpenChange={setIsApplicantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Applicant {selectedJob && `for ${selectedJob.title}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={applicantForm.firstName}
                  onChange={(e) => setApplicantForm({ ...applicantForm, firstName: e.target.value })}
                  data-testid="input-applicant-first"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={applicantForm.lastName}
                  onChange={(e) => setApplicantForm({ ...applicantForm, lastName: e.target.value })}
                  data-testid="input-applicant-last"
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={applicantForm.email}
                onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                data-testid="input-applicant-email"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={applicantForm.phone}
                onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                data-testid="input-applicant-phone"
              />
            </div>
            <div>
              <Label>Source</Label>
              <Input
                value={applicantForm.source}
                onChange={(e) => setApplicantForm({ ...applicantForm, source: e.target.value })}
                placeholder="e.g., LinkedIn, Referral"
                data-testid="input-applicant-source"
              />
            </div>
            <div>
              <Label>Cover Letter / Notes</Label>
              <Textarea
                value={applicantForm.coverLetter}
                onChange={(e) => setApplicantForm({ ...applicantForm, coverLetter: e.target.value })}
                rows={3}
                data-testid="input-applicant-cover"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplicantDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createApplicantMutation.mutate({
                jobPostingId: applicantForm.jobPostingId,
                firstName: applicantForm.firstName,
                lastName: applicantForm.lastName,
                email: applicantForm.email,
                phone: applicantForm.phone || null,
                coverLetter: applicantForm.coverLetter || null,
                source: applicantForm.source || null,
                status: "new",
              })}
              disabled={!applicantForm.firstName || !applicantForm.lastName || !applicantForm.email || createApplicantMutation.isPending}
              data-testid="button-save-applicant"
            >
              {createApplicantMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Schedule Interview
              {selectedApplicant && ` - ${selectedApplicant.firstName} ${selectedApplicant.lastName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={interviewForm.scheduledDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                  data-testid="input-interview-date"
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={interviewForm.scheduledTime}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledTime: e.target.value })}
                  data-testid="input-interview-time"
                />
              </div>
            </div>
            <div>
              <Label>Interview Type</Label>
              <Select
                value={interviewForm.type}
                onValueChange={(v) => setInterviewForm({ ...interviewForm, type: v })}
              >
                <SelectTrigger data-testid="select-interview-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location / Link</Label>
              <Input
                value={interviewForm.location}
                onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                placeholder="e.g., Meeting Room 2 or Zoom link"
                data-testid="input-interview-location"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                rows={3}
                data-testid="input-interview-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createInterviewMutation.mutate({
                applicantId: interviewForm.applicantId,
                scheduledDate: interviewForm.scheduledDate,
                scheduledTime: interviewForm.scheduledTime || null,
                type: interviewForm.type,
                location: interviewForm.location || null,
                notes: interviewForm.notes || null,
                status: "scheduled",
              })}
              disabled={!interviewForm.scheduledDate || createInterviewMutation.isPending}
              data-testid="button-save-interview"
            >
              {createInterviewMutation.isPending ? "Scheduling..." : "Schedule Interview"}
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
