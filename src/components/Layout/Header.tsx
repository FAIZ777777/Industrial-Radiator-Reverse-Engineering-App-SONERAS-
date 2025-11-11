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
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Radiator & Heat Exchanger Engineering
          </p>
        </div>

        <div className="flex items-center gap-4">
          {onSave && (
            <Button onClick={onSave} variant="outline" size="sm" className="gap-2">
              <Save size={16} />
              Save
            </Button>
          )}
          {onExport && (
            <Button onClick={onExport} variant="outline" size="sm" className="gap-2">
              <FileDown size={16} />
              Export
            </Button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <User size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">
              {engineerName || 'Engineer'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
