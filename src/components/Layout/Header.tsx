import { useSettingsStore } from '@/store/settingsStore';
import { User, Save, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  onSave?: () => void;
  onExport?: () => void;
}

export const Header = ({ title, onSave, onExport }: HeaderProps) => {
  const engineerName = useSettingsStore((state) => state.engineerName);

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-lg bg-card/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Radiator & Heat Exchanger Engineering
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto flex-wrap">
          {onSave && (
            <Button onClick={onSave} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
              <Save size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          )}
          {onExport && (
            <Button onClick={onExport} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
              <FileDown size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-muted rounded-lg flex-1 sm:flex-initial">
            <User size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">
              {engineerName || 'Engineer'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
