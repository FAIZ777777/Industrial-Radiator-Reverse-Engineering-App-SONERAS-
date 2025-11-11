import { Header } from '@/components/Layout/Header';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import sonerasLogo from '@/assets/soneras-logo.png';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="About" />
      
      <main className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Company Info */}
          <Card className="p-8 text-center">
            <img
              src={sonerasLogo}
              alt="Soneras Logo"
              className="h-24 w-24 mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Soneras Engineering Suite
            </h2>
            <p className="text-muted-foreground mb-4">
              Professional Radiator & Heat Exchanger Engineering
            </p>
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Version 1.0.0
            </div>
          </Card>

          {/* Application Description */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">
              About This Application
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The Soneras Engineering Suite is a professional desktop application designed 
                to enable engineers to perform comprehensive reverse engineering calculations 
                on radiator and heat exchanger products.
              </p>
              <p>
                This application implements advanced thermal analysis methodologies including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
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
          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Technical Specifications
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-medium">Framework</span>
                <span>React 18+ with TypeScript</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-medium">Desktop Platform</span>
                <span>Electron.js (Cross-platform)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-medium">Data Storage</span>
                <span>Local JSON Files</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-medium">Calculation Engine</span>
                <span>Custom Thermal Analysis Library</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Export Formats</span>
                <span>PDF, Excel, CSV</span>
              </div>
            </div>
          </Card>

          {/* Methodology */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Calculation Methodology
            </h3>
            <p className="text-muted-foreground mb-4">
              This application follows industry-standard thermal engineering principles 
              and correlations as outlined in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
              <li>ASHRAE Fundamentals Handbook</li>
              <li>Heat Transfer Textbook by J.P. Holman</li>
              <li>Fundamentals of Heat and Mass Transfer by Incropera & DeWitt</li>
              <li>VDI Heat Atlas</li>
            </ul>
          </Card>

          {/* Contact */}
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Contact Information
            </h3>
            <p className="text-muted-foreground">
              For support, inquiries, or feedback, please contact:
            </p>
            <p className="text-primary font-semibold mt-2">
              Soneras Engineering Department
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
