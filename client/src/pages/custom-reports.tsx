import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Play,
  Save,
  Trash2,
  BookOpen,
  Plus,
  X,
  Database,
  Filter,
  Columns,
  ArrowUpDown,
  Loader2,
  LayoutList,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type FieldDef = { key: string; label: string; type: string; source?: string };
type FilterItem = { field: string; operator: string; value: string; value2?: string };
type SavedReport = {
  id: number;
  name: string;
  dataSource: string;
  columns: string;
  filters: string;
  groupBy: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  createdBy: string | null;
  createdAt: string;
};

const DATA_SOURCES = [
  { value: "customers", label: "Customers", icon: "👤" },
  { value: "loans", label: "Loans / Financing", icon: "💰" },
  { value: "installments", label: "Installments / Payments", icon: "📅" },
  { value: "collections", label: "Collections", icon: "📋" },
  { value: "guarantors", label: "Guarantors", icon: "🤝" },
  { value: "disbursements", label: "Disbursements", icon: "🏦" },
];

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "starts_with", label: "Starts With" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "between", label: "Between" },
  { value: "is_null", label: "Is Empty" },
  { value: "is_not_null", label: "Is Not Empty" },
];

export default function CustomReportsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [groupBy, setGroupBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [reportData, setReportData] = useState<any>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [activeTab, setActiveTab] = useState<"builder" | "saved">("builder");

  const sourcesKey = selectedSources.sort().join(",");

  const { data: fields = [] } = useQuery<FieldDef[]>({
    queryKey: ["/api/custom-reports/fields", sourcesKey],
    enabled: selectedSources.length > 0,
  });

  const { data: savedReports = [] } = useQuery<SavedReport[]>({
    queryKey: ["/api/saved-reports"],
  });

  const generateMutation = useMutation({
    mutationFn: async (config: any) => {
      const res = await apiRequest("POST", "/api/custom-reports/generate", config);
      return res.json();
    },
    onSuccess: (data) => {
      setReportData(data);
      toast({ title: "Report generated", description: `${data.total} records found` });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to generate report", variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/saved-reports", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      setSaveDialogOpen(false);
      setReportName("");
      toast({ title: "Report saved", description: "Template saved for future use" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/saved-reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      toast({ title: "Report deleted" });
    },
  });

  const toggleSource = (source: string) => {
    setSelectedSources(prev => {
      const next = prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source];
      if (!prev.includes(source) || next.length === 0) {
        setSelectedColumns([]);
        setFilters([]);
        setGroupBy("");
        setSortBy("");
        setReportData(null);
      }
      return next;
    });
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const selectAllColumns = () => {
    if (selectedColumns.length === fields.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(fields.map((f) => f.key));
    }
  };

  const addFilter = () => {
    setFilters([...filters, { field: fields[0]?.key || "", operator: "equals", value: "" }]);
  };

  const updateFilter = (index: number, updates: Partial<FilterItem>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (selectedSources.length === 0) {
      toast({ title: "Select at least one data source", variant: "destructive" });
      return;
    }
    if (selectedColumns.length === 0) {
      toast({ title: "Select at least one column", variant: "destructive" });
      return;
    }
    generateMutation.mutate({
      dataSources: selectedSources,
      columns: selectedColumns,
      filters: filters.filter((f) => f.field && (f.operator === "is_null" || f.operator === "is_not_null" || f.value)),
      groupBy: groupBy && groupBy !== "none" ? groupBy : undefined,
      sortBy: sortBy && sortBy !== "none" ? sortBy : undefined,
      sortOrder,
    });
  };

  const handleSave = () => {
    if (!reportName.trim()) return;
    saveMutation.mutate({
      name: reportName.trim(),
      dataSource: selectedSources.join(","),
      columns: JSON.stringify(selectedColumns),
      filters: JSON.stringify(filters),
      groupBy: groupBy && groupBy !== "none" ? groupBy : null,
      sortBy: sortBy && sortBy !== "none" ? sortBy : null,
      sortOrder,
    });
  };

  const loadSavedReport = (report: SavedReport) => {
    const sources = report.dataSource.includes(",") ? report.dataSource.split(",") : [report.dataSource];
    setSelectedSources(sources);
    try {
      setSelectedColumns(JSON.parse(report.columns));
      setFilters(JSON.parse(report.filters));
    } catch {
      setSelectedColumns([]);
      setFilters([]);
    }
    setGroupBy(report.groupBy || "");
    setSortBy(report.sortBy || "");
    setSortOrder(report.sortOrder || "asc");
    setReportData(null);
    setActiveTab("builder");
    toast({ title: "Template loaded", description: `Loaded "${report.name}". Click Generate to run.` });
  };

  const getColumnLabel = (key: string) => {
    const found = fields.find((f) => f.key === key);
    if (found) return found.label;
    return key.replace(/^[a-z]_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  const getSourceLabel = () => {
    if (selectedSources.length === 0) return "";
    if (selectedSources.length === 1) {
      return DATA_SOURCES.find(s => s.value === selectedSources[0])?.label || selectedSources[0];
    }
    return selectedSources.map(s => DATA_SOURCES.find(d => d.value === s)?.label || s).join(" + ");
  };

  const exportToExcel = () => {
    if (!reportData?.data?.length) return;
    const displayCols = selectedColumns.length > 0 ? selectedColumns : Object.keys(reportData.data[0]);
    const rows = reportData.data.map((row: any) => {
      const obj: any = {};
      displayCols.forEach((col) => {
        obj[getColumnLabel(col)] = formatCellValue(row[col]);
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Custom_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (!reportData?.data?.length) return;
    const doc = new jsPDF({ orientation: "landscape" });
    const sourceName = getSourceLabel();

    doc.setFontSize(16);
    doc.text(`Custom Report — ${sourceName}`, 14, 15);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()} | Records: ${reportData.total}`, 14, 22);

    const displayCols = selectedColumns.length > 0 ? selectedColumns : Object.keys(reportData.data[0]);
    const headers = displayCols.map((col) => getColumnLabel(col));
    const body = reportData.data.map((row: any) =>
      displayCols.map((col) => formatCellValue(row[col]))
    );

    autoTable(doc, {
      head: [headers],
      body,
      startY: 28,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`Custom_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const displayColumns = selectedColumns.length > 0
    ? selectedColumns
    : reportData?.data?.[0] ? Object.keys(reportData.data[0]) : [];

  const sourceColors: Record<string, string> = {
    customers: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    loans: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    installments: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    collections: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    guarantors: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    disbursements: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  };

  const groupedFields = selectedSources.map(src => ({
    source: src,
    label: DATA_SOURCES.find(d => d.value === src)?.label || src,
    fields: fields.filter(f => f.source === src),
  }));

  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" data-testid="text-page-title">
            Custom Report Builder
          </h1>
          <p className="text-sm text-muted-foreground">
            Build custom reports from one or multiple data sources with filters, grouping, and export
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("builder")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "builder"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-builder"
        >
          <Database className="h-4 w-4 inline mr-2" />
          Report Builder
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "saved"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-saved"
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Saved Templates ({savedReports.length})
        </button>
      </div>

      {activeTab === "saved" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedReports.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No saved report templates yet</p>
                <p className="text-xs mt-1">Build a report and save it as a template for quick access</p>
              </CardContent>
            </Card>
          ) : (
            savedReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => deleteMutation.mutate(report.id)}
                      data-testid={`button-delete-report-${report.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {(report.dataSource.includes(",") ? report.dataSource.split(",") : [report.dataSource]).map(src => (
                        <Badge key={src} variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs">
                          {DATA_SOURCES.find((s) => s.value === src)?.label || src}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(() => { try { return JSON.parse(report.columns).length; } catch { return 0; } })()} columns
                      {(() => { try { const f = JSON.parse(report.filters); return f.length > 0 ? ` • ${f.length} filters` : ""; } catch { return ""; } })()}
                      {report.groupBy && report.groupBy !== "none" ? ` • Grouped by ${report.groupBy}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => loadSavedReport(report)}
                      data-testid={`button-load-report-${report.id}`}
                    >
                      <Play className="h-3 w-3 mr-2" /> Load & Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "builder" && (
        <>
          <div className="grid gap-4 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-500" />
                  1. Data Sources
                  {selectedSources.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">{selectedSources.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">Select one or more sources to combine</p>
                <div className="space-y-1.5">
                  {DATA_SOURCES.map((source) => (
                    <label
                      key={source.value}
                      className={`flex items-center gap-2 text-xs py-1.5 px-2 cursor-pointer rounded transition-colors ${
                        selectedSources.includes(source.value)
                          ? sourceColors[source.value]
                          : "hover:bg-muted/50"
                      }`}
                      data-testid={`checkbox-source-${source.value}`}
                    >
                      <Checkbox
                        checked={selectedSources.includes(source.value)}
                        onCheckedChange={() => toggleSource(source.value)}
                      />
                      <span className="mr-1">{source.icon}</span>
                      {source.label}
                    </label>
                  ))}
                </div>
                {selectedSources.length > 1 && (
                  <p className="text-xs text-emerald-600 mt-2 font-medium">
                    Combined: {getSourceLabel()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Columns className="h-4 w-4 text-blue-500" />
                  2. Columns
                  {selectedColumns.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">{selectedColumns.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSources.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Select data source(s) first</p>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    <button
                      onClick={selectAllColumns}
                      className="text-xs text-emerald-600 hover:underline mb-1"
                      data-testid="button-select-all-columns"
                    >
                      {selectedColumns.length === fields.length ? "Deselect All" : "Select All"}
                    </button>
                    {groupedFields.length > 1 ? (
                      groupedFields.map(group => (
                        <div key={group.source}>
                          <p className={`text-xs font-semibold mt-2 mb-1 px-1 py-0.5 rounded ${sourceColors[group.source] || ""}`}>
                            {group.label}
                          </p>
                          {group.fields.map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs py-0.5 cursor-pointer hover:bg-muted/50 rounded px-1">
                              <Checkbox
                                checked={selectedColumns.includes(field.key)}
                                onCheckedChange={() => toggleColumn(field.key)}
                                data-testid={`checkbox-column-${field.key}`}
                              />
                              {field.label}
                            </label>
                          ))}
                        </div>
                      ))
                    ) : (
                      fields.map((field) => (
                        <label key={field.key} className="flex items-center gap-2 text-xs py-0.5 cursor-pointer hover:bg-muted/50 rounded px-1">
                          <Checkbox
                            checked={selectedColumns.includes(field.key)}
                            onCheckedChange={() => toggleColumn(field.key)}
                            data-testid={`checkbox-column-${field.key}`}
                          />
                          {field.label}
                        </label>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-purple-500" />
                  3. Sort & Group
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSources.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Select data source(s) first</p>
                ) : (
                  <>
                    <div>
                      <Label className="text-xs">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-8 text-xs" data-testid="select-sort-by">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {fields.map((f) => (
                            <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {sortBy && sortBy !== "none" && (
                      <div>
                        <Label className="text-xs">Sort Order</Label>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                          <SelectTrigger className="h-8 text-xs" data-testid="select-sort-order">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Ascending (A → Z)</SelectItem>
                            <SelectItem value="desc">Descending (Z → A)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs">Group By</Label>
                      <Select value={groupBy} onValueChange={setGroupBy}>
                        <SelectTrigger className="h-8 text-xs" data-testid="select-group-by">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {fields.filter((f) => f.type === "text").map((f) => (
                            <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-500" />
                  4. Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleGenerate}
                  disabled={selectedSources.length === 0 || selectedColumns.length === 0 || generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  data-testid="button-generate-report"
                >
                  {generateMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Generate Report</>
                  )}
                </Button>

                {selectedSources.length > 0 && selectedColumns.length > 0 && (
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-save-template">
                        <Save className="h-3 w-3 mr-2" /> Save as Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Report Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Template Name</Label>
                          <Input
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            placeholder="e.g., Active Loans by Branch"
                            data-testid="input-report-name"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Sources: {getSourceLabel()}</p>
                          <p>Columns: {selectedColumns.length} selected</p>
                          <p>Filters: {filters.filter((f) => f.value || f.operator === "is_null" || f.operator === "is_not_null").length} active</p>
                        </div>
                        <Button
                          onClick={handleSave}
                          disabled={!reportName.trim() || saveMutation.isPending}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-testid="button-confirm-save"
                        >
                          {saveMutation.isPending ? "Saving..." : "Save Template"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {reportData?.data?.length > 0 && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={exportToExcel} data-testid="button-export-excel">
                      <FileSpreadsheet className="h-3 w-3 mr-1" /> Excel
                    </Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={exportToPDF} data-testid="button-export-pdf">
                      <FileText className="h-3 w-3 mr-1" /> PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedSources.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4 text-orange-500" />
                    Filters
                    {filters.length > 0 && <Badge variant="secondary">{filters.length}</Badge>}
                  </CardTitle>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={addFilter} data-testid="button-add-filter">
                    <Plus className="h-3 w-3 mr-1" /> Add Filter
                  </Button>
                </div>
              </CardHeader>
              {filters.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {filters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2 flex-wrap">
                        <Select
                          value={filter.field}
                          onValueChange={(v) => updateFilter(index, { field: v })}
                        >
                          <SelectTrigger className="h-8 text-xs w-48" data-testid={`select-filter-field-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fields.map((f) => (
                              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={filter.operator}
                          onValueChange={(v) => updateFilter(index, { operator: v })}
                        >
                          <SelectTrigger className="h-8 text-xs w-36" data-testid={`select-filter-operator-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATORS.map((op) => (
                              <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {filter.operator !== "is_null" && filter.operator !== "is_not_null" && (
                          <Input
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="h-8 text-xs w-40"
                            placeholder="Value..."
                            data-testid={`input-filter-value-${index}`}
                          />
                        )}

                        {filter.operator === "between" && (
                          <Input
                            value={filter.value2 || ""}
                            onChange={(e) => updateFilter(index, { value2: e.target.value })}
                            className="h-8 text-xs w-40"
                            placeholder="End value..."
                            data-testid={`input-filter-value2-${index}`}
                          />
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeFilter(index)}
                          data-testid={`button-remove-filter-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {reportData && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LayoutList className="h-4 w-4 text-emerald-500" />
                    Results
                    <Badge variant="outline">{reportData.total} records</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={exportToExcel} data-testid="button-export-excel-bottom">
                      <Download className="h-3 w-3 mr-1" /> Excel
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={exportToPDF} data-testid="button-export-pdf-bottom">
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reportData.grouped ? (
                  <div className="space-y-4">
                    {reportData.grouped.map((group: any, gi: number) => (
                      <div key={gi}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                            {group.group}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{group.count} records</span>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-emerald-50 dark:bg-emerald-950/30">
                                <TableHead className="text-xs w-10">#</TableHead>
                                {displayColumns.map((col: string) => (
                                  <TableHead key={col} className="text-xs whitespace-nowrap">{getColumnLabel(col)}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.rows.slice(0, 100).map((row: any, ri: number) => (
                                <TableRow key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-slate-50 dark:bg-slate-900/50"}>
                                  <TableCell className="text-xs text-muted-foreground">{ri + 1}</TableCell>
                                  {displayColumns.map((col: string) => (
                                    <TableCell key={col} className="text-xs whitespace-nowrap">{formatCellValue(row[col])}</TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-emerald-50 dark:bg-emerald-950/30">
                          <TableHead className="text-xs w-10">#</TableHead>
                          {displayColumns.map((col: string) => (
                            <TableHead key={col} className="text-xs whitespace-nowrap">{getColumnLabel(col)}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.data.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={displayColumns.length + 1} className="text-center py-8 text-muted-foreground">
                              No records found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          reportData.data.slice(0, 500).map((row: any, ri: number) => (
                            <TableRow key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-slate-50 dark:bg-slate-900/50"}>
                              <TableCell className="text-xs text-muted-foreground">{ri + 1}</TableCell>
                              {displayColumns.map((col: string) => (
                                <TableCell key={col} className="text-xs whitespace-nowrap">{formatCellValue(row[col])}</TableCell>
                              ))}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    {reportData.data.length > 500 && (
                      <p className="text-xs text-center text-muted-foreground py-2">
                        Showing first 500 of {reportData.total} records. Export for full data.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
