import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export interface CalculationResults {
  reynoldsHot: number;
  reynoldsCold: number;
  prandtlHot: number;
  prandtlCold: number;
  grashofHot: number;
  grashofCold: number;
  rayleighHot: number;
  rayleighCold: number;
  nusseltHot: number;
  nusseltCold: number;
  effectiveness: number;
  ntu: number;
  heatTransferRate: number;
  pressureDropHot: number;
  pressureDropCold: number;
  configuration: string;
  flowRegime: string;
}

export interface Calculation {
  id: string;
  timestamp: string;
  engineer: string;
  productName: string;
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
      name: 'soneras-calculations',
    }
  )
);
