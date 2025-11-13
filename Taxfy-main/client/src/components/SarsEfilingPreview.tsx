import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, CheckCircle2, Calculator } from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatCurrency } from "@/lib/utils";

type TaxData = {
  grossRemuneration?: number;
  payeWithheld?: number;
  uifContrib?: number;
  retirementFund?: number;
  medicalScheme?: number;
  travelAllowance?: number;
  medicalCredits?: number;
  totalTax?: number;
  taxYear?: string;
  taxableIncome?: number;
  incomeTax?: number;
  primaryRebate?: number;
  medicalTaxCredits?: number;
  effectiveRate?: number;
  marginalRate?: number;
  refundAmount?: number;
  amountOwed?: number;
};

interface SarsEfilingPreviewProps {
  taxData: TaxData;
}

export function SarsEfilingPreview({ taxData }: SarsEfilingPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dataSnapshotRef = useRef<TaxData | null>(null);
  const { toast } = useCustomToast();

  // Check if we have any valid tax data (including zeros)
  const hasData = taxData && Object.values(taxData).some(v => v != null);

  // When opening, capture a deep clone snapshot in ref
  const handleOpen = () => {
    if (hasData) {
      dataSnapshotRef.current = structuredClone(taxData);
      setIsOpen(true);
    }
  };

  // Always use the frozen snapshot from ref
  const displayData = dataSnapshotRef.current || taxData;

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      variant: "default",
    });
  };

  const DataRow = ({ label, value, code }: { label: string; value: string; code?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {code && <Badge variant="outline" className="text-xs">{code}</Badge>}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleCopy(label, value)}
          data-testid={`button-copy-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={!hasData}
        variant="outline"
        className="w-full"
        data-testid="button-open-sars-preview"
      >
        <FileText className="w-4 h-4 mr-2" />
        View SARS eFiling Data
      </Button>

      {isOpen && (
        <Card className="mt-4 border-2" data-testid="card-sars-preview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              SARS eFiling Preview
            </CardTitle>
            <CardDescription>
              Copy these values to your SARS eFiling form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="income" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="income" data-testid="tab-income">
                  <FileText className="w-4 h-4 mr-2" />
                  Income
                </TabsTrigger>
                <TabsTrigger value="deductions" data-testid="tab-deductions">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Deductions
                </TabsTrigger>
                <TabsTrigger value="tax" data-testid="tab-tax">
                  <Calculator className="w-4 h-4 mr-2" />
                  Tax Result
                </TabsTrigger>
              </TabsList>

              <TabsContent value="income" className="space-y-1 mt-4">
                <DataRow
                  label="Gross Remuneration"
                  value={formatCurrency(displayData.grossRemuneration || 0)}
                  code="3601"
                />
                <DataRow
                  label="Travel Allowance"
                  value={formatCurrency(displayData.travelAllowance || 0)}
                  code="3701"
                />
              </TabsContent>

              <TabsContent value="deductions" className="space-y-1 mt-4">
                <DataRow
                  label="PAYE Withheld"
                  value={formatCurrency(displayData.payeWithheld || 0)}
                  code="4102"
                />
                <DataRow
                  label="UIF Contribution"
                  value={formatCurrency(displayData.uifContrib || 0)}
                  code="3605"
                />
                <DataRow
                  label="Retirement Fund"
                  value={formatCurrency(displayData.retirementFund || 0)}
                  code="4005"
                />
                <DataRow
                  label="Medical Scheme"
                  value={formatCurrency(displayData.medicalScheme || 0)}
                  code="4116"
                />
                <DataRow
                  label="Medical Tax Credits"
                  value={formatCurrency(displayData.medicalTaxCredits || 0)}
                  code="4150"
                />
              </TabsContent>

              <TabsContent value="tax" className="space-y-1 mt-4">
                <DataRow
                  label="Taxable Income"
                  value={formatCurrency(displayData.taxableIncome || 0)}
                />
                <DataRow
                  label="Income Tax"
                  value={formatCurrency(displayData.incomeTax || 0)}
                />
                <DataRow
                  label="Primary Rebate"
                  value={formatCurrency(displayData.primaryRebate || 0)}
                />
                <DataRow
                  label="Total Tax"
                  value={formatCurrency(displayData.totalTax || 0)}
                  code="4149"
                />
                {displayData.refundAmount ? (
                  <DataRow
                    label="Refund Amount"
                    value={formatCurrency(displayData.refundAmount)}
                  />
                ) : null}
                {displayData.amountOwed ? (
                  <DataRow
                    label="Amount Owed"
                    value={formatCurrency(displayData.amountOwed)}
                  />
                ) : null}
              </TabsContent>
            </Tabs>

            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-full mt-4"
              data-testid="button-close-preview"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
