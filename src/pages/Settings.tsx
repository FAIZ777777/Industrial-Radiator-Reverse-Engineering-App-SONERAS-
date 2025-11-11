import { Header } from '@/components/Layout/Header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const Settings = () => {
  const settings = useSettingsStore();
  const [formData, setFormData] = useState({
    engineerName: settings.engineerName,
    companyName: settings.companyName,
    decimalPrecision: settings.decimalPrecision,
    defaultGravity: settings.defaultGravity,
  });

  const handleSave = () => {
    settings.updateSettings(formData);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    settings.resetSettings();
    setFormData({
      engineerName: '',
      companyName: 'Soneras',
      decimalPrecision: 4,
      defaultGravity: 9.81,
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" onSave={handleSave} />
      
      <main className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Application Settings
            </h2>

            <div className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  User Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="engineerName">Engineer Name</Label>
                    <Input
                      id="engineerName"
                      value={formData.engineerName}
                      onChange={(e) =>
                        setFormData({ ...formData, engineerName: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Calculation Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Calculation Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="decimalPrecision">Decimal Precision</Label>
                    <Input
                      id="decimalPrecision"
                      type="number"
                      min="2"
                      max="8"
                      value={formData.decimalPrecision}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          decimalPrecision: parseInt(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of decimal places to display in results
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="defaultGravity">Default Gravity (m/s²)</Label>
                    <Input
                      id="defaultGravity"
                      type="number"
                      step="0.01"
                      value={formData.defaultGravity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultGravity: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              <Button onClick={handleSave} className="gap-2">
                <Save size={16} />
                Save Settings
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
