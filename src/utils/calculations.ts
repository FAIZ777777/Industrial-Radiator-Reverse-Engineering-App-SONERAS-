import { CalculationInput, CalculationResults } from '@/store/calculationStore';

// Reynolds Number Calculation
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

// Prandtl Number Calculation
export const calculatePrandtl = (
  viscosity: number,
  specificHeat: number,
  thermalConductivity: number
): number => {
  return (viscosity * specificHeat) / thermalConductivity;
};

// Grashof Number Calculation
export const calculateGrashof = (
  temperature: number,
  wallTemp: number,
  density: number,
  length: number,
  viscosity: number,
  gravity: number
): number => {
  const beta = 1 / temperature;
  const numerator = beta * gravity * Math.abs(wallTemp - temperature) * Math.pow(density, 2) * Math.pow(length, 3);
  const denominator = Math.pow(viscosity, 2);
  return numerator / denominator;
};

// Rayleigh Number Calculation
export const calculateRayleigh = (grashof: number, prandtl: number): number => {
  return grashof * prandtl;
};

// Nusselt Number Calculation (Churchill-Bernstein for external flow over cylinder)
export const calculateNusseltChurchillBernstein = (
  reynolds: number,
  prandtl: number
): number => {
  const term1 = 0.4 * Math.pow(reynolds, 0.5);
  const term2 = 0.06 * Math.pow(reynolds, 2 / 3);
  const term3 = Math.pow(prandtl, 0.4);
  return (term1 + term2) * term3;
};

// Nusselt Number for laminar flow in pipe
export const calculateNusseltLaminar = (): number => {
  return 3.66;
};

// Nusselt Number (Simplified formula for external flow)
export const calculateNusseltSimplified = (
  reynolds: number,
  prandtl: number
): number => {
  const term1 = 0.3;
  const term2 = (0.62 * Math.pow(reynolds, 0.5) * Math.pow(prandtl, 1 / 3)) /
    Math.pow(1 + Math.pow(0.4 * prandtl, 2 / 3), 0.25);
  const term3 = Math.pow(1 + Math.pow(reynolds / 282000, 5 / 8), 4 / 5);
  return term1 + term2 * term3;
};

// Heat Transfer Coefficient
export const calculateHeatTransferCoefficient = (
  nusselt: number,
  thermalConductivity: number,
  diameter: number
): number => {
  return (nusselt * thermalConductivity) / diameter;
};

// NTU (Number of Transfer Units)
export const calculateNTU = (
  overallHeatTransferCoeff: number,
  area: number,
  minCapacity: number
): number => {
  return (overallHeatTransferCoeff * area) / minCapacity;
};

// Effectiveness for Counter Flow
export const calculateEffectivenessCounterFlow = (
  ntu: number,
  capacityRatio: number
): number => {
  if (capacityRatio === 1) {
    return ntu / (1 + ntu);
  }
  const numerator = 1 - Math.exp(-ntu * (1 - capacityRatio));
  const denominator = 1 - capacityRatio * Math.exp(-ntu * (1 - capacityRatio));
  return numerator / denominator;
};

// Effectiveness for Parallel Flow
export const calculateEffectivenessParallelFlow = (
  ntu: number,
  capacityRatio: number
): number => {
  const numerator = 1 - Math.exp(-ntu * (1 + capacityRatio));
  const denominator = 1 + capacityRatio;
  return numerator / denominator;
};

// Pressure Drop Calculation
export const calculatePressureDrop = (
  frictionFactor: number,
  length: number,
  diameter: number,
  density: number,
  velocity: number
): number => {
  return (frictionFactor * length * density * Math.pow(velocity, 2)) / (2 * diameter);
};

// Main Calculation Function
export const performCalculations = (
  input: CalculationInput
): CalculationResults => {
  // Step 1: Calculate Reynolds Numbers
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

  // Determine flow regime
  const flowRegime = reynoldsHot < 2000 || reynoldsCold < 2000 ? 'Laminar' : 'Turbulent';

  // Step 2: Calculate Prandtl Numbers
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

  // Step 3: Calculate Grashof Numbers
  const avgHotTemp = (input.hotFluidTempIn + input.hotFluidTempOut) / 2 + 273.15;
  const avgColdTemp = (input.coldFluidTempIn + input.coldFluidTempOut) / 2 + 273.15;

  const grashofHot = calculateGrashof(
    avgHotTemp,
    input.wallTemp + 273.15,
    input.hotFluidDensity,
    input.tubeLength,
    input.hotFluidViscosity,
    input.gravityCoefficient
  );

  const grashofCold = calculateGrashof(
    avgColdTemp,
    input.wallTemp + 273.15,
    input.coldFluidDensity,
    input.tubeLength,
    input.coldFluidViscosity,
    input.gravityCoefficient
  );

  // Step 4: Calculate Rayleigh Numbers
  const rayleighHot = calculateRayleigh(grashofHot, prandtlHot);
  const rayleighCold = calculateRayleigh(grashofCold, prandtlCold);

  // Step 5: Calculate Nusselt Numbers
  let nusseltHot: number;
  let nusseltCold: number;

  if (flowRegime === 'Laminar') {
    nusseltHot = calculateNusseltLaminar();
    nusseltCold = calculateNusseltLaminar();
  } else {
    nusseltHot = calculateNusseltChurchillBernstein(reynoldsHot, prandtlHot);
    nusseltCold = calculateNusseltSimplified(reynoldsCold, prandtlCold);
  }

  // Step 6: Calculate Heat Transfer Coefficients
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

  // Overall Heat Transfer Coefficient (simplified - series resistance)
  const overallU = 1 / (1 / hHot + 1 / hCold);

  // Step 7: Calculate Heat Capacities
  const capacityHot = input.hotFluidMassFlow * input.hotFluidSpecificHeat;
  const capacityCold = input.coldFluidMassFlow * input.coldFluidSpecificHeat;
  const minCapacity = Math.min(capacityHot, capacityCold);
  const maxCapacity = Math.max(capacityHot, capacityCold);
  const capacityRatio = minCapacity / maxCapacity;

  // Step 8: Calculate NTU
  const ntu = calculateNTU(overallU, input.totalSurfaceArea, minCapacity);

  // Step 9: Calculate Effectiveness (Counter Flow assumed)
  const effectiveness = calculateEffectivenessCounterFlow(ntu, capacityRatio);
  const configuration = 'Counter Flow (E-14)';

  // Step 10: Calculate Heat Transfer Rate
  const maxHeatTransfer = minCapacity * (input.hotFluidTempIn - input.coldFluidTempIn);
  const heatTransferRate = effectiveness * maxHeatTransfer;

  // Step 11: Calculate Pressure Drops (simplified)
  const frictionFactor = 0.079 / Math.pow(reynoldsHot, 0.25); // Blasius equation for turbulent
  const pressureDropHot = calculatePressureDrop(
    frictionFactor,
    input.tubeLength,
    input.tubeExtDiameter,
    input.hotFluidDensity,
    input.hotFluidVelocity
  );

  const pressureDropCold = calculatePressureDrop(
    frictionFactor,
    input.tubeLength,
    input.tubeIntDiameter,
    input.coldFluidDensity,
    input.coldFluidVelocity
  );

  return {
    reynoldsHot,
    reynoldsCold,
    prandtlHot,
    prandtlCold,
    grashofHot,
    grashofCold,
    rayleighHot,
    rayleighCold,
    nusseltHot,
    nusseltCold,
    effectiveness,
    ntu,
    heatTransferRate,
    pressureDropHot,
    pressureDropCold,
    configuration,
    flowRegime,
  };
};
