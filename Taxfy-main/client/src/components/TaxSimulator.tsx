import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import { IRP5Data } from '../types/IRP5';
import { simulateTaxScenario, EnhancedTaxResult } from '../lib/enhancedTaxCalculator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface TaxSimulatorProps {
  baseData: IRP5Data;
  className?: string;
}

interface SimulationScenario {
  name: string;
  description: string;
  adjustments: {
    bonusIncome?: number;
    additionalRetirement?: number;
    additionalMedical?: number;
    additionalPaye?: number;
  };
}

export function TaxSimulator({ baseData, className }: TaxSimulatorProps) {
  const [customAdjustments, setCustomAdjustments] = useState({
    bonusIncome: 0,
    additionalRetirement: 0,
    additionalMedical: 0,
    additionalPaye: 0
  });

  const [simulationResult, setSimulationResult] = useState<EnhancedTaxResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('custom');

  // Predefined scenarios
  const predefinedScenarios: SimulationScenario[] = [
    {
      name: 'Year-End Bonus',
      description: 'Simulate receiving a R50,000 bonus',
      adjustments: { bonusIncome: 50000 }
    },
    {
      name: 'Max Retirement',
      description: 'Maximize retirement contributions',
      adjustments: { 
        additionalRetirement: Math.max(0, Math.min(baseData.grossRemuneration * 0.275, 350000) - baseData.retirementFund)
      }
    },
    {
      name: 'PAYE Top-Up',
      description: 'Add R10,000 PAYE payment',
      adjustments: { additionalPaye: 10000 }
    },
    {
      name: 'Comprehensive',
      description: 'Bonus + Max retirement + PAYE top-up',
      adjustments: {
        bonusIncome: 30000,
        additionalRetirement: Math.max(0, Math.min(baseData.grossRemuneration * 0.275, 350000) - baseData.retirementFund),
        additionalPaye: 5000
      }
    }
  ];

  const runSimulation = (adjustments: typeof customAdjustments) => {
    const result = simulateTaxScenario(baseData, adjustments);
    setSimulationResult(result);
  };

  useEffect(() => {
    if (selectedScenario === 'custom') {
      runSimulation(customAdjustments);
    }
  }, [customAdjustments, selectedScenario, baseData]);

  const handleScenarioSelect = (scenarioName: string) => {
    setSelectedScenario(scenarioName);
    
    if (scenarioName === 'custom') {
      runSimulation(customAdjustments);
    } else {
      const scenario = predefinedScenarios.find(s => s.name === scenarioName);
      if (scenario) {
        runSimulation({
          bonusIncome: scenario.adjustments.bonusIncome || 0,
          additionalRetirement: scenario.adjustments.additionalRetirement || 0,
          additionalMedical: scenario.adjustments.additionalMedical || 0,
          additionalPaye: scenario.adjustments.additionalPaye || 0
        });
      }
    }
  };

  const handleCustomAdjustment = (field: keyof typeof customAdjustments, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomAdjustments(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const resetSimulation = () => {
    setCustomAdjustments({
      bonusIncome: 0,
      additionalRetirement: 0,
      additionalMedical: 0,
      additionalPaye: 0
    });
    setSelectedScenario('custom');
  };

  // Calculate current tax position for comparison
  const currentResult = simulateTaxScenario(baseData, {});
  const difference = simulationResult ? {
    refund: simulationResult.refundAmount - currentResult.refundAmount,
    owed: simulationResult.amountOwed - currentResult.amountOwed,
    tax: simulationResult.totalTax - currentResult.totalTax
  } : null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Tax Scenario Simulator
        </CardTitle>
        <p className="text-sm text-gray-600">
          Model different scenarios to see how they affect your tax position
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedScenario} onValueChange={handleScenarioSelect}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
            <TabsTrigger value="predefined">Quick Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonusIncome">Additional Income (R)</Label>
                <Input
                  id="bonusIncome"
                  type="number"
                  placeholder="e.g., 50000"
                  value={customAdjustments.bonusIncome || ''}
                  onChange={(e) => handleCustomAdjustment('bonusIncome', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalRetirement">Extra Retirement (R)</Label>
                <Input
                  id="additionalRetirement"
                  type="number"
                  placeholder="e.g., 20000"
                  value={customAdjustments.additionalRetirement || ''}
                  onChange={(e) => handleCustomAdjustment('additionalRetirement', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalMedical">Extra Medical (R)</Label>
                <Input
                  id="additionalMedical"
                  type="number"
                  placeholder="e.g., 5000"
                  value={customAdjustments.additionalMedical || ''}
                  onChange={(e) => handleCustomAdjustment('additionalMedical', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalPaye">Additional PAYE (R)</Label>
                <Input
                  id="additionalPaye"
                  type="number"
                  placeholder="e.g., 10000"
                  value={customAdjustments.additionalPaye || ''}
                  onChange={(e) => handleCustomAdjustment('additionalPaye', e.target.value)}
                />
              </div>
            </div>

            <Button onClick={resetSimulation} variant="outline" className="w-full">
              Reset to Current Position
            </Button>
          </TabsContent>

          <TabsContent value="predefined" className="space-y-4">
            <div className="grid gap-3">
              {predefinedScenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedScenario === scenario.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleScenarioSelect(scenario.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                    {selectedScenario === scenario.name && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Results Comparison */}
        {simulationResult && difference && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Simulation Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Position */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Current Position</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tax Due:</span>
                    <span>R {currentResult.totalTax.toLocaleString()}</span>
                  </div>
                  {currentResult.isRefund ? (
                    <div className="flex justify-between text-green-600">
                      <span>Refund:</span>
                      <span>R {currentResult.refundAmount.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-red-600">
                      <span>Amount Owed:</span>
                      <span>R {currentResult.amountOwed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Simulated Position */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Simulated Position</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tax Due:</span>
                    <span>R {simulationResult.totalTax.toLocaleString()}</span>
                  </div>
                  {simulationResult.isRefund ? (
                    <div className="flex justify-between text-green-600">
                      <span>Refund:</span>
                      <span>R {simulationResult.refundAmount.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-red-600">
                      <span>Amount Owed:</span>
                      <span>R {simulationResult.amountOwed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Impact */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Impact
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tax Change:</span>
                    <span className={difference.tax > 0 ? 'text-red-600' : 'text-green-600'}>
                      {difference.tax > 0 ? '+' : ''}R {difference.tax.toLocaleString()}
                    </span>
                  </div>
                  {difference.refund !== 0 && (
                    <div className="flex justify-between">
                      <span>Refund Change:</span>
                      <span className={difference.refund > 0 ? 'text-green-600' : 'text-red-600'}>
                        {difference.refund > 0 ? '+' : ''}R {difference.refund.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {difference.owed !== 0 && (
                    <div className="flex justify-between">
                      <span>Debt Change:</span>
                      <span className={difference.owed > 0 ? 'text-red-600' : 'text-green-600'}>
                        {difference.owed > 0 ? '+' : ''}R {difference.owed.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {simulationResult.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Scenario Recommendations
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {simulationResult.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 