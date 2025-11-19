import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Trash2, Eye, Download, Filter, Calendar, 
  TrendingUp, Zap, SortAsc, SortDesc, X, Archive,
  FileText, CheckCircle, AlertCircle, BarChart3
} from 'lucide-react';
import { useCalculationStore, HeatExchangerType } from '@/store/calculationStore';
import { exportCalculationsToCSV, exportCalculationsToJSON } from '@/utils/exportFunctions';

const History = () => {
  const navigate = useNavigate();
  const calculations = useCalculationStore((state) => state.calculations);
  const deleteCalculation = useCalculationStore((state) => state.deleteCalculation);
  const setCurrentCalculation = useCalculationStore((state) => state.setCurrentCalculation);
  const clearHistory = useCalculationStore((state) => state.clearHistory);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<HeatExchangerType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'effectiveness' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort calculations
  const filteredAndSortedCalculations = useMemo(() => {
    let filtered = calculations.filter((calc) => {
      const matchesSearch = 
        calc.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.engineer.toLowerCase().includes(searchTerm.toLowerCase());
      
      // FIX: Use calc.input.flowConfiguration instead of calc.exchangerType
      const matchesType = filterType === 'all' || (calc.input.flowConfiguration || 'counter-flow') === filterType;
      
      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'effectiveness':
          comparison = a.results.effectiveness - b.results.effectiveness;
          break;
        case 'name':
          comparison = a.productName.localeCompare(b.productName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [calculations, searchTerm, filterType, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = calculations.length;
    const avgEffectiveness = total > 0
      ? calculations.reduce((sum, calc) => sum + calc.results.effectiveness, 0) / total
      : 0;
    
    const byType = calculations.reduce((acc, calc) => {
      // FIX: Use calc.input.flowConfiguration
      const type = calc.input.flowConfiguration || 'counter-flow';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, avgEffectiveness, byType };
  }, [calculations]);

  const handleView = (calc: typeof calculations[0]) => {
    setCurrentCalculation(calc);
    navigate('/results');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this calculation?')) {
      deleteCalculation(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL calculations? This cannot be undone.')) {
      clearHistory();
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportCalculationsToCSV(filteredAndSortedCalculations);
    } else {
      exportCalculationsToJSON(filteredAndSortedCalculations);
    }
  };

  const getPerformanceBadge = (effectiveness: number) => {
    if (effectiveness >= 0.85) {
      return { label: 'Excellent', color: 'bg-green-100 text-green-700 border-green-200' };
    } else if (effectiveness >= 0.70) {
      return { label: 'Good', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    } else if (effectiveness >= 0.55) {
      return { label: 'Fair', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    }
    return { label: 'Poor', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Calculation History</h1>
                <p className="text-xs text-slate-600">{calculations.length} total calculations</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600">Total Calculations</h3>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600">Avg. Effectiveness</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {(stats.avgEffectiveness * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600">Most Common Type</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 capitalize">
              {Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/-/g, ' ') || 'N/A'}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by product name or engineer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                showFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Sort Button */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border-2 border-slate-200 rounded-lg font-semibold bg-white hover:bg-slate-50 transition-all outline-none cursor-pointer"
              >
                <option value="date">Date</option>
                <option value="effectiveness">Effectiveness</option>
                <option value="name">Name</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
              >
                {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t-2 border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Heat Exchanger Type</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Types
                </button>
                {/* Updated types to match the new Store IDs */}
                {[
                  'counter-flow', 
                  'parallel-flow', 
                  'shell-and-tube', 
                  'cross-flow-both-unmixed',
                  'cross-flow-cmax-mixed',
                  'cross-flow-cmin-mixed'
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as HeatExchangerType)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleExport('csv')}
            disabled={filteredAndSortedCalculations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={filteredAndSortedCalculations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            <Download size={18} />
            Export JSON
          </button>
          <button
            onClick={handleClearAll}
            disabled={calculations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all ml-auto"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredAndSortedCalculations.length}</span> of{' '}
            <span className="font-bold text-slate-900">{calculations.length}</span> calculations
          </p>
        </div>

        {/* Calculations List */}
        {filteredAndSortedCalculations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Archive className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Calculations Found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first calculation'}
            </p>
            <button
              onClick={() => navigate('/new-calculation')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              Create New Calculation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCalculations.map((calc, index) => {
              const performance = getPerformanceBadge(calc.results.effectiveness);
              
              return (
                <div
                  key={calc.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all"
                  style={{
                    animation: 'fadeInUp 0.3s ease-out forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">
                              {calc.productName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${performance.color}`}>
                              {performance.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(calc.timestamp).toLocaleDateString()}
                            </span>
                            <span>Engineer: {calc.engineer}</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium capitalize">
                              {(calc.input.flowConfiguration || 'counter-flow').replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-100">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle size={14} className="text-green-600" />
                            <p className="text-xs text-slate-600 font-medium">Effectiveness</p>
                          </div>
                          <p className="text-2xl font-bold text-green-700">
                            {(calc.results.effectiveness * 100).toFixed(1)}%
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-orange-600" />
                            <p className="text-xs text-slate-600 font-medium">Heat Transfer</p>
                          </div>
                          <p className="text-2xl font-bold text-orange-700">
                            {(calc.results.heatTransferRate / 1000).toFixed(1)} kW
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={14} className="text-blue-600" />
                            <p className="text-xs text-slate-600 font-medium">NTU</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-700">
                            {calc.results.NTU.toFixed(2)}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-100">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={14} className="text-purple-600" />
                            <p className="text-xs text-slate-600 font-medium">Flow Regime</p>
                          </div>
                          <p className="text-lg font-bold text-purple-700">
                            {calc.results.flowRegime.hot}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => handleView(calc)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md flex-1 lg:flex-initial"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(calc.id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all border-2 border-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default History;