import { CalculationInput as StoreInput } from '@/store/calculationStore';

// Constants
const RE_CRITICAL_INTERNAL = 2000;
const RE_CRITICAL_EXTERNAL = 5e5;
const RE_TRANSITION_END = 4000;
const GRAVITY = 9.81;

// 1. Update Types to match your UI options
export type HeatExchangerType = 
  | 'counter-flow' 
  | 'parallel-flow' 
  | 'shell-and-tube' 
  | 'cross-flow-both-unmixed' 
  | 'cross-flow-cmax-mixed' 
  | 'cross-flow-cmin-mixed';

// 2. Update Interface to include the configuration
export interface CalculationInput {
  hotFluidDensity: number;
  hotFluidVelocity: number;
  tubeExtDiameter: number;
  hotFluidViscosity: number;
  coldFluidDensity: number;
  coldFluidVelocity: number;
  tubeIntDiameter: number;
  coldFluidViscosity: number;
  hotFluidSpecificHeat: number;
  hotFluidThermalConductivity: number;
  coldFluidSpecificHeat: number;
  coldFluidThermalConductivity: number;
  hotFluidTempIn: number;
  hotFluidTempOut: number;
  coldFluidTempIn: number;
  coldFluidTempOut: number;
  wallTemp: number;
  tubeLength: number;
  gravityCoefficient?: number;
  totalSurfaceArea: number;
  hotFluidMassFlow: number;
  coldFluidMassFlow: number;
  flowConfiguration?: HeatExchangerType; // Added this field
}

export interface CalculationResults {
  reynolds: { hot: number; cold: number };
  prandtl: { hot: number; cold: number };
  grashof: { hot: number; cold: number };
  rayleigh: { hot: number; cold: number };
  nusselt: { hot: number; cold: number };
  heatTransferCoeff: { hot: number; cold: number };
  overallHeatTransferCoeff: number;
  capacityRatio: number;
  NTU: number;
  effectiveness: number;
  heatTransferRate: number;
  maxHeatTransferRate: number;
  pressureDrop: { hot: number; cold: number };
  flowRegime: { hot: 'Laminar' | 'Transitional' | 'Turbulent'; cold: 'Laminar' | 'Transitional' | 'Turbulent' };
  configuration: HeatExchangerType;
  criticalReynolds: { internal: number; external: number };
}

// --- Basic Helper Functions ---

export const calculateReynolds = (
  massFlow: number,
  viscosity: number,
  diameter: number
): number => {
  return (4 * massFlow) / (Math.PI * viscosity * diameter);
};

export const calculateReynoldsFromVelocity = (
  density: number,
  velocity: number,
  diameter: number,
  viscosity: number
): number => {
  return (density * velocity * diameter) / viscosity;
};

export const determineFlowRegime = (
  reynolds: number
): 'Laminar' | 'Transitional' | 'Turbulent' => {
  if (reynolds < RE_CRITICAL_INTERNAL) return 'Laminar';
  if (reynolds < RE_TRANSITION_END) return 'Transitional';
  return 'Turbulent';
};

export const calculatePrandtl = (
  viscosity: number,
  specificHeat: number,
  thermalConductivity: number
): number => {
  return (viscosity * specificHeat) / thermalConductivity;
};

export const calculateBeta = (temperature: number): number => {
  return 1 / (temperature + 273.15);
};

export const calculateGrashof = (
  temperature: number,
  wallTemp: number,
  density: number,
  length: number,
  viscosity: number,
  gravity: number = GRAVITY
): number => {
  const beta = calculateBeta(temperature);
  const tempDiff = Math.abs(wallTemp - temperature);
  const numerator = beta * gravity * tempDiff * Math.pow(density, 2) * Math.pow(length, 3);
  const denominator = Math.pow(viscosity, 2);
  return numerator / denominator;
};

export const calculateRayleigh = (grashof: number, prandtl: number): number => {
  return grashof * prandtl;
};

// --- Nusselt Correlations ---

export const calculateNusseltChurchillBernstein = (
  reynolds: number,
  prandtl: number,
  viscosityRatio: number = 1.0
): number => {
  const term1 = 0.4 * Math.pow(reynolds, 0.5);
  const term2 = 0.06 * Math.pow(reynolds, 2 / 3);
  const term3 = Math.pow(prandtl, 0.4);
  const term4 = Math.pow(viscosityRatio, 0.25);
  return (term1 + term2) * term3 * term4;
};

export const calculateNusseltLaminar = (): number => {
  return 3.66;
};

export const calculateNusseltAlternative = (
  reynolds: number,
  prandtl: number
): number => {
  const term1 = 0.3;
  const numerator = 0.62 * Math.pow(reynolds, 0.5) * Math.pow(prandtl, 1 / 3);
  const denominator = Math.pow(1 + Math.pow(0.4 / prandtl, 2 / 3), 0.25);
  const term2 = numerator / denominator;
  const term3 = Math.pow(1 + Math.pow(reynolds / 282000, 5 / 8), 4 / 5);
  return term1 + term2 * term3;
};

export const calculateHeatTransferCoefficient = (
  nusselt: number,
  thermalConductivity: number,
  diameter: number
): number => {
  return (nusselt * thermalConductivity) / diameter;
};

export const calculateOverallU = (
  hHot: number,
  hCold: number,
  wallResistance: number = 0
): number => {
  return 1 / (1 / hHot + wallResistance + 1 / hCold);
};

export const calculateNTU = (
  overallU: number,
  area: number,
  minCapacity: number
): number => {
  return (overallU * area) / minCapacity;
};

export const calculateCapacityRatio = (
  minCapacity: number,
  maxCapacity: number
): number => {
  return minCapacity / maxCapacity;
};

// --- 3. Updated Effectiveness Logic for Cross-Flows ---

export const getEffectiveness = (
  ntu: number,
  cr: number, // Capacity Ratio
  type: HeatExchangerType
): number => {
  // Safety: prevent negative NTU or divide by zero
  if (ntu <= 0) return 0;

  let eff = 0;

  switch (type) {
    case 'parallel-flow':
      // ε = (1 - exp(-NTU(1 + Cr))) / (1 + Cr)
      eff = (1 - Math.exp(-ntu * (1 + cr))) / (1 + cr);
      break;

    case 'shell-and-tube':
      // TEMA E (One shell pass, 2,4... tube passes)
      // ε = 2 / (1 + Cr + sqrt(1+Cr^2) * (1+exp(-NTU*sqrt...)) / (1-exp(...)))
      {
        const sq = Math.sqrt(1 + cr * cr);
        const expTerm = Math.exp(-ntu * sq);
        const numerator = 1 + expTerm;
        const denominator = 1 - expTerm;
        eff = 2 * (1 / (1 + cr + sq * (numerator / denominator)));
      }
      break;

    case 'cross-flow-both-unmixed':
      // ε = 1 - exp[ (1/Cr) * (NTU)^0.22 * { exp[ -Cr * (NTU)^0.78 ] - 1 } ]
      {
         const exponent = (Math.pow(ntu, 0.22) / cr) * (Math.exp(-cr * Math.pow(ntu, 0.78)) - 1);
         eff = 1 - Math.exp(exponent);
      }
      break;

    case 'cross-flow-cmax-mixed':
      // Cmax mixed, Cmin unmixed
      // ε = (1/Cr) * (1 - exp{ -Cr * [1 - exp(-NTU)] })
      {
        const inner = 1 - Math.exp(-ntu);
        eff = (1 / cr) * (1 - Math.exp(-cr * inner));
      }
      break;
    
    case 'cross-flow-cmin-mixed':
      // Cmin mixed, Cmax unmixed
      // ε = 1 - exp{ -(1/Cr) * [1 - exp(-Cr * NTU)] }
      {
        const inner = 1 - Math.exp(-cr * ntu);
        eff = 1 - Math.exp(-(1 / cr) * inner);
      }
      break;

    case 'counter-flow':
    default:
      // ε = (1 - exp(-NTU(1-Cr))) / (1 - Cr*exp(-NTU(1-Cr)))
      if (cr < 1) {
        const expTerm = Math.exp(-ntu * (1 - cr));
        eff = (1 - expTerm) / (1 - cr * expTerm);
      } else {
        // When Cr = 1
        eff = ntu / (1 + ntu);
      }
      break;
  }

  // Clamp result between 0 and 1 (mathematical safety)
  return Math.max(0, Math.min(1, eff));
};

export const calculateFrictionFactorBlasius = (reynolds: number): number => {
  return 0.079 / Math.pow(reynolds, 0.25);
};

export const calculateFrictionFactorLaminar = (reynolds: number): number => {
  return 64 / reynolds;
};

export const calculatePressureDrop = (
  frictionFactor: number,
  length: number,
  diameter: number,
  density: number,
  velocity: number
): number => {
  return (frictionFactor * length * density * Math.pow(velocity, 2)) / (2 * diameter);
};

// --- 4. Main Calculation Function ---

export const performCalculations = (
  input: CalculationInput
): CalculationResults => {
  
  // Use the configuration from input, default to counter-flow if missing
  const exchangerType = input.flowConfiguration || 'counter-flow';

  const reynoldsHot = calculateReynoldsFromVelocity(
    input.hotFluidDensity,
    input.hotFluidVelocity,
    input.tubeExtDiameter,
    input.hotFluidViscosity
  );
  
  const reynoldsCold = calculateReynoldsFromVelocity(
    input.coldFluidDensity,
    input.coldFluidVelocity,
    input.tubeIntDiameter,
    input.coldFluidViscosity
  );

  const flowRegimeHot = determineFlowRegime(reynoldsHot);
  const flowRegimeCold = determineFlowRegime(reynoldsCold);

  const prandtlHot = calculatePrandtl(
    input.hotFluidViscosity,
    input.hotFluidSpecificHeat,
    input.hotFluidThermalConductivity
  );

  const prandtlCold = calculatePrandtl(
    input.coldFluidViscosity,
    input.coldFluidSpecificHeat,
    input.coldFluidThermalConductivity
  );

  const avgHotTemp = (input.hotFluidTempIn + input.hotFluidTempOut) / 2;
  const avgColdTemp = (input.coldFluidTempIn + input.coldFluidTempOut) / 2;

  const grashofHot = calculateGrashof(
    avgHotTemp,
    input.wallTemp,
    input.hotFluidDensity,
    input.tubeLength,
    input.hotFluidViscosity,
    input.gravityCoefficient
  );

  const grashofCold = calculateGrashof(
    avgColdTemp,
    input.wallTemp,
    input.coldFluidDensity,
    input.tubeLength,
    input.coldFluidViscosity,
    input.gravityCoefficient
  );

  const rayleighHot = calculateRayleigh(grashofHot, prandtlHot);
  const rayleighCold = calculateRayleigh(grashofCold, prandtlCold);

  let nusseltHot: number;
  let nusseltCold: number;

  if (flowRegimeHot === 'Laminar') {
    nusseltHot = calculateNusseltLaminar();
  } else {
    nusseltHot = calculateNusseltChurchillBernstein(reynoldsHot, prandtlHot);
  }

  if (flowRegimeCold === 'Laminar') {
    nusseltCold = calculateNusseltLaminar();
  } else {
    nusseltCold = calculateNusseltAlternative(reynoldsCold, prandtlCold);
  }

  const hHot = calculateHeatTransferCoefficient(
    nusseltHot,
    input.hotFluidThermalConductivity,
    input.tubeExtDiameter
  );

  const hCold = calculateHeatTransferCoefficient(
    nusseltCold,
    input.coldFluidThermalConductivity,
    input.tubeIntDiameter
  );

  const overallU = calculateOverallU(hHot, hCold);

  const capacityHot = input.hotFluidMassFlow * input.hotFluidSpecificHeat;
  const capacityCold = input.coldFluidMassFlow * input.coldFluidSpecificHeat;
  const minCapacity = Math.min(capacityHot, capacityCold);
  const maxCapacity = Math.max(capacityHot, capacityCold);
  const capacityRatio = calculateCapacityRatio(minCapacity, maxCapacity);

  const ntu = calculateNTU(overallU, input.totalSurfaceArea, minCapacity);

  // Calculate effectiveness using the specific type
  const effectiveness = getEffectiveness(ntu, capacityRatio, exchangerType);

  const maxHeatTransferRate = minCapacity * (input.hotFluidTempIn - input.coldFluidTempIn);
  const heatTransferRate = effectiveness * maxHeatTransferRate;

  const frictionFactorHot = flowRegimeHot === 'Laminar' 
    ? calculateFrictionFactorLaminar(reynoldsHot)
    : calculateFrictionFactorBlasius(reynoldsHot);

  const frictionFactorCold = flowRegimeCold === 'Laminar'
    ? calculateFrictionFactorLaminar(reynoldsCold)
    : calculateFrictionFactorBlasius(reynoldsCold);

  const pressureDropHot = calculatePressureDrop(
    frictionFactorHot,
    input.tubeLength,
    input.tubeExtDiameter,
    input.hotFluidDensity,
    input.hotFluidVelocity
  );

  const pressureDropCold = calculatePressureDrop(
    frictionFactorCold,
    input.tubeLength,
    input.tubeIntDiameter,
    input.coldFluidDensity,
    input.coldFluidVelocity
  );

  return {
    reynolds: {
      hot: reynoldsHot,
      cold: reynoldsCold
    },
    prandtl: {
      hot: prandtlHot,
      cold: prandtlCold
    },
    grashof: {
      hot: grashofHot,
      cold: grashofCold
    },
    rayleigh: {
      hot: rayleighHot,
      cold: rayleighCold
    },
    nusselt: {
      hot: nusseltHot,
      cold: nusseltCold
    },
    heatTransferCoeff: {
      hot: hHot,
      cold: hCold
    },
    overallHeatTransferCoeff: overallU,
    capacityRatio: capacityRatio,
    NTU: ntu,
    effectiveness: effectiveness,
    heatTransferRate: heatTransferRate,
    maxHeatTransferRate: maxHeatTransferRate,
    pressureDrop: {
      hot: pressureDropHot,
      cold: pressureDropCold
    },
    flowRegime: {
      hot: flowRegimeHot,
      cold: flowRegimeCold
    },
    configuration: exchangerType,
    criticalReynolds: {
      internal: RE_CRITICAL_INTERNAL,
      external: RE_CRITICAL_EXTERNAL
    }
  };
};