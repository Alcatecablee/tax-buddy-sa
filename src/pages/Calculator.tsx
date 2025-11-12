import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Calculator as CalcIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonalInfoStep } from "@/components/calculator/PersonalInfoStep";
import { IncomeStep } from "@/components/calculator/IncomeStep";
import { DeductionsStep } from "@/components/calculator/DeductionsStep";
import { ResultsStep } from "@/components/calculator/ResultsStep";
import { 
  AgeCategory, 
  IncomeInputs, 
  DeductionInputs, 
  TaxPaidInputs,
  calculateTax,
  TaxCalculationResult
} from "@/lib/taxCalculator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Calculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('under_65');
  const [income, setIncome] = useState<IncomeInputs>({
    salary: 0,
    freelance: 0,
    rental: 0,
    investment: 0
  });
  const [deductions, setDeductions] = useState<DeductionInputs>({
    retirementContributions: 0,
    medicalAidContributions: 0,
    medicalExpenses: 0,
    charitableDonations: 0
  });
  const [taxPaid, setTaxPaid] = useState<TaxPaidInputs>({
    paye: 0,
    provisionalTax: 0
  });
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const steps = [
    { title: 'Personal Info' },
    { title: 'Income' },
    { title: 'Deductions' },
    { title: 'Results' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    // Recalculate whenever inputs change
    const newResult = calculateTax(income, deductions, taxPaid, ageCategory);
    setResult(newResult);
  }, [income, deductions, taxPaid, ageCategory]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleIncomeChange = (field: keyof IncomeInputs, value: number) => {
    setIncome(prev => ({ ...prev, [field]: value }));
  };

  const handleDeductionChange = (field: keyof DeductionInputs, value: number) => {
    setDeductions(prev => ({ ...prev, [field]: value }));
  };

  const handleTaxPaidChange = (field: keyof TaxPaidInputs, value: number) => {
    setTaxPaid(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('tax_calculations').insert({
        user_id: user?.id || null,
        tax_year: '2024/2025',
        age_category: ageCategory,
        salary_income: income.salary,
        freelance_income: income.freelance,
        rental_income: income.rental,
        investment_income: income.investment,
        retirement_contributions: deductions.retirementContributions,
        medical_aid_contributions: deductions.medicalAidContributions,
        medical_expenses: deductions.medicalExpenses,
        charitable_donations: deductions.charitableDonations,
        paye_paid: taxPaid.paye,
        provisional_tax_paid: taxPaid.provisionalTax,
        total_income: result.totalIncome,
        taxable_income: result.taxableIncome,
        total_tax_owed: result.taxAfterRebates,
        total_tax_paid: result.totalTaxPaid,
        refund_amount: result.refundAmount
      });

      if (error) throw error;

      toast({
        title: "Calculation Saved",
        description: "Your tax calculation has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: "Error",
        description: "Failed to save calculation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-soft">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2">
              <CalcIcon className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Tax Refund Calculator</h1>
            </div>
            <div className="w-32" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background border-b border-border">
        <div className="container px-6 py-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <PersonalInfoStep
              ageCategory={ageCategory}
              onAgeCategoryChange={setAgeCategory}
            />
          )}
          {currentStep === 1 && (
            <IncomeStep
              income={income}
              onIncomeChange={handleIncomeChange}
            />
          )}
          {currentStep === 2 && (
            <DeductionsStep
              deductions={deductions}
              taxPaid={taxPaid}
              onDeductionChange={handleDeductionChange}
              onTaxPaidChange={handleTaxPaidChange}
            />
          )}
          {currentStep === 3 && result && (
            <ResultsStep result={result} />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-background border-t border-border sticky bottom-0 shadow-large">
        <div className="container px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep === steps.length - 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Calculation
                </Button>
              )}
              
              {currentStep < steps.length - 1 && (
                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleNext}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
