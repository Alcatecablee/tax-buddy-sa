import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileText, AlertCircle, Info, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { IRP5Data } from "@/lib/pdfProcessor";

interface ManualEntryFormProps {
  onSubmit: (data: IRP5Data) => void;
  onCancel: () => void;
  initialData?: Partial<IRP5Data>;
}

export const ManualEntryForm = ({ onSubmit, onCancel, initialData }: ManualEntryFormProps) => {
  const [formData, setFormData] = useState<IRP5Data>({
    grossRemuneration: initialData?.grossRemuneration || 0,
    payeWithheld: initialData?.payeWithheld || 0,
    uifContrib: initialData?.uifContrib || 0,
    retirementFund: initialData?.retirementFund || 0,
    medicalScheme: initialData?.medicalScheme || 0,
    travelAllowance: initialData?.travelAllowance || 0,
    medicalCredits: initialData?.medicalCredits || 0,
    taxYear: initialData?.taxYear || new Date().getFullYear().toString(),
    totalTax: initialData?.totalTax || 0,
    source: initialData?.source || 'manual_entry',
    uploadedAt: initialData?.uploadedAt || new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formatCurrency = (value: number): string => {
    return value > 0 ? `R${value.toLocaleString()}` : '';
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[R,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleInputChange = (field: keyof IRP5Data, value: string) => {
    if (field === 'taxYear') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      const numericValue = parseCurrency(value);
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (formData.grossRemuneration <= 0) {
      newErrors.grossRemuneration = 'Gross remuneration is required';
    } else if (formData.grossRemuneration < 1000) {
      newErrors.grossRemuneration = 'Amount seems too low';
    } else if (formData.grossRemuneration > 50000000) {
      newErrors.grossRemuneration = 'Amount seems too high';
    }

    if (formData.payeWithheld < 0) {
      newErrors.payeWithheld = 'PAYE cannot be negative';
    } else if (formData.payeWithheld > formData.grossRemuneration) {
      newErrors.payeWithheld = 'PAYE cannot exceed gross remuneration';
    }

    // Tax year validation
    const currentYear = new Date().getFullYear();
    const taxYear = parseInt(formData.taxYear);
    if (isNaN(taxYear) || taxYear < 2020 || taxYear > currentYear + 1) {
      newErrors.taxYear = 'Please enter a valid tax year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'grossRemuneration':
      case 'payeWithheld':
        return DollarSign;
      case 'taxYear':
        return Calendar;
      default:
        return FileText;
    }
  };

  const requiredFields = ['grossRemuneration', 'payeWithheld'];
  const completedRequiredFields = requiredFields.filter(field => {
    const value = formData[field as keyof IRP5Data];
    return typeof value === 'number' && value > 0;
  }).length;
  const progressPercentage = (completedRequiredFields / requiredFields.length) * 100;

  const fieldGroups = [
    {
      title: "Tax Year Information",
      icon: Calendar,
      color: "blue",
      fields: [
        {
          key: 'taxYear',
          label: 'Tax Year',
          placeholder: '2024',
          required: true,
          type: 'text' as const,
          description: 'The tax year for this IRP5 certificate'
        }
      ]
    },
    {
      title: "Required Information",
      icon: DollarSign,
      color: "green",
      fields: [
        {
          key: 'grossRemuneration',
          label: 'Gross Remuneration',
          placeholder: 'R 0',
          required: true,
          type: 'currency' as const,
          code: 'Code 3601',
          description: 'Your total salary before deductions'
        },
        {
          key: 'payeWithheld',
          label: 'PAYE Tax Withheld',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 3810 or 3704',
          description: 'Tax deducted from your salary by your employer'
        }
      ]
    },
    {
      title: "Additional Information (Optional)",
      icon: FileText,
      color: "purple",
      fields: [
        {
          key: 'uifContrib',
          label: 'UIF Contribution',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 3706',
          description: 'Unemployment Insurance Fund contribution'
        },
        {
          key: 'retirementFund',
          label: 'Retirement Fund Contribution',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 4005',
          description: 'Contributions to pension or provident fund'
        },
        {
          key: 'medicalScheme',
          label: 'Medical Scheme Contribution',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 4474',
          description: 'Medical aid contributions paid'
        },
        {
          key: 'travelAllowance',
          label: 'Travel Allowance',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 3703',
          description: 'Travel or motor vehicle allowance received'
        },
        {
          key: 'medicalCredits',
          label: 'Medical Tax Credits',
          placeholder: 'R 0',
          required: false,
          type: 'currency' as const,
          code: 'Code 4150',
          description: 'Medical tax credits claimed'
        }
      ]
    }
  ];

  return (
    <Card className="max-w-5xl mx-auto glass-card border-0 rounded-3xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <CardHeader className="glass-header pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl text-white">Manual IRP5 Entry</CardTitle>
              <CardDescription className="text-base mt-1 text-white/70">
                Enter your IRP5 details manually for accurate tax calculations
              </CardDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-white">Progress</div>
              <div className="text-xs text-white/60">{completedRequiredFields}/{requiredFields.length} required</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${progressPercentage * 1.76} 176`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile progress */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Form Progress</span>
            <span className="text-sm text-white/60">{completedRequiredFields}/{requiredFields.length} required</span>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {fieldGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.title} className="space-y-6 animate-in fade-in-0 slide-in-from-left-4 duration-500" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-sm border
                    ${group.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' :
                      group.color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                      'bg-purple-500/20 text-purple-400 border-purple-500/20'}
                  `}>
                    <GroupIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{group.title}</h3>
                  {group.title.includes('Required') && (
                    <Badge variant="outline" className="rounded-full bg-primary/20 text-primary border-primary/30">
                      {completedRequiredFields}/{requiredFields.length} complete
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {group.fields.map((field) => {
                    const FieldIcon = getFieldIcon(field.key);
                    const hasError = !!errors[field.key];
                    const isFocused = focusedField === field.key;
                    const hasValue = field.type === 'currency' 
                      ? typeof formData[field.key as keyof IRP5Data] === 'number' && (formData[field.key as keyof IRP5Data] as number) > 0
                      : !!formData[field.key as keyof IRP5Data];

                    return (
                      <div key={field.key} className="space-y-3">
                        <Label 
                          htmlFor={field.key}
                          className="text-base font-medium text-white flex items-center space-x-2"
                        >
                          <FieldIcon className="w-4 h-4" />
                          <span>
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </span>
                          {field.code && (
                            <Badge variant="outline" className="text-xs rounded-full bg-secondary/10 text-muted-foreground border-border/20">
                              {field.code}
                            </Badge>
                          )}
                        </Label>
                        
                        <div className="relative">
                          <Input
                            id={field.key}
                            type="text"
                            placeholder={field.placeholder}
                            value={field.type === 'currency' 
                              ? formatCurrency(formData[field.key as keyof IRP5Data] as number)
                              : formData[field.key as keyof IRP5Data] as string
                            }
                            onChange={(e) => handleInputChange(field.key as keyof IRP5Data, e.target.value)}
                            onFocus={() => setFocusedField(field.key)}
                            onBlur={() => setFocusedField(null)}
                            className={`
                              h-12 rounded-2xl border-2 transition-all duration-200 text-base bg-secondary/5 backdrop-blur-sm text-foreground placeholder:text-muted-foreground
                              ${hasError 
                                ? 'border-red-400/50 bg-red-500/10 focus:border-red-400' 
                                : isFocused 
                                  ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/20' 
                                  : hasValue
                                    ? 'border-green-400/50 bg-green-500/10'
                                    : 'border-border/20 hover:border-border/30'
                              }
                            `}
                            aria-describedby={`${field.key}-description`}
                          />
                          
                          {hasValue && !hasError && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            </div>
                          )}
                        </div>
                        
                        {field.description && (
                          <p 
                            id={`${field.key}-description`}
                            className="text-sm text-white/60 flex items-start space-x-2"
                          >
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{field.description}</span>
                          </p>
                        )}
                        
                        {hasError && (
                          <p className="text-sm text-red-400 flex items-center space-x-2 animate-in slide-in-from-left-2 duration-200">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errors[field.key]}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {groupIndex < fieldGroups.length - 1 && (
                  <Separator className="my-8 bg-border/20" />
                )}
              </div>
            );
          })}

          {/* Summary Section */}
          <div className="glass-card rounded-3xl p-6 border border-white/20 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Quick Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">Gross Income</span>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-lg font-bold text-white mt-1">
                  {formatCurrency(formData.grossRemuneration) || 'R 0'}
                </p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">PAYE Withheld</span>
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-white mt-1">
                  {formatCurrency(formData.payeWithheld) || 'R 0'}
                </p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 border border-white/10 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">Tax Year</span>
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-white mt-1">
                  {formData.taxYear || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <Button
              type="submit"
              className="flex-1 h-14 bg-primary hover:bg-primary/90 rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={completedRequiredFields < requiredFields.length}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Tax Position
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="h-14 rounded-2xl text-base font-medium bg-secondary/5 border-border/20 text-foreground hover:bg-secondary/10 transition-all duration-200 min-w-[120px]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 