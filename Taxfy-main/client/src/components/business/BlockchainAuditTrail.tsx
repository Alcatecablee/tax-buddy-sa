import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Blocks,
  Shield,
  Lock,
  CheckCircle,
  Eye,
  Download,
  Copy,
  Clock,
  Hash,
  Users,
  FileCheck,
  AlertTriangle,
  Award,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Activity,
  Database,
  Link as LinkIcon,
  Fingerprint,
  Globe,
} from "lucide-react";

interface BlockchainTransaction {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  documentId?: string;
  blockHash: string;
  previousHash: string;
  verified: boolean;
  gasUsed?: number;
  confirmations: number;
  details: {
    operation: string;
    changes: string[];
    ipfsHash?: string;
    signature: string;
  };
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  event: string;
  user: string;
  entity: string;
  action: string;
  status: "verified" | "pending" | "failed";
  blockchainTxId: string;
  complianceFlags: string[];
  riskLevel: "low" | "medium" | "high";
}

interface ComplianceMetric {
  category: string;
  score: number;
  status: "compliant" | "warning" | "violation";
  lastChecked: Date;
  details: string;
}

export default function BlockchainAuditTrail() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("transactions");

  // Mock blockchain data
  const transactions: BlockchainTransaction[] = [
    {
      id: "tx_001",
      timestamp: new Date("2024-12-20T10:30:00"),
      action: "Tax Calculation Verified",
      user: "system@taxfy.co.za",
      documentId: "IRP5_2024_001",
      blockHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      previousHash: "0x0987654321fedcba0987654321fedcba",
      verified: true,
      gasUsed: 21000,
      confirmations: 156,
      details: {
        operation: "CALCULATE_TAX",
        changes: [
          "Gross income verified: R850,000",
          "Tax liability calculated: R145,230",
          "PAYE credits applied: R125,000",
        ],
        ipfsHash: "QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M",
        signature: "0x789abc123def456789abc123def456789abc123def",
      },
    },
    {
      id: "tx_002",
      timestamp: new Date("2024-12-20T09:15:00"),
      action: "Document Upload",
      user: "john.doe@company.com",
      documentId: "IRP5_2024_001",
      blockHash: "0x2b3c4d5e6f7890ab1234567890abcdef",
      previousHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      verified: true,
      gasUsed: 35000,
      confirmations: 189,
      details: {
        operation: "UPLOAD_DOCUMENT",
        changes: [
          "Document hash verified",
          "OCR processing completed",
          "Data validation passed",
        ],
        ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
        signature: "0xabc123def456789abc123def456789abc123def456",
      },
    },
    {
      id: "tx_003",
      timestamp: new Date("2024-12-20T08:45:00"),
      action: "Compliance Check",
      user: "compliance@taxfy.co.za",
      blockHash: "0x3c4d5e6f7890ab1234567890abcdef12",
      previousHash: "0x2b3c4d5e6f7890ab1234567890abcdef",
      verified: true,
      gasUsed: 28000,
      confirmations: 201,
      details: {
        operation: "COMPLIANCE_AUDIT",
        changes: [
          "SARS regulations compliance verified",
          "Data privacy checks passed",
          "Retention policy applied",
        ],
        signature: "0xdef456789abc123def456789abc123def456789abc",
      },
    },
  ];

  const auditEntries: AuditEntry[] = [
    {
      id: "audit_001",
      timestamp: new Date("2024-12-20T10:30:00"),
      event: "Tax Calculation",
      user: "John Doe",
      entity: "Company ABC",
      action: "Calculate annual tax liability",
      status: "verified",
      blockchainTxId: "tx_001",
      complianceFlags: ["SARS_COMPLIANT", "DATA_VERIFIED"],
      riskLevel: "low",
    },
    {
      id: "audit_002",
      timestamp: new Date("2024-12-20T09:15:00"),
      event: "Document Processing",
      user: "John Doe",
      entity: "Company ABC",
      action: "Upload and process IRP5 document",
      status: "verified",
      blockchainTxId: "tx_002",
      complianceFlags: ["DOCUMENT_VERIFIED", "OCR_VALIDATED"],
      riskLevel: "low",
    },
    {
      id: "audit_003",
      timestamp: new Date("2024-12-20T08:45:00"),
      event: "Compliance Audit",
      user: "System",
      entity: "Taxfy Platform",
      action: "Automated compliance verification",
      status: "verified",
      blockchainTxId: "tx_003",
      complianceFlags: ["REGULATORY_CHECK", "PRIVACY_COMPLIANT"],
      riskLevel: "low",
    },
  ];

  const complianceMetrics: ComplianceMetric[] = [
    {
      category: "SARS Compliance",
      score: 98,
      status: "compliant",
      lastChecked: new Date(),
      details: "All tax calculations comply with current SARS regulations",
    },
    {
      category: "Data Privacy (POPIA)",
      score: 96,
      status: "compliant",
      lastChecked: new Date(),
      details: "Data processing complies with POPIA requirements",
    },
    {
      category: "Financial Reporting",
      score: 94,
      status: "compliant",
      lastChecked: new Date(),
      details: "Audit trails meet financial reporting standards",
    },
    {
      category: "International Standards",
      score: 89,
      status: "warning",
      lastChecked: new Date(),
      details: "Minor adjustments needed for full ISO 27001 compliance",
    },
  ];

  const verifyTransaction = (txId: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const averageComplianceScore =
    complianceMetrics.reduce((sum, metric) => sum + metric.score, 0) /
    complianceMetrics.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Blocks className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Blockchain Audit Trail
                </CardTitle>
                <CardDescription className="text-lg">
                  Immutable, cryptographically verified audit trail for complete
                  transparency and compliance
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Trail
              </Button>
              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Blocks className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Verified on blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {averageComplianceScore.toFixed(0)}%
            </div>
            <Progress value={averageComplianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Entries
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                auditEntries.filter((entry) => entry.status === "verified")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {auditEntries.length} total audit entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Level
            </CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Enterprise</div>
            <p className="text-xs text-muted-foreground">256-bit encryption</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">
            Blockchain Transactions
          </TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="verification">Verification Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions by hash, user, or action..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {transactions.map((transaction) => (
            <Card key={transaction.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {transaction.action}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {transaction.timestamp.toLocaleString()}
                        <span className="mx-2">•</span>
                        <Users className="h-3 w-3" />
                        {transaction.user}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      Block #{transaction.confirmations}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {transaction.confirmations} confirmations
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Block Hash:
                      </span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {transaction.blockHash.slice(0, 10)}...
                          {transaction.blockHash.slice(-8)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(transaction.blockHash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Previous Hash:
                      </span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {transaction.previousHash.slice(0, 10)}...
                        {transaction.previousHash.slice(-8)}
                      </code>
                    </div>
                    {transaction.gasUsed && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Gas Used:
                        </span>
                        <span className="text-sm font-medium">
                          {transaction.gasUsed.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Transaction Details:
                    </h4>
                    <ul className="space-y-1">
                      {transaction.details.changes.map((change, index) => (
                        <li
                          key={index}
                          className="text-xs flex items-center gap-2"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => verifyTransaction(transaction.id)}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-3 w-3 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Globe className="h-3 w-3 mr-2" />
                    View on Explorer
                  </Button>
                  {transaction.details.ipfsHash && (
                    <Button size="sm" variant="outline">
                      <Database className="h-3 w-3 mr-2" />
                      IPFS Data
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {auditEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        entry.status === "verified"
                          ? "bg-green-500/10"
                          : entry.status === "pending"
                            ? "bg-yellow-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {entry.status === "verified" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {entry.status === "pending" && (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      {entry.status === "failed" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entry.event}</CardTitle>
                      <CardDescription className="mt-1">
                        {entry.action} by {entry.user} for {entry.entity}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        entry.riskLevel === "low"
                          ? "outline"
                          : entry.riskLevel === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {entry.riskLevel} risk
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {entry.complianceFlags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline">
                    <LinkIcon className="h-3 w-3 mr-2" />
                    View Blockchain TX: {entry.blockchainTxId}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.category}</CardTitle>
                    <Badge
                      variant={
                        metric.status === "compliant"
                          ? "outline"
                          : metric.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Compliance Score:
                      </span>
                      <span className="font-bold text-lg">{metric.score}%</span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {metric.details}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Last checked: {metric.lastChecked.toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Recheck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Timeline</CardTitle>
              <CardDescription>
                Historical compliance metrics and regulatory changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "2024-12-20",
                    event: "SARS Regulation Update",
                    status: "compliant",
                    details:
                      "Updated tax calculation algorithms for new regulations",
                  },
                  {
                    date: "2024-12-15",
                    event: "POPIA Compliance Review",
                    status: "compliant",
                    details:
                      "Annual data protection compliance audit completed",
                  },
                  {
                    date: "2024-12-10",
                    event: "ISO 27001 Assessment",
                    status: "warning",
                    details:
                      "Minor security enhancements required for full compliance",
                  },
                  {
                    date: "2024-12-01",
                    event: "Financial Reporting Standards",
                    status: "compliant",
                    details:
                      "Audit trail mechanisms verified for regulatory reporting",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        item.status === "compliant"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.details}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.date}
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.status === "compliant" ? "outline" : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Verify Document Integrity
                </CardTitle>
                <CardDescription>
                  Verify that a document hasn't been tampered with using
                  blockchain verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Hash:</label>
                  <input
                    type="text"
                    placeholder="Enter document hash or upload file..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Document
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Transaction Lookup
                </CardTitle>
                <CardDescription>
                  Look up any transaction on the blockchain using its hash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Transaction Hash:
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Lookup Transaction
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Network Status</CardTitle>
              <CardDescription>
                Real-time status of the blockchain network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">Online</div>
                  <div className="text-sm text-muted-foreground">
                    Network Status
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Blocks className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">1,247,892</div>
                  <div className="text-sm text-muted-foreground">
                    Latest Block
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">2.3s</div>
                  <div className="text-sm text-muted-foreground">
                    Block Time
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-500/10">
                  <Database className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-bold text-lg">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
