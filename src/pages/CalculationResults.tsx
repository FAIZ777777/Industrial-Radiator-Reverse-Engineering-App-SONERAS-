import { Header } from '@/components/Layout/Header';
import { Card } from '@/components/ui/card';
import { useCalculationStore } from '@/store/calculationStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToPDF, exportToExcel } from '@/utils/exportFunctions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CalculationResults = () => {
  const navigate = useNavigate();
  const currentCalculation = useCalculationStore((state) => state.currentCalculation);

  if (!currentCalculation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Calculation Data</h2>
          <Button onClick={() => navigate('/new-calculation')}>
            Start New Calculation
          </Button>
        </div>
      </div>
    );
  }

  const { results, input } = currentCalculation;

  const tempData = [
    { position: 'Inlet', hot: input.hotFluidTempIn, cold: input.coldFluidTempIn },
    { position: 'Outlet', hot: input.hotFluidTempOut, cold: input.coldFluidTempOut },
  ];

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      exportToPDF(currentCalculation);
    } else {
      exportToExcel(currentCalculation);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Calculation Results"
        onExport={() => handleExport('pdf')}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentCalculation.productName}
            </h2>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Engineer: {currentCalculation.engineer}</span>
              <span>Date: {new Date(currentCalculation.timestamp).toLocaleString()}</span>
              <span>Configuration: {results.configuration}</span>
              <span>Flow Regime: {results.flowRegime}</span>
            </div>
          </Card>
        </motion.div>

        {/* Key Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-primary border-0">
              <h3 className="text-sm font-medium text-primary-foreground/80 mb-2">
                Effectiveness
              </h3>
              <p className="text-4xl font-bold text-primary-foreground">
                {(results.effectiveness * 100).toFixed(2)}%
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-accent border-0">
              <h3 className="text-sm font-medium text-primary-foreground/80 mb-2">
                Heat Transfer Rate
              </h3>
              <p className="text-4xl font-bold text-primary-foreground">
                {results.heatTransferRate.toFixed(0)} W
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-success border-0">
              <h3 className="text-sm font-medium text-success-foreground/80 mb-2">
                NTU Value
              </h3>
              <p className="text-4xl font-bold text-success-foreground">
                {results.ntu.toFixed(4)}
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Dimensionless Numbers
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Reynolds (Hot)</span>
                  <span className="text-primary font-semibold">{results.reynoldsHot.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Reynolds (Cold)</span>
                  <span className="text-primary font-semibold">{results.reynoldsCold.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Prandtl (Hot)</span>
                  <span className="text-primary font-semibold">{results.prandtlHot.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Prandtl (Cold)</span>
                  <span className="text-primary font-semibold">{results.prandtlCold.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Nusselt (Hot)</span>
                  <span className="text-primary font-semibold">{results.nusseltHot.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Nusselt (Cold)</span>
                  <span className="text-primary font-semibold">{results.nusseltCold.toFixed(4)}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Pressure Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Pressure Drop (Hot)</span>
                  <span className="text-destructive font-semibold">{results.pressureDropHot.toFixed(2)} Pa</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Pressure Drop (Cold)</span>
                  <span className="text-destructive font-semibold">{results.pressureDropCold.toFixed(2)} Pa</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Grashof (Hot)</span>
                  <span className="text-primary font-semibold">{results.grashofHot.toExponential(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Grashof (Cold)</span>
                  <span className="text-primary font-semibold">{results.grashofCold.toExponential(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Rayleigh (Hot)</span>
                  <span className="text-primary font-semibold">{results.rayleighHot.toExponential(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-foreground font-medium">Rayleigh (Cold)</span>
                  <span className="text-primary font-semibold">{results.rayleighCold.toExponential(2)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Temperature Profile Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Temperature Profile
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="position"
                  stroke="hsl(var(--foreground))"
                />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hot"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={3}
                  name="Hot Fluid (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="cold"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  name="Cold Fluid (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex gap-4"
        >
          <Button onClick={() => handleExport('pdf')} className="gap-2">
            <FileDown size={16} />
            Export PDF
          </Button>
          <Button onClick={() => handleExport('excel')} variant="outline" className="gap-2">
            <FileDown size={16} />
            Export Excel
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default CalculationResults;
