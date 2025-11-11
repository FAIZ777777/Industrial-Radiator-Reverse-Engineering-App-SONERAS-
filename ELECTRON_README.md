# Soneras Radiator Engineering Suite - Electron Desktop App

## Overview
This is a professional Electron.js desktop application for radiator and heat exchanger reverse engineering calculations. While the application runs in the browser during development with Lovable, the full Electron structure is included for desktop deployment.

## Project Structure

```
soneras-radiator-app/
├── electron/                  # Electron main process files
│   ├── main.js               # Main process entry point
│   └── preload.js            # Preload script for IPC
├── src/                      # React application
│   ├── pages/                # Application pages
│   ├── components/           # Reusable components
│   ├── store/                # Zustand state management
│   └── utils/                # Utility functions
└── electron-builder.json     # Build configuration
```

## Features

### Core Functionality
- **Dashboard**: Overview of calculations and quick actions
- **Multi-step Input Form**: Comprehensive thermal and fluid property inputs
- **Advanced Calculations**: 
  - Reynolds, Prandtl, Grashof, Rayleigh, Nusselt numbers
  - NTU-Effectiveness method
  - Pressure drop analysis
  - Flow regime determination
- **Results Visualization**: Charts and detailed reports
- **History Management**: Local storage of all calculations
- **Export**: PDF, Excel, and CSV export capabilities

### Technical Stack
- **Frontend**: React 18+ with TypeScript
- **Desktop**: Electron.js (ready for deployment)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Export**: jsPDF and XLSX

## Running in Development (Web Mode)

The application currently runs in web mode within Lovable:

```bash
npm install
npm run dev
```

Access at `http://localhost:8080`

## Building as Desktop Application

To build the Electron desktop application:

### Prerequisites
1. Node.js 16+ installed
2. All dependencies installed: `npm install`
3. Add Electron dependencies:
   ```bash
   npm install --save-dev electron electron-builder
   ```

### Build Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"electron electron/main.js\"",
    "electron:build": "npm run build && electron-builder",
    "build": "vite build"
  },
  "main": "electron/main.js"
}
```

### Platform-Specific Builds

**Windows:**
```bash
npm run electron:build -- --win
```

**macOS:**
```bash
npm run electron:build -- --mac
```

**Linux:**
```bash
npm run electron:build -- --linux
```

## Data Storage

### In Web Mode (Current)
- Uses browser localStorage via Zustand persist
- Data stored in browser's local storage

### In Desktop Mode (Electron)
- Uses Node.js file system
- Data stored in user's app data directory:
  - Windows: `C:\Users\{username}\AppData\Roaming\Soneras Radiator Engineering Suite`
  - macOS: `~/Library/Application Support/Soneras Radiator Engineering Suite`
  - Linux: `~/.config/Soneras Radiator Engineering Suite`

## Configuration Files

### electron/main.js
Main Electron process that creates the application window and handles system-level operations.

### electron/preload.js
Secure bridge between main and renderer processes using IPC (Inter-Process Communication).

### electron-builder.json
Configuration for building installers for Windows, macOS, and Linux.

## Calculation Methodology

The application implements industry-standard thermal engineering calculations:

1. **Reynolds Number**: Flow regime determination
   - Re = (ρ × V × D) / μ
   - Critical Re = 2000 for internal flow

2. **Prandtl Number**: Fluid property characterization
   - Pr = (μ × Cp) / λ

3. **Grashof Number**: Natural convection analysis
   - Gr = (β × g × ΔT × ρ² × L³) / μ²

4. **Nusselt Number**: Multiple correlations
   - Churchill-Bernstein for external flow
   - Laminar: Nu = 3.66
   - Simplified correlation for complex geometries

5. **NTU-Effectiveness Method**
   - Supports multiple configurations (counter flow, parallel flow, etc.)
   - ε = f(NTU, Cr)

6. **Pressure Drop Analysis**
   - Linear and singular pressure drops
   - Friction factor calculations

## Development vs Production

### Development (Current State)
- Runs in browser via Lovable
- Hot reloading enabled
- Developer tools available
- LocalStorage for data persistence

### Production (Desktop Deployment)
- Standalone desktop application
- Native file system access
- System tray integration possible
- Auto-updates capability
- Offline functionality

## Security Considerations

- Context isolation enabled in Electron
- Node integration disabled in renderer
- Secure IPC communication via preload script
- Input validation on all forms
- No external network calls (fully offline capable)

## Future Enhancements

Potential features for desktop version:
- [ ] System tray icon with quick actions
- [ ] Auto-update mechanism
- [ ] Batch calculation processing
- [ ] Custom report templates
- [ ] Database backup/restore
- [ ] Multi-language support
- [ ] Advanced 3D visualization

## Support

For technical support or questions about the calculation methodology, refer to:
- ASHRAE Fundamentals Handbook
- Heat Transfer by J.P. Holman
- Fundamentals of Heat and Mass Transfer by Incropera & DeWitt

## License

Proprietary - Soneras Company

---

**Note**: This application is currently running in web mode within Lovable. The Electron files are included and ready for desktop deployment when needed. All features work identically in both web and desktop modes.
