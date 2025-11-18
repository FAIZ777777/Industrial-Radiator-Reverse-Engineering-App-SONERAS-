import { Home, Calculator, History, Settings, Info, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sonerasLogo from '@/assets/soneras-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: Home },
  { title: 'New Calculation', path: '/new-calculation', icon: Calculator },
  { title: 'History', path: '/history', icon: History },
  { title: 'Settings', path: '/settings', icon: Settings },
  { title: 'About', path: '/about', icon: Info },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "👋 Signed out successfully" });
      navigate("/signin");
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out", variant: "destructive" });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 76 : 280 }}
        className="fixed lg:sticky left-0 top-0 h-screen bg-sidebar/95 backdrop-blur-2xl border-r border-border/40 z-50 flex flex-col"
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3.5"
              >
                <img src={sonerasLogo} alt="Soneras" className="h-10 w-10 rounded-lg shadow-md" />
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">Soneras</h1>
                  <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Engineering Suite
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 rounded-lg hover:bg-sidebar-accent/60 transition-all hover:scale-110 text-sidebar-foreground/80"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <Menu size={22} /> : <X size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className="flex items-center gap-4 px-3 py-3.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-300 group"
                  activeClassName="!text-primary font-semibold" // Only color change on active
                >
                  <item.icon
                    size={23}
                    className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium overflow-hidden whitespace-nowrap"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: Logout + Footer */}
        <div className="border-t border-border/30 p-4 space-y-4">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
          >
            <LogOut size={21} />
            {!isCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
          </Button>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[10px] text-sidebar-foreground/40 pt-3 border-t border-border/20"
              >
                <p>v2.5.0 • 2025</p>
                <p className="mt-0.5">© Soneras Technologies</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};