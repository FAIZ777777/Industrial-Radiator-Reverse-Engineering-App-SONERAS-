import { useState, Fragment } from 'react';
import { ArrowRight, ArrowLeft, Calculator, Droplet, Thermometer, Ruler, Zap, Info, TrendingUp, Wind, Gauge, FileText, Check, X } from 'lucide-react';
import { useCalculationStore, CalculationInput, HeatExchangerType } from '@/store/calculationStore';
import { performCalculations } from '@/utils/calculations';
import { useSettingsStore } from '@/store/settingsStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NewCalculation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // State variables
  const [productName, setProductName] = useState('');
  const [hasFiche, setHasFiche] = useState<boolean | null>(null);
  
  // Initialize formData with defaults
  const [formData, setFormData] = useState<CalculationInput>({
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
    flowConfiguration: 'counter-flow', // Default matches HeatExchangerType
    tubeThermalConductivity: 385,
    foulingFactorHot: 0.0001,
    foulingFactorCold: 0.0001,
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

  // Helper to select configuration
  const handleConfigSelect = (configId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      flowConfiguration: configId as HeatExchangerType 
    }));
  };

  const handleCalculate = () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    try {
      const results = performCalculations(formData);
      
      const calculation = {
        id: `calc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        engineer: engineerName || 'Unknown',
        productName,
        input: formData,
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

  const totalSteps = 5;

  const stepIcons = [
    { icon: Info, color: 'text-blue-500' },
    { icon: Thermometer, color: 'text-red-500' },
    { icon: Droplet, color: 'text-cyan-500' },
    { icon: Ruler, color: 'text-purple-500' },
    { icon: Calculator, color: 'text-green-500' }
  ];

  // Updated list to match HeatExchangerType in store
  const exchangerTypes = [
    { id: 'counter-flow', name: 'Counter Flow', description: 'Fluids flow in opposite directions (E=14/15)' },
    { id: 'parallel-flow', name: 'Parallel Flow', description: 'Both fluids flow in same direction (E=13)' },
    { id: 'shell-and-tube', name: 'Shell & Tube', description: 'One fluid in tubes, one in shell (E=16)' },
    { id: 'cross-flow-both-unmixed', name: 'Cross Flow (Radiator)', description: 'Both fluids unmixed (E=17)' },
    { id: 'cross-flow-cmax-mixed', name: 'Cross Flow (Tube Bank)', description: 'Max Capacity Mixed (E=18)' },
    { id: 'cross-flow-cmin-mixed', name: 'Cross Flow (Tube Bank)', description: 'Min Capacity Mixed (E=19)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SONERA Heat Exchanger</h1>
                <p className="text-xs text-slate-600">Advanced Thermal Analysis System</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          
          {/* Modern step indicators */}
          <div className="flex items-center gap-2 mb-3">
            {[...Array(totalSteps)].map((_, i) => {
              const StepIcon = stepIcons[i].icon;
              const isActive = i + 1 === step;
              const isCompleted = i + 1 < step;
              
              return (
                <Fragment key={i}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 shadow-lg shadow-green-200' :
                    isActive ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-200 scale-110' :
                    'bg-slate-200'
                  }`}>
                    <StepIcon className={`w-5 h-5 ${isCompleted || isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 < step ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </Fragment>
              );
            })}
          </div>
          
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div className="transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 backdrop-blur-sm">
            
            {/* --- STEP 1: Project Info & Fiche Technique --- */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Project Information</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Start Your Analysis
                  </h2>
                  <p className="text-slate-600">
                    Enter basic project details to begin
                  </p>
                </div>
                
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Industrial Radiator HX-5000"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-900"
                    />
                  </div>

                  {/* NEW: Fiche Technique Question */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Do you have a Technical Sheet (Fiche Technique)?
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setHasFiche(true)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                          hasFiche === true 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <Check className="w-4 h-4" /> Yes
                      </button>
                      <button
                        onClick={() => setHasFiche(false)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                          hasFiche === false 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <X className="w-4 h-4" /> No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 2: Configuration & Thermal --- */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
                    <Thermometer className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Configuration & Thermal</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Type & Temperature
                  </h2>
                  <p className="text-slate-600">
                    Select the flow configuration and define fluid parameters
                  </p>
                </div>

                {/* Part A: Heat Exchanger Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Heat Exchanger Configuration
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exchangerTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleConfigSelect(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.flowConfiguration === type.id
                            ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-offset-2'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 mb-1 text-sm">{type.name}</div>
                        <div className="text-xs text-slate-500">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-200 my-6"></div>
                
                {/* Part B: Thermal Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border-2 border-red-100">
                    <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Hot Fluid
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Inlet Temp (°C)</label>
                        <input
                          type="number"
                          value={formData.hotFluidTempIn}
                          onChange={(e) => handleInputChange('hotFluidTempIn', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Outlet Temp (°C)</label>
                        <input
                          type="number"
                          value={formData.hotFluidTempOut}
                          onChange={(e) => handleInputChange('hotFluidTempOut', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mass Flow (kg/s)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.hotFluidMassFlow}
                          onChange={(e) => handleInputChange('hotFluidMassFlow', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-xl border-2 border-cyan-100">
                    <h3 className="font-bold text-cyan-900 mb-4 flex items-center gap-2">
                      <Wind className="w-5 h-5" />
                      Cold Fluid
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Inlet Temp (°C)</label>
                        <input
                          type="number"
                          value={formData.coldFluidTempIn}
                          onChange={(e) => handleInputChange('coldFluidTempIn', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Outlet Temp (°C)</label>
                        <input
                          type="number"
                          value={formData.coldFluidTempOut}
                          onChange={(e) => handleInputChange('coldFluidTempOut', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mass Flow (kg/s)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.coldFluidMassFlow}
                          onChange={(e) => handleInputChange('coldFluidMassFlow', e.target.value)}
                          className="w-full px-3 py-2.5 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Wall Temperature (°C)</label>
                    <input
                      type="number"
                      value={formData.wallTemp}
                      onChange={(e) => handleInputChange('wallTemp', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 3: Fluid Properties --- */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-full mb-4">
                    <Droplet className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700">Fluid Properties</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Thermophysical Data
                  </h2>
                  <p className="text-slate-600">
                    Enter physical and thermal properties of both fluids
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-red-700 pb-2 border-b-2 border-red-200">Hot Fluid Properties</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Viscosity (kg/m·s)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.hotFluidViscosity}
                        onChange={(e) => handleInputChange('hotFluidViscosity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Density (kg/m³)</label>
                      <input
                        type="number"
                        value={formData.hotFluidDensity}
                        onChange={(e) => handleInputChange('hotFluidDensity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Heat (J/kg·°C)</label>
                      <input
                        type="number"
                        value={formData.hotFluidSpecificHeat}
                        onChange={(e) => handleInputChange('hotFluidSpecificHeat', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Thermal Conductivity (W/m·°C)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.hotFluidThermalConductivity}
                        onChange={(e) => handleInputChange('hotFluidThermalConductivity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-cyan-700 pb-2 border-b-2 border-cyan-200">Cold Fluid Properties</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Viscosity (kg/m·s)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.coldFluidViscosity}
                        onChange={(e) => handleInputChange('coldFluidViscosity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Density (kg/m³)</label>
                      <input
                        type="number"
                        value={formData.coldFluidDensity}
                        onChange={(e) => handleInputChange('coldFluidDensity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Heat (J/kg·°C)</label>
                      <input
                        type="number"
                        value={formData.coldFluidSpecificHeat}
                        onChange={(e) => handleInputChange('coldFluidSpecificHeat', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Thermal Conductivity (W/m·°C)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.coldFluidThermalConductivity}
                        onChange={(e) => handleInputChange('coldFluidThermalConductivity', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 4: Geometric Parameters --- */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-4">
                    <Ruler className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Geometric Parameters</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Physical Dimensions
                  </h2>
                  <p className="text-slate-600">
                    Specify tube geometry and exchanger configuration
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tube External Diameter (m)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.tubeExtDiameter}
                      onChange={(e) => handleInputChange('tubeExtDiameter', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tube Internal Diameter (m)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.tubeIntDiameter}
                      onChange={(e) => handleInputChange('tubeIntDiameter', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tube Length (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tubeLength}
                      onChange={(e) => handleInputChange('tubeLength', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Tubes</label>
                    <input
                      type="number"
                      value={formData.numberOfTubes}
                      onChange={(e) => handleInputChange('numberOfTubes', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Total Surface Area (m²)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.totalSurfaceArea}
                      onChange={(e) => handleInputChange('totalSurfaceArea', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hot Fluid Velocity (m/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hotFluidVelocity}
                      onChange={(e) => handleInputChange('hotFluidVelocity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cold Fluid Velocity (m/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.coldFluidVelocity}
                      onChange={(e) => handleInputChange('coldFluidVelocity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 5: Review & Formulas --- */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Review & Calculate</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Calculation Formulas
                  </h2>
                  <p className="text-slate-600">
                    Review the mathematical models used in analysis
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Reynolds */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Reynolds Number
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-blue-200">
                        Re = (ρ × V × D) / μ
                      </div>
                      <p className="text-xs text-slate-600 pt-2">
                        Determines flow regime (laminar/turbulent)
                      </p>
                    </div>
                  </div>

                  {/* Prandtl */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-100">
                    <h3 className="font-bold text-purple-900 mb-3">Prandtl Number</h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-purple-200">
                        Pr = (μ × Cp) / λ
                      </div>
                      <p className="text-xs text-slate-600 pt-2">
                        Ratio of momentum to thermal diffusivity
                      </p>
                    </div>
                  </div>

                  {/* Grashof */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl border-2 border-orange-100">
                    <h3 className="font-bold text-orange-900 mb-3">Grashof Number</h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-orange-200 text-xs">
                        Gr = (β × g × |Tw - T| × ρ² × L³) / μ²
                      </div>
                      <p className="text-xs text-slate-600 pt-2">
                        Ratio of buoyancy to viscous forces
                      </p>
                    </div>
                  </div>

                  {/* Nusselt */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border-2 border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-3">Nusselt Number</h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-indigo-200 text-xs">
                        Nu = (0.4Re^0.5 + 0.06Re^(2/3)) × Pr^0.4
                      </div>
                    </div>
                  </div>

                  {/* NTU */}
                  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-5 rounded-xl border-2 border-cyan-100">
                    <h3 className="font-bold text-cyan-900 mb-3">NTU Method</h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-cyan-200 text-xs">
                        NTU = (U × A) / Cmin
                      </div>
                      <div className="font-mono bg-white p-3 rounded-lg border border-cyan-200">
                        Cr = Cmin / Cmax
                      </div>
                    </div>
                  </div>

                  {/* Effectiveness & Heat Transfer */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border-2 border-red-100">
                    <h3 className="font-bold text-red-900 mb-3">Heat Transfer Rate</h3>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-white p-3 rounded-lg border border-red-200 text-xs">
                        Qmax = Cmin × (Th,in - Tc,in)
                      </div>
                      <div className="font-mono bg-white p-3 rounded-lg border border-red-200">
                        Q = ε × Qmax
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-xl text-white shadow-xl">
                  <h3 className="font-bold text-xl mb-2">Ready to Calculate</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    All parameters have been entered. Click the button below to perform the thermal analysis.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-200 text-xs">Product</p>
                      <p className="font-semibold">{productName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Configuration</p>
                      <p className="font-semibold capitalize">{formData.flowConfiguration?.replace(/-/g, ' ') || 'Counter Flow'}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Hot Fluid</p>
                      <p className="font-semibold">{formData.hotFluidTempIn}°C → {formData.hotFluidTempOut}°C</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs">Cold Fluid</p>
                      <p className="font-semibold">{formData.coldFluidTempIn}°C → {formData.coldFluidTempOut}°C</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              step === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => {
                 // Validation for Step 1
                 if (step === 1) {
                   if (!productName.trim()) {
                     toast.error('Please enter a product name');
                     return;
                   }
                   if (hasFiche === null) {
                     toast.error('Please indicate if you have a technical sheet');
                     return;
                   }
                 }
                 setStep((prev) => Math.min(totalSteps, prev + 1))
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
            >
              <span>Continue</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleCalculate}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Calculator size={20} />
              <span>Calculate Results</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewCalculation;