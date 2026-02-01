import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, FileText, Save } from "lucide-react";
import { Link } from "wouter";
import type { Customer, Branch, FinanceOfficer, FundingSource } from "@shared/schema";

const loanFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  branchId: z.string().min(1, "Branch is required"),
  financeOfficerId: z.string().optional(),
  fundingSourceId: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  productCode: z.string().optional(),
  financingPurpose: z.string().optional(),
  financingCycle: z.coerce.number().optional(),
  requestAmount: z.coerce.number().min(1, "Request amount is required"),
  financingDurationMonths: z.coerce.number().min(1, "Duration is required"),
  gracePeriod: z.coerce.number().optional(),
  numberOfInstallments: z.coerce.number().optional(),
  marginRate: z.coerce.number().optional(),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

export default function NewLoanPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: customers } = useQuery<{ customers: Customer[] }>({
    queryKey: ["/api/customers"],
  });

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const { data: officers } = useQuery<FinanceOfficer[]>({
    queryKey: ["/api/officers"],
  });

  const { data: fundingSources } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources"],
  });

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      customerId: "",
      branchId: "",
      financeOfficerId: "",
      fundingSourceId: "",
      productName: "Murabaha",
      productCode: "",
      financingPurpose: "",
      financingCycle: 1,
      requestAmount: 0,
      financingDurationMonths: 12,
      gracePeriod: 0,
      numberOfInstallments: 12,
      marginRate: 0,
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: async (data: LoanFormValues) => {
      return apiRequest("POST", "/api/loans", {
        ...data,
        requestAmount: String(data.requestAmount),
        marginRate: data.marginRate ? String(data.marginRate) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: "Loan Created",
        description: "The loan application has been created successfully.",
      });
      navigate("/loans");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create loan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoanFormValues) => {
    createLoanMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/loans">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-new-loan-title">New Loan Application</h1>
            <p className="text-muted-foreground">Create a new loan application</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-customer">
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers?.customers?.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.firstName} {customer.lastName} ({customer.customerNo})
                            </SelectItem>
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
                      <FormLabel>Branch *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-branch">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches?.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="financeOfficerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finance Officer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-officer">
                            <SelectValue placeholder="Select officer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {officers?.map((officer) => (
                            <SelectItem key={officer.id} value={officer.id}>
                              {officer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fundingSourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Source</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-funding-source">
                            <SelectValue placeholder="Select funding source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fundingSources?.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Murabaha" data-testid="input-product-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 11" data-testid="input-product-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requestAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Amount (AFN) *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" data-testid="input-request-amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="financingDurationMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Months) *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="12" data-testid="input-duration" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Installments</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="12" data-testid="input-installments" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gracePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace Period (Months)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="0" data-testid="input-grace-period" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marginRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin Rate (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" placeholder="0" data-testid="input-margin-rate" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="financingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financing Cycle</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="1" data-testid="input-financing-cycle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="financingPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financing Purpose</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe the purpose of this loan..." data-testid="input-purpose" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={createLoanMutation.isPending} data-testid="button-submit-loan">
                  <Save className="mr-2 h-4 w-4" />
                  {createLoanMutation.isPending ? "Creating..." : "Create Loan"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/loans">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
