import { Upload, Calculator, FileText, Download, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorks = () => (
  <section className="py-20 bg-background animate-fade-in transition-all duration-500" aria-label="How It Works">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Four Steps to Tax Clarity
        </h2>
        <p className="text-lg text-slate-600">
          From IRP5 chaos to clear insights in minutes
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="text-center group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Step 1: Upload IRP5">
          <CardHeader>
            <div
              className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Upload className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">1. Upload IRP5</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Drop your official SARS IRP5 PDF. We handle both digital and scanned copies with OCR.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Step 2: Verify Data">
          <CardHeader>
            <div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Zap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">2. Verify Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Review auto-extracted fields in plain English. Fix any flagged items in seconds.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Step 3: Run Scenarios">
          <CardHeader>
            <div
              className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">3. Run Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Use interactive sliders to test retirement contributions and see instant tax impact.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="text-center group hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Step 4: Export Report">
          <CardHeader>
            <div
              className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">4. Export Report</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Download professional PDF reports to share with accountants or file with SARS.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);
export default HowItWorks;
