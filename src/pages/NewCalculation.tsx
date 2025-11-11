import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calculator } from 'lucide-react';
import { CalculationInput, useCalculationStore } from '@/store/calculationStore';
import { performCalculations } from '@/utils/calculations';
import { useSettingsStore } from '@/store/settingsStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NewCalculation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState('');
  const [formData, setFormData] = useState<Partial<CalculationInput>>({
    hotFluidTempIn: 80,
    hotFluidTempOut: 60,
    coldFluidTempIn: 20,
    coldFluidTempOut: 40,
    hotFluidMassFlow: 0.5,
    coldFluidMassFlow: 0.5,
    wallTemp: 50,
    hotFluidViscosity: 0.001,
    hotFluidDensity: 1000,
    hotFluidSpecificHeat: 4180,
    hotFluidThermalConductivity: 0.6,
    coldFluidViscosity: 0.001,
    coldFluidDensity: 1000,
    coldFluidSpecificHeat: 4180,
    coldFluidThermalConductivity: 0.6,
    tubeExtDiameter: 0.025,
    tubeIntDiameter: 0.020,
    tubeLength: 1.0,
    numberOfTubes: 10,
    totalSurfaceArea: 0.785,
    hotFluidVelocity: 1.0,
    coldFluidVelocity: 1.0,
    gravityCoefficient: 9.81,
  });

  const addCalculation = useCalculationStore((state) => state.addCalculation);
  const setCurrentCalculation = useCalculationStore((state) => state.setCurrentCalculation);
  const engineerName = useSettingsStore((state) => state.engineerName);

  const handleInputChange = (field: keyof CalculationInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    try {
      const results = performCalculations(formData as CalculationInput);
      
      const calculation = {
        id: `calc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        engineer: engineerName || 'Unknown',
        productName,
        input: formData as CalculationInput,
        results,
      };

      addCalculation(calculation);
      setCurrentCalculation(calculation);
      toast.success('Calculation completed successfully!');
      navigate('/results');
    } catch (error) {
      toast.error('Error performing calculation');
      console.error(error);
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background">
      <Header title="New Calculation" />
      
      <main className="p-3 sm:p-4 md:p-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 sm:p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Product Information
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Enter basic product details to begin
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName" className="text-sm sm:text-base">Product Name</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Radiator Model X-2000"
                      className="mt-1 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Thermal Properties
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Temperature and flow rate parameters
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm sm:text-base">Hot Fluid Temperature In (°C)</Label>
                    <Input
                      type="number"
                      value={formData.hotFluidTempIn}
                      onChange={(e) => handleInputChange('hotFluidTempIn', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Hot Fluid Temperature Out (°C)</Label>
                    <Input
                      type="number"
                      value={formData.hotFluidTempOut}
                      onChange={(e) => handleInputChange('hotFluidTempOut', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Cold Fluid Temperature In (°C)</Label>
                    <Input
                      type="number"
                      value={formData.coldFluidTempIn}
                      onChange={(e) => handleInputChange('coldFluidTempIn', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Cold Fluid Temperature Out (°C)</Label>
                    <Input
                      type="number"
                      value={formData.coldFluidTempOut}
                      onChange={(e) => handleInputChange('coldFluidTempOut', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Hot Fluid Mass Flow (kg/s)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.hotFluidMassFlow}
                      onChange={(e) => handleInputChange('hotFluidMassFlow', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Cold Fluid Mass Flow (kg/s)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.coldFluidMassFlow}
                      onChange={(e) => handleInputChange('coldFluidMassFlow', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Fluid Properties
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Thermophysical properties of fluids
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground">Hot Fluid</h3>
                    <div>
                      <Label className="text-sm sm:text-base">Viscosity (kg/m·s)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.hotFluidViscosity}
                        onChange={(e) => handleInputChange('hotFluidViscosity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Density (kg/m³)</Label>
                      <Input
                        type="number"
                        value={formData.hotFluidDensity}
                        onChange={(e) => handleInputChange('hotFluidDensity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Specific Heat (J/kg·°C)</Label>
                      <Input
                        type="number"
                        value={formData.hotFluidSpecificHeat}
                        onChange={(e) => handleInputChange('hotFluidSpecificHeat', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Thermal Conductivity (W/m·°C)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.hotFluidThermalConductivity}
                        onChange={(e) => handleInputChange('hotFluidThermalConductivity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground">Cold Fluid</h3>
                    <div>
                      <Label className="text-sm sm:text-base">Viscosity (kg/m·s)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.coldFluidViscosity}
                        onChange={(e) => handleInputChange('coldFluidViscosity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Density (kg/m³)</Label>
                      <Input
                        type="number"
                        value={formData.coldFluidDensity}
                        onChange={(e) => handleInputChange('coldFluidDensity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Specific Heat (J/kg·°C)</Label>
                      <Input
                        type="number"
                        value={formData.coldFluidSpecificHeat}
                        onChange={(e) => handleInputChange('coldFluidSpecificHeat', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm sm:text-base">Thermal Conductivity (W/m·°C)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.coldFluidThermalConductivity}
                        onChange={(e) => handleInputChange('coldFluidThermalConductivity', e.target.value)}
                        className="mt-1 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Geometric Parameters
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Physical dimensions and configuration
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm sm:text-base">Tube External Diameter (m)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.tubeExtDiameter}
                      onChange={(e) => handleInputChange('tubeExtDiameter', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Tube Internal Diameter (m)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.tubeIntDiameter}
                      onChange={(e) => handleInputChange('tubeIntDiameter', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Tube Length (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.tubeLength}
                      onChange={(e) => handleInputChange('tubeLength', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Number of Tubes</Label>
                    <Input
                      type="number"
                      value={formData.numberOfTubes}
                      onChange={(e) => handleInputChange('numberOfTubes', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Total Surface Area (m²)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.totalSurfaceArea}
                      onChange={(e) => handleInputChange('totalSurfaceArea', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Hot Fluid Velocity (m/s)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.hotFluidVelocity}
                      onChange={(e) => handleInputChange('hotFluidVelocity', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Cold Fluid Velocity (m/s)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.coldFluidVelocity}
                      onChange={(e) => handleInputChange('coldFluidVelocity', e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Calculation Formulas Section - Show on last step */}
        {step === totalSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="p-4 sm:p-6 md:p-8 bg-muted/30">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Calculation Formulas
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Reynolds Number */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Reynolds Number</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="font-mono break-all">Re = (ρ × V × D) / μ</p>
                    <p className="text-muted-foreground break-all">or Re = (4 × ṁ) / (π × μ × D)</p>
                  </div>
                </div>

                {/* Prandtl Number */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Prandtl Number</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border text-xs sm:text-sm">
                    <p className="font-mono break-all">Pr = (μ × Cp) / λ</p>
                  </div>
                </div>

                {/* Grashof Number */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Grashof Number</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="font-mono">β = 1 / T</p>
                    <p className="font-mono break-all">Gr = (β × g × |Tw - T| × ρ² × L³) / μ²</p>
                  </div>
                </div>

                {/* Rayleigh Number */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Rayleigh Number</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border text-xs sm:text-sm">
                    <p className="font-mono">Ra = Gr × Pr</p>
                  </div>
                </div>

                {/* Nusselt Number */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Nusselt Number</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="text-muted-foreground mb-2">Churchill-Bernstein (turbulent):</p>
                    <p className="font-mono break-all">Nu = (0.4 × Re^0.5 + 0.06 × Re^(2/3)) × Pr^0.4</p>
                    <p className="text-muted-foreground mt-2">Laminar flow:</p>
                    <p className="font-mono">Nu = 3.66</p>
                  </div>
                </div>

                {/* Heat Transfer Coefficient */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Heat Transfer Coefficient</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border text-xs sm:text-sm">
                    <p className="font-mono break-all">h = (Nu × λ) / D</p>
                  </div>
                </div>

                {/* NTU Method */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">NTU Method</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="font-mono break-all">NTU = (U × A) / Cmin</p>
                    <p className="font-mono">Cr = Cmin / Cmax</p>
                  </div>
                </div>

                {/* Effectiveness */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Effectiveness (Counter Flow)</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="font-mono break-all">ε = (1 - e^(-NTU(1-Cr))) / (1 - Cr × e^(-NTU(1-Cr)))</p>
                    <p className="text-muted-foreground break-all">if Cr = 1: ε = NTU / (1 + NTU)</p>
                  </div>
                </div>

                {/* Pressure Drop */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Pressure Drop</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border text-xs sm:text-sm">
                    <p className="font-mono break-all">ΔP = (f × L × ρ × V²) / (2 × D)</p>
                  </div>
                </div>

                {/* Heat Transfer Rate */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base text-primary">Heat Transfer Rate</h3>
                  <div className="bg-background p-3 sm:p-4 rounded-lg border border-border space-y-2 text-xs sm:text-sm">
                    <p className="font-mono break-all">Qmax = Cmin × (Th,in - Tc,in)</p>
                    <p className="font-mono">Q = ε × Qmax</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((prev) => Math.min(totalSteps, prev + 1))}
              className="gap-2 bg-primary text-primary-foreground w-full sm:w-auto"
              size="lg"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Continue</span>
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleCalculate}
              className="gap-2 bg-gradient-primary text-primary-foreground w-full sm:w-auto"
              size="lg"
            >
              <Calculator size={16} />
              Calculate
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewCalculation;
