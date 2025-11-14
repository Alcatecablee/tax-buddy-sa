import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Calculator as CalcIcon, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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
import whiteLogo from "@assets/taxify-logo-white.png";
import darkLogo from "@assets/taxify-logo-dark.png";

const Calculator = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
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
  const [isEditing, setIsEditing] = useState(false);
  const [calculationId, setCalculationId] = useState<string | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const steps = [
    { title: 'Personal Info' },
    { title: 'Income' },
    { title: 'Deductions' },
    { title: 'Results' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    // Check if we're in edit mode
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
      setIsEditing(true);
      setCalculationId(editId);
    }
  }, []);

  useEffect(() => {
    // Load calculation data when editing
    if (!isEditing || !calculationId || !user) return;
    
    let cancelled = false;
    
    const loadCalculation = async () => {
      setIsLoadingEdit(true);
      
      try {
        const { data, error } = await supabase
          .from('tax_calculations')
          .select('*')
          .eq('id', calculationId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          throw new Error('Calculation not found or you do not have permission to edit it');
        }
        
        if (cancelled) return;
        
        // Pre-fill form with loaded data
        setAgeCategory(data.age_category as AgeCategory);
        setIncome({
          salary: data.salary_income ?? 0,
          freelance: data.freelance_income ?? 0,
          rental: data.rental_income ?? 0,
          investment: data.investment_income ?? 0
        });
        setDeductions({
          retirementContributions: data.retirement_contributions ?? 0,
          medicalAidContributions: data.medical_aid_contributions ?? 0,
          medicalExpenses: data.medical_expenses ?? 0,
          charitableDonations: data.charitable_donations ?? 0
        });
        setTaxPaid({
          paye: data.paye_paid ?? 0,
          provisionalTax: data.provisional_tax_paid ?? 0
        });
        
        toast({
          title: "Calculation Loaded",
          description: "Your saved calculation has been loaded for editing.",
        });
      } catch (error: any) {
        if (!cancelled) {
          toast({
            title: "Error Loading Calculation",
            description: error.message || "Failed to load calculation. Please try again.",
            variant: "destructive",
          });
          setLocation('/dashboard');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingEdit(false);
        }
      }
    };
    
    loadCalculation();
    
    return () => {
      cancelled = true;
    };
  }, [isEditing, calculationId, user, toast, setLocation]);

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
    if (!result || isLoadingEdit) return;

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your calculations.",
        variant: "destructive",
      });
      return;
    }

    try {
      const calculationData = {
        user_id: user.id,
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
      };

      let error;
      
      if (isEditing && calculationId) {
        const result = await supabase
          .from('tax_calculations')
          .update(calculationData)
          .eq('id', calculationId)
          .eq('user_id', user.id);
        
        error = result.error;
        
        if (!error) {
          toast({
            title: "Calculation Updated",
            description: "Your tax calculation has been updated successfully.",
          });
        }
      } else {
        const result = await supabase
          .from('tax_calculations')
          .insert(calculationData);
        
        error = result.error;
        
        if (!error) {
          toast({
            title: "Calculation Saved",
            description: "Your tax calculation has been saved successfully.",
          });
        }
      }
      
      if (error) throw error;
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
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1"
              data-testid="link-home"
            >
              <img 
                src={darkLogo} 
                alt="Taxify" 
                className="w-8 h-8 dark:hidden"
              />
              <img 
                src={whiteLogo} 
                alt="Taxify" 
                className="w-8 h-8 hidden dark:block"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">Taxify</span>
                <span className="text-xs text-muted-foreground">Calculator</span>
              </div>
            </button>
            <div className="w-32" />
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
                user ? (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSave}
                    data-testid="button-save"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Calculation
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setLocation('/login')}
                    data-testid="button-login-to-save"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In to Save
                  </Button>
                )
              )}
              
              {currentStep < steps.length - 1 && (
                <Button
                  variant="default"
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
