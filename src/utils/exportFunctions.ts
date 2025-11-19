// ============================================================================
// FILE: utils/exportFunctions.ts
// Complete export utilities for SONERA calculations with jsPDF and XLSX
// ============================================================================

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Calculation } from '@/store/calculationStore';

// ============================================================================
// PDF Export with jsPDF (Professional Report)
// ============================================================================

export const exportToPDF = (calculation: Calculation) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, color: number[] = [59, 130, 246]) => {
    checkPageBreak(15);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, yPos + 6);
    doc.setTextColor(0, 0, 0);
    yPos += 12;
  };

  // ========== HEADER ==========
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ SONERA', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Heat Exchanger Thermal Analysis Report', pageWidth / 2, 25, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  yPos = 45;

  // ========== CALCULATION INFO ==========
  addSectionHeader('📋 Calculation Information', [16, 185, 129]);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Product Name:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.productName, 55, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Engineer:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.engineer, 55, yPos);
  yPos += 7;

  const date = new Date(calculation.timestamp);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(date.toLocaleDateString() + ' ' + date.toLocaleTimeString(), 55, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Calculation ID:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.id, 55, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Exchanger Type:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  // FIX: Use input.flowConfiguration instead of root property
  const typeStr = (calculation.input.flowConfiguration || 'Counter Flow').replace(/-/g, ' ').replace('flow', ' Flow').toUpperCase();
  doc.text(typeStr, 55, yPos);
  yPos += 10;

  // ========== KEY PERFORMANCE INDICATORS ==========
  addSectionHeader('🎯 Key Performance Indicators', [239, 68, 68]);
  
  const kpis = [
    { label: 'Effectiveness', value: (calculation.results.effectiveness * 100).toFixed(2) + '%', color: [16, 185, 129] },
    { label: 'Heat Transfer', value: (calculation.results.heatTransferRate / 1000).toFixed(2) + ' kW', color: [245, 158, 11] },
    { label: 'NTU', value: calculation.results.NTU.toFixed(3), color: [59, 130, 246] },
    { label: 'Overall U', value: calculation.results.overallHeatTransferCoeff.toFixed(2) + ' W/m²·°C', color: [139, 92, 246] }
  ];

  const boxWidth = (pageWidth - 40) / 4;
  const boxHeight = 20;
  const startX = 15;
  
  checkPageBreak(boxHeight + 5);
  
  kpis.forEach((kpi, index) => {
    const x = startX + (index * (boxWidth + 3));
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(kpi.label, x + boxWidth / 2, yPos + 7, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.value, x + boxWidth / 2, yPos + 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
  });
  
  doc.setTextColor(0, 0, 0);
  yPos += boxHeight + 10;

  // ========== INPUT PARAMETERS ==========
  addSectionHeader('🌡️ Input Parameters', [59, 130, 246]);
  
  const inputParams = [
    ['Parameter', 'Hot Fluid', 'Cold Fluid'],
    ['Inlet Temperature', calculation.input.hotFluidTempIn + ' °C', calculation.input.coldFluidTempIn + ' °C'],
    ['Outlet Temperature', calculation.input.hotFluidTempOut + ' °C', calculation.input.coldFluidTempOut + ' °C'],
    ['Mass Flow Rate', calculation.input.hotFluidMassFlow + ' kg/s', calculation.input.coldFluidMassFlow + ' kg/s'],
    ['Viscosity', calculation.input.hotFluidViscosity + ' kg/m·s', calculation.input.coldFluidViscosity + ' kg/m·s'],
    ['Density', calculation.input.hotFluidDensity + ' kg/m³', calculation.input.coldFluidDensity + ' kg/m³'],
    ['Specific Heat', calculation.input.hotFluidSpecificHeat + ' J/kg·°C', calculation.input.coldFluidSpecificHeat + ' J/kg·°C'],
    ['Thermal Conductivity', calculation.input.hotFluidThermalConductivity + ' W/m·°C', calculation.input.coldFluidThermalConductivity + ' W/m·°C'],
    // ADDED: Fouling Factors
    ['Fouling Factor', (calculation.input.foulingFactorHot || 0) + ' m²·K/W', (calculation.input.foulingFactorCold || 0) + ' m²·K/W']
  ];

  doc.setFontSize(9);
  const colWidths = [60, 60, 60];
  const tableStartX = 15;
  
  checkPageBreak(inputParams.length * 7 + 10);
  
  inputParams.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(tableStartX, yPos - 5, colWidths.reduce((a, b) => a + b, 0), 7, 'F');
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    row.forEach((cell, colIndex) => {
      const x = tableStartX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
      doc.text(cell, x + 2, yPos);
    });
    
    yPos += 7;
    
    if (rowIndex === 0) {
      doc.setDrawColor(200, 200, 200);
      doc.line(tableStartX, yPos - 1, tableStartX + colWidths.reduce((a, b) => a + b, 0), yPos - 1);
    }
  });
  
  yPos += 5;

  // ========== GEOMETRIC PARAMETERS ==========
  checkPageBreak(30);
  addSectionHeader('📐 Geometric Parameters', [139, 92, 246]);
  
  const geomParams = [
    ['Tube External Diameter', calculation.input.tubeExtDiameter + ' m'],
    ['Tube Internal Diameter', calculation.input.tubeIntDiameter + ' m'],
    ['Tube Length', calculation.input.tubeLength + ' m'],
    ['Number of Tubes', calculation.input.numberOfTubes.toString()],
    ['Total Surface Area', calculation.input.totalSurfaceArea + ' m²'],
    ['Wall Temperature', calculation.input.wallTemp + ' °C'],
    // ADDED: Tube Conductivity
    ['Tube Material Cond.', (calculation.input.tubeThermalConductivity || 385) + ' W/m·K']
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const geomColWidth = (pageWidth - 30) / 2;
  geomParams.forEach((param, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 15 + (col * geomColWidth);
    const y = yPos + (row * 7);
    
    doc.setFont('helvetica', 'bold');
    doc.text(param[0] + ':', x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(param[1], x + 55, y);
  });
  
  yPos += Math.ceil(geomParams.length / 2) * 7 + 5;

  // ========== NEW PAGE FOR RESULTS ==========
  doc.addPage();
  yPos = 20;

  // ========== DIMENSIONLESS NUMBERS ==========
  addSectionHeader('📊 Dimensionless Numbers', [59, 130, 246]);
  
  const dimensionless = [
    ['Parameter', 'Hot Fluid', 'Cold Fluid'],
    ['Reynolds Number (Re)', calculation.results.reynolds.hot.toFixed(2), calculation.results.reynolds.cold.toFixed(2)],
    ['Prandtl Number (Pr)', calculation.results.prandtl.hot.toFixed(4), calculation.results.prandtl.cold.toFixed(4)],
    ['Grashof Number (Gr)', calculation.results.grashof.hot.toExponential(2), calculation.results.grashof.cold.toExponential(2)],
    ['Rayleigh Number (Ra)', calculation.results.rayleigh.hot.toExponential(2), calculation.results.rayleigh.cold.toExponential(2)],
    ['Nusselt Number (Nu)', calculation.results.nusselt.hot.toFixed(2), calculation.results.nusselt.cold.toFixed(2)],
    ['Flow Regime', calculation.results.flowRegime.hot, calculation.results.flowRegime.cold]
  ];

  dimensionless.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(tableStartX, yPos - 5, colWidths.reduce((a, b) => a + b, 0), 7, 'F');
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    row.forEach((cell, colIndex) => {
      const x = tableStartX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
      doc.text(cell, x + 2, yPos);
    });
    
    yPos += 7;
    
    if (rowIndex === 0) {
      doc.setDrawColor(200, 200, 200);
      doc.line(tableStartX, yPos - 1, tableStartX + colWidths.reduce((a, b) => a + b, 0), yPos - 1);
    }
  });
  
  yPos += 5;

  // ========== HEAT TRANSFER ANALYSIS ==========
  addSectionHeader('🔥 Heat Transfer Analysis', [245, 158, 11]);
  
  const heatTransfer = [
    ['Heat Transfer Coeff. (Hot)', calculation.results.heatTransferCoeff.hot.toFixed(2) + ' W/m²·°C'],
    ['Heat Transfer Coeff. (Cold)', calculation.results.heatTransferCoeff.cold.toFixed(2) + ' W/m²·°C'],
    ['Overall Heat Transfer Coeff. (U)', calculation.results.overallHeatTransferCoeff.toFixed(2) + ' W/m²·°C'],
    ['Capacity Ratio (Cr)', calculation.results.capacityRatio.toFixed(4)],
    ['Number of Transfer Units (NTU)', calculation.results.NTU.toFixed(4)],
    ['Effectiveness (ε)', (calculation.results.effectiveness * 100).toFixed(2) + ' %'],
    ['Max Heat Transfer Rate (Qmax)', calculation.results.maxHeatTransferRate.toFixed(2) + ' W (' + (calculation.results.maxHeatTransferRate / 1000).toFixed(2) + ' kW)'],
    ['Actual Heat Transfer Rate (Q)', calculation.results.heatTransferRate.toFixed(2) + ' W (' + (calculation.results.heatTransferRate / 1000).toFixed(2) + ' kW)'],
    ['Heat Transfer Efficiency', ((calculation.results.heatTransferRate / calculation.results.maxHeatTransferRate) * 100).toFixed(1) + ' %']
  ];

  doc.setFontSize(9);
  heatTransfer.forEach(param => {
    checkPageBreak(7);
    doc.setFont('helvetica', 'bold');
    doc.text(param[0] + ':', 15, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(param[1], 100, yPos);
    yPos += 7;
  });
  
  yPos += 3;

  // ========== PRESSURE DROP ==========
  addSectionHeader('💨 Pressure Drop Analysis', [139, 92, 246]);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Hot Fluid Pressure Drop:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.results.pressureDrop.hot.toFixed(2) + ' Pa', 100, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Cold Fluid Pressure Drop:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.results.pressureDrop.cold.toFixed(2) + ' Pa', 100, yPos);
  yPos += 10;

  // ========== FOOTER ==========
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('SONERA - Advanced Heat Exchanger Thermal Analysis System', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('Generated on ' + new Date().toLocaleString(), pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text('© ' + new Date().getFullYear() + ' SONERA Engineering Suite', pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Save the PDF
  doc.save(`SONERA_Report_${calculation.productName.replace(/\s+/g, '_')}_${calculation.id}.pdf`);
};

// ============================================================================
// Excel Export with XLSX (Multiple Sheets)
// ============================================================================

export const exportToExcel = (calculation: Calculation) => {
  const workbook = XLSX.utils.book_new();

  // FIX: Use input.flowConfiguration
  const configType = (calculation.input.flowConfiguration || 'Counter Flow').replace(/-/g, ' ').toUpperCase();

  // ========== SHEET 1: SUMMARY ==========
  const summaryData = [
    ['SONERA Heat Exchanger Analysis Report'],
    [''],
    ['Calculation Information'],
    ['Product Name', calculation.productName],
    ['Engineer', calculation.engineer],
    ['Date', new Date(calculation.timestamp).toLocaleDateString()],
    ['Time', new Date(calculation.timestamp).toLocaleTimeString()],
    ['Calculation ID', calculation.id],
    ['Exchanger Type', configType],
    [''],
    ['Key Performance Indicators'],
    ['Effectiveness', (calculation.results.effectiveness * 100).toFixed(2) + ' %'],
    ['NTU', calculation.results.NTU.toFixed(4)],
    ['Heat Transfer Rate', calculation.results.heatTransferRate.toFixed(2) + ' W'],
    ['Heat Transfer Rate (kW)', (calculation.results.heatTransferRate / 1000).toFixed(2) + ' kW'],
    ['Overall U', calculation.results.overallHeatTransferCoeff.toFixed(2) + ' W/m²·°C']
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ width: 30 }, { width: 40 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // ========== SHEET 2: INPUT PARAMETERS ==========
  const inputData = [
    ['Input Parameters'],
    [''],
    ['Parameter', 'Hot Fluid', 'Cold Fluid', 'Unit'],
    ['Inlet Temperature', calculation.input.hotFluidTempIn, calculation.input.coldFluidTempIn, '°C'],
    ['Outlet Temperature', calculation.input.hotFluidTempOut, calculation.input.coldFluidTempOut, '°C'],
    ['Mass Flow Rate', calculation.input.hotFluidMassFlow, calculation.input.coldFluidMassFlow, 'kg/s'],
    ['Velocity', calculation.input.hotFluidVelocity, calculation.input.coldFluidVelocity, 'm/s'],
    ['Viscosity', calculation.input.hotFluidViscosity, calculation.input.coldFluidViscosity, 'kg/m·s'],
    ['Density', calculation.input.hotFluidDensity, calculation.input.coldFluidDensity, 'kg/m³'],
    ['Specific Heat', calculation.input.hotFluidSpecificHeat, calculation.input.coldFluidSpecificHeat, 'J/kg·°C'],
    ['Thermal Conductivity', calculation.input.hotFluidThermalConductivity, calculation.input.coldFluidThermalConductivity, 'W/m·°C'],
    // ADDED: Fouling
    ['Fouling Factor', calculation.input.foulingFactorHot || 0, calculation.input.foulingFactorCold || 0, 'm²·K/W'],
    [''],
    ['Geometric Parameters'],
    ['Tube External Diameter', calculation.input.tubeExtDiameter, '', 'm'],
    ['Tube Internal Diameter', calculation.input.tubeIntDiameter, '', 'm'],
    ['Tube Length', calculation.input.tubeLength, '', 'm'],
    ['Number of Tubes', calculation.input.numberOfTubes, '', ''],
    ['Total Surface Area', calculation.input.totalSurfaceArea, '', 'm²'],
    ['Wall Temperature', calculation.input.wallTemp, '', '°C'],
    ['Gravity Coefficient', calculation.input.gravityCoefficient, '', 'm/s²'],
    // ADDED: Tube Cond
    ['Tube Conductivity', calculation.input.tubeThermalConductivity || 385, '', 'W/m·K']
  ];

  const inputSheet = XLSX.utils.aoa_to_sheet(inputData);
  inputSheet['!cols'] = [{ width: 30 }, { width: 20 }, { width: 20 }, { width: 15 }];
  XLSX.utils.book_append_sheet(workbook, inputSheet, 'Input Parameters');

  // ========== SHEET 3: RESULTS ==========
  const resultsData = [
    ['Calculation Results'],
    [''],
    ['Dimensionless Numbers', 'Hot Fluid', 'Cold Fluid', 'Unit'],
    ['Reynolds Number (Re)', calculation.results.reynolds.hot.toFixed(4), calculation.results.reynolds.cold.toFixed(4), ''],
    ['Prandtl Number (Pr)', calculation.results.prandtl.hot.toFixed(4), calculation.results.prandtl.cold.toFixed(4), ''],
    ['Grashof Number (Gr)', calculation.results.grashof.hot.toExponential(2), calculation.results.grashof.cold.toExponential(2), ''],
    ['Rayleigh Number (Ra)', calculation.results.rayleigh.hot.toExponential(2), calculation.results.rayleigh.cold.toExponential(2), ''],
    ['Nusselt Number (Nu)', calculation.results.nusselt.hot.toFixed(4), calculation.results.nusselt.cold.toFixed(4), ''],
    ['Flow Regime', calculation.results.flowRegime.hot, calculation.results.flowRegime.cold, ''],
    [''],
    ['Heat Transfer Analysis', 'Value', '', 'Unit'],
    ['Heat Transfer Coeff. (Hot)', calculation.results.heatTransferCoeff.hot.toFixed(2), '', 'W/m²·°C'],
    ['Heat Transfer Coeff. (Cold)', calculation.results.heatTransferCoeff.cold.toFixed(2), '', 'W/m²·°C'],
    ['Overall Heat Transfer Coeff. (U)', calculation.results.overallHeatTransferCoeff.toFixed(2), '', 'W/m²·°C'],
    ['Capacity Ratio (Cr)', calculation.results.capacityRatio.toFixed(4), '', ''],
    ['Number of Transfer Units (NTU)', calculation.results.NTU.toFixed(4), '', ''],
    ['Effectiveness (ε)', calculation.results.effectiveness.toFixed(4), (calculation.results.effectiveness * 100).toFixed(2) + '%', ''],
    ['Max Heat Transfer Rate (Qmax)', calculation.results.maxHeatTransferRate.toFixed(2), (calculation.results.maxHeatTransferRate / 1000).toFixed(2), 'W / kW'],
    ['Actual Heat Transfer Rate (Q)', calculation.results.heatTransferRate.toFixed(2), (calculation.results.heatTransferRate / 1000).toFixed(2), 'W / kW'],
    ['Heat Transfer Efficiency', ((calculation.results.heatTransferRate / calculation.results.maxHeatTransferRate) * 100).toFixed(2), '', '%'],
    [''],
    ['Pressure Drop Analysis', 'Value', '', 'Unit'],
    ['Hot Fluid Pressure Drop', calculation.results.pressureDrop.hot.toFixed(2), '', 'Pa'],
    ['Cold Fluid Pressure Drop', calculation.results.pressureDrop.cold.toFixed(2), '', 'Pa']
  ];

  const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);
  resultsSheet['!cols'] = [{ width: 35 }, { width: 20 }, { width: 20 }, { width: 15 }];
  XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Results');

  // Save the workbook
  XLSX.writeFile(workbook, `SONERA_Calculation_${calculation.productName.replace(/\s+/g, '_')}_${calculation.id}.xlsx`);
};

// ============================================================================
// CSV Export (Multiple Calculations)
// ============================================================================

export const exportToCSV = (calculations: Calculation[]) => {
  if (calculations.length === 0) {
    alert('No calculations to export');
    return;
  }

  const csvData = calculations.map(calc => ({
    'ID': calc.id,
    'Date': new Date(calc.timestamp).toLocaleDateString(),
    'Time': new Date(calc.timestamp).toLocaleTimeString(),
    'Engineer': calc.engineer,
    'Product Name': calc.productName,
    // FIX: Use input.flowConfiguration
    'Exchanger Type': (calc.input.flowConfiguration || 'Counter Flow').replace(/-/g, ' '),
    // Temperatures
    'Hot Temp In (°C)': calc.input.hotFluidTempIn,
    'Hot Temp Out (°C)': calc.input.hotFluidTempOut,
    'Cold Temp In (°C)': calc.input.coldFluidTempIn,
    'Cold Temp Out (°C)': calc.input.coldFluidTempOut,
    // Flows
    'Hot Mass Flow (kg/s)': calc.input.hotFluidMassFlow,
    'Cold Mass Flow (kg/s)': calc.input.coldFluidMassFlow,
    // Geometry
    'Tube Ext Dia (m)': calc.input.tubeExtDiameter,
    'Tube Int Dia (m)': calc.input.tubeIntDiameter,
    'Tube Length (m)': calc.input.tubeLength,
    'Number of Tubes': calc.input.numberOfTubes,
    'Surface Area (m²)': calc.input.totalSurfaceArea,
    // ADDED: New inputs
    'Fouling Hot': calc.input.foulingFactorHot || 0,
    'Fouling Cold': calc.input.foulingFactorCold || 0,
    'Tube Cond': calc.input.tubeThermalConductivity || 385,
    // Results
    'Effectiveness (%)': (calc.results.effectiveness * 100).toFixed(2),
    'NTU': calc.results.NTU.toFixed(4),
    'Heat Transfer (W)': calc.results.heatTransferRate.toFixed(2),
    'Heat Transfer (kW)': (calc.results.heatTransferRate / 1000).toFixed(2),
    'Overall U (W/m²·°C)': calc.results.overallHeatTransferCoeff.toFixed(2),
    'Reynolds Hot': calc.results.reynolds.hot.toFixed(2),
    'Reynolds Cold': calc.results.reynolds.cold.toFixed(2),
    'Prandtl Hot': calc.results.prandtl.hot.toFixed(4),
    'Prandtl Cold': calc.results.prandtl.cold.toFixed(4),
    'Nusselt Hot': calc.results.nusselt.hot.toFixed(2),
    'Nusselt Cold': calc.results.nusselt.cold.toFixed(2),
    'Flow Regime Hot': calc.results.flowRegime.hot,
    'Flow Regime Cold': calc.results.flowRegime.cold,
    'Pressure Drop Hot (Pa)': calc.results.pressureDrop.hot.toFixed(2),
    'Pressure Drop Cold (Pa)': calc.results.pressureDrop.cold.toFixed(2)
  }));

  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SONERA_Calculations_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ============================================================================
// JSON Export (Multiple Calculations)
// ============================================================================

export const exportToJSON = (calculations: Calculation[]) => {
  if (calculations.length === 0) {
    alert('No calculations to export');
    return;
  }

  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    application: 'SONERA Heat Exchanger Analysis System',
    count: calculations.length,
    calculations: calculations
  }, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SONERA_Calculations_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ============================================================================
// Single Calculation JSON Export
// ============================================================================

export const exportSingleCalculationToJSON = (calculation: Calculation) => {
  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    application: 'SONERA Heat Exchanger Analysis System',
    calculation: calculation
  }, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SONERA_${calculation.productName.replace(/\s+/g, '_')}_${calculation.id}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ============================================================================
// CSV Export (batched)
// ============================================================================

/**
 * Export calculations to CSV format
 */
export const exportCalculationsToCSV = (calculations: Calculation[]) => {
  if (calculations.length === 0) {
    alert('No calculations to export');
    return;
  }

  // CSV Headers
  const headers = [
    'ID',
    'Date',
    'Time',
    'Engineer',
    'Product Name',
    'Exchanger Type',
    // Input Parameters
    'Hot Temp In (°C)',
    'Hot Temp Out (°C)',
    'Cold Temp In (°C)',
    'Cold Temp Out (°C)',
    'Hot Mass Flow (kg/s)',
    'Cold Mass Flow (kg/s)',
    'Wall Temp (°C)',
    'Tube Ext Diameter (m)',
    'Tube Int Diameter (m)',
    'Tube Length (m)',
    'Number of Tubes',
    'Total Surface Area (m²)',
    // ADDED: New fields
    'Fouling Hot',
    'Fouling Cold',
    'Tube Cond',
    // Results
    'Effectiveness (%)',
    'NTU',
    'Heat Transfer Rate (W)',
    'Heat Transfer Rate (kW)',
    'Max Heat Transfer (W)',
    'Overall U (W/m²·°C)',
    'Capacity Ratio',
    'Reynolds Hot',
    'Reynolds Cold',
    'Prandtl Hot',
    'Prandtl Cold',
    'Nusselt Hot',
    'Nusselt Cold',
    'Grashof Hot',
    'Grashof Cold',
    'Rayleigh Hot',
    'Rayleigh Cold',
    'Heat Transfer Coeff Hot (W/m²·°C)',
    'Heat Transfer Coeff Cold (W/m²·°C)',
    'Pressure Drop Hot (Pa)',
    'Pressure Drop Cold (Pa)',
    'Flow Regime Hot',
    'Flow Regime Cold'
  ];

  // CSV Rows
  const rows = calculations.map(calc => {
    const date = new Date(calc.timestamp);
    return [
      calc.id,
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      calc.engineer,
      calc.productName,
      // FIX: Use input.flowConfiguration
      (calc.input.flowConfiguration || 'Counter Flow').replace(/-/g, ' '),
      // Inputs
      calc.input.hotFluidTempIn,
      calc.input.hotFluidTempOut,
      calc.input.coldFluidTempIn,
      calc.input.coldFluidTempOut,
      calc.input.hotFluidMassFlow,
      calc.input.coldFluidMassFlow,
      calc.input.wallTemp,
      calc.input.tubeExtDiameter,
      calc.input.tubeIntDiameter,
      calc.input.tubeLength,
      calc.input.numberOfTubes,
      calc.input.totalSurfaceArea,
      // ADDED: New inputs
      calc.input.foulingFactorHot || 0,
      calc.input.foulingFactorCold || 0,
      calc.input.tubeThermalConductivity || 385,
      // Results
      (calc.results.effectiveness * 100).toFixed(2),
      calc.results.NTU.toFixed(4),
      calc.results.heatTransferRate.toFixed(2),
      (calc.results.heatTransferRate / 1000).toFixed(2),
      calc.results.maxHeatTransferRate.toFixed(2),
      calc.results.overallHeatTransferCoeff.toFixed(2),
      calc.results.capacityRatio.toFixed(4),
      calc.results.reynolds.hot.toFixed(2),
      calc.results.reynolds.cold.toFixed(2),
      calc.results.prandtl.hot.toFixed(4),
      calc.results.prandtl.cold.toFixed(4),
      calc.results.nusselt.hot.toFixed(2),
      calc.results.nusselt.cold.toFixed(2),
      calc.results.grashof.hot.toExponential(2),
      calc.results.grashof.cold.toExponential(2),
      calc.results.rayleigh.hot.toExponential(2),
      calc.results.rayleigh.cold.toExponential(2),
      calc.results.heatTransferCoeff.hot.toFixed(2),
      calc.results.heatTransferCoeff.cold.toFixed(2),
      calc.results.pressureDrop.hot.toFixed(2),
      calc.results.pressureDrop.cold.toFixed(2),
      calc.results.flowRegime.hot,
      calc.results.flowRegime.cold
    ];
  });

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Download
  downloadFile(csvContent, 'sonera-calculations.csv', 'text/csv');
};

// ============================================================================
// JSON Export (batched)
// ============================================================================

/**
 * Export calculations to JSON format
 */
export const exportCalculationsToJSON = (calculations: Calculation[]) => {
  if (calculations.length === 0) {
    alert('No calculations to export');
    return;
  }

  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0',
    count: calculations.length,
    calculations: calculations
  }, null, 2);

  downloadFile(jsonContent, 'sonera-calculations.json', 'application/json');
};

// ============================================================================
// PDF Export (Single Calculation - print window)
// ============================================================================

/**
 * Export single calculation to PDF (uses browser print)
 */
export const exportToPDFPrint = (calculation: Calculation) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to export PDF');
    return;
  }

  const { input, results } = calculation;
  const date = new Date(calculation.timestamp);
  // FIX: Use input.flowConfiguration
  const configStr = (calculation.input.flowConfiguration || 'Counter Flow').replace(/-/g, ' ').replace('flow', ' Flow');

  // Generate HTML content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SONERA Calculation Report - ${calculation.productName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      padding: 20mm;
      background: white;
    }
    
    .header {
      border-bottom: 4px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .header .subtitle {
      color: #64748b;
      font-size: 14px;
    }
    
    .info-section {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #3b82f6;
    }
    
    .info-section h2 {
      color: #1e40af;
      font-size: 18px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .info-label {
      font-weight: 600;
      color: #475569;
    }
    
    .info-value {
      color: #1e293b;
      font-weight: bold;
    }
    
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    
    .kpi-card {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .kpi-card.green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .kpi-card.orange {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    
    .kpi-card.purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }
    
    .kpi-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .kpi-value {
      font-size: 32px;
      font-weight: bold;
    }
    
    .results-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    
    .results-table th,
    .results-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .results-table th {
      background: #f1f5f9;
      font-weight: 600;
      color: #475569;
    }
    
    .results-table tr:hover {
      background: #f8fafc;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    
    .performance-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .performance-excellent {
      background: #d1fae5;
      color: #065f46;
    }
    
    .performance-good {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .performance-fair {
      background: #fed7aa;
      color: #92400e;
    }
    
    .performance-poor {
      background: #fecaca;
      color: #991b1b;
    }
    
    @media print {
      body {
        padding: 10mm;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ SONERA Heat Exchanger Analysis Report</h1>
    <div class="subtitle">Advanced Thermal Calculation System</div>
  </div>

  <div class="info-section">
    <h2>📋 Calculation Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Product Name:</span>
        <span class="info-value">${calculation.productName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Engineer:</span>
        <span class="info-value">${calculation.engineer}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Date:</span>
        <span class="info-value">${date.toLocaleDateString()}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Time:</span>
        <span class="info-value">${date.toLocaleTimeString()}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Calculation ID:</span>
        <span class="info-value">${calculation.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Exchanger Type:</span>
        <span class="info-value">${configStr}</span>
      </div>
    </div>
  </div>

  <h2 style="margin-bottom: 15px; color: #1e40af;">🎯 Key Performance Indicators</h2>
  <div class="kpi-grid">
    <div class="kpi-card green">
      <div class="kpi-label">Effectiveness</div>
      <div class="kpi-value">${(results.effectiveness * 100).toFixed(1)}%</div>
    </div>
    <div class="kpi-card orange">
      <div class="kpi-label">Heat Transfer</div>
      <div class="kpi-value">${(results.heatTransferRate / 1000).toFixed(2)} kW</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">NTU Value</div>
      <div class="kpi-value">${results.NTU.toFixed(3)}</div>
    </div>
    <div class="kpi-card purple">
      <div class="kpi-label">Overall U</div>
      <div class="kpi-value">${results.overallHeatTransferCoeff.toFixed(1)}</div>
    </div>
  </div>

  <div class="info-section">
    <h2>🌡️ Input Parameters</h2>
    <table class="results-table">
      <tr>
        <th>Parameter</th>
        <th>Hot Fluid</th>
        <th>Cold Fluid</th>
      </tr>
      <tr>
        <td>Inlet Temperature</td>
        <td>${input.hotFluidTempIn} °C</td>
        <td>${input.coldFluidTempIn} °C</td>
      </tr>
      <tr>
        <td>Outlet Temperature</td>
        <td>${input.hotFluidTempOut} °C</td>
        <td>${input.coldFluidTempOut} °C</td>
      </tr>
      <tr>
        <td>Mass Flow Rate</td>
        <td>${input.hotFluidMassFlow} kg/s</td>
        <td>${input.coldFluidMassFlow} kg/s</td>
      </tr>
      <tr>
        <td>Viscosity</td>
        <td>${input.hotFluidViscosity} kg/m·s</td>
        <td>${input.coldFluidViscosity} kg/m·s</td>
      </tr>
      <tr>
        <td>Density</td>
        <td>${input.hotFluidDensity} kg/m³</td>
        <td>${input.coldFluidDensity} kg/m³</td>
      </tr>
      <tr>
        <td>Specific Heat</td>
        <td>${input.hotFluidSpecificHeat} J/kg·°C</td>
        <td>${input.coldFluidSpecificHeat} J/kg·°C</td>
      </tr>
      <tr>
        <td>Thermal Conductivity</td>
        <td>${input.hotFluidThermalConductivity} W/m·°C</td>
        <td>${input.coldFluidThermalConductivity} W/m·°C</td>
      </tr>
    </table>
  </div>

  <div class="info-section">
    <h2>📐 Geometric Parameters</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Tube External Diameter:</span>
        <span class="info-value">${input.tubeExtDiameter} m</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tube Internal Diameter:</span>
        <span class="info-value">${input.tubeIntDiameter} m</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tube Length:</span>
        <span class="info-value">${input.tubeLength} m</span>
      </div>
      <div class="info-item">
        <span class="info-label">Number of Tubes:</span>
        <span class="info-value">${input.numberOfTubes}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Total Surface Area:</span>
        <span class="info-value">${input.totalSurfaceArea} m²</span>
      </div>
      <div class="info-item">
        <span class="info-label">Wall Temperature:</span>
        <span class="info-value">${input.wallTemp} °C</span>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <div class="info-section">
    <h2>📊 Dimensionless Numbers</h2>
    <table class="results-table">
      <tr>
        <th>Parameter</th>
        <th>Hot Fluid</th>
        <th>Cold Fluid</th>
      </tr>
      <tr>
        <td>Reynolds Number (Re)</td>
        <td>${results.reynolds.hot.toFixed(2)}</td>
        <td>${results.reynolds.cold.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Prandtl Number (Pr)</td>
        <td>${results.prandtl.hot.toFixed(4)}</td>
        <td>${results.prandtl.cold.toFixed(4)}</td>
      </tr>
      <tr>
        <td>Grashof Number (Gr)</td>
        <td>${results.grashof.hot.toExponential(2)}</td>
        <td>${results.grashof.cold.toExponential(2)}</td>
      </tr>
      <tr>
        <td>Rayleigh Number (Ra)</td>
        <td>${results.rayleigh.hot.toExponential(2)}</td>
        <td>${results.rayleigh.cold.toExponential(2)}</td>
      </tr>
      <tr>
        <td>Nusselt Number (Nu)</td>
        <td>${results.nusselt.hot.toFixed(2)}</td>
        <td>${results.nusselt.cold.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Flow Regime</td>
        <td>${results.flowRegime.hot}</td>
        <td>${results.flowRegime.cold}</td>
      </tr>
    </table>
  </div>

  <div class="info-section">
    <h2>🔥 Heat Transfer Analysis</h2>
    <table class="results-table">
      <tr>
        <th>Parameter</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Heat Transfer Coefficient (Hot)</td>
        <td>${results.heatTransferCoeff.hot.toFixed(2)} W/m²·°C</td>
      </tr>
      <tr>
        <td>Heat Transfer Coefficient (Cold)</td>
        <td>${results.heatTransferCoeff.cold.toFixed(2)} W/m²·°C</td>
      </tr>
      <tr>
        <td>Overall Heat Transfer Coefficient (U)</td>
        <td>${results.overallHeatTransferCoeff.toFixed(2)} W/m²·°C</td>
      </tr>
      <tr>
        <td>Capacity Ratio (Cr)</td>
        <td>${results.capacityRatio.toFixed(4)}</td>
      </tr>
      <tr>
        <td>Number of Transfer Units (NTU)</td>
        <td>${results.NTU.toFixed(4)}</td>
      </tr>
      <tr>
        <td>Effectiveness (ε)</td>
        <td>${(results.effectiveness * 100).toFixed(2)}%</td>
      </tr>
      <tr>
        <td>Maximum Heat Transfer Rate (Qmax)</td>
        <td>${results.maxHeatTransferRate.toFixed(2)} W (${(results.maxHeatTransferRate / 1000).toFixed(2)} kW)</td>
      </tr>
      <tr>
        <td>Actual Heat Transfer Rate (Q)</td>
        <td>${results.heatTransferRate.toFixed(2)} W (${(results.heatTransferRate / 1000).toFixed(2)} kW)</td>
      </tr>
      <tr>
        <td>Heat Transfer Efficiency</td>
        <td>${((results.heatTransferRate / results.maxHeatTransferRate) * 100).toFixed(1)}%</td>
      </tr>
    </table>
  </div>

  <div class="info-section">
    <h2>💨 Pressure Drop Analysis</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Hot Fluid Pressure Drop:</span>
        <span class="info-value">${results.pressureDrop.hot.toFixed(2)} Pa</span>
      </div>
      <div class="info-item">
        <span class="info-label">Cold Fluid Pressure Drop:</span>
        <span class="info-value">${results.pressureDrop.cold.toFixed(2)} Pa</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>SONERA</strong> - Advanced Heat Exchanger Thermal Analysis System</p>
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>© ${new Date().getFullYear()} SONERA Engineering Suite</p>
  </div>
</body>
</html>
  `;

  // Write content and trigger print
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Download file helper
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export single calculation to JSON (file helper)
 */
export const exportSingleCalculationToJSON_File = (calculation: Calculation) => {
  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0',
    calculation: calculation
  }, null, 2);

  downloadFile(
    jsonContent,
    `sonera-${calculation.productName.replace(/\s+/g, '-')}-${calculation.id}.json`,
    'application/json'
  );
};

/**
 * Export Excel (using CSV with .xlsx extension for simplicity)
 * For true Excel support, use a library like xlsx
 */
export const exportCalculationsToExcel = (calculations: Calculation[]) => {
  // For basic Excel support, we'll use CSV with xlsx extension
  // For advanced features, integrate the 'xlsx' library
  exportCalculationsToCSV(calculations);
  
  // If you want true Excel support, install 'xlsx' package:
  // npm install xlsx
  // Then implement using SheetJS XLSX library
};