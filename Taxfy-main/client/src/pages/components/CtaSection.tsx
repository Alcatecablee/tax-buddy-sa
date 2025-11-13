import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => (
  <section className="py-20 bg-primary animate-fade-in transition-all duration-500" aria-label="Call to Action">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ready to Simplify Your Tax Planning?
      </h2>
      <p className="text-xl text-primary-foreground/80 mb-8">
        Join thousands of South Africans who've already streamlined their tax process.
      </p>
      <Button
        size="lg"
        asChild
        className="bg-background text-foreground hover:bg-background/90 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-background focus-visible:ring-offset-2 hover:scale-105 shadow-lg"
      >
        <Link to="/upload" tabIndex={0} aria-label="Start now, it's free">
          <Upload className="w-5 h-5 mr-2" aria-label="Upload icon" role="img" focusable="false" />
          Start Now - It's Free
        </Link>
      </Button>
    </div>
  </section>
);
export default CtaSection;
