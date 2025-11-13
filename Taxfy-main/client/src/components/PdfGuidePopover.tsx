import React, { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface GuideData {
  field: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  priority: 'High' | 'Medium' | 'Low';
  timeEstimate: string;
  description: string;
  sarsCodes: string[];
  tips: string[];
  advancedTips?: string[];
  commonIssues?: string[];
  color: string;
  highlightAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    code?: string;
  }>;
}

const GUIDE_DATA: Record<string, GuideData> = {
  taxYear: {
    field: 'taxYear',
    title: 'Tax Year',
    difficulty: 'Easy',
    priority: 'High',
    timeEstimate: '30 seconds',
    description: 'The tax year for which this certificate was issued. Usually found at the top of your IRP5.',
    sarsCodes: ['3601'],
    tips: [
      'Look at the top section of your IRP5',
      'Tax year runs from March to February',
      'Should match the year you\'re filing for'
    ],
    color: 'blue',
    highlightAreas: [
      { x: 20, y: 50, width: 200, height: 25, label: 'Tax Year', code: '2024' }
    ]
  },
  grossSalary: {
    field: 'grossSalary',
    title: 'Gross Remuneration',
    difficulty: 'Easy',
    priority: 'High',
    timeEstimate: '1 minute',
    description: 'Your total salary before deductions. This is usually the largest amount on your IRP5.',
    sarsCodes: ['3601', '3603'],
    tips: [
      'Look for "Gross Remuneration" or "Total Income"',
      'This includes salary, bonuses, and allowances',
      'Should be the total before any deductions'
    ],
    advancedTips: [
      'May include multiple income sources',
      'Bonuses are included in this amount',
      'Overtime pay is typically included'
    ],
    color: 'green',
    highlightAreas: [
      { x: 20, y: 140, width: 150, height: 35, label: 'Gross Remuneration', code: '3601' }
    ]
  },
  payeWithheld: {
    field: 'payeWithheld',
    title: 'PAYE Tax Withheld',
    difficulty: 'Medium',
    priority: 'High',
    timeEstimate: '1-2 minutes',
    description: 'The total tax deducted from your salary during the year. This determines if you get a refund.',
    sarsCodes: ['4102'],
    tips: [
      'Look for "PAYE" or "Tax Deducted"',
      'This is what your employer paid SARS on your behalf',
      'Higher amounts may mean a bigger refund'
    ],
    advancedTips: [
      'Includes monthly tax deductions',
      'May show adjustments from previous months',
      'Provisional tax payments not included here'
    ],
    commonIssues: [
      'Sometimes split across multiple codes',
      'Don\'t confuse with UIF or other deductions'
    ],
    color: 'orange',
    highlightAreas: [
      { x: 185, y: 140, width: 150, height: 35, label: 'PAYE Withheld', code: '4102' }
    ]
  },
  medicalCredits: {
    field: 'medicalCredits',
    title: 'Medical Scheme Tax Credits',
    difficulty: 'Hard',
    priority: 'Medium',
    timeEstimate: '2-3 minutes',
    description: 'Tax credits for medical scheme contributions. These reduce your tax liability directly.',
    sarsCodes: ['4150'],
    tips: [
      'Look for "Medical Credits" section',
      'These are credits, not deductions',
      'Usually shows monthly amounts × 12'
    ],
    advancedTips: [
      'Credits for main member and dependents',
      'Different rates for different categories',
      'May include additional medical expenses'
    ],
    commonIssues: [
      'Often confused with medical aid contributions',
      'May be zero if not a medical scheme member',
      'Credits can vary monthly'
    ],
    color: 'purple',
    highlightAreas: [
      { x: 350, y: 180, width: 140, height: 35, label: 'Medical Credits', code: '4150' }
    ]
  },
  retirementContribution: {
    field: 'retirementContribution',
    title: 'Retirement Fund Contributions',
    difficulty: 'Medium',
    priority: 'Medium',
    timeEstimate: '2 minutes',
    description: 'Contributions to pension or provident funds. These provide tax deductions.',
    sarsCodes: ['4005', '4006'],
    tips: [
      'Look for "Pension" or "Retirement" contributions',
      'May include both employer and employee portions',
      'Check if amounts look reasonable (usually 7.5-27.5% of salary)'
    ],
    advancedTips: [
      'Employer contributions may be taxable',
      'Different limits for pension vs provident funds',
      'May include catch-up contributions'
    ],
    color: 'indigo',
    highlightAreas: [
      { x: 20, y: 180, width: 160, height: 35, label: 'Retirement Contributions', code: '4005' }
    ]
  },
  medicalAidContribution: {
    field: 'medicalAidContribution',
    title: 'Medical Aid Contributions',
    difficulty: 'Medium',
    priority: 'Medium',
    timeEstimate: '1-2 minutes',
    description: 'Your contributions to medical scheme. Used to calculate medical credits.',
    sarsCodes: ['3810', '4474', '4472'],
    tips: [
      'Look for "Medical Scheme Contributions"',
      'This is what you paid, not the credit amount',
      'Usually monthly amount × 12'
    ],
    advancedTips: [
      'May include employer subsidies',
      'Used to calculate the medical credits',
      'Different for main member vs dependents'
    ],
    color: 'pink',
    highlightAreas: [
      { x: 185, y: 180, width: 160, height: 35, label: 'Medical Aid Contributions', code: '3810' }
    ]
  },
  uifContribution: {
    field: 'uifContribution',
    title: 'UIF Contributions',
    difficulty: 'Easy',
    priority: 'Low',
    timeEstimate: '1 minute',
    description: 'Unemployment Insurance Fund contributions. Usually 1% of salary, capped annually.',
    sarsCodes: ['3605', '3706'],
    tips: [
      'Look for "UIF" in deductions section',
      'Should be about 1% of your salary',
      'Has an annual maximum limit'
    ],
    color: 'teal',
    highlightAreas: [
      { x: 350, y: 140, width: 140, height: 35, label: 'UIF', code: '3605' }
    ]
  },
  travelAllowance: {
    field: 'travelAllowance',
    title: 'Travel Allowance',
    difficulty: 'Medium',
    priority: 'Medium',
    timeEstimate: '1-2 minutes',
    description: 'Allowances for travel expenses. May be partially taxable depending on usage.',
    sarsCodes: ['3701', '3702'],
    tips: [
      'Look for "Travel Allowance" or similar',
      'May be listed under allowances section',
      'Could be monthly amount × 12'
    ],
    color: 'cyan',
    highlightAreas: [
      { x: 20, y: 220, width: 160, height: 35, label: 'Travel Allowance', code: '3701' }
    ]
  }
};

