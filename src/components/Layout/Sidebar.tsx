import { Home, Calculator, History, Settings, Info, Menu, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sonerasLogo from '@/assets/soneras-logo.png';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'New Calculation', path: '/new-calculation', icon: Calculator },
  { title: 'History', path: '/history', icon: History },
  { title: 'Settings', path: '/settings', icon: Settings },
  { title: 'About', path: '/about', icon: Info },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 280 }}
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 lg:relative transition-all duration-300 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-80'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <img src={sonerasLogo} alt="Soneras" className="h-10 w-10" />
                  <div>
                    <h1 className="text-sidebar-foreground font-bold text-lg">Soneras</h1>
                    <p className="text-sidebar-foreground/60 text-xs">Engineering Suite</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 group"
                    activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-lg"
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap"
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

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-sidebar-foreground/60 text-center"
                >
                  <p>Version 1.0.0</p>
                  <p className="mt-1">© 2024 Soneras</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
