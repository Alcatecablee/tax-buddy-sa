import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Download,
  Eye,
  Settings,
  Layout,
  Palette,
  Type,
  Image as ImageIcon,
  BarChart3,
  Table,
  Calendar,
  DollarSign,
  User,
  Building,
  Save,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: "individual" | "business" | "compliance" | "custom";
  createdAt: Date;
  lastModified: Date;
  createdBy: string;
  isDefault: boolean;
  usageCount: number;
  elements: TemplateElement[];
  styling: TemplateStyle;
}

interface TemplateElement {
  id: string;
  type:
    | "header"
    | "text"
    | "table"
    | "chart"
    | "image"
    | "calculation"
    | "signature";
  content: any;
  position: { x: number; y: number; width: number; height: number };
  styling: ElementStyle;
}

interface ElementStyle {
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  border?: boolean;
  alignment?: "left" | "center" | "right";
}

interface TemplateStyle {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  headerStyle: ElementStyle;
  bodyStyle: ElementStyle;
}

export const CustomReportTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useCustomToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    // In production, this would fetch from your API
    const mockTemplates: ReportTemplate[] = [
      {
        id: "1",
        name: "Standard Individual Tax Report",
        description:
          "Professional individual tax return report with SARS compliance",
        category: "individual",
        createdAt: new Date(),
        lastModified: new Date(),
        createdBy: "System",
        isDefault: true,
        usageCount: 156,
        elements: [],
        styling: {
          primaryColor: "#3b82f6",
          secondaryColor: "#64748b",
          fontFamily: "Inter",
          headerStyle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
          bodyStyle: { fontSize: 12, color: "#475569" },
        },
      },
      {
        id: "2",
        name: "Corporate Tax Summary",
        description:
          "Comprehensive business tax report with detailed calculations",
        category: "business",
        createdAt: new Date(),
        lastModified: new Date(),
        createdBy: "Sarah Johnson",
        isDefault: false,
        usageCount: 89,
        elements: [],
        styling: {
          primaryColor: "#059669",
          secondaryColor: "#6b7280",
          fontFamily: "Inter",
          headerStyle: {
            fontSize: 20,
            fontWeight: "semibold",
            color: "#065f46",
          },
          bodyStyle: { fontSize: 11, color: "#374151" },
        },
      },
      {
        id: "3",
        name: "SARS Compliance Report",
        description: "Detailed compliance report for SARS submissions",
        category: "compliance",
        createdAt: new Date(),
        lastModified: new Date(),
        createdBy: "David Smith",
        isDefault: false,
        usageCount: 34,
        elements: [],
        styling: {
          primaryColor: "#dc2626",
          secondaryColor: "#9ca3af",
          fontFamily: "Inter",
          headerStyle: { fontSize: 18, fontWeight: "bold", color: "#991b1b" },
          bodyStyle: { fontSize: 10, color: "#4b5563" },
        },
      },
    ];

    setTemplates(mockTemplates);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "individual":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "business":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "compliance":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "custom":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const createTemplate = () => {
    toast({
      title: "Template Created",
      description: "New report template has been created successfully",
    });
    setShowCreateTemplate(false);
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    toast({
      title: "Template Duplicated",
      description: `Created a copy of "${template.name}"`,
    });
  };

  const deleteTemplate = (template: ReportTemplate) => {
    if (template.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default templates cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Deleted",
      description: `"${template.name}" has been deleted`,
    });
  };

  const generateReport = (template: ReportTemplate) => {
    toast({
      title: "Report Generated",
      description: `Report generated using "${template.name}" template`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Custom Report Templates
          </CardTitle>
          <p className="text-muted-foreground">
            Create, customize, and manage professional tax report templates for
            your practice
          </p>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="editor">Template Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview & Export</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowCreateTemplate(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="border-border hover:border-primary/20 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                        {template.isDefault && (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            Default
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={getCategoryColor(template.category)}
                          >
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Used {template.usageCount} times
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>By {template.createdBy}</span>
                          <Calendar className="w-3 h-3 ml-2" />
                          <span>
                            {template.lastModified.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setActiveTab("editor");
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateTemplate(template)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setActiveTab("preview");
                            }}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateReport(template)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          {!template.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTemplate(template)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {showCreateTemplate && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Create New Template</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Template Name
                        </label>
                        <Input
                          placeholder="Enter template name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">
                              Individual
                            </SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="compliance">
                              Compliance
                            </SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe the template purpose..."
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Base Template
                        </label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Start from template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blank">
                              Blank Template
                            </SelectItem>
                            <SelectItem value="standard">
                              Standard Individual
                            </SelectItem>
                            <SelectItem value="business">
                              Business Template
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="color"
                            defaultValue="#3b82f6"
                            className="w-16 h-9"
                          />
                          <Input placeholder="#3b82f6" className="flex-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={createTemplate}>Create Template</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateTemplate(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="editor" className="space-y-6">
              {selectedTemplate ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Template Elements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          { icon: Type, name: "Text Block", type: "text" },
                          { icon: BarChart3, name: "Chart", type: "chart" },
                          { icon: Table, name: "Data Table", type: "table" },
                          {
                            icon: ImageIcon,
                            name: "Logo/Image",
                            type: "image",
                          },
                          {
                            icon: DollarSign,
                            name: "Calculation",
                            type: "calculation",
                          },
                          {
                            icon: FileText,
                            name: "Signature",
                            type: "signature",
                          },
                        ].map((element) => (
                          <Button
                            key={element.type}
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                          >
                            <element.icon className="w-4 h-4 mr-2" />
                            {element.name}
                          </Button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Styling Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="color"
                              value={selectedTemplate.styling.primaryColor}
                              className="w-16 h-9"
                            />
                            <Input
                              value={selectedTemplate.styling.primaryColor}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Font Family
                          </label>
                          <Select value={selectedTemplate.styling.fontFamily}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Times">
                                Times New Roman
                              </SelectItem>
                              <SelectItem value="Helvetica">
                                Helvetica
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Company Logo
                          </label>
                          <Button
                            variant="outline"
                            className="w-full mt-1"
                            size="sm"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>
                            Template Editor: {selectedTemplate.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border border-border rounded-lg p-8 bg-white min-h-[600px] text-black">
                          <div className="space-y-6">
                            <div className="text-center border-b border-gray-200 pb-4">
                              <h1
                                style={{
                                  color: selectedTemplate.styling.primaryColor,
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                }}
                              >
                                Tax Return Report
                              </h1>
                              <p className="text-gray-600 mt-2">
                                Professional Tax Consultation Services
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3
                                  className="font-semibold mb-2"
                                  style={{
                                    color:
                                      selectedTemplate.styling.primaryColor,
                                  }}
                                >
                                  Client Information
                                </h3>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Name:</strong> [Client Name]
                                  </p>
                                  <p>
                                    <strong>Tax Number:</strong> [Tax Number]
                                  </p>
                                  <p>
                                    <strong>Tax Year:</strong> [Tax Year]
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3
                                  className="font-semibold mb-2"
                                  style={{
                                    color:
                                      selectedTemplate.styling.primaryColor,
                                  }}
                                >
                                  Tax Summary
                                </h3>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Gross Income:</strong> [Gross
                                    Income]
                                  </p>
                                  <p>
                                    <strong>Tax Paid:</strong> [Tax Paid]
                                  </p>
                                  <p>
                                    <strong>Refund Due:</strong> [Refund Due]
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3
                                className="font-semibold mb-2"
                                style={{
                                  color: selectedTemplate.styling.primaryColor,
                                }}
                              >
                                Detailed Calculations
                              </h3>
                              <div className="border border-gray-200 rounded">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="p-2 text-left">
                                        Description
                                      </th>
                                      <th className="p-2 text-right">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="p-2 border-b">
                                        Taxable Income
                                      </td>
                                      <td className="p-2 border-b text-right">
                                        [Amount]
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="p-2 border-b">
                                        Deductions
                                      </td>
                                      <td className="p-2 border-b text-right">
                                        [Amount]
                                      </td>
                                    </tr>
                                    <tr className="font-semibold">
                                      <td className="p-2">Total Tax Due</td>
                                      <td className="p-2 text-right">
                                        [Amount]
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                              <p>
                                Generated by Taxfy Professional Practice | Date:{" "}
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Template Selected
                    </h3>
                    <p className="text-muted-foreground">
                      Select a template from the Templates tab to start editing
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Preview: {selectedTemplate.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Full Screen
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-8">
                      <div
                        className="bg-white border border-gray-200 rounded-lg p-8 text-black"
                        style={{ minHeight: "800px" }}
                      >
                        <div className="space-y-6">
                          <div className="text-center border-b border-gray-200 pb-6">
                            <h1
                              style={{
                                color: selectedTemplate.styling.primaryColor,
                                fontSize: "28px",
                                fontWeight: "bold",
                                fontFamily: selectedTemplate.styling.fontFamily,
                              }}
                            >
                              Professional Tax Return Report
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                              Tax Year 2024/2025
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <h3
                                className="font-semibold mb-4 text-lg"
                                style={{
                                  color: selectedTemplate.styling.primaryColor,
                                }}
                              >
                                Client Information
                              </h3>
                              <div className="space-y-2">
                                <p>
                                  <strong>Full Name:</strong> John David Smith
                                </p>
                                <p>
                                  <strong>Tax Reference:</strong> 9876543210
                                </p>
                                <p>
                                  <strong>ID Number:</strong> 8012155555555
                                </p>
                                <p>
                                  <strong>Email:</strong> john.smith@email.com
                                </p>
                                <p>
                                  <strong>Phone:</strong> +27 82 123 4567
                                </p>
                              </div>
                            </div>
                            <div>
                              <h3
                                className="font-semibold mb-4 text-lg"
                                style={{
                                  color: selectedTemplate.styling.primaryColor,
                                }}
                              >
                                Tax Summary
                              </h3>
                              <div className="space-y-2">
                                <p>
                                  <strong>Gross Income:</strong> R 450,000.00
                                </p>
                                <p>
                                  <strong>Taxable Income:</strong> R 410,000.00
                                </p>
                                <p>
                                  <strong>Tax Calculated:</strong> R 89,200.00
                                </p>
                                <p>
                                  <strong>PAYE Paid:</strong> R 95,500.00
                                </p>
                                <p className="text-green-600 font-bold">
                                  <strong>Refund Due:</strong> R 6,300.00
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3
                              className="font-semibold mb-4 text-lg"
                              style={{
                                color: selectedTemplate.styling.primaryColor,
                              }}
                            >
                              Detailed Tax Calculation
                            </h3>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead
                                  style={{
                                    backgroundColor:
                                      selectedTemplate.styling.primaryColor +
                                      "10",
                                  }}
                                >
                                  <tr>
                                    <th className="p-3 text-left font-semibold">
                                      Description
                                    </th>
                                    <th className="p-3 text-right font-semibold">
                                      Amount (ZAR)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="p-3 border-b">
                                      Gross Remuneration
                                    </td>
                                    <td className="p-3 border-b text-right">
                                      450,000.00
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 border-b">
                                      Retirement Fund Contribution
                                    </td>
                                    <td className="p-3 border-b text-right">
                                      (35,000.00)
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 border-b">
                                      Medical Aid Contribution
                                    </td>
                                    <td className="p-3 border-b text-right">
                                      (5,000.00)
                                    </td>
                                  </tr>
                                  <tr
                                    className="font-semibold"
                                    style={{ backgroundColor: "#f8f9fa" }}
                                  >
                                    <td className="p-3">Taxable Income</td>
                                    <td className="p-3 text-right">
                                      410,000.00
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 border-b">
                                      Tax on Income
                                    </td>
                                    <td className="p-3 border-b text-right">
                                      89,200.00
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 border-b">
                                      PAYE Deducted
                                    </td>
                                    <td className="p-3 border-b text-right">
                                      (95,500.00)
                                    </td>
                                  </tr>
                                  <tr
                                    className="font-bold text-green-600"
                                    style={{ backgroundColor: "#f0f9ff" }}
                                  >
                                    <td className="p-3">Refund Due</td>
                                    <td className="p-3 text-right">6,300.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">
                                  Prepared by: Your Tax Practice
                                </p>
                                <p className="text-sm text-gray-600">
                                  Certified Tax Practitioner
                                </p>
                                <p className="text-sm text-gray-600">
                                  support@taxfirm.co.za | +27 11 123 4567
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  Report Generated:
                                </p>
                                <p className="font-semibold">
                                  {new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Template Selected
                    </h3>
                    <p className="text-muted-foreground">
                      Select a template to preview how your reports will look
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReportTemplates;
