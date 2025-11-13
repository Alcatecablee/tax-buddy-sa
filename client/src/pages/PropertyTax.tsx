import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Municipality, PropertyTaxResult } from "@shared/schema";
import { propertyTaxCalculationSchema, municipalityComparisonSchema } from "@shared/schema";

export default function PropertyTax() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Property Tax Calculator</h1>
          <p className="text-muted-foreground">
            Calculate and compare property tax rates across South African municipalities
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calculator" data-testid="tab-calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="compare" data-testid="tab-compare">
              <TrendingUp className="w-4 h-4 mr-2" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <PropertyTaxCalculator />
          </TabsContent>

          <TabsContent value="compare">
            <MunicipalityComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PropertyTaxCalculator() {
  const [result, setResult] = useState<PropertyTaxResult | null>(null);

  const { data: municipalitiesResponse, isLoading: loadingMunicipalities } = useQuery<{success: boolean; data: Municipality[]}>({
    queryKey: ['/api/municipal/municipalities'],
  });
  
  const municipalities = municipalitiesResponse?.data;

  const form = useForm({
    resolver: zodResolver(propertyTaxCalculationSchema),
    defaultValues: {
      municipalityCode: "",
      propertyValue: 1000000,
      propertyCategory: "residential" as const,
      financialYear: "2024/2025",
      rebates: {
        pensioner: false,
        disabled: false,
        lowIncome: false,
      },
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/municipal/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data: any) => {
    calculateMutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculate Property Tax</CardTitle>
          <CardDescription>
            Enter your property details to calculate annual and monthly tax
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="municipalityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingMunicipalities}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-municipality">
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingMunicipalities ? (
                          <div className="p-2">
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : (
                          municipalities?.map((muni) => (
                            <SelectItem key={muni.code} value={muni.code}>
                              {muni.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Value (R)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-property-value"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="agricultural">Agricultural</SelectItem>
                        <SelectItem value="vacant_land">Vacant Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Rebates (if applicable)</FormLabel>
                <FormField
                  control={form.control}
                  name="rebates.pensioner"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-pensioner"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Pensioner (25% rebate)
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rebates.disabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-disabled"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Disabled Person (50% rebate)
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rebates.lowIncome"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-low-income"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Low Income (for properties under R400k)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={calculateMutation.isPending}
                data-testid="button-calculate"
              >
                {calculateMutation.isPending ? "Calculating..." : "Calculate Tax"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {result.municipalityName}
            </CardTitle>
            <CardDescription>Property Tax Calculation Results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Property Value</p>
                <p className="text-2xl font-bold">
                  R{result.propertyValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tax Rate</p>
                <p className="text-2xl font-bold">
                  {(result.taxRate * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Taxable Value</span>
                  <span className="font-medium">
                    R{result.taxableValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annual Tax (before rebates)</span>
                  <span className="font-medium">
                    R{result.annualTax.toLocaleString()}
                  </span>
                </div>
                {result.appliedRebates && result.appliedRebates.length > 0 && (
                  <div className="bg-muted p-3 rounded-md space-y-1">
                    <p className="text-sm font-medium">Applied Rebates:</p>
                    {result.appliedRebates.map((rebate, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        • {rebate}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 bg-primary/5 p-4 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Annual Tax (net)</span>
                  <span className="text-2xl font-bold text-primary">
                    R{result.netAnnualTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Monthly Tax</span>
                  <span className="text-xl font-bold text-primary">
                    R{result.netMonthlyTax.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm space-y-2">
                <div>
                  <strong>Data Source:</strong>{" "}
                  {result.dataSource === 'manual_override' && 'Manually verified rate'}
                  {result.dataSource === 'validated_fallback' && 'Validated average rate'}
                  {result.dataSource === 'api' && 'Real-time municipal data'}
                  {!result.dataSource && 'Municipal data'}
                </div>
                
                {result.validatedBy && (
                  <div className="text-xs text-muted-foreground" data-testid="text-validated-by">
                    <strong>Validated by:</strong> {result.validatedBy}
                  </div>
                )}
                
                {result.lastValidated && (
                  <div data-testid="text-last-validated">
                    <strong>Last Validated:</strong>{" "}
                    {new Date(result.lastValidated).toLocaleDateString('en-ZA', { 
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                
                {(result.effectiveDate || result.expiryDate) && (
                  <div className="text-xs text-muted-foreground" data-testid="text-validity-period">
                    {result.effectiveDate && (
                      <span>
                        Valid from: {new Date(result.effectiveDate).toLocaleDateString('en-ZA', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    )}
                    {result.effectiveDate && result.expiryDate && ' • '}
                    {result.expiryDate && (
                      <span>
                        Expires: {new Date(result.expiryDate).toLocaleDateString('en-ZA', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    )}
                  </div>
                )}
                
                {result.sourceUrl && (
                  <div className="text-xs">
                    <a 
                      href={result.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      data-testid="link-source-url"
                    >
                      View official municipal rates →
                    </a>
                  </div>
                )}
                
                {result.notes && (
                  <div className="text-xs text-muted-foreground italic" data-testid="text-notes">
                    {result.notes}
                  </div>
                )}
                
                <div className="pt-1 border-t text-xs">
                  <strong>Disclaimer:</strong> This is an estimate. Actual rates may vary.
                  Contact your municipality for official rates and rebate eligibility.
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MunicipalityComparison() {
  const [results, setResults] = useState<PropertyTaxResult[]>([]);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);

  const { data: municipalitiesResponse, isLoading: loadingMunicipalities } = useQuery<{success: boolean; data: Municipality[]}>({
    queryKey: ['/api/municipal/municipalities'],
  });
  
  const municipalities = municipalitiesResponse?.data;

  const form = useForm({
    resolver: zodResolver(municipalityComparisonSchema),
    defaultValues: {
      municipalityCodes: [],
      propertyValue: 1000000,
      propertyCategory: "residential" as const,
      financialYear: "2024/2025",
    },
  });

  const compareMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/municipal/compare', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const toggleMunicipality = (code: string) => {
    const newSelection = selectedMunicipalities.includes(code)
      ? selectedMunicipalities.filter((c) => c !== code)
      : [...selectedMunicipalities, code];
    
    setSelectedMunicipalities(newSelection);
    form.setValue('municipalityCodes', newSelection);
  };

  const onSubmit = (data: any) => {
    compareMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare Municipalities</CardTitle>
          <CardDescription>
            Select 2-5 municipalities to compare property tax rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <FormLabel>Select Municipalities (2-5)</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {loadingMunicipalities ? (
                    Array(6).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))
                  ) : (
                    municipalities?.slice(0, 8).map((muni) => (
                      <div
                        key={muni.code}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedMunicipalities.includes(muni.code)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover-elevate'
                        }`}
                        onClick={() => toggleMunicipality(muni.code)}
                        data-testid={`municipality-${muni.code}`}
                      >
                        <p className="font-medium text-sm">{muni.name}</p>
                        <p className="text-xs opacity-80">{muni.province}</p>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedMunicipalities.length} / 5
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Value (R)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          data-testid="input-compare-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-compare-category">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                          <SelectItem value="vacant_land">Vacant Land</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={compareMutation.isPending || selectedMunicipalities.length < 2}
                data-testid="button-compare"
              >
                {compareMutation.isPending ? "Comparing..." : "Compare Municipalities"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>
              Sorted by lowest to highest annual tax
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={result.municipalityName} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Lowest
                            </span>
                          )}
                          <h3 className="font-semibold">{result.municipalityName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Rate: {(result.taxRate * 100).toFixed(2)}% •{" "}
                          {result.propertyCategory}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R{result.netAnnualTax.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          R{result.netMonthlyTax.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {results.length > 1 && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">Potential Savings:</p>
                  <p className="text-sm text-muted-foreground">
                    Moving from {results[results.length - 1]?.municipalityName} to{" "}
                    {results[0]?.municipalityName} could save you{" "}
                    <span className="font-semibold text-foreground">
                      R
                      {(
                        (results[results.length - 1]?.netAnnualTax || 0) -
                        (results[0]?.netAnnualTax || 0)
                      ).toLocaleString()}
                    </span>{" "}
                    per year in property tax.
                  </p>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm space-y-2">
                    <div>
                      <strong>Data Source:</strong>{" "}
                      {results[0]?.dataSource === 'manual_override' && 'Manually verified rates'}
                      {results[0]?.dataSource === 'validated_fallback' && 'Validated average rates'}
                      {results[0]?.dataSource === 'api' && 'Real-time municipal data'}
                      {!results[0]?.dataSource && 'Municipal data'}
                    </div>
                    
                    {results[0]?.validatedBy && (
                      <div className="text-xs text-muted-foreground" data-testid="text-validated-by-comparison">
                        <strong>Validated by:</strong> {results[0].validatedBy}
                      </div>
                    )}
                    
                    {results[0]?.lastValidated && (
                      <div className="text-xs text-muted-foreground" data-testid="text-last-validated-comparison">
                        Last validated: {new Date(results[0].lastValidated).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    
                    <div className="pt-1 border-t text-xs">
                      These are estimates. Contact each municipality for official rates.
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
