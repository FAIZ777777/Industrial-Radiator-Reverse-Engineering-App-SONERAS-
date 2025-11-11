import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
}

export const StatsCard = ({ title, value, icon: Icon, trend, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 border-border bg-card">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1 sm:mt-2 truncate">{value}</h3>
            {trend !== undefined && (
              <p
                className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium ${
                  trend >= 0 ? 'text-success' : 'text-destructive'
                }`}
              >
                {trend >= 0 ? '+' : ''}
                {trend}% from last month
              </p>
            )}
          </div>
          <div className="p-2 sm:p-3 bg-gradient-primary rounded-lg sm:rounded-xl flex-shrink-0">
            <Icon size={20} className="sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
