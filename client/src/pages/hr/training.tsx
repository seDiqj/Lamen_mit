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
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Award,
  Users,
  Calendar,
  Wrench,
} from "lucide-react";
import { format } from "date-fns";

const sessionStatusColors: Record<string, string> = {
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Training() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("programs");
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    isActive: true,
  });

  const [sessionForm, setSessionForm] = useState({
    programId: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    status: "planned",
  });

  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  const [certForm, setCertForm] = useState({
    name: "",
    issuingOrganization: "",
    validityPeriod: "",
    description: "",
  });

  const { data: programs, isLoading: loadingPrograms } = useQuery<any[]>({
    queryKey: ["/api/hr/training/programs"],
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery<any[]>({
    queryKey: ["/api/hr/training/sessions"],
  });

  const { data: skills, isLoading: loadingSkills } = useQuery<any[]>({
    queryKey: ["/api/hr/training/skills"],
  });

  const { data: certifications, isLoading: loadingCertifications } = useQuery<any[]>({
    queryKey: ["/api/hr/training/certifications"],
  });

  const createProgramMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/training/programs/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/training/programs", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Program updated" : "Program created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/training/programs"] });
      setIsProgramDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save program", description: error.message, variant: "destructive" });
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/training/sessions/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/training/sessions", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Session updated" : "Session created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/training/sessions"] });
      setIsSessionDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save session", description: error.message, variant: "destructive" });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/training/skills/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/training/skills", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Skill updated" : "Skill created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/training/skills"] });
      setIsSkillDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save skill", description: error.message, variant: "destructive" });
    },
  });

  const createCertMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingItem) {
        return apiRequest("PATCH", `/api/hr/training/certifications/${editingItem.id}`, data);
      }
      return apiRequest("POST", "/api/hr/training/certifications", data);
    },
    onSuccess: () => {
      toast({ title: editingItem ? "Certification updated" : "Certification created" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/training/certifications"] });
      setIsCertDialogOpen(false);
      resetForms();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save certification", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const endpoints: Record<string, string> = {
        program: `/api/hr/training/programs/${id}`,
        session: `/api/hr/training/sessions/${id}`,
        skill: `/api/hr/training/skills/${id}`,
        certification: `/api/hr/training/certifications/${id}`,
      };
      return apiRequest("DELETE", endpoints[type]);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/training"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    },
  });

  const resetForms = () => {
    setProgramForm({ title: "", description: "", category: "", duration: "", isActive: true });
    setSessionForm({ programId: "", startDate: "", endDate: "", location: "", maxParticipants: "", status: "planned" });
    setSkillForm({ name: "", category: "", description: "" });
    setCertForm({ name: "", issuingOrganization: "", validityPeriod: "", description: "" });
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingItem(program);
    setProgramForm({
      title: program.title,
      description: program.description || "",
      category: program.category || "",
      duration: program.duration?.toString() || "",
      isActive: program.isActive ?? true,
    });
    setIsProgramDialogOpen(true);
  };

  const handleEditSkill = (skill: any) => {
    setEditingItem(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category || "",
      description: skill.description || "",
    });
    setIsSkillDialogOpen(true);
  };

  const handleEditCert = (cert: any) => {
    setEditingItem(cert);
    setCertForm({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization || "",
      validityPeriod: cert.validityPeriod?.toString() || "",
      description: cert.description || "",
    });
    setIsCertDialogOpen(true);
  };

  const upcomingSessions = sessions?.filter((s) => s.status === "planned").length || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Training & Development
          </h1>
          <p className="text-muted-foreground">Manage training programs, skills, and certifications</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Training programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">Planned sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Defined skills</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certifications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Available certifications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="programs" data-testid="tab-programs">Programs</TabsTrigger>
              <TabsTrigger value="sessions" data-testid="tab-sessions">Sessions</TabsTrigger>
              <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications" data-testid="tab-certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="programs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Training Programs</h3>
                <Button onClick={() => { resetForms(); setIsProgramDialogOpen(true); }} data-testid="button-new-program">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPrograms ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : programs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No programs defined</TableCell>
                    </TableRow>
                  ) : (
                    programs?.map((program) => (
                      <TableRow key={program.id} data-testid={`row-program-${program.id}`}>
                        <TableCell className="font-medium">{program.title}</TableCell>
                        <TableCell>{program.category || "General"}</TableCell>
                        <TableCell>{program.duration ? `${program.duration} hours` : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={program.isActive ? "default" : "secondary"}>
                            {program.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProgram(program)} data-testid={`button-edit-program-${program.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("program", program.id)} data-testid={`button-delete-program-${program.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Training Sessions</h3>
                <Button onClick={() => { resetForms(); setIsSessionDialogOpen(true); }} data-testid="button-new-session">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSessions ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : sessions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No sessions scheduled</TableCell>
                    </TableRow>
                  ) : (
                    sessions?.map((session) => (
                      <TableRow key={session.id} data-testid={`row-session-${session.id}`}>
                        <TableCell className="font-medium">{session.program?.title || "N/A"}</TableCell>
                        <TableCell>
                          {session.startDate ? format(new Date(session.startDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {session.endDate ? format(new Date(session.endDate), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>{session.location || "N/A"}</TableCell>
                        <TableCell>{session.enrollmentCount || 0}/{session.maxParticipants || "∞"}</TableCell>
                        <TableCell>
                          <Badge className={sessionStatusColors[session.status] || sessionStatusColors.planned}>
                            {session.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("session", session.id)} data-testid={`button-delete-session-${session.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Skills Library</h3>
                <Button onClick={() => { resetForms(); setIsSkillDialogOpen(true); }} data-testid="button-new-skill">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
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
                  {loadingSkills ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : skills?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No skills defined</TableCell>
                    </TableRow>
                  ) : (
                    skills?.map((skill) => (
                      <TableRow key={skill.id} data-testid={`row-skill-${skill.id}`}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell>{skill.category || "General"}</TableCell>
                        <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill)} data-testid={`button-edit-skill-${skill.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("skill", skill.id)} data-testid={`button-delete-skill-${skill.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Certifications</h3>
                <Button onClick={() => { resetForms(); setIsCertDialogOpen(true); }} data-testid="button-new-cert">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Issuing Organization</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCertifications ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : certifications?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No certifications defined</TableCell>
                    </TableRow>
                  ) : (
                    certifications?.map((cert) => (
                      <TableRow key={cert.id} data-testid={`row-cert-${cert.id}`}>
                        <TableCell className="font-medium">{cert.name}</TableCell>
                        <TableCell>{cert.issuingOrganization || "N/A"}</TableCell>
                        <TableCell>{cert.validityPeriod ? `${cert.validityPeriod} months` : "Lifetime"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCert(cert)} data-testid={`button-edit-cert-${cert.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("certification", cert.id)} data-testid={`button-delete-cert-${cert.id}`}>
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

      <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Program" : "Add Training Program"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={programForm.title}
                onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                placeholder="e.g., Customer Service Excellence"
                data-testid="input-program-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={programForm.category}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                  placeholder="e.g., Soft Skills"
                  data-testid="input-program-category"
                />
              </div>
              <div>
                <Label>Duration (hours)</Label>
                <Input
                  type="number"
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                  data-testid="input-program-duration"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                rows={3}
                data-testid="input-program-description"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={programForm.isActive ? "active" : "inactive"}
                onValueChange={(v) => setProgramForm({ ...programForm, isActive: v === "active" })}
              >
                <SelectTrigger data-testid="select-program-status">
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
            <Button variant="outline" onClick={() => setIsProgramDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createProgramMutation.mutate({
                title: programForm.title,
                description: programForm.description || null,
                category: programForm.category || null,
                duration: programForm.duration ? parseInt(programForm.duration) : null,
                isActive: programForm.isActive,
              })}
              disabled={!programForm.title || createProgramMutation.isPending}
              data-testid="button-save-program"
            >
              {createProgramMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Training Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Program</Label>
              <Select
                value={sessionForm.programId}
                onValueChange={(v) => setSessionForm({ ...sessionForm, programId: v })}
              >
                <SelectTrigger data-testid="select-session-program">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>{program.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={sessionForm.startDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, startDate: e.target.value })}
                  data-testid="input-session-start"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={sessionForm.endDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, endDate: e.target.value })}
                  data-testid="input-session-end"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={sessionForm.location}
                  onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                  placeholder="e.g., Training Room A"
                  data-testid="input-session-location"
                />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={sessionForm.maxParticipants}
                  onChange={(e) => setSessionForm({ ...sessionForm, maxParticipants: e.target.value })}
                  data-testid="input-session-max"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={sessionForm.status}
                onValueChange={(v) => setSessionForm({ ...sessionForm, status: v })}
              >
                <SelectTrigger data-testid="select-session-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createSessionMutation.mutate({
                programId: sessionForm.programId,
                startDate: sessionForm.startDate || null,
                endDate: sessionForm.endDate || null,
                location: sessionForm.location || null,
                maxParticipants: sessionForm.maxParticipants ? parseInt(sessionForm.maxParticipants) : null,
                status: sessionForm.status,
              })}
              disabled={!sessionForm.programId || createSessionMutation.isPending}
              data-testid="button-save-session"
            >
              {createSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g., Microsoft Excel"
                data-testid="input-skill-name"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                placeholder="e.g., Technical"
                data-testid="input-skill-category"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={skillForm.description}
                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                rows={3}
                data-testid="input-skill-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createSkillMutation.mutate({
                name: skillForm.name,
                category: skillForm.category || null,
                description: skillForm.description || null,
              })}
              disabled={!skillForm.name || createSkillMutation.isPending}
              data-testid="button-save-skill"
            >
              {createSkillMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Certification" : "Add Certification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={certForm.name}
                onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                placeholder="e.g., PMP Certification"
                data-testid="input-cert-name"
              />
            </div>
            <div>
              <Label>Issuing Organization</Label>
              <Input
                value={certForm.issuingOrganization}
                onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                placeholder="e.g., PMI"
                data-testid="input-cert-issuer"
              />
            </div>
            <div>
              <Label>Validity Period (months)</Label>
              <Input
                type="number"
                value={certForm.validityPeriod}
                onChange={(e) => setCertForm({ ...certForm, validityPeriod: e.target.value })}
                placeholder="Leave empty for lifetime"
                data-testid="input-cert-validity"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={certForm.description}
                onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                rows={3}
                data-testid="input-cert-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCertDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createCertMutation.mutate({
                name: certForm.name,
                issuingOrganization: certForm.issuingOrganization || null,
                validityPeriod: certForm.validityPeriod ? parseInt(certForm.validityPeriod) : null,
                description: certForm.description || null,
              })}
              disabled={!certForm.name || createCertMutation.isPending}
              data-testid="button-save-cert"
            >
              {createCertMutation.isPending ? "Saving..." : "Save"}
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
