import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { AgeCategory } from "@/lib/taxCalculator";

interface PersonalInfoStepProps {
  ageCategory: AgeCategory;
  onAgeCategoryChange: (value: AgeCategory) => void;
}

export const PersonalInfoStep = ({ ageCategory, onAgeCategoryChange }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
          <p className="text-muted-foreground">Your age affects your tax threshold and rebates</p>
        </div>
      </div>

      <Card className="p-6">
        <Label className="text-base font-semibold mb-4 block">What is your age category?</Label>
        <RadioGroup value={ageCategory} onValueChange={(value) => onAgeCategoryChange(value as AgeCategory)}>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-smooth cursor-pointer">
              <RadioGroupItem value="under_65" id="under_65" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="under_65" className="font-medium cursor-pointer">
                  Under 65 years
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Tax threshold: R95,750 | Primary rebate: R17,235
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-smooth cursor-pointer">
              <RadioGroupItem value="65_to_74" id="65_to_74" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="65_to_74" className="font-medium cursor-pointer">
                  65 to 74 years
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Tax threshold: R148,217 | Additional rebate: R9,444
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-smooth cursor-pointer">
              <RadioGroupItem value="75_plus" id="75_plus" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="75_plus" className="font-medium cursor-pointer">
                  75 years and older
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Tax threshold: R165,689 | Additional rebate: R12,589
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-6 p-4 bg-primary-light rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> Your age on the last day of the tax year (28 February 2025) determines your category.
            Higher age categories benefit from higher tax thresholds and additional rebates.
          </p>
        </div>
      </Card>
    </div>
  );
};
