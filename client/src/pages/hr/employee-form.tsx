import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  UserPlus,
  User,
  Briefcase,
  GraduationCap,
  Phone,
  Languages,
  Users,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  FileText,
  Upload,
  Camera,
} from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import type { 
  Branch, 
  Department, 
  Position,
  Employee,
  EmployeeEmergencyContact,
  EmployeeLanguage,
  EmployeeFamilyMember,
  EmployeeReference,
} from "@shared/schema";

const WIZARD_TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "education", label: "Education & Experience", icon: GraduationCap },
  { id: "contacts", label: "Emergency Contacts", icon: Phone },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "family", label: "Family at Lamen", icon: Users },
  { id: "references", label: "References", icon: FileText },
];

const employeeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  fatherName: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  age: z.number().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
  nationalId: z.string().optional(),
  nationalIdPlaceOfIssue: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondPhoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  positionId: z.string().optional(),
  departmentId: z.string().optional(),
  branchId: z.string().optional(),
  dutyStation: z.string().optional(),
  hireDate: z.string().optional(),
  employmentStatus: z.enum(["active", "on_leave", "suspended", "terminated", "resigned"]).optional(),
  educationLevel: z.enum(["not_graduate", "high_school", "bachelor", "master", "phd"]).optional(),
  educationDetails: z.string().optional(),
  totalExperienceYears: z.number().optional(),
  jobRelatedExperienceYears: z.number().optional(),
  otherExperienceYears: z.number().optional(),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

type EmergencyContactForm = {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
};

type LanguageForm = {
  language: string;
  speakingLevel: "basic" | "conversational" | "fluent";
  writingLevel: "basic" | "conversational" | "fluent";
  readingLevel: "basic" | "conversational" | "fluent";
};

type FamilyMemberForm = {
  name: string;
  fatherName: string;
  relationship: string;
  position: string;
  department: string;
};

type ReferenceForm = {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
};

