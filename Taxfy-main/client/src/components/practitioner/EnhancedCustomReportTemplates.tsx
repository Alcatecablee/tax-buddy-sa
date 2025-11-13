import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Save,
  Copy,
  Star,
  Crown,
  Building,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Zap,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatCurrency } from "@/lib/utils";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type:
    | "standard"
    | "detailed"
    | "summary"
    | "custom"
    | "compliance"
    | "executive"
    | "comparison";
  category: "individual" | "business" | "practitioner" | "enterprise";
  complianceLevel: "basic" | "standard" | "enhanced" | "enterprise";
  clientTypes: ("individual" | "business" | "trust" | "partnership")[];
  features: string[];
  sections: TemplateSection[];
  styling: TemplateStyling;
  isActive: boolean;
  isPremium: boolean;
  isDefault: boolean;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
  previewImage?: string;
  estimatedProcessingTime: number;
}

interface TemplateSection {
  id: string;
  name: string;
  type:
    | "header"
    | "summary"
    | "calculations"
    | "charts"
    | "compliance"
    | "recommendations"
    | "footer";
  required: boolean;
  order: number;
  content: SectionContent;
}

interface SectionContent {
  title?: string;
  fields: string[];
  includeCharts?: boolean;
  chartTypes?: ("bar" | "pie" | "line")[];
  complianceChecks?: string[];
  customContent?: string;
}

interface TemplateStyling {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  logoPosition: "header" | "footer" | "watermark";
  showBranding: boolean;
  pageLayout: "portrait" | "landscape";
  margins: { top: number; right: number; bottom: number; left: number };
}

export const EnhancedCustomReportTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCompliance, setFilterCompliance] = useState("all");
  const { toast } = useCustomToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    // Professional templates for tax practitioners
    const professionalTemplates: ReportTemplate[] = [
      {
        id: "prof-executive-summary",
        name: "Executive Tax Summary",
        description:
          "Comprehensive executive-level tax summary for business clients",
        type: "executive",
        category: "business",
        complianceLevel: "enhanced",
        clientTypes: ["business", "trust"],
        features: [
          "Executive summary dashboard",
          "Key metrics visualization",
          "Compliance status overview",
          "Strategic recommendations",
          "Risk assessment",
        ],
        sections: [
          {
            id: "exec-header",
            name: "Executive Header",
            type: "header",
            required: true,
            order: 1,
            content: {
              title: "Executive Tax Analysis",
              fields: ["clientName", "taxYear", "reportDate", "preparedBy"],
            },
          },
          {
            id: "key-metrics",
            name: "Key Financial Metrics",
            type: "summary",
            required: true,
            order: 2,
            content: {
              fields: [
                "totalTax",
                "effectiveRate",
                "complianceScore",
                "riskLevel",
              ],
              includeCharts: true,
              chartTypes: ["bar", "pie"],
            },
          },
          {
            id: "compliance-overview",
            name: "Compliance Status",
            type: "compliance",
            required: true,
            order: 3,
            content: {
              complianceChecks: [
                "SARS filing compliance",
                "VAT registration status",
                "PAYE compliance",
                "Transfer pricing documentation",
              ],
            },
          },
        ],
        styling: {
          primaryColor: "#1e40af",
          secondaryColor: "#64748b",
          accentColor: "#10b981",
          fontFamily: "Inter",
          fontSize: 12,
          logoPosition: "header",
          showBranding: true,
          pageLayout: "portrait",
          margins: { top: 20, right: 15, bottom: 20, left: 15 },
        },
        isActive: true,
        isPremium: true,
        isDefault: false,
        createdAt: new Date("2024-01-15"),
        lastModified: new Date("2024-01-20"),
        usageCount: 45,
        estimatedProcessingTime: 8,
      },
      {
        id: "prof-detailed-individual",
        name: "Professional Individual Report",
        description:
          "Detailed tax report for individual clients with comprehensive analysis",
        type: "detailed",
        category: "individual",
        complianceLevel: "standard",
        clientTypes: ["individual"],
        features: [
          "Detailed income breakdown",
          "Deduction optimization analysis",
          "Year-over-year comparison",
          "Tax planning recommendations",
          "Supporting documentation",
        ],
        sections: [
          {
            id: "client-info",
            name: "Client Information",
            type: "header",
            required: true,
            order: 1,
            content: {
              fields: ["fullName", "taxNumber", "taxYear", "filingDate"],
            },
          },
          {
            id: "income-analysis",
            name: "Income Analysis",
            type: "calculations",
            required: true,
            order: 2,
            content: {
              fields: ["grossIncome", "taxableIncome", "deductions", "credits"],
              includeCharts: true,
              chartTypes: ["bar", "line"],
            },
          },
          {
            id: "optimization",
            name: "Tax Optimization",
            type: "recommendations",
            required: false,
            order: 3,
            content: {
              fields: [
                "currentOptimization",
                "potentialSavings",
                "recommendations",
              ],
            },
          },
        ],
        styling: {
          primaryColor: "#059669",
          secondaryColor: "#6b7280",
          accentColor: "#3b82f6",
          fontFamily: "Inter",
          fontSize: 11,
          logoPosition: "header",
          showBranding: true,
          pageLayout: "portrait",
          margins: { top: 15, right: 10, bottom: 15, left: 10 },
        },
        isActive: true,
        isPremium: false,
        isDefault: true,
        createdAt: new Date("2024-01-10"),
        lastModified: new Date("2024-01-18"),
        usageCount: 127,
        estimatedProcessingTime: 5,
      },
      {
        id: "prof-compliance-audit",
        name: "Compliance Audit Report",
        description:
          "Comprehensive compliance audit report for enterprise clients",
        type: "compliance",
        category: "enterprise",
        complianceLevel: "enterprise",
        clientTypes: ["business", "trust", "partnership"],
        features: [
          "Full compliance audit trail",
          "Regulatory requirement mapping",
          "Risk assessment matrix",
          "Remediation recommendations",
          "Timeline for compliance",
        ],
        sections: [
          {
            id: "audit-scope",
            name: "Audit Scope",
            type: "header",
            required: true,
            order: 1,
            content: {
              fields: ["auditPeriod", "regulations", "scope", "methodology"],
            },
          },
          {
            id: "findings",
            name: "Compliance Findings",
            type: "compliance",
            required: true,
            order: 2,
            content: {
              complianceChecks: [
                "Income tax compliance",
                "VAT compliance",
                "PAYE compliance",
                "Skills development levy",
                "Transfer pricing compliance",
                "Exchange control compliance",
              ],
            },
          },
          {
            id: "risk-matrix",
            name: "Risk Assessment",
            type: "charts",
            required: true,
            order: 3,
            content: {
              includeCharts: true,
              chartTypes: ["bar"],
              fields: ["riskLevel", "impact", "probability", "mitigation"],
            },
          },
        ],
        styling: {
          primaryColor: "#dc2626",
          secondaryColor: "#64748b",
          accentColor: "#f59e0b",
          fontFamily: "Inter",
          fontSize: 10,
          logoPosition: "footer",
          showBranding: true,
          pageLayout: "portrait",
          margins: { top: 25, right: 20, bottom: 25, left: 20 },
        },
        isActive: true,
        isPremium: true,
        isDefault: false,
        createdAt: new Date("2024-01-12"),
        lastModified: new Date("2024-01-22"),
        usageCount: 23,
        estimatedProcessingTime: 12,
      },
      {
        id: "prof-comparison-report",
        name: "Multi-Year Comparison Report",
        description: "Year-over-year tax comparison with trend analysis",
        type: "comparison",
        category: "practitioner",
        complianceLevel: "standard",
        clientTypes: ["individual", "business"],
        features: [
          "Multi-year comparison charts",
          "Trend analysis",
          "Performance indicators",
          "Growth projections",
          "Strategic insights",
        ],
        sections: [
          {
            id: "comparison-summary",
            name: "Comparison Summary",
            type: "summary",
            required: true,
            order: 1,
            content: {
              fields: [
                "yearRange",
                "keyMetrics",
                "trendDirection",
                "highlights",
              ],
            },
          },
          {
            id: "trend-charts",
            name: "Trend Analysis",
            type: "charts",
            required: true,
            order: 2,
            content: {
              includeCharts: true,
              chartTypes: ["line", "bar"],
              fields: ["income", "tax", "deductions", "credits"],
            },
          },
        ],
        styling: {
          primaryColor: "#7c3aed",
          secondaryColor: "#64748b",
          accentColor: "#06b6d4",
          fontFamily: "Inter",
          fontSize: 11,
          logoPosition: "header",
          showBranding: true,
          pageLayout: "landscape",
          margins: { top: 15, right: 15, bottom: 15, left: 15 },
        },
        isActive: true,
        isPremium: false,
        isDefault: false,
        createdAt: new Date("2024-01-08"),
        lastModified: new Date("2024-01-16"),
        usageCount: 67,
        estimatedProcessingTime: 6,
      },
    ];

    setTemplates(professionalTemplates);
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || template.category === filterCategory;
    const matchesCompliance =
      filterCompliance === "all" ||
      template.complianceLevel === filterCompliance;

    return matchesSearch && matchesCategory && matchesCompliance;
  });

  const createNewTemplate = () => {
    const newTemplate: ReportTemplate = {
      id: `custom-${Date.now()}`,
      name: "New Custom Template",
      description: "Custom template created by user",
      type: "custom",
      category: "practitioner",
      complianceLevel: "standard",
      clientTypes: ["individual"],
      features: ["Custom sections", "Flexible layout"],
      sections: [
        {
          id: "custom-header",
          name: "Header",
          type: "header",
          required: true,
          order: 1,
          content: {
            title: "Custom Tax Report",
            fields: ["clientName", "taxYear", "reportDate"],
          },
        },
      ],
      styling: {
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        accentColor: "#10b981",
        fontFamily: "Inter",
        fontSize: 11,
        logoPosition: "header",
        showBranding: true,
        pageLayout: "portrait",
        margins: { top: 15, right: 10, bottom: 15, left: 10 },
      },
      isActive: true,
      isPremium: false,
      isDefault: false,
      createdAt: new Date(),
      lastModified: new Date(),
      usageCount: 0,
      estimatedProcessingTime: 5,
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setSelectedTemplate(newTemplate);
    setShowEditor(true);

    toast({
      title: "Template Created",
      description: "New custom template created successfully",
    });
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    const duplicated = {
      ...template,
      id: `copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      usageCount: 0,
    };

    setTemplates((prev) => [...prev, duplicated]);

    toast({
      title: "Template Duplicated",
      description: `Created copy of ${template.name}`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));

    toast({
      title: "Template Deleted",
      description: "Template has been removed from your library",
    });
  };

  const exportTemplate = (template: ReportTemplate) => {
    const exportData = JSON.stringify(template, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.name.replace(/[^a-zA-Z0-9]/g, "_")}_template.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Template Exported",
      description: "Template has been exported as JSON file",
    });
  };

  const getComplianceBadgeColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "enhanced":
        return "bg-green-100 text-green-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "individual":
        return <Users className="h-4 w-4" />;
      case "business":
        return <Building className="h-4 w-4" />;
      case "practitioner":
        return <FileText className="h-4 w-4" />;
      case "enterprise":
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional Report Templates</h2>
          <p className="text-muted-foreground">
            Create and manage custom report templates for your tax practice
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Professional
          </Badge>
          <Button onClick={createNewTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="editor">Template Editor</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="settings">Template Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Template Library</CardTitle>
                  <CardDescription>
                    Choose from professional templates or create your own
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="practitioner">Practitioner</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterCompliance}
                    onValueChange={setFilterCompliance}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Compliance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="enhanced">Enhanced</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="border hover:border-primary/20 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <div>
                            <CardTitle className="text-lg">
                              {template.name}
                            </CardTitle>
                            {template.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                        {template.isPremium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant="outline"
                          className={getComplianceBadgeColor(
                            template.complianceLevel,
                          )}
                        >
                          {template.complianceLevel}
                        </Badge>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="outline">
                          {template.sections.length} sections
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Usage:</span>
                          <span>{template.usageCount} times</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Est. Time:
                          </span>
                          <span>{template.estimatedProcessingTime} min</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setShowEditor(true);
                            setActiveTab("editor");
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportTemplate(template)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>Template Editor - {selectedTemplate.name}</CardTitle>
                <CardDescription>
                  Customize sections, styling, and compliance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={selectedTemplate.name}
                        onChange={(e) =>
                          setSelectedTemplate((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  name: e.target.value,
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateDesc">Description</Label>
                      <Textarea
                        id="templateDesc"
                        value={selectedTemplate.description}
                        onChange={(e) =>
                          setSelectedTemplate((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  description: e.target.value,
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={selectedTemplate.category}
                        onValueChange={(value: any) =>
                          setSelectedTemplate((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  category: value,
                                }
                              : null,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="practitioner">
                            Practitioner
                          </SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Compliance Level</Label>
                      <Select
                        value={selectedTemplate.complianceLevel}
                        onValueChange={(value: any) =>
                          setSelectedTemplate((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  complianceLevel: value,
                                }
                              : null,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Styling Options</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{
                              backgroundColor:
                                selectedTemplate.styling.primaryColor,
                            }}
                          />
                          <Input
                            type="color"
                            value={selectedTemplate.styling.primaryColor}
                            onChange={(e) =>
                              setSelectedTemplate((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      styling: {
                                        ...prev.styling,
                                        primaryColor: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                            className="w-16 h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{
                              backgroundColor:
                                selectedTemplate.styling.secondaryColor,
                            }}
                          />
                          <Input
                            type="color"
                            value={selectedTemplate.styling.secondaryColor}
                            onChange={(e) =>
                              setSelectedTemplate((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      styling: {
                                        ...prev.styling,
                                        secondaryColor: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                            className="w-16 h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Accent Color</Label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{
                              backgroundColor:
                                selectedTemplate.styling.accentColor,
                            }}
                          />
                          <Input
                            type="color"
                            value={selectedTemplate.styling.accentColor}
                            onChange={(e) =>
                              setSelectedTemplate((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      styling: {
                                        ...prev.styling,
                                        accentColor: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                            className="w-16 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Font Family</Label>
                        <Select
                          value={selectedTemplate.styling.fontFamily}
                          onValueChange={(value) =>
                            setSelectedTemplate((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    styling: {
                                      ...prev.styling,
                                      fontFamily: value,
                                    },
                                  }
                                : null,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">
                              Times New Roman
                            </SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Page Layout</Label>
                        <Select
                          value={selectedTemplate.styling.pageLayout}
                          onValueChange={(value: any) =>
                            setSelectedTemplate((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    styling: {
                                      ...prev.styling,
                                      pageLayout: value,
                                    },
                                  }
                                : null,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Template Sections</h4>
                  <div className="space-y-3">
                    {selectedTemplate.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold">
                              {section.order}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{section.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {section.type} •{" "}
                              {section.required ? "Required" : "Optional"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={section.required} />
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      // Save template logic
                      toast({
                        title: "Template Saved",
                        description:
                          "Your template has been saved successfully",
                      });
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Template Selected
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select a template from the library to start editing
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{templates.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Templates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Usage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {(
                        templates.reduce(
                          (sum, t) => sum + t.estimatedProcessingTime,
                          0,
                        ) / templates.length
                      ).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Process Time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(template.category)}
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {template.usageCount} uses
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {template.estimatedProcessingTime} min avg
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
              <CardDescription>
                Configure global template preferences and defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-save Templates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save template changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Branding by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Show practice branding on new templates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Template Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing templates with team members
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCustomReportTemplates;
