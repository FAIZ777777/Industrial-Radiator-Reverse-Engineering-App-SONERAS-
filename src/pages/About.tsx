import { Header } from '@/components/Layout/Header';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import sonerasLogo from '@/assets/soneras-logo.png';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="About" />
      
      <main className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Company Info */}
          <Card className="p-4 sm:p-6 md:p-8 text-center">
            <img
              src={sonerasLogo}
              alt="Soneras Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto mb-4 sm:mb-6"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              Soneras Engineering Suite
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-2">
              Professional Radiator & Heat Exchanger Engineering
            </p>
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
              Version 1.0.0
            </div>
          </Card>

          {/* Application Description */}
          <Card className="p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              About This Application
            </h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
              <p>
                The Soneras Engineering Suite is a professional desktop application designed 
                to enable engineers to perform comprehensive reverse engineering calculations 
                on radiator and heat exchanger products.
              </p>
              <p>
                This application implements advanced thermal analysis methodologies including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
                <li>Reynolds Number calculations for flow regime determination</li>
                <li>Prandtl Number for fluid property characterization</li>
                <li>Grashof and Rayleigh Numbers for natural convection analysis</li>
                <li>Nusselt Number correlations (Churchill-Bernstein, laminar, simplified)</li>
                <li>NTU-Effectiveness method for heat exchanger performance</li>
                <li>Pressure drop calculations for system design</li>
                <li>Multiple heat exchanger configurations (parallel, counter flow, shell & tube)</li>
              </ul>
            </div>
          </Card>

          {/* Technical Information */}
          <Card className="p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              Technical Specifications
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border">
                <span className="font-medium text-foreground">Framework</span>
                <span className="sm:text-right">React 18+ with TypeScript</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border">
                <span className="font-medium text-foreground">Desktop Platform</span>
                <span className="sm:text-right">Electron.js (Cross-platform)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border">
                <span className="font-medium text-foreground">Data Storage</span>
                <span className="sm:text-right">Local JSON Files</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border">
                <span className="font-medium text-foreground">Calculation Engine</span>
                <span className="sm:text-right">Custom Thermal Analysis Library</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2">
                <span className="font-medium text-foreground">Export Formats</span>
                <span className="sm:text-right">PDF, Excel, CSV</span>
              </div>
            </div>
          </Card>

          {/* Methodology */}
          <Card className="p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              Calculation Methodology
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              This application follows industry-standard thermal engineering principles 
              and correlations as outlined in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm sm:text-base text-muted-foreground">
              <li>ASHRAE Fundamentals Handbook</li>
              <li>Heat Transfer Textbook by J.P. Holman</li>
              <li>Fundamentals of Heat and Mass Transfer by Incropera & DeWitt</li>
              <li>VDI Heat Atlas</li>
            </ul>
          </Card>

          {/* Contact */}
          <Card className="p-4 sm:p-6 md:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              Contact Information
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              For support, inquiries, or feedback, please contact:
            </p>
            <p className="text-sm sm:text-base text-primary font-semibold mt-2">
              Soneras Engineering Department
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
