import { Header } from '@/components/Layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCalculationStore } from '@/store/calculationStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportToCSV } from '@/utils/exportFunctions';

const History = () => {
  const navigate = useNavigate();
  const calculations = useCalculationStore((state) => state.calculations);
  const deleteCalculation = useCalculationStore((state) => state.deleteCalculation);
  const setCurrentCalculation = useCalculationStore((state) => state.setCurrentCalculation);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculations = calculations.filter(
    (calc) =>
      calc.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.engineer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (calc: typeof calculations[0]) => {
    setCurrentCalculation(calc);
    navigate('/results');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this calculation?')) {
      deleteCalculation(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Calculation History" />
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by product name or engineer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => exportToCSV(calculations)}
            variant="outline"
            disabled={calculations.length === 0}
            className="gap-2"
          >
            <Download size={18} />
            Export All
          </Button>
        </div>

        {/* Calculations List */}
        {filteredCalculations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No calculations found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCalculations.map((calc, index) => (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {calc.productName}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Engineer: {calc.engineer}</span>
                        <span>Date: {new Date(calc.timestamp).toLocaleDateString()}</span>
                        <span>Configuration: {calc.results.configuration}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Effectiveness</p>
                          <p className="text-lg font-bold text-primary">
                            {(calc.results.effectiveness * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Heat Transfer</p>
                          <p className="text-lg font-bold text-primary">
                            {calc.results.heatTransferRate.toFixed(0)} W
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reynolds (Hot)</p>
                          <p className="text-lg font-bold text-primary">
                            {calc.results.reynoldsHot.toFixed(0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Flow Regime</p>
                          <p className="text-lg font-bold text-primary">
                            {calc.results.flowRegime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleView(calc)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Eye size={16} />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(calc.id)}
                        size="sm"
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
