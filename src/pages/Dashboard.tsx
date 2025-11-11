import { Header } from '@/components/Layout/Header';
import { StatsCard } from '@/components/UI/StatsCard';
import { Calculator, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useCalculationStore } from '@/store/calculationStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const calculations = useCalculationStore((state) => state.calculations);

  const stats = {
    total: calculations.length,
    avgEffectiveness: calculations.length > 0
      ? (calculations.reduce((sum, calc) => sum + calc.results.effectiveness, 0) / calculations.length * 100).toFixed(1)
      : '0',
    recentCount: calculations.filter(
      calc => new Date(calc.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" />
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Soneras Engineering Suite
          </h2>
          <p className="text-muted-foreground">
            Professional radiator and heat exchanger reverse engineering calculations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Calculations"
            value={stats.total}
            icon={Calculator}
            delay={0}
          />
          <StatsCard
            title="Average Effectiveness"
            value={`${stats.avgEffectiveness}%`}
            icon={TrendingUp}
            delay={0.1}
          />
          <StatsCard
            title="Recent (7 days)"
            value={stats.recentCount}
            icon={Clock}
            delay={0.2}
          />
          <StatsCard
            title="Completed"
            value={stats.total}
            icon={CheckCircle}
            delay={0.3}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 bg-gradient-primary border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-primary-foreground">
                <h3 className="text-2xl font-bold mb-2">Start New Calculation</h3>
                <p className="text-primary-foreground/80">
                  Perform reverse engineering calculations on radiator products
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/new-calculation')}
                className="bg-card text-foreground hover:bg-card/90 shadow-xl"
              >
                <Calculator className="mr-2" size={20} />
                New Calculation
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
          <Card className="p-6">
            {calculations.length === 0 ? (
              <div className="text-center py-12">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No calculations yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/new-calculation')}
                >
                  Create your first calculation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {calculations.slice(0, 5).map((calc, index) => (
                  <motion.div
                    key={calc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    onClick={() => navigate('/history')}
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{calc.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(calc.timestamp).toLocaleDateString()} • {calc.engineer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {(calc.results.effectiveness * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Effectiveness</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
