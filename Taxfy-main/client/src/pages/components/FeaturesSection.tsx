import { Shield, Zap, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => (
  <section className="py-20 bg-background animate-fade-in transition-all duration-500" aria-label="Why Choose Taxfy?">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 
          className="text-3xl font-bold text-slate-800 mb-4 transition-all duration-500" 
          aria-label="Why Choose Taxfy?"
        >
          <span className="text-primary">
            Why Choose Taxfy?
          </span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Secure & Private - Your data stays safe with bank-level encryption">
          <CardHeader>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Secure & Private</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Your data stays safe with bank-level encryption. We never store your personal information.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Fast Insights - Get tax calculations in seconds, not hours">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Fast Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Get tax calculations in seconds, not hours. Upload your IRP5 and get instant results.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105 focus-within:shadow-xl focus-within:scale-105" tabIndex={0} aria-label="Accountant Ready - Export professional reports for your accountant">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Accountant Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Export professional reports that your accountant will love. Save time and money.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);
export default FeaturesSection;
