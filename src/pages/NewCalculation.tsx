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
      
      <main className="p-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
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
          <Card className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Product Information
                  </h2>
                  <p className="text-muted-foreground">
                    Enter basic product details to begin
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Radiator Model X-2000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Thermal Properties
                  </h2>
                  <p className="text-muted-foreground">
                    Temperature and flow rate parameters
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Hot Fluid Temperature In (°C)</Label>
                    <Input
                      type="number"
                      value={formData.hotFluidTempIn}
                      onChange={(e) => handleInputChange('hotFluidTempIn', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Hot Fluid Temperature Out (°C)</Label>
                    <Input
                      type="number"
                      value={formData.hotFluidTempOut}
                      onChange={(e) => handleInputChange('hotFluidTempOut', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Cold Fluid Temperature In (°C)</Label>
                    <Input
                      type="number"
                      value={formData.coldFluidTempIn}
                      onChange={(e) => handleInputChange('coldFluidTempIn', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Cold Fluid Temperature Out (°C)</Label>
                    <Input
                      type="number"
                      value={formData.coldFluidTempOut}
                      onChange={(e) => handleInputChange('coldFluidTempOut', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Hot Fluid Mass Flow (kg/s)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.hotFluidMassFlow}
                      onChange={(e) => handleInputChange('hotFluidMassFlow', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Cold Fluid Mass Flow (kg/s)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.coldFluidMassFlow}
                      onChange={(e) => handleInputChange('coldFluidMassFlow', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Fluid Properties
                  </h2>
                  <p className="text-muted-foreground">
                    Thermophysical properties of fluids
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Hot Fluid</h3>
                    <div>
                      <Label>Viscosity (kg/m·s)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.hotFluidViscosity}
                        onChange={(e) => handleInputChange('hotFluidViscosity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Density (kg/m³)</Label>
                      <Input
                        type="number"
                        value={formData.hotFluidDensity}
                        onChange={(e) => handleInputChange('hotFluidDensity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Specific Heat (J/kg·°C)</Label>
                      <Input
                        type="number"
                        value={formData.hotFluidSpecificHeat}
                        onChange={(e) => handleInputChange('hotFluidSpecificHeat', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Thermal Conductivity (W/m·°C)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.hotFluidThermalConductivity}
                        onChange={(e) => handleInputChange('hotFluidThermalConductivity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Cold Fluid</h3>
                    <div>
                      <Label>Viscosity (kg/m·s)</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.coldFluidViscosity}
                        onChange={(e) => handleInputChange('coldFluidViscosity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Density (kg/m³)</Label>
                      <Input
                        type="number"
                        value={formData.coldFluidDensity}
                        onChange={(e) => handleInputChange('coldFluidDensity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Specific Heat (J/kg·°C)</Label>
                      <Input
                        type="number"
                        value={formData.coldFluidSpecificHeat}
                        onChange={(e) => handleInputChange('coldFluidSpecificHeat', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Thermal Conductivity (W/m·°C)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.coldFluidThermalConductivity}
                        onChange={(e) => handleInputChange('coldFluidThermalConductivity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Geometric Parameters
                  </h2>
                  <p className="text-muted-foreground">
                    Physical dimensions and configuration
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tube External Diameter (m)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.tubeExtDiameter}
                      onChange={(e) => handleInputChange('tubeExtDiameter', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tube Internal Diameter (m)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.tubeIntDiameter}
                      onChange={(e) => handleInputChange('tubeIntDiameter', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tube Length (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.tubeLength}
                      onChange={(e) => handleInputChange('tubeLength', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Number of Tubes</Label>
                    <Input
                      type="number"
                      value={formData.numberOfTubes}
                      onChange={(e) => handleInputChange('numberOfTubes', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Total Surface Area (m²)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.totalSurfaceArea}
                      onChange={(e) => handleInputChange('totalSurfaceArea', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Hot Fluid Velocity (m/s)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.hotFluidVelocity}
                      onChange={(e) => handleInputChange('hotFluidVelocity', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Cold Fluid Velocity (m/s)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.coldFluidVelocity}
                      onChange={(e) => handleInputChange('coldFluidVelocity', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((prev) => Math.min(totalSteps, prev + 1))}
              className="gap-2 bg-primary text-primary-foreground"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleCalculate}
              className="gap-2 bg-gradient-primary text-primary-foreground"
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
