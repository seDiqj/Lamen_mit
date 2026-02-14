import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save } from "lucide-react";
import type { Province, District } from "@shared/schema";

const customerFormSchema = z.object({
  customerNo: z.string().min(1, "Customer number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  maritalStatus: z.string().optional(),
  nationalId: z.string().optional(),
  placeOfBirth: z.string().optional(),
  age: z.coerce.number().optional(),
  homeAddress: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondPhoneNumber: z.string().optional(),
  numberOfDependents: z.coerce.number().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCustomerDialog({ open, onOpenChange }: NewCustomerDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: provincesData = [] } = useQuery<Province[]>({ queryKey: ["/api/provinces"] });
  const { data: districtsData = [] } = useQuery<(District & { provinceName?: string })[]>({ queryKey: ["/api/districts"] });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      customerNo: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      gender: undefined,
      maritalStatus: undefined,
      nationalId: "",
      placeOfBirth: "",
      age: undefined,
      homeAddress: "",
      province: "",
      district: "",
      phoneNumber: "",
      secondPhoneNumber: "",
      numberOfDependents: undefined,
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      return apiRequest("POST", "/api/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Customer Created",
        description: "The customer has been created successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    createCustomerMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Register a new customer in the system</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="customerNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Number *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. KB1300001" data-testid="input-customer-no" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Last Name</FormLabel>
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
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-maritalStatus">
                          <SelectValue placeholder="Select marital status" />
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
                    <FormLabel>National ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter national ID" data-testid="input-national-id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter age" data-testid="input-age" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter place of birth" data-testid="input-place-of-birth" />
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
                    <FormLabel>Second Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter second phone" data-testid="input-second-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter home address" data-testid="input-home-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const prov = provincesData.find(p => p.id.toString() === value);
                        field.onChange(prov?.name || "");
                        form.setValue("district", "");
                      }}
                      value={provincesData.find(p => p.name === field.value)?.id.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provincesData.map((prov) => (
                          <SelectItem key={prov.id} value={prov.id.toString()}>{prov.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => {
                  const selectedProvince = provincesData.find(p => p.name === form.watch("province"));
                  const filteredDistricts = districtsData.filter(d => d.provinceId === selectedProvince?.id);
                  return (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const dist = filteredDistricts.find(d => d.id.toString() === value);
                          field.onChange(dist?.name || "");
                        }}
                        value={filteredDistricts.find(d => d.name === field.value)?.id.toString() || ""}
                        disabled={!selectedProvince}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-district">
                            <SelectValue placeholder={selectedProvince ? "Select district" : "Select province first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredDistricts.map((dist) => (
                            <SelectItem key={dist.id} value={dist.id.toString()}>{dist.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="numberOfDependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="0" data-testid="input-dependents" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCustomerMutation.isPending} data-testid="button-submit-customer">
                <Save className="mr-2 h-4 w-4" />
                {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
