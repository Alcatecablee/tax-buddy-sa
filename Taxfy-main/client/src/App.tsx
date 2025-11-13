import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ui/toast";
import ErrorBoundary from "./components/ErrorBoundary";
import { LoadingSkeleton } from "./components/ui/loading-skeleton";
import { SiteLoader } from "./components/ui/site-loader";
import { AuthLoadingWrapper } from "./components/AuthLoadingWrapper";
import {
  Calculator,
  FileText,
  DollarSign,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ChatboxBeta } from "@/components/ui/chatbox-beta";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";

const queryClient = new QueryClient();

// Lazy load pages for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Upload = React.lazy(() => import("./pages/Upload"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const ManualEntry = React.lazy(() => import("./pages/ManualEntry"));
const HowTo = React.lazy(() => import("./pages/HowTo"));
const About = React.lazy(() => import("./pages/About"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Search = React.lazy(() => import("./pages/Search"));
const GuidesList = React.lazy(() => import("./pages/Guides"));
const GuideDetail = React.lazy(() =>
  import("./pages/Guides").then((module) => ({ default: module.GuideDetail })),
);
const SarsTaxSeason2025 = React.lazy(
  () => import("./pages/blog/SarsTaxSeason2025"),
);
const SarsRefundCheck = React.lazy(
  () => import("./pages/blog/SarsRefundCheck"),
);
const TaxReturnDocuments = React.lazy(
  () => import("./pages/blog/TaxReturnDocuments"),
);
const TaxDeductionsGuide = React.lazy(
  () => import("./pages/blog/TaxDeductionsGuide"),
);
const SarsEfilingGuide = React.lazy(
  () => import("./pages/blog/SarsEfilingGuide"),
);
const TaxPlanningStrategies = React.lazy(
  () => import("./pages/blog/TaxPlanningStrategies"),
);
const TaxSeasonPreparation2025 = React.lazy(
  () => import("./pages/blog/TaxSeasonPreparation2025"),
);
const CostOfLivingTaxImpact2025 = React.lazy(
  () => import("./pages/blog/CostOfLivingTaxImpact2025"),
);
const TaxSeasonDeadlines2025 = React.lazy(
  () => import("./pages/blog/TaxSeasonDeadlines2025"),
);
const MaximizeTaxRefund2025 = React.lazy(
  () => import("./pages/blog/MaximizeTaxRefund2025"),
);
const CommonTaxMistakes2025 = React.lazy(
  () => import("./pages/blog/CommonTaxMistakes2025"),
);
const SarsAutoAssessment2025 = React.lazy(
  () => import("./pages/blog/SarsAutoAssessment2025"),
);
const PayeTaxDirectiveChanges2025 = React.lazy(
  () => import("./pages/blog/PayeTaxDirectiveChanges2025"),
);
const VatBusinessTaxUpdates2025 = React.lazy(
  () => import("./pages/blog/VatBusinessTaxUpdates2025"),
);
const MidYearTaxPlanning2025 = React.lazy(
  () => import("./pages/blog/MidYearTaxPlanning2025"),
);
const CryptocurrencyTaxSouthAfrica2025 = React.lazy(
  () => import("./pages/blog/CryptocurrencyTaxSouthAfrica2025"),
);
const RemoteWorkTaxImplications2025 = React.lazy(
  () => import("./pages/blog/RemoteWorkTaxImplications2025"),
);
const SarsDigitalTransformation2025 = React.lazy(
  () => import("./pages/blog/SarsDigitalTransformation2025"),
);
const ProvisionalTaxDeadlines2025 = React.lazy(
  () => import("./pages/blog/ProvisionalTaxDeadlines2025"),
);
const SarsFilingSeasonAlerts2025 = React.lazy(
  () => import("./pages/blog/SarsFilingSeasonAlerts2025"),
);
const TaxRefundOptimizationJuly2025 = React.lazy(
  () => import("./pages/blog/TaxRefundOptimizationJuly2025"),
);

const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const SuperAdminDashboard = React.lazy(
  () => import("./pages/SuperAdminDashboard"),
);
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const ConfirmEmail = React.lazy(() => import("./pages/ConfirmEmail"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Settings = React.lazy(() => import("./pages/Settings"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = React.lazy(() => import("./pages/PaymentCancelled"));

const Vault = React.lazy(() => import("./pages/Vault"));
const Clients = React.lazy(() => import("./pages/Clients"));
const BulkUpload = React.lazy(() => import("./pages/BulkUpload"));
const ApiDocs = React.lazy(() => import("./pages/ApiDocs"));
const Support = React.lazy(() => import("./pages/Support"));
// const PressHub = React.lazy(() => import('./components/PressHub'));

// Legal pages
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = React.lazy(() => import("./pages/CookiePolicy"));
const Disclaimer = React.lazy(() => import("./pages/Disclaimer"));
const Unsubscribe = React.lazy(() => import("./pages/Unsubscribe"));

// Floating shapes component
const FloatingShapes: React.FC = () => {
  const shapes = [
    { icon: Calculator, size: "w-8 h-8" },
    { icon: FileText, size: "w-6 h-6" },
    { icon: DollarSign, size: "w-10 h-10" },
    { icon: TrendingUp, size: "w-7 h-7" },
    { icon: PieChart, size: "w-9 h-9" },
  ];

  return (
    <div className="floating-shapes">
      {shapes.map((Shape, index) => (
        <div key={index} className="floating-shape">
          <Shape.icon className={`${Shape.size} text-primary/20`} />
        </div>
      ))}
    </div>
  );
};

function App() {
  // Force dark theme and prevent switching
  useEffect(() => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("taxfy-ui-theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="taxfy-ui-theme">
          <AuthProvider>
            <AuthLoadingWrapper>
              <SubscriptionProvider
                initialPlan="free"
                initialFeatureFlags={{
                  // Enable pricing and subscriptions for proper plan enforcement
                  enablePricing: true,
                  enableSubscriptions: true,
                  enableApiAccess: false,
                  enableWhiteLabel: false,
                  enableBulkProcessing: false,
                  enablePrioritySupport: false,
                  enableCustomBranding: false,
                }}
              >
                <ToastProvider>
                  <TooltipProvider>
                    <Sonner />
                    <HelmetProvider>
                      <Router>
                        <ScrollToTop />
                        <div className="min-h-screen bg-background text-foreground flex flex-col">
                          <Navigation />
                          <main className="flex-1 pt-16">
                            <Suspense
                              fallback={
                                <SiteLoader message="Loading page..." />
                              }
                            >
                              <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/how-to" element={<HowTo />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/search" element={<Search />} />
                                <Route
                                  path="/guides"
                                  element={<GuidesList />}
                                />
                                <Route
                                  path="/guides/:slug"
                                  element={<GuideDetail />}
                                />
                                {/* <Route path="/press-hub" element={<PressHub />} /> */}
                                <Route
                                  path="/blog/sars-tax-season-2025"
                                  element={<SarsTaxSeason2025 />}
                                />
                                <Route
                                  path="/blog/sars-refund-check"
                                  element={<SarsRefundCheck />}
                                />
                                <Route
                                  path="/blog/tax-return-documents"
                                  element={<TaxReturnDocuments />}
                                />
                                <Route
                                  path="/blog/tax-deductions-guide"
                                  element={<TaxDeductionsGuide />}
                                />
                                <Route
                                  path="/blog/sars-efiling-guide"
                                  element={<SarsEfilingGuide />}
                                />
                                <Route
                                  path="/blog/tax-planning-strategies"
                                  element={<TaxPlanningStrategies />}
                                />
                                <Route
                                  path="/blog/tax-season-preparation-2025"
                                  element={<TaxSeasonPreparation2025 />}
                                />
                                <Route
                                  path="/blog/cost-of-living-tax-impact-2025"
                                  element={<CostOfLivingTaxImpact2025 />}
                                />
                                <Route
                                  path="/blog/tax-season-deadlines-2025"
                                  element={<TaxSeasonDeadlines2025 />}
                                />
                                <Route
                                  path="/blog/maximize-tax-refund-2025"
                                  element={<MaximizeTaxRefund2025 />}
                                />
                                <Route
                                  path="/blog/common-tax-mistakes-2025"
                                  element={<CommonTaxMistakes2025 />}
                                />
                                <Route
                                  path="/blog/sars-auto-assessment-2025"
                                  element={<SarsAutoAssessment2025 />}
                                />
                                <Route
                                  path="/blog/paye-tax-directive-changes-2025"
                                  element={<PayeTaxDirectiveChanges2025 />}
                                />
                                <Route
                                  path="/blog/vat-business-tax-updates-2025"
                                  element={<VatBusinessTaxUpdates2025 />}
                                />
                                <Route
                                  path="/blog/mid-year-tax-planning-2025"
                                  element={<MidYearTaxPlanning2025 />}
                                />
                                <Route
                                  path="/blog/cryptocurrency-tax-south-africa-2025"
                                  element={<CryptocurrencyTaxSouthAfrica2025 />}
                                />
                                <Route
                                  path="/blog/remote-work-tax-implications-2025"
                                  element={<RemoteWorkTaxImplications2025 />}
                                />
                                <Route
                                  path="/blog/sars-digital-transformation-2025"
                                  element={<SarsDigitalTransformation2025 />}
                                />
                                <Route
                                  path="/blog/provisional-tax-deadlines-2025"
                                  element={<ProvisionalTaxDeadlines2025 />}
                                />
                                <Route
                                  path="/blog/sars-filing-season-alerts-2025"
                                  element={<SarsFilingSeasonAlerts2025 />}
                                />
                                <Route
                                  path="/blog/tax-refund-optimization-july-2025"
                                  element={<TaxRefundOptimizationJuly2025 />}
                                />
                                <Route
                                  path="/auth/callback"
                                  element={<AuthCallback />}
                                />
                                <Route path="/signin" element={<SignIn />} />
                                <Route
                                  path="/confirm-email"
                                  element={<ConfirmEmail />}
                                />

                                {/* Payment routes */}
                                <Route
                                  path="/payment/success"
                                  element={<PaymentSuccess />}
                                />
                                <Route
                                  path="/payment/cancelled"
                                  element={<PaymentCancelled />}
                                />

                                <Route
                                  path="/reports"
                                  element={
                                    <ProtectedRoute>
                                      <Reports />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/settings"
                                  element={
                                    <ProtectedRoute>
                                      <Settings />
                                    </ProtectedRoute>
                                  }
                                />

                                <Route
                                  path="/admin-dashboard"
                                  element={
                                    <ProtectedRoute>
                                      <AdminDashboard />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/super-admin"
                                  element={
                                    <ProtectedRoute>
                                      <SuperAdminDashboard />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route path="/search" element={<Search />} />

                                {/* Legal Pages */}
                                <Route
                                  path="/privacy-policy"
                                  element={<PrivacyPolicy />}
                                />
                                <Route
                                  path="/terms-of-service"
                                  element={<TermsOfService />}
                                />
                                <Route
                                  path="/cookie-policy"
                                  element={<CookiePolicy />}
                                />
                                <Route
                                  path="/disclaimer"
                                  element={<Disclaimer />}
                                />
                                <Route
                                  path="/unsubscribe"
                                  element={<Unsubscribe />}
                                />
                                <Route
                                  path="/privacy"
                                  element={<PrivacyPolicy />}
                                />

                                {/* Main tax calculation features - require authentication */}
                                <Route
                                  path="/upload"
                                  element={
                                    <ProtectedRoute>
                                      <Upload />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/manual-entry"
                                  element={
                                    <ProtectedRoute>
                                      <ManualEntry />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/dashboard"
                                  element={
                                    <ProtectedRoute>
                                      <Dashboard />
                                    </ProtectedRoute>
                                  }
                                />

                                <Route
                                  path="/vault"
                                  element={
                                    <ProtectedRoute>
                                      <Vault />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/clients"
                                  element={
                                    <ProtectedRoute>
                                      <Clients />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/bulk-upload"
                                  element={
                                    <ProtectedRoute>
                                      <BulkUpload />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route path="/api-docs" element={<ApiDocs />} />
                                <Route path="/support" element={<Support />} />

                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </Suspense>
                          </main>
                          <Footer />
                          <ChatboxBeta />
                          <PWAInstallPrompt />
                        </div>
                      </Router>
                    </HelmetProvider>
                  </TooltipProvider>
                </ToastProvider>
              </SubscriptionProvider>
            </AuthLoadingWrapper>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
