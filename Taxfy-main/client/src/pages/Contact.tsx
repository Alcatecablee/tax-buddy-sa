import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  Calculator,
  Shield,
  Zap,
  Users,
  Star,
  FileText,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { CustomNotificationManager } from "@/components/ui/custom-notification";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact = () => {
  const { toast, toasts, removeToast } = useCustomToast();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inquiryTypes = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "support", label: "Technical Support", icon: HelpCircle },
    { value: "tax-help", label: "Tax Calculation Help", icon: Calculator },
    { value: "business", label: "Business Partnership", icon: Users },
    { value: "feedback", label: "Feedback & Suggestions", icon: Star },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@taxfy.co.za",
      description: "Get help with tax calculations and technical issues",
      action: "mailto:support@taxfy.co.za",
    },
    {
      icon: MapPin,
      title: "Office Location",
      value: "Johannesburg, South Africa",
      description: "Serving South African taxpayers nationwide",
      action: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon - Fri: 8:00 AM - 6:00 PM",
      description: "SAST (South African Standard Time)",
      action: null,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Fast Response",
      description: "We respond to all inquiries within 24 hours",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your information is protected and confidential",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get help from qualified South African tax professionals",
    },
  ];

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 1000) {
      errors.message = "Message must be less than 1000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        description: "Check the form fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(
        `[${formData.inquiryType.toUpperCase()}] ${formData.subject}`,
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Inquiry Type: ${inquiryTypes.find((t) => t.value === formData.inquiryType)?.label}\n\n` +
          `Message:\n${formData.message}\n\n` +
          `---\nSent from Taxfy Contact Form`,
      );

      const mailtoLink = `mailto:support@taxfy.co.za?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      toast({
        title: "Email Client Opened! 📧",
        description:
          "Your default email client should open with your message pre-filled. Send it to complete your inquiry.",
      });

      // Show success state
      setShowSuccess(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an issue opening your email client. Please email us directly at support@taxfy.co.za",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name && formData.email && formData.subject && formData.message;

  // Structured data for contact page
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Taxfy",
    description:
      "Get in touch with Taxfy for support with South African tax calculations, SARS refunds, and technical assistance.",
    url: "https://taxfy.co.za/contact",
    mainEntity: {
      "@type": "Organization",
      name: "Taxfy",
      email: "support@taxfy.co.za",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Johannesburg",
        addressCountry: "ZA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@taxfy.co.za",
        contactType: "customer service",
        availableLanguage: ["English", "Afrikaans"],
      },
    },
  };

  // Success Component
  const SuccessState = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-green-500/20 bg-green-500/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-muted-foreground mb-6">
            Your email client should have opened with your message pre-filled.
            Please send the email to complete your inquiry.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <span>Check your email client</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <span>Review and send the message</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <span>We'll respond within 24 hours</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => setShowSuccess(false)} className="w-full">
              Continue Browsing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (window.location.href = "mailto:support@taxfy.co.za")
              }
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Open Email Client Again
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-3">
              While you wait, explore these resources:
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <a href="/how-to">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Guide
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <a href="/blog">
                  <FileText className="w-3 h-3 mr-1" />
                  Blog
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <a href="/upload">
                  <Calculator className="w-3 h-3 mr-1" />
                  Calculator
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <SEO
        title="Contact Taxfy | Get Help with Your SARS Refund | South African Tax Support"
        description="Contact Taxfy for expert help with South African tax calculations, SARS refunds, and technical support. Our tax professionals are here to help you maximize your refund."
        keywords="contact Taxfy, South African tax support, SARS refund help, tax calculation support, technical support, maximize SARS refund"
        canonical="https://taxfy.co.za/contact"
        structuredData={contactStructuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto max-w-4xl text-center relative">
            <Badge variant="secondary" className="mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Need Help Maximizing Your SARS Refund?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our South African tax experts are here to help you get the most
              out of Taxfy. Whether you need technical support or tax advice,
              we're committed to helping you maximize your SARS refund.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={() =>
                  (window.location.href = "mailto:support@taxfy.co.za")
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Directly
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Choose the contact method that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{info.title}</h3>
                      <p className="text-primary font-medium mb-2">
                        {info.value}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {info.description}
                      </p>
                      {info.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => (window.location.href = info.action!)}
                        >
                          Contact Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24
                    hours to help you maximize your SARS refund.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className={
                            formErrors.name
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }
                          required
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className={
                            formErrors.email
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }
                          required
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        className={
                          formErrors.subject
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }
                        required
                      />
                      {formErrors.subject && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          {formErrors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide details about your inquiry. If it's about tax calculations, include relevant information like your income range or specific questions."
                        rows={6}
                        className={
                          formErrors.message
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }
                        required
                      />
                      <div className="flex justify-between items-center">
                        {formErrors.message ? (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            {formErrors.message}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {formData.message.length}/1000 characters
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Opening Email Client...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our privacy policy.
                      We'll only use your information to respond to your
                      inquiry.
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Features & FAQ */}
              <div className="space-y-8">
                {/* Why Contact Us */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Why Contact Taxfy?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Quick Help */}
                <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-500" />
                      Need Immediate Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      For quick answers, check out our resources:
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="/how-to">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          How-To Guide
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="/blog">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Tax Blog & Tips
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="/upload">
                          <Calculator className="w-4 h-4 mr-2" />
                          Try Calculator
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Your SARS Refund?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Don't wait! Start calculating your tax refund today while our
              support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8" asChild>
                <a href="/upload">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Refund Now
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="/blog/sars-tax-season-2025">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tax Season Guide
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Notification Manager */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />

      {/* Success Component */}
      {showSuccess && <SuccessState />}
    </>
  );
};

export default Contact;