export default function EmployeeForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/hr/employees/:id/edit");
  const isEditing = !!params?.id;
  const employeeId = params?.id;
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactForm[]>([]);
  const [languages, setLanguages] = useState<LanguageForm[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberForm[]>([]);
  const [references, setReferences] = useState<ReferenceForm[]>([]);
  
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  
  const [newContact, setNewContact] = useState<EmergencyContactForm>({ name: "", relationship: "", phoneNumber: "", email: "" });
  const [newLanguage, setNewLanguage] = useState<LanguageForm>({ language: "", speakingLevel: "basic", writingLevel: "basic", readingLevel: "basic" });
  const [newFamilyMember, setNewFamilyMember] = useState<FamilyMemberForm>({ name: "", fatherName: "", relationship: "", position: "", department: "" });
  const [newReference, setNewReference] = useState<ReferenceForm>({ name: "", relationship: "", phoneNumber: "", email: "", address: "" });
  const [photoUrl, setPhotoUrl] = useState<string>("");
  
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      setPhotoUrl(response.objectPath);
      toast({ title: "Photo uploaded successfully" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      gender: undefined,
      dateOfBirth: "",
      maritalStatus: undefined,
      nationalId: "",
      nationalIdPlaceOfIssue: "",
      phoneNumber: "",
      secondPhoneNumber: "",
      email: "",
      permanentAddress: "",
      currentAddress: "",
      positionId: "",
      departmentId: "",
      branchId: "",
      dutyStation: "",
      hireDate: "",
      employmentStatus: "active",
      educationLevel: undefined,
      educationDetails: "",
      totalExperienceYears: 0,
      jobRelatedExperienceYears: 0,
      otherExperienceYears: 0,
    },
  });

  const { data: branches } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: departments } = useQuery<Department[]>({ queryKey: ["/api/hr/departments"] });
  const { data: positions } = useQuery<Position[]>({ queryKey: ["/api/hr/positions"] });
  
  const { data: existingEmployee } = useQuery<Employee>({
    queryKey: ["/api/hr/employees", employeeId],
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingEmployee && isEditing) {
      form.reset({
        firstName: existingEmployee.firstName || "",
        lastName: existingEmployee.lastName || "",
        fatherName: existingEmployee.fatherName || "",
        gender: existingEmployee.gender as any,
        dateOfBirth: existingEmployee.dateOfBirth || "",
        maritalStatus: existingEmployee.maritalStatus as any,
        nationalId: existingEmployee.nationalId || "",
        nationalIdPlaceOfIssue: existingEmployee.nationalIdPlaceOfIssue || "",
        phoneNumber: existingEmployee.phoneNumber || "",
        secondPhoneNumber: existingEmployee.secondPhoneNumber || "",
        email: existingEmployee.email || "",
        permanentAddress: existingEmployee.permanentAddress || "",
        currentAddress: existingEmployee.currentAddress || "",
        positionId: existingEmployee.positionId || "",
        departmentId: existingEmployee.departmentId || "",
        branchId: existingEmployee.branchId || "",
        dutyStation: existingEmployee.dutyStation || "",
        hireDate: existingEmployee.hireDate || "",
        employmentStatus: existingEmployee.employmentStatus as any,
        educationLevel: existingEmployee.educationLevel as any,
        educationDetails: existingEmployee.educationDetails || "",
        totalExperienceYears: existingEmployee.totalExperienceYears || 0,
        jobRelatedExperienceYears: existingEmployee.jobRelatedExperienceYears || 0,
        otherExperienceYears: existingEmployee.otherExperienceYears || 0,
      });
      if (existingEmployee.photoUrl) {
        setPhotoUrl(existingEmployee.photoUrl);
      }
    }
  }, [existingEmployee, isEditing, form]);

  const createMutation = useMutation({
    mutationFn: async (data: EmployeeFormData & { emergencyContacts: EmergencyContactForm[], languages: LanguageForm[], familyMembers: FamilyMemberForm[], references: ReferenceForm[] }) => {
      const res = await apiRequest("POST", "/api/hr/employees", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Employee created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/employees"] });
      setLocation("/hr/employees");
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create employee", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EmployeeFormData & { emergencyContacts: EmergencyContactForm[], languages: LanguageForm[], familyMembers: FamilyMemberForm[], references: ReferenceForm[] }) => {
      const res = await apiRequest("PATCH", `/api/hr/employees/${employeeId}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Employee updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/employees"] });
      setLocation("/hr/employees");
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update employee", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    const submitData = {
      ...data,
      photoUrl,
      emergencyContacts,
      languages,
      familyMembers,
      references,
    };
    
    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const nextTab = () => {
    if (activeTab < WIZARD_TABS.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const addContact = () => {
    if (newContact.name) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: "", relationship: "", phoneNumber: "", email: "" });
      setContactDialogOpen(false);
    }
  };

  const addLanguage = () => {
    if (newLanguage.language) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage({ language: "", speakingLevel: "basic", writingLevel: "basic", readingLevel: "basic" });
      setLanguageDialogOpen(false);
    }
  };

  const addFamilyMember = () => {
    if (newFamilyMember.name) {
      setFamilyMembers([...familyMembers, newFamilyMember]);
      setNewFamilyMember({ name: "", fatherName: "", relationship: "", position: "", department: "" });
      setFamilyDialogOpen(false);
    }
  };

  const addReference = () => {
    if (newReference.name) {
      setReferences([...references, newReference]);
      setNewReference({ name: "", relationship: "", phoneNumber: "", email: "", address: "" });
      setReferenceDialogOpen(false);
    }
  };

  const renderTabContent = () => {
    switch (WIZARD_TABS[activeTab].id) {
      case "personal":
        return (
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex items-start gap-6 pb-4 border-b">
              <div className="relative">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Employee photo" 
                    className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-base font-medium">Employee Photo</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a professional photo for the employee's profile.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          uploadFile(file);
                        }
                      };
                      input.click();
                    }}
                    data-testid="button-upload-photo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                  {photoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPhotoUrl("")}
                      data-testid="button-remove-photo"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter first name" data-testid="input-first-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter last name" data-testid="input-last-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter father's name" data-testid="input-father-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => {
                const calculateAge = (dob: string) => {
                  if (!dob) return null;
                  const birthDate = new Date(dob);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }
                  return age;
                };
                const age = calculateAge(field.value);
                return (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-dob" className="flex-1" />
                      </FormControl>
                      {age !== null && age >= 0 && (
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          Age: <span className="text-foreground font-semibold">{age}</span> years
                        </span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-marital-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIC/Tazkira Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter NIC number" data-testid="input-national-id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationalIdPlaceOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place of Issue</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter place of issue" data-testid="input-nic-place" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter phone number" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter secondary phone" data-testid="input-phone-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Enter email" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2 lg:col-span-3">
              <FormField
                control={form.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter permanent address" data-testid="input-permanent-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <FormField
                control={form.control}
                name="currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter current address" data-testid="input-current-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>
          </div>
        );

      case "employment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department/Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="positionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {positions?.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>{pos.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dutyStation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duty Station</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter duty station" data-testid="input-duty-station" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-hire-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                      <SelectItem value="resigned">Resigned</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "education":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-education">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not_graduate">Not Yet Graduate</SelectItem>
                      <SelectItem value="high_school">High School Graduate</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="educationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Details</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe your educational background" data-testid="input-education-details" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="totalExperienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Experience (Years)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        field.onChange(val ? parseInt(val) : 0);
                      }}
                      placeholder="Enter years"
                      data-testid="input-total-exp" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobRelatedExperienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Related Experience (Years)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        field.onChange(val ? parseInt(val) : 0);
                      }}
                      placeholder="Enter years"
                      data-testid="input-job-exp" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherExperienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Experience (Years)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        field.onChange(val ? parseInt(val) : 0);
                      }}
                      placeholder="Enter years"
                      data-testid="input-other-exp" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Emergency Contacts</h3>
              <Button type="button" onClick={() => setContactDialogOpen(true)} className="gap-2" data-testid="button-add-contact">
                <Plus className="h-4 w-4" /> Add Contact
              </Button>
            </div>
            {emergencyContacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emergencyContacts.map((contact, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.relationship}</TableCell>
                      <TableCell>{contact.phoneNumber}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No emergency contacts added. Click "Add Contact" to add one.
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "languages":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Languages</h3>
              <Button type="button" onClick={() => setLanguageDialogOpen(true)} className="gap-2" data-testid="button-add-language">
                <Plus className="h-4 w-4" /> Add Language
              </Button>
            </div>
            {languages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead>Speaking</TableHead>
                    <TableHead>Writing</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {languages.map((lang, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{lang.language}</TableCell>
                      <TableCell><Badge variant="outline">{lang.speakingLevel}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{lang.writingLevel}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{lang.readingLevel}</Badge></TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No languages added. Click "Add Language" to add one.
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "family":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Family Members Working at Lamen</h3>
              <Button type="button" onClick={() => setFamilyDialogOpen(true)} className="gap-2" data-testid="button-add-family">
                <Plus className="h-4 w-4" /> Add Family Member
              </Button>
            </div>
            {familyMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyMembers.map((member, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.fatherName}</TableCell>
                      <TableCell>{member.relationship}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No family members added. Click "Add Family Member" if any relatives work at Lamen.
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "references":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Professional References</h3>
              <Button type="button" onClick={() => setReferenceDialogOpen(true)} className="gap-2" data-testid="button-add-reference">
                <Plus className="h-4 w-4" /> Add Reference
              </Button>
            </div>
            {references.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {references.map((ref, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{ref.name}</TableCell>
                      <TableCell>{ref.relationship}</TableCell>
                      <TableCell>{ref.phoneNumber}</TableCell>
                      <TableCell>{ref.email}</TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setReferences(references.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No references added. Click "Add Reference" to add professional references.
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <UserPlus className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">
              {isEditing ? "Edit Employee" : "Add New Employee"}
            </h1>
            <p className="text-muted-foreground text-sm">Staff Personal Information Form</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setLocation("/hr/employees")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employees
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {WIZARD_TABS.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === index
                ? "bg-primary text-primary-foreground"
                : index < activeTab
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-testid={`tab-${tab.id}`}
          >
            {index < activeTab ? (
              <Check className="h-4 w-4" />
            ) : (
              <tab.icon className="h-4 w-4" />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const TabIcon = WIZARD_TABS[activeTab].icon;
              return <TabIcon className="h-5 w-5" />;
            })()}
            {WIZARD_TABS[activeTab].label}
          </CardTitle>
          <CardDescription>
            Step {activeTab + 1} of {WIZARD_TABS.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderTabContent()}
              
              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevTab}
                  disabled={activeTab === 0}
                  data-testid="button-prev"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                
                {activeTab === WIZARD_TABS.length - 1 ? (
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="gap-2"
                    data-testid="button-submit"
                  >
                    <Save className="h-4 w-4" />
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Employee"}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextTab} data-testid="button-next">
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input 
                value={newContact.name} 
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Contact name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Relationship</Label>
              <Input 
                value={newContact.relationship} 
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input 
                value={newContact.phoneNumber} 
                onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={newContact.email} 
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={addContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Language</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Language *</Label>
              <Input 
                value={newLanguage.language} 
                onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                placeholder="e.g., Dari, Pashto, English"
              />
            </div>
            <div className="grid gap-2">
              <Label>Speaking Level</Label>
              <Select 
                value={newLanguage.speakingLevel} 
                onValueChange={(v) => setNewLanguage({ ...newLanguage, speakingLevel: v as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Writing Level</Label>
              <Select 
                value={newLanguage.writingLevel} 
                onValueChange={(v) => setNewLanguage({ ...newLanguage, writingLevel: v as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Reading Level</Label>
              <Select 
                value={newLanguage.readingLevel} 
                onValueChange={(v) => setNewLanguage({ ...newLanguage, readingLevel: v as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLanguageDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={addLanguage}>Add Language</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={familyDialogOpen} onOpenChange={setFamilyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Family Member at Lamen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input 
                value={newFamilyMember.name} 
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                placeholder="Family member name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Father's Name</Label>
              <Input 
                value={newFamilyMember.fatherName} 
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, fatherName: e.target.value })}
                placeholder="Father's name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Relationship</Label>
              <Input 
                value={newFamilyMember.relationship} 
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                placeholder="e.g., Brother, Sister, Cousin"
              />
            </div>
            <div className="grid gap-2">
              <Label>Position</Label>
              <Input 
                value={newFamilyMember.position} 
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, position: e.target.value })}
                placeholder="Their position at Lamen"
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Input 
                value={newFamilyMember.department} 
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, department: e.target.value })}
                placeholder="Their department"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFamilyDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={addFamilyMember}>Add Family Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={referenceDialogOpen} onOpenChange={setReferenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Professional Reference</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input 
                value={newReference.name} 
                onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                placeholder="Reference name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Relationship</Label>
              <Input 
                value={newReference.relationship} 
                onChange={(e) => setNewReference({ ...newReference, relationship: e.target.value })}
                placeholder="e.g., Former Supervisor, Colleague"
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input 
                value={newReference.phoneNumber} 
                onChange={(e) => setNewReference({ ...newReference, phoneNumber: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={newReference.email} 
                onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Textarea 
                value={newReference.address} 
                onChange={(e) => setNewReference({ ...newReference, address: e.target.value })}
                placeholder="Address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setReferenceDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={addReference}>Add Reference</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
