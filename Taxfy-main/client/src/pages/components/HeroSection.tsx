import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section
    className="relative py-24 overflow-hidden animate-fade-in transition-all duration-500"
    tabIndex={-1}
    aria-label="Welcome section"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-12">
        {/* Main Content */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight transition-colors duration-300">
            Your IRP5 Data,
            <span className="text-primary block mt-2">Simplified</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Upload your IRP5, extract data instantly, run tax scenarios, and get
            professional reports. The smart way to understand your South African
            tax position.
          </p>
        </div>

        {/* Product Hunt Badge */}
        <div className="flex justify-center py-6">
          <a
            href="https://www.producthunt.com/products/taxfy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-taxfy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=973195&theme=neutral&t=1750703325289"
              alt="Taxfy - Check if SARS Owes You Money in under 30 seconds | Product Hunt"
              style={{ width: "250px", height: "54px" }}
              width="250"
              height="54"
              className="hover:scale-105 transition-transform duration-200"
            />
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 transition-transform duration-200 focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-105"
          >
            <Link to="/upload" tabIndex={0} aria-label="Upload your IRP5">
              <Upload
                className="w-5 h-5 mr-2"
                aria-label="Upload icon"
                role="img"
                focusable="false"
              />
              Upload Your IRP5
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Background Decorative Elements */}
    <div
      className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full opacity-25 animate-pulse pointer-events-none"
      aria-hidden="true"
    ></div>
    <div
      className="absolute bottom-20 right-10 w-24 h-24 bg-green-500/10 rounded-full opacity-25 animate-pulse pointer-events-none"
      aria-hidden="true"
    ></div>
  </section>
);

export default HeroSection;
