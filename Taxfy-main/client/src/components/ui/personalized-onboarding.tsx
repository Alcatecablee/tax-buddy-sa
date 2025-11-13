import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  Briefcase,
  Calculator,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  DollarSign,
  Users,
  Building,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

interface UserProfile {
  name: string;
  userType: 'individual' | 'practitioner' | 'business';
  experience: 'beginner' | 'intermediate' | 'expert';
  goals: string[];
  frequency: 'once-yearly' | 'quarterly' | 'monthly' | 'weekly';
  interests: string[];
}

interface PersonalizedOnboardingProps {
  onComplete: (profile: UserProfile) => void;
  className?: string;
}

export function PersonalizedOnboarding({ onComplete, className }: PersonalizedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    userType: 'individual',
    experience: 'beginner',
    goals: [],
    frequency: 'once-yearly',
    interests: []
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Taxfy',
      description: 'Let\'s personalize your tax calculation experience',
      icon: Sparkles,
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Your Profile',
      description: 'Tell us about yourself',
      icon: User,
      component: ProfileStep
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      icon: Target,
      component: GoalsStep
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      icon: Calculator,
      component: PreferencesStep
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your personalized dashboard is ready',
      icon: CheckCircle,
      component: CompleteStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const currentStepData = steps[currentStep];

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <currentStepData.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CurrentStepComponent 
            profile={profile}
            updateProfile={updateProfile}
            onNext={nextStep}
          />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !profile.name) ||
                (currentStep === 2 && profile.goals.length === 0)
              }
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
        <Calculator className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">
          South Africa's Most Trusted Tax Calculator
        </h3>
        <p className="text-muted-foreground">
          Join thousands of South Africans who have discovered money SARS owes them. 
          Let's customize your experience to maximize your tax refund.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>SARS Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Bank-Level Security</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Free Forever</span>
        </div>
      </div>
    </div>
  );
}

function ProfileStep({ profile, updateProfile }: any) {
  const userTypes = [
    {
      id: 'individual',
      label: 'Individual Taxpayer',
      description: 'I file my own tax return',
      icon: User
    },
    {
      id: 'practitioner',
      label: 'Tax Practitioner',
      description: 'I help others with tax returns',
      icon: Briefcase
    },
    {
      id: 'business',
      label: 'Business Owner',
      description: 'I manage business tax compliance',
      icon: Building
    }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to tax calculations' },
    { id: 'intermediate', label: 'Intermediate', description: 'Some tax experience' },
    { id: 'expert', label: 'Expert', description: 'Very experienced with taxes' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-medium">What should we call you?</Label>
        <Input
          id="name"
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          placeholder="Enter your name"
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-base font-medium mb-4 block">I am a...</Label>
        <RadioGroup
          value={profile.userType}
          onValueChange={(value) => updateProfile({ userType: value })}
          className="space-y-3"
        >
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.id} className="flex items-center space-x-3">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label 
                  htmlFor={type.id} 
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium mb-4 block">Tax experience level</Label>
        <RadioGroup
          value={profile.experience}
          onValueChange={(value) => updateProfile({ experience: value })}
          className="space-y-2"
        >
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center space-x-3">
              <RadioGroupItem value={level.id} id={level.id} />
              <Label htmlFor={level.id} className="cursor-pointer flex-1">
                <span className="font-medium">{level.label}</span>
                <span className="text-sm text-muted-foreground ml-2">- {level.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

function GoalsStep({ profile, updateProfile }: any) {
  const goals = [
    { id: 'maximize-refund', label: 'Maximize my tax refund', icon: DollarSign },
    { id: 'understand-tax', label: 'Better understand my tax position', icon: FileText },
    { id: 'save-time', label: 'Save time on tax calculations', icon: CheckCircle },
    { id: 'avoid-mistakes', label: 'Avoid costly tax mistakes', icon: Target },
    { id: 'plan-ahead', label: 'Plan for next tax season', icon: Calculator },
    { id: 'manage-clients', label: 'Manage client tax returns', icon: Users }
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = profile.goals || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id: string) => id !== goalId)
      : [...currentGoals, goalId];
    updateProfile({ goals: updatedGoals });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          What are your main goals? (Select all that apply)
        </Label>
        <div className="grid md:grid-cols-2 gap-3">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = profile.goals?.includes(goal.id);
            
            return (
              <div
                key={goal.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => toggleGoal(goal.id)}
              >
                <Checkbox 
                  checked={isSelected}
                  onChange={() => toggleGoal(goal.id)}
                />
                <Icon className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm", isSelected ? "font-medium" : "")}>{goal.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ profile, updateProfile }: any) {
  const frequencies = [
    { id: 'once-yearly', label: 'Once a year', description: 'During tax season only' },
    { id: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
    { id: 'monthly', label: 'Monthly', description: 'Regular tax planning' },
    { id: 'weekly', label: 'Weekly', description: 'Active tax management' }
  ];

  const interests = [
    'Tax deductions',
    'Medical aid credits',
    'Retirement planning',
    'Investment tax',
    'Business expenses',
    'Provisional tax',
    'Capital gains tax',
    'Estate planning'
  ];

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i: string) => i !== interest)
      : [...currentInterests, interest];
    updateProfile({ interests: updatedInterests });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">How often do you work with taxes?</Label>
        <RadioGroup
          value={profile.frequency}
          onValueChange={(value) => updateProfile({ frequency: value })}
          className="space-y-2"
        >
          {frequencies.map((freq) => (
            <div key={freq.id} className="flex items-center space-x-3">
              <RadioGroupItem value={freq.id} id={freq.id} />
              <Label htmlFor={freq.id} className="cursor-pointer flex-1">
                <span className="font-medium">{freq.label}</span>
                <span className="text-sm text-muted-foreground ml-2">- {freq.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-medium mb-4 block">
          Areas of interest (optional)
        </Label>
        <div className="grid md:grid-cols-2 gap-2">
          {interests.map((interest) => {
            const isSelected = profile.interests?.includes(interest);
            
            return (
              <div
                key={interest}
                className={cn(
                  "flex items-center gap-2 p-2 rounded border cursor-pointer text-sm transition-all",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => toggleInterest(interest)}
              >
                <Checkbox 
                  checked={isSelected}
                  onChange={() => toggleInterest(interest)}
                />
                <span>{interest}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompleteStep({ profile }: any) {
  const getRecommendations = () => {
    const recommendations = [];
    
    if (profile.goals?.includes('maximize-refund')) {
      recommendations.push({
        title: 'Upload your IRP5',
        description: 'Start by uploading your IRP5 to see potential refunds',
        action: '/upload',
        icon: FileText
      });
    }
    
    if (profile.userType === 'practitioner') {
      recommendations.push({
        title: 'Explore Business Features',
        description: 'Access tools for managing multiple clients',
        action: '/business-dashboard',
        icon: Briefcase
      });
    }
    
    if (profile.experience === 'beginner') {
      recommendations.push({
        title: 'Read the Tax Guide',
        description: 'Learn the basics of South African tax calculations',
        action: '/how-to',
        icon: Target
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">
          Welcome aboard, {profile.name}!
        </h3>
        <p className="text-muted-foreground">
          Your personalized tax dashboard is ready. Based on your profile, here's what we recommend:
        </p>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <Card key={index} className="text-left hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}