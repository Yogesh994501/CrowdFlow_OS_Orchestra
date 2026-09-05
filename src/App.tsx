import React, { useEffect } from 'react';
import { useCrowdFlowStore } from './store/useCrowdFlowStore';
import { TopNav } from './components/navigation/TopNav';
import { Sidebar } from './components/navigation/Sidebar';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { MapScreen } from './components/screens/MapScreen';
import { CapacityScreen } from './components/screens/CapacityScreen';
import { MobilityScreen } from './components/screens/MobilityScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { InterventionsScreen } from './components/screens/InterventionsScreen';
import { SimulationScreen } from './components/screens/SimulationScreen';
import { DependencyScreen } from './components/screens/DependencyScreen';
import { OperatorsScreen } from './components/screens/OperatorsScreen';
import { AttendeeScreen } from './components/screens/AttendeeScreen';
import { LandingScreen } from './components/screens/LandingScreen';
import { DarkVeilBackground } from './components/backgrounds/DarkVeilBackground';
import { RadarGridBackground } from './components/backgrounds/RadarGridBackground';
import { SoftAuroraBackground } from './components/backgrounds/SoftAuroraBackground';
import { HyperspeedBackground } from './components/backgrounds/HyperspeedBackground';
import { DataSourcePanel } from './components/common/DataSourcePanel';
import { Smartphone, X, Sparkles } from 'lucide-react';

export function App() {
  const { 
    activeScreen, 
    tickMetrics, 
    orchestratePipeline, 
    isMobileDeviceFrame, 
    toggleMobileDeviceFrame,
    currentRole,
    currentScenario 
  } = useCrowdFlowStore();

  // 1. Start live 3.5s metric simulation ticker
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      tickMetrics();
    }, 3500);

    return () => clearInterval(tickerInterval);
  }, [tickMetrics]);

  // 2. Run unified orchestration pipeline on mount + every 30s
  useEffect(() => {
    orchestratePipeline(); // Initial run on mount
    const orchestrationInterval = setInterval(() => {
      orchestratePipeline();
    }, 30000); // Every 30 seconds

    return () => clearInterval(orchestrationInterval);
  }, [orchestratePipeline]);

  // If on landing screen, render full-bleed Hyperspeed landing experience
  if (activeScreen === 'landing') {
    return <LandingScreen />;
  }

  // Render active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'overview':
        return <OverviewScreen />;
      case 'map':
        return <MapScreen />;
      case 'capacity':
        return <CapacityScreen />;
      case 'mobility':
        return <MobilityScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'interventions':
        return <InterventionsScreen />;
      case 'simulation':
        return <SimulationScreen />;
      case 'dependency':
        return <DependencyScreen />;
      case 'operators':
        return <OperatorsScreen />;
      case 'attendee':
        return (
          <div className="relative py-4 flex justify-center min-h-[calc(100vh-100px)]">
            <SoftAuroraBackground />
            <AttendeeScreen />
          </div>
        );
      default:
        return <OverviewScreen />;
    }
  };

  // Scenario-reactive ambient depth gradient (Option 2)
  const getAmbientGradient = () => {
    switch (currentScenario) {
      case 'heavy_rain':
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(14,165,233,0.22),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(56,189,248,0.15),transparent_65%)]';
      case 'hotel_saturation':
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(245,158,11,0.20),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(251,113,133,0.14),transparent_65%)]';
      case 'metro_disruption':
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(168,85,247,0.22),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(56,189,248,0.14),transparent_65%)]';
      case 'gate_closure':
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(239,68,68,0.22),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(244,63,94,0.14),transparent_65%)]';
      case 'demand_surge':
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(16,185,129,0.20),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(0,240,255,0.16),transparent_65%)]';
      case 'normal':
      default:
        return 'bg-[radial-gradient(ellipse_75%_55%_at_45%_-15%,rgba(34,211,238,0.16),transparent_65%),radial-gradient(ellipse_65%_50%_at_85%_100%,rgba(99,102,241,0.15),transparent_65%)]';
    }
  };

  // Select appropriate background based on purpose:
  // - Map: Map is the background (no animated canvas behind it)
  // - Attendee: Soft Aurora (handled inside attendee wrapper)
  // - Overview & Command Center: Subtle Hyperspeed + Atmospheric Navy Overlay + Ambient Gradients
  const renderBackground = () => {
    if (activeScreen === 'map' || activeScreen === 'attendee') {
      return null; // Map is hero; Attendee has its dedicated soft aurora
    }
    return (
      <>
        {/* Layer 1: Subtle Animated Hyperspeed Environmental Layer (Scenario-Reactive) */}
        <HyperspeedBackground isSubtle={true} scenario={currentScenario} />
        {/* Layer 2: Translucent Atmospheric Navy Overlay (balanced for glassmorphic blur visibility) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-[#07111F]/45 via-[#091525]/30 to-[#050B14]/50" />
        {/* Layer 3: Scenario-Reactive Ambient Luminous Depth Gradients */}
        <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-700 ease-in-out ${getAmbientGradient()}`} />
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#07111F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Purpose-driven dynamic background */}
      {renderBackground()}

      {/* Data Source Health Panel — visible on all command center screens */}
      {activeScreen !== 'attendee' && <DataSourcePanel />}

      {/* Top Operations Navigation */}
      <TopNav />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Sidebar (hidden if in full Attendee role on small screens) */}
        {currentRole !== 'attendee' && <Sidebar />}

        {/* Dynamic Screen Viewport */}
        <main className={`flex-1 ${activeScreen === 'attendee' ? 'p-0 md:p-6 lg:p-8' : 'p-4 md:p-6 lg:p-8'} overflow-y-auto max-w-[1600px] mx-auto w-full`}>
          {renderScreen()}
        </main>

      </div>

      {/* Floating Phone Simulator Frame (Toggleable on Desktop for Side-by-Side Testing) */}
      {isMobileDeviceFrame && activeScreen !== 'attendee' && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up shadow-2xl">
          <div className="relative">
            <div className="absolute -top-10 right-0 flex items-center gap-2 bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Smartphone className="w-3.5 h-3.5" />
                Live Attendee Companion
              </span>
              <button
                onClick={toggleMobileDeviceFrame}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white ml-2"
                title="Close phone preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="shadow-2xl border-4 border-slate-700/60 rounded-[32px] overflow-hidden bg-dark-950">
              <AttendeeScreen />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