interface PdfGuidePopoverProps {
  field: string;
  className?: string;
}

const PdfGuidePopover: React.FC<PdfGuidePopoverProps> = ({ field, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showHighlights, setShowHighlights] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const guideData = GUIDE_DATA[field];
  
  if (!guideData) {
    return null;
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-orange-500/20 text-orange-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`ml-2 h-5 w-5 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 ${className}`}
          title={`View IRP5 guide for ${guideData.title}`}
        >
          <FileText className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[90vw] max-w-4xl p-0 overflow-hidden border-border/50 bg-background"
        side="bottom"
        align="start"
        sideOffset={5}
      >
        <div className="flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{guideData.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getDifficultyColor(guideData.difficulty)}>
                    {guideData.difficulty}
                  </Badge>
                  <Badge className={getPriorityColor(guideData.priority)}>
                    {guideData.priority} Priority
                  </Badge>
                  <span className="text-sm text-muted-foreground">⏱️ {guideData.timeEstimate}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              {/* IRP5 Sample Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">IRP5 Sample Location</h4>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 50}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs px-2 min-w-[3rem] text-center text-muted-foreground">
                      {zoom !== 100 ? `${zoom}%` : '100%'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 300}
                      className="h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHighlights(!showHighlights)}
                      className="h-8 w-8 p-0"
                      title={showHighlights ? 'Hide highlights' : 'Show highlights'}
                    >
                      {showHighlights ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <Card className="relative overflow-hidden bg-card border-2 border-border/50">
                  <div 
                    className="relative transition-transform duration-200 overflow-auto"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                  >
                    {/* Sample IRP5 Document */}
                    <div className="w-[500px] h-[280px] bg-card border border-border p-4 text-xs text-foreground">
                      {/* Header */}
                      <div className="text-center font-bold mb-4 text-sm border-b border-border pb-2">
                        INCOME TAX CERTIFICATE (IRP5)
                        <div className="text-xs font-normal mt-1">Tax Year: 2024</div>
                      </div>
                      
                      {/* Sample IRP5 Content */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <div className="text-xs p-1 border border-border bg-card">Employee: [YOUR NAME]</div>
                          <div className="text-xs p-1 border border-border bg-card">ID Number: [YOUR ID NUMBER]</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs p-1 border border-border bg-card">Employer: [EMPLOYER NAME]</div>
                          <div className="text-xs p-1 border border-border bg-card">Tax Number: [EMPLOYER TAX NO]</div>
                        </div>
                      </div>

                      {/* Income and Deductions Grid */}
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-blue-800">Income (3601)</div>
                          <div className="text-blue-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-orange-800">PAYE (4001)</div>
                          <div className="text-orange-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-teal-800">UIF (4101)</div>
                          <div className="text-teal-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-indigo-800">Retirement (4006)</div>
                          <div className="text-indigo-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-pink-800">Medical Aid (4028)</div>
                          <div className="text-pink-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-purple-800">Medical Credits (4240)</div>
                          <div className="text-purple-700">R [AMOUNT]</div>
                        </div>
                        <div className="p-2 border border-border bg-card">
                          <div className="font-semibold text-cyan-800">Travel Allow (3701)</div>
                          <div className="text-cyan-700">R [AMOUNT]</div>
                        </div>
                      </div>
                    </div>

                    {/* Highlight Overlays */}
                    {showHighlights && guideData.highlightAreas.map((area, index) => (
                      <div
                        key={index}
                        className={`absolute border-2 border-red-500 bg-red-500/20 animate-pulse rounded`}
                        style={{
                          left: `${area.x}px`,
                          top: `${area.y}px`,
                          width: `${area.width}px`,
                          height: `${area.height}px`,
                          animationDelay: `${index * 200}ms`
                        }}
                      >
                        <div className="absolute -top-7 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-10">
                          {area.label} {area.code && `(${area.code})`}
                        </div>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Guide Content */}
              <div className="space-y-4">
                {/* Description */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-foreground">Field Description</h4>
                    <p className="text-sm text-muted-foreground">{guideData.description}</p>
                  </CardContent>
                </Card>

                {/* SARS Codes */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-foreground">SARS Codes</h4>
                    <div className="flex flex-wrap gap-2">
                      {guideData.sarsCodes.map((code) => (
                        <Badge key={code} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-foreground">Quick Tips</h4>
                    <ul className="space-y-1">
                      {guideData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Advanced Section */}
                {(guideData.advancedTips || guideData.commonIssues) && (
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Advanced Information</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="text-xs h-6"
                        >
                          {showAdvanced ? 'Show Less' : 'Show More Tips'}
                        </Button>
                      </div>
                      
                      {showAdvanced && (
                        <div className="space-y-3">
                          {guideData.advancedTips && (
                            <div>
                              <h5 className="text-sm font-medium mb-1 text-foreground">Additional Tips</h5>
                              <ul className="space-y-1">
                                {guideData.advancedTips.map((tip, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <span className="text-blue-600 mr-2 mt-0.5">•</span>
                                    <span className="text-muted-foreground">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {guideData.commonIssues && (
                            <div>
                              <h5 className="text-sm font-medium mb-1 text-amber-700 dark:text-amber-400">Common Issues</h5>
                              <ul className="space-y-1">
                                {guideData.commonIssues.map((issue, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <span className="text-amber-600 mr-2 mt-0.5">⚠️</span>
                                    <span className="text-muted-foreground">{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PdfGuidePopover;
