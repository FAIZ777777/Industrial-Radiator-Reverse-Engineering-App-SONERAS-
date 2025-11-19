import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Update these types to match EXACTLY what is in your UI (NewCalculation.tsx)
export type HeatExchangerType = 
  | 'counter-flow' 
  | 'parallel-flow' 
  | 'shell-and-tube' 
  | 'cross-flow-both-unmixed' 
  | 'cross-flow-cmax-mixed' 
  | 'cross-flow-cmin-mixed';

export interface CalculationInput {
  // Thermal Properties
  hotFluidTempIn: number;
  hotFluidTempOut: number;
  coldFluidTempIn: number;
  coldFluidTempOut: number;
  hotFluidMassFlow: number;
  coldFluidMassFlow: number;
  wallTemp: number;

  // Hot Fluid Properties
  hotFluidViscosity: number;
  hotFluidDensity: number;
  hotFluidSpecificHeat: number;
  hotFluidThermalConductivity: number;

  // Cold Fluid Properties
  coldFluidViscosity: number;
  coldFluidDensity: number;
  coldFluidSpecificHeat: number;
  coldFluidThermalConductivity: number;

  // Geometric Parameters
  tubeExtDiameter: number;
  tubeIntDiameter: number;
  tubeLength: number;
  numberOfTubes: number;
  totalSurfaceArea: number;

  // Operating Conditions
  hotFluidVelocity: number;
  coldFluidVelocity: number;
  gravityCoefficient: number;

  // --- NEW FIELDS ADDED HERE ---
  // This connects the dropdown in UI to the logic
  flowConfiguration: HeatExchangerType; 
  
  // These were in your formData in NewCalculation.tsx but missing here
  tubeThermalConductivity?: number;
  foulingFactorHot?: number;
  foulingFactorCold?: number;
}

export interface CalculationResults {
  reynolds: {
    hot: number;
    cold: number;
  };
  prandtl: {
    hot: number;
    cold: number;
  };
  grashof: {
    hot: number;
    cold: number;
  };
  rayleigh: {
    hot: number;
    cold: number;
  };
  nusselt: {
    hot: number;
    cold: number;
  };
  heatTransferCoeff: {
    hot: number;
    cold: number;
  };
  overallHeatTransferCoeff: number;
  capacityRatio: number;
  NTU: number;
  effectiveness: number;
  heatTransferRate: number;
  maxHeatTransferRate: number;
  pressureDrop: {
    hot: number;
    cold: number;
  };
  flowRegime: {
    hot: 'Laminar' | 'Transitional' | 'Turbulent';
    cold: 'Laminar' | 'Transitional' | 'Turbulent';
  };
  configuration: HeatExchangerType;
  criticalReynolds: {
    internal: number;
    external: number;
  };
}

export interface Calculation {
  id: string;
  timestamp: string;
  engineer: string;
  productName: string;
  // Removed 'exchangerType' from here because it is now inside 'input.flowConfiguration'
  // This prevents the error where you weren't passing it at the root level.
  input: CalculationInput;
  results: CalculationResults;
}

interface CalculationStore {
  calculations: Calculation[];
  currentCalculation: Calculation | null;
  addCalculation: (calculation: Calculation) => void;
  setCurrentCalculation: (calculation: Calculation | null) => void;
  deleteCalculation: (id: string) => void;
  clearHistory: () => void;
}

export const useCalculationStore = create<CalculationStore>()(
  persist(
    (set) => ({
      calculations: [],
      currentCalculation: null,
      addCalculation: (calculation) =>
        set((state) => ({
          calculations: [calculation, ...state.calculations],
        })),
      setCurrentCalculation: (calculation) =>
        set({ currentCalculation: calculation }),
      deleteCalculation: (id) =>
        set((state) => ({
          calculations: state.calculations.filter((calc) => calc.id !== id),
        })),
      clearHistory: () => set({ calculations: [] }),
    }),
    {
      name: 'sonera-calculations',
    }
  )
);