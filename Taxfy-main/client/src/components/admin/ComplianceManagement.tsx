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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Search,
  Filter,
  Calendar,
  Award,
  Target,
  BarChart3,
  Activity,
  Lock,
  Key,
  Globe,
  Users,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  BusinessApiService,
  ComplianceFramework,
  ComplianceRequirement,
} from "@/services/businessApiService";

export function ComplianceManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [selectedFramework, setSelectedFramework] =
    useState<ComplianceFramework | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFramework, setNewFramework] = useState({
    name: "",
    description: "",
    version: "1.0",
    category: "security" as ComplianceFramework["category"],
  });
  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    category: "security" as ComplianceRequirement["category"],
    priority: "medium" as ComplianceRequirement["priority"],
    framework_id: "",
  });

  // Load data on component mount
  useEffect(() => {
    loadFrameworks();
  }, []);

  // Load requirements when framework is selected
  useEffect(() => {
    if (selectedFramework) {
      loadRequirements(selectedFramework.id);
    }
  }, [selectedFramework]);

  const loadFrameworks = async () => {
    setLoading(true);
    try {
      const response = await RealComplianceAPI.getFrameworks();

      if (response.success && response.data) {
        setFrameworks(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load compliance frameworks",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load frameworks:", error);
      toast({
        title: "Error",
        description: "Failed to load compliance frameworks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = async (frameworkId: string) => {
    try {
      const response = await RealComplianceAPI.getRequirements(frameworkId);

      if (response.success && response.data) {
        setRequirements(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load requirements",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load requirements:", error);
      toast({
        title: "Error",
        description: "Failed to load requirements",
        variant: "destructive",
      });
    }
  };

  const createFramework = async () => {
    if (!newFramework.name || !newFramework.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await RealComplianceAPI.createFramework({
        name: newFramework.name,
        description: newFramework.description,
        version: "1.0",
        status: "active" as const,
        requirementsCount: 0,
        complianceScore: 0,
      });

      if (response.success && response.data) {
        setFrameworks((prev) => [response.data!, ...prev]);
        setNewFramework({
          name: "",
          description: "",
          version: "1.0",
          category: "security",
        });
        toast({
          title: "Success",
          description: "Compliance framework created successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create framework",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to create framework:", error);
      toast({
        title: "Error",
        description: "Failed to create framework",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFramework = async (framework: ComplianceFramework) => {
    setLoading(true);
    try {
      const response = await RealComplianceAPI.updateFramework(framework.id, {
        name: framework.name,
        description: framework.description,
        version: framework.version,
        status: framework.status,
      });

      if (response.success && response.data) {
        setFrameworks((prev) =>
          prev.map((f) => (f.id === framework.id ? response.data! : f)),
        );
        setSelectedFramework(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Framework updated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update framework",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update framework:", error);
      toast({
        title: "Error",
        description: "Failed to update framework",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFramework = async (frameworkId: string) => {
    if (!confirm("Are you sure you want to delete this framework?")) return;

    setLoading(true);
    try {
      const response = await RealComplianceAPI.deleteFramework(frameworkId);

      if (response.success) {
        setFrameworks((prev) => prev.filter((f) => f.id !== frameworkId));
        if (selectedFramework?.id === frameworkId) {
          setSelectedFramework(null);
          setRequirements([]);
        }
        toast({
          title: "Success",
          description: "Framework deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete framework",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete framework:", error);
      toast({
        title: "Error",
        description: "Failed to delete framework",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequirement = async () => {
    if (
      !newRequirement.title ||
      !newRequirement.description ||
      !selectedFramework
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await RealComplianceAPI.createRequirement({
        framework_id: selectedFramework.id,
        title: newRequirement.title,
        description: newRequirement.description,
        category: newRequirement.category,
        priority: newRequirement.priority,
        status: "pending",
      });

      if (response.success && response.data) {
        setRequirements((prev) => [response.data!, ...prev]);
        setNewRequirement({
          title: "",
          description: "",
          category: "security",
          priority: "medium",
          framework_id: selectedFramework.id,
        });
        toast({
          title: "Success",
          description: "Requirement created successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create requirement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to create requirement:", error);
      toast({
        title: "Error",
        description: "Failed to create requirement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequirementStatus = async (
    requirementId: string,
    status: ComplianceRequirement["status"],
  ) => {
    try {
      const response = await RealComplianceAPI.updateRequirementStatus(
        requirementId,
        status,
      );

      if (response.success && response.data) {
        setRequirements((prev) =>
          prev.map((r) => (r.id === requirementId ? response.data! : r)),
        );
        toast({
          title: "Success",
          description: "Requirement status updated",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update requirement status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update requirement status:", error);
      toast({
        title: "Error",
        description: "Failed to update requirement status",
        variant: "destructive",
      });
    }
  };

  const calculateComplianceScore = (frameworkId: string) => {
    const frameworkRequirements = requirements.filter(
      (r) => r.frameworkId === frameworkId,
    );
    const totalRequirements = frameworkRequirements.length;
    const completedRequirements = frameworkRequirements.filter(
      (r) => r.status === "completed",
    ).length;
    if (totalRequirements === 0) return 0;

    return Math.round((completedRequirements / totalRequirements) * 100);
  };

  // ... existing code ...
}
