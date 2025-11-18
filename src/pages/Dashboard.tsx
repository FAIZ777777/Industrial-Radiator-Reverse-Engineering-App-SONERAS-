import { Header } from '@/components/Layout/Header';
import { StatsCard } from '@/components/UI/StatsCard';
import { Calculator, TrendingUp, Clock, CheckCircle, ArrowRight, Plus, Users, Target } from 'lucide-react';
import { useCalculationStore } from '@/store/calculationStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    completed: calculations.length
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30"
      style={{ fontFamily: 'Tajawal-R, sans-serif' }}
    >
      <Header title="Dashboard" />
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
            <div>
              <h1 
                className="text-3xl font-bold text-slate-900 mb-1"
                style={{ fontFamily: 'Tajawal-L, sans-serif' }}
              >
                Engineering Dashboard
              </h1>
              <p 
                className="text-lg text-slate-600 max-w-2xl leading-relaxed"
                style={{ fontFamily: 'Tajawal-L, sans-serif' }}
              >
                Professional radiator and heat exchanger reverse engineering calculations. 
                Monitor performance and manage your engineering projects.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Calculations"
              value={stats.total}
              icon={Calculator}
              trend="+12%"
              description="All time calculations"
              gradient="from-blue-500 to-blue-600"
              delay={0}
              fontFamily="Tajawal-R"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Avg. Effectiveness"
              value={`${stats.avgEffectiveness}%`}
              icon={TrendingUp}
              trend="+2.3%"
              description="Overall performance"
              gradient="from-green-500 to-emerald-600"
              delay={0.1}
              fontFamily="Tajawal-R"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Recent (7 days)"
              value={stats.recentCount}
              icon={Clock}
              trend="+5"
              description="This week"
              gradient="from-amber-500 to-orange-500"
              delay={0.2}
              fontFamily="Tajawal-R"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle}
              trend="100%"
              description="Success rate"
              gradient="from-purple-500 to-purple-600"
              delay={0.3}
              fontFamily="Tajawal-R"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 
                      className="text-2xl font-semibold mb-3"
                      style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                    >
                      Start New Analysis
                    </h3>
                    <p 
                      className="text-slate-300 text-lg leading-relaxed"
                      style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                    >
                      Perform comprehensive reverse engineering calculations on radiator products with advanced analysis tools.
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="relative">
                      <Calculator className="h-16 w-16 text-blue-400" />
                      <div className="absolute -inset-4 bg-blue-400/10 rounded-full blur-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  <div className="flex-1">
                    <p 
                      className="text-base text-slate-600 mb-4 leading-relaxed"
                      style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                    >
                      Start a new engineering analysis with our comprehensive calculation suite including thermal performance, fluid dynamics, and structural integrity.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-700 border-0">
                        Heat Transfer
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-100 text-green-700 border-0">
                        Fluid Dynamics
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-purple-100 text-purple-700 border-0">
                        Performance Analysis
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => navigate('/new-calculation')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl transition-all duration-300 hover:shadow-3xl min-w-[180px] h-12 text-base font-medium group"
                    style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                  >
                    <Plus className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    New Calculation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-6">
                <CardTitle 
                  className="text-xl font-semibold flex items-center gap-3 text-slate-800"
                  style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span 
                      className="text-sm font-medium text-slate-700"
                      style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                    >
                      Calculations Today
                    </span>
                  </div>
                  <span 
                    className="font-bold text-blue-600 text-lg"
                    style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                  >
                    3
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span 
                      className="text-sm font-medium text-slate-700"
                      style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                    >
                      Avg. Time
                    </span>
                  </div>
                  <span 
                    className="font-bold text-green-600 text-lg"
                    style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                  >
                    12m
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-slate-500" />
                    <span 
                      className="text-sm font-medium text-slate-700"
                      style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                    >
                      Success Rate
                    </span>
                  </div>
                  <span 
                    className="font-bold text-purple-600 text-lg"
                    style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                  >
                    98.5%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 
                className="text-2xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: 'Tajawal-L, sans-serif' }}
              >
                Recent Activity
              </h3>
              <p 
                className="text-slate-600"
                style={{ fontFamily: 'Tajawal-L, sans-serif' }}
              >
                Latest calculations and analysis results
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/history')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-200 group"
              style={{ fontFamily: 'Tajawal-R, sans-serif' }}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {calculations.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="relative inline-block mb-4">
                    <Calculator className="h-20 w-20 text-slate-300 mx-auto" />
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-30"></div>
                  </div>
                  <h4 
                    className="text-xl font-semibold text-slate-700 mb-3"
                    style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                  >
                    No calculations yet
                  </h4>
                  <p 
                    className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed"
                    style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                  >
                    Get started by creating your first reverse engineering calculation to analyze thermal performance and efficiency.
                  </p>
                  <Button
                    onClick={() => navigate('/new-calculation')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-8 py-3 text-base font-medium transition-all duration-300 hover:shadow-xl"
                    style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create First Calculation
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {calculations.slice(0, 5).map((calc, index) => (
                    <motion.div
                      key={calc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all duration-300 cursor-pointer group border-b border-slate-100 last:border-b-0"
                      onClick={() => navigate('/history')}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                          calc.results.effectiveness > 0.8 ? 'bg-green-500' : 
                          calc.results.effectiveness > 0.6 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 
                            className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-lg mb-1"
                            style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                          >
                            {calc.productName}
                          </h4>
                          <div className="flex items-center gap-4">
                            <p 
                              className="text-sm text-slate-500"
                              style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                            >
                              {new Date(calc.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <span className="text-slate-300">•</span>
                            <p 
                              className="text-sm text-slate-500"
                              style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                            >
                              {calc.engineer}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p 
                            className="font-bold text-xl text-slate-900"
                            style={{ fontFamily: 'Tajawal-L, sans-serif' }}
                          >
                            {(calc.results.effectiveness * 100).toFixed(1)}%
                          </p>
                          <p 
                            className="text-xs text-slate-500 uppercase tracking-wide"
                            style={{ fontFamily: 'Tajawal-R, sans-serif' }}
                          >
                            Effectiveness
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;