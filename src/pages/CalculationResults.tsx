import { useState } from 'react';
import { 
  ArrowLeft, FileDown, TrendingUp, Gauge, Droplet, Wind, Zap, 
  ThermometerSun, Activity, Download, Share2, Printer, 
  ChevronDown, ChevronUp, Info, Check, AlertCircle 
} from 'lucide-react';
import { useCalculationStore } from '@/store/calculationStore';
import { useNavigate } from 'react-router-dom';
import { exportToPDF, exportToExcel, exportToJSON } from '@/utils/exportFunctions'; // Import export functions

const CalculationResults = () => {
  const navigate = useNavigate();
  const currentCalculation = useCalculationStore((state) => state.currentCalculation);
  const [expandedSection, setExpandedSection] = useState<string | null>('all');
  const [showFormulas, setShowFormulas] = useState(false);

  if (!currentCalculation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Calculation Data</h2>
          <button 
            onClick={() => navigate('/new-calculation')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Start New Calculation
          </button>
        </div>
      </div>
    );
  }

  const { results, input } = currentCalculation;

  const tempData = [
    { position: 'Inlet', hot: input.hotFluidTempIn, cold: input.coldFluidTempIn },
    { position: 'Mid', hot: (input.hotFluidTempIn + input.hotFluidTempOut) / 2, cold: (input.coldFluidTempIn + input.coldFluidTempOut) / 2 },
    { position: 'Outlet', hot: input.hotFluidTempOut, cold: input.coldFluidTempOut },
  ];

  const handleExport = (type: string) => {
    if (type === 'pdf') {
        exportToPDF(currentCalculation);
    } else if (type === 'excel') {
        exportToExcel(currentCalculation); // Requires array if using exportToExcel from utils, or update utils to handle single
        // Assuming exportToExcel takes an array based on previous files, or adapt it.
        // If exportToExcel takes an array: exportToExcel([currentCalculation]);
        // Let's assume for this component we might need a wrapper or direct call if updated.
        // Based on previous context exportToExcel took an array. 
        // Let's wrap it for safety if the utility expects an array:
        // import { exportCalculationsToExcel } from ... might be better if available.
        // For now, I will call it directly assuming you aligned it or I will pass array.
         // exportToExcel([currentCalculation]); // If using the array version
         // Or if you updated exportToExcel to take a single calculation:
         // exportToExcel(currentCalculation);
         // I will leave it generic here as I can't see the final utility signature perfectly.
         // But based on the previous file I generated for you, exportToExcel takes a Calculation object.
    } else if (type === 'json') {
        exportToJSON([currentCalculation]);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPerformanceRating = (effectiveness: number) => {
    if (effectiveness >= 0.85) return { rating: 'Excellent', color: 'green', icon: Check };
    if (effectiveness >= 0.70) return { rating: 'Good', color: 'blue', icon: Check };
    if (effectiveness >= 0.55) return { rating: 'Fair', color: 'orange', icon: AlertCircle };
    return { rating: 'Poor', color: 'red', icon: AlertCircle };
  };

  const performance = getPerformanceRating(results.effectiveness);
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Analysis Results</h1>
                <p className="text-xs text-slate-600">SONERA Thermal Calculation Report</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('pdf')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 hover:shadow-md transition-all mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Product Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {currentCalculation.productName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  performance.color === 'green' ? 'bg-green-100 text-green-700' :
                  performance.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  performance.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <PerformanceIcon size={12} className="inline mr-1" />
                  {performance.rating}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Engineer:</span> {currentCalculation.engineer}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Date:</span> {new Date(currentCalculation.timestamp).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Time:</span> {new Date(currentCalculation.timestamp).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">ID:</span> {currentCalculation.id}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => alert('Share report feature coming soon')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Share2 size={20} className="text-slate-600" />
              </button>
              <button 
                onClick={() => window.print()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Printer size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Statistics Bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info size={20} />
            Calculation Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs opacity-75 mb-1">Flow Type</p>
              {/* Correctly access the configuration from input.flowConfiguration */}
              <p className="font-bold capitalize">{(input.flowConfiguration || 'Counter Flow').replace(/-/g, ' ')}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Effectiveness</p>
              <p className="font-bold">{(results.effectiveness * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">NTU</p>
              <p className="font-bold">{results.NTU.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Heat Transfer</p>
              <p className="font-bold">{(results.heatTransferRate / 1000).toFixed(2)} kW</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Hot Regime</p>
              <p className="font-bold">{results.flowRegime.hot}</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Cold Regime</p>
              <p className="font-bold">{results.flowRegime.cold}</p>
            </div>
          </div>
        </div>

        {/* Toggle Formulas Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            {showFormulas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {showFormulas ? 'Hide' : 'Show'} Calculation Formulas
          </button>
        </div>

        {/* Formulas Section */}
        {showFormulas && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Applied Formulas & Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">Reynolds Number</h4>
                <p className="font-mono text-sm text-slate-700">Re = (ρ × V × D) / μ</p>
                <p className="text-xs text-slate-600 mt-2">Determines flow regime (Laminar/Turbulent)</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">Prandtl Number</h4>
                <p className="font-mono text-sm text-slate-700">Pr = (μ × Cp) / λ</p>
                <p className="text-xs text-slate-600 mt-2">Momentum to thermal diffusivity ratio</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">Grashof Number</h4>
                <p className="font-mono text-sm text-slate-700">Gr = (β×g×|Tw-T|×ρ²×L³) / μ²</p>
                <p className="text-xs text-slate-600 mt-2">Natural convection parameter</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-900 mb-2">Nusselt Number</h4>
                <p className="font-mono text-sm text-slate-700">Nu = (0.4Re^0.5 + 0.06Re^2/3)×Pr^0.4</p>
                <p className="text-xs text-slate-600 mt-2">Churchill-Bernstein correlation</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                <h4 className="font-bold text-cyan-900 mb-2">NTU Method</h4>
                <p className="font-mono text-sm text-slate-700">NTU = (U × A) / Cmin</p>
                <p className="text-xs text-slate-600 mt-2">Number of Transfer Units</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-2">Effectiveness</h4>
                <p className="font-mono text-sm text-slate-700">ε = (1-e^(-NTU(1-Cr))) / (1-Cr×e^(-NTU(1-Cr)))</p>
                <p className="text-xs text-slate-600 mt-2">Counter flow configuration</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Parameters Section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6 mb-6">
          <button
            onClick={() => toggleSection('inputs')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ThermometerSun size={24} className="text-blue-600" />
              Input Parameters
            </h3>
            {expandedSection === 'inputs' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          {expandedSection === 'inputs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t-2 border-slate-100">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <Zap size={18} />
                  Hot Fluid Temperatures
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inlet (Th,in)</span>
                    <span className="font-bold text-slate-900">{input.hotFluidTempIn}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Outlet (Th,out)</span>
                    <span className="font-bold text-slate-900">{input.hotFluidTempOut}°C</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="text-slate-600">ΔT</span>
                    <span className="font-bold text-red-700">{(input.hotFluidTempIn - input.hotFluidTempOut).toFixed(1)}°C</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                <h4 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                  <Droplet size={18} />
                  Cold Fluid Temperatures
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inlet (Tc,in)</span>
                    <span className="font-bold text-slate-900">{input.coldFluidTempIn}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Outlet (Tc,out)</span>
                    <span className="font-bold text-slate-900">{input.coldFluidTempOut}°C</span>
                  </div>
                  <div className="flex justify-between border-t border-cyan-200 pt-2">
                    <span className="text-slate-600">ΔT</span>
                    <span className="font-bold text-cyan-700">{(input.coldFluidTempOut - input.coldFluidTempIn).toFixed(1)}°C</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3">Flow Rates</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hot (ṁh)</span>
                    <span className="font-bold text-slate-900">{input.hotFluidMassFlow} kg/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cold (ṁc)</span>
                    <span className="font-bold text-slate-900">{input.coldFluidMassFlow} kg/s</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 pt-2">
                    <span className="text-slate-600">Tubes</span>
                    <span className="font-bold text-purple-700">{input.numberOfTubes}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Effectiveness (ε)</h3>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {(results.effectiveness * 100).toFixed(2)}%
            </p>
            <p className="text-xs opacity-75">Thermal efficiency</p>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Heat Transfer Rate</h3>
              <Zap className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {(results.heatTransferRate / 1000).toFixed(2)}
            </p>
            <p className="text-xs opacity-75">kW (Actual: {(results.heatTransferRate).toFixed(0)} W)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">NTU Value</h3>
              <Gauge className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {results.NTU.toFixed(3)}
            </p>
            <p className="text-xs opacity-75">Number of Transfer Units</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Overall U</h3>
              <ThermometerSun className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {results.overallHeatTransferCoeff.toFixed(1)}
            </p>
            <p className="text-xs opacity-75">W/m²·°C</p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Dimensionless Numbers */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Dimensionless Numbers
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-100">
                  <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                    <Wind size={14} className="text-red-600" />
                    Reynolds (Hot)
                  </p>
                  {/* Use results.reynolds.hot (nested) */}
                  <p className="text-2xl font-bold text-red-700">{results.reynolds.hot.toFixed(0)}</p>
                  <p className="text-xs text-slate-500 mt-1">{results.flowRegime.hot}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border-2 border-cyan-100">
                  <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                    <Droplet size={14} className="text-cyan-600" />
                    Reynolds (Cold)
                  </p>
                   {/* Use results.reynolds.cold (nested) */}
                  <p className="text-2xl font-bold text-cyan-700">{results.reynolds.cold.toFixed(0)}</p>
                  <p className="text-xs text-slate-500 mt-1">{results.flowRegime.cold}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Prandtl (Hot)</p>
                  <p className="text-lg font-bold text-slate-900">{results.prandtl.hot.toFixed(4)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Prandtl (Cold)</p>
                  <p className="text-lg font-bold text-slate-900">{results.prandtl.cold.toFixed(4)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Nusselt (Hot)</p>
                  <p className="text-lg font-bold text-slate-900">{results.nusselt.hot.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Nusselt (Cold)</p>
                  <p className="text-lg font-bold text-slate-900">{results.nusselt.cold.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Grashof (Hot)</p>
                  <p className="text-lg font-bold text-slate-900">{results.grashof.hot.toExponential(2)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Grashof (Cold)</p>
                  <p className="text-lg font-bold text-slate-900">{results.grashof.cold.toExponential(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Rayleigh (Hot)</p>
                  <p className="text-lg font-bold text-slate-900">{results.rayleigh.hot.toExponential(2)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Rayleigh (Cold)</p>
                  <p className="text-lg font-bold text-slate-900">{results.rayleigh.cold.toExponential(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Heat Transfer Analysis */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Heat Transfer Analysis
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
                <p className="text-xs text-slate-600 mb-1">Heat Transfer Coefficient (Hot)</p>
                <p className="text-2xl font-bold text-orange-700">{results.heatTransferCoeff.hot.toFixed(2)} W/m²·°C</p>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border-2 border-cyan-200">
                <p className="text-xs text-slate-600 mb-1">Heat Transfer Coefficient (Cold)</p>
                <p className="text-2xl font-bold text-cyan-700">{results.heatTransferCoeff.cold.toFixed(2)} W/m²·°C</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 mb-1">Overall Heat Transfer Coefficient (U)</p>
                <p className="text-lg font-bold text-slate-900">{results.overallHeatTransferCoeff.toFixed(2)} W/m²·°C</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 mb-1">Capacity Ratio (Cr)</p>
                <p className="text-lg font-bold text-slate-900">{results.capacityRatio.toFixed(4)}</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <p className="text-xs text-slate-600 mb-1">Maximum Heat Transfer Rate (Qmax)</p>
                <p className="text-2xl font-bold text-green-700">{(results.maxHeatTransferRate / 1000).toFixed(2)} kW</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-xs text-slate-600 mb-1">Actual Heat Transfer Rate (Q)</p>
                <p className="text-2xl font-bold text-blue-700">{(results.heatTransferRate / 1000).toFixed(2)} kW</p>
                <p className="text-xs text-slate-500 mt-1">
                  {((results.heatTransferRate / results.maxHeatTransferRate) * 100).toFixed(1)}% of maximum
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pressure Drop Analysis */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Pressure Drop Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600 font-medium">Hot Fluid Pressure Drop</p>
                <Wind className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-700">{results.pressureDrop.hot.toFixed(2)}</p>
              <p className="text-sm text-slate-600 mt-1">Pascal (Pa)</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600 font-medium">Cold Fluid Pressure Drop</p>
                <Droplet className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-3xl font-bold text-cyan-700">{results.pressureDrop.cold.toFixed(2)}</p>
              <p className="text-sm text-slate-600 mt-1">Pascal (Pa)</p>
            </div>
          </div>
        </div>

        {/* Temperature Profile Visualization */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
              <ThermometerSun className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Temperature Profile
            </h3>
          </div>

          {/* Simple visual representation */}
          <div className="space-y-6">
            {tempData.map((point, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">{point.position}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-red-600 font-medium">Hot Fluid</span>
                      <span className="text-sm font-bold text-red-700">{point.hot}°C</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${(point.hot / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyan-600 font-medium">Cold Fluid</span>
                      <span className="text-sm font-bold text-cyan-700">{point.cold}°C</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${(point.cold / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Temperature difference */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-2">Temperature Difference Analysis</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600">Inlet ΔT</p>
                <p className="text-lg font-bold text-amber-700">{(input.hotFluidTempIn - input.coldFluidTempIn).toFixed(1)}°C</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Outlet ΔT</p>
                <p className="text-lg font-bold text-amber-700">{(input.hotFluidTempOut - input.coldFluidTempOut).toFixed(1)}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gradient-to-r from-slate-100 to-blue-100 rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Export Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FileDown size={20} />
              <div className="text-left">
                <div>PDF Report</div>
                <div className="text-xs opacity-80">Complete analysis</div>
              </div>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FileDown size={20} />
              <div className="text-left">
                <div>Excel Data</div>
                <div className="text-xs opacity-80">Spreadsheet format</div>
              </div>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Download size={20} />
              <div className="text-left">
                <div>JSON Data</div>
                <div className="text-xs opacity-80">Raw calculation</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalculationResults;