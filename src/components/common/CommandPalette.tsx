import React, { useState, useEffect, useRef } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { 
  Search, 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  Bus, 
  ShieldAlert, 
  Sparkles, 
  FlaskConical, 
  GitBranch, 
  Sliders, 
  Smartphone,
  Play, 
  RotateCcw, 
  CloudRain, 
  AlertTriangle,
  FileText,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Palette,
  Calendar
} from 'lucide-react';
import type { ScreenType, DemoScenario } from '../../types';

interface CommandItem {
  id: string;
  category: 'Screen' | 'Scenario' | 'Zone' | 'Temporal' | 'Action' | 'Theme' | 'Event';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExportModal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenExportModal
}) => {
  const { 
    setActiveScreen, 
    setScenario, 
    setSelectedZoneId,
    setTemporalMinutes,
    setIsForecastPlaying,
    isForecastPlaying,
    toggleAudioMute,
    isAudioMuted,
    setTheme,
    events,
    activeEventId,
    setActiveEvent
  } = useCrowdFlowStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Master command registry
  const allCommands: CommandItem[] = [
    // Screens
    {
      id: 'screen-overview',
      category: 'Screen',
      title: 'Command Center Overview',
      subtitle: 'System health, KPIs, sector matrix and live feed',
      icon: LayoutDashboard,
      shortcut: '⌘1',
      onSelect: () => { setActiveScreen('overview'); onClose(); }
    },
    {
      id: 'screen-map',
      category: 'Screen',
      title: 'Live City Map',
      subtitle: 'Interactive Leaflet GIS map with crowd heat polygons',
      icon: MapPin,
      shortcut: '⌘2',
      onSelect: () => { setActiveScreen('map'); onClose(); }
    },
    {
      id: 'screen-capacity',
      category: 'Screen',
      title: 'Capacity & Hotel Intelligence',
      subtitle: 'Hospitality deficit, inventory, and emergency beds',
      icon: Building2,
      shortcut: '⌘3',
      onSelect: () => { setActiveScreen('capacity'); onClose(); }
    },
    {
      id: 'screen-mobility',
      category: 'Screen',
      title: 'Mobility & Multimodal Transit',
      subtitle: 'Transit corridors, rail bottlenecks, and shuttle dispatch',
      icon: Bus,
      shortcut: '⌘4',
      onSelect: () => { setActiveScreen('mobility'); onClose(); }
    },
    {
      id: 'screen-alerts',
      category: 'Screen',
      title: 'Incident Alert Center',
      subtitle: 'Active critical and high operational incidents',
      icon: ShieldAlert,
      shortcut: '⌘5',
      onSelect: () => { setActiveScreen('alerts'); onClose(); }
    },
    {
      id: 'screen-interventions',
      category: 'Screen',
      title: 'AI Decision Engine & Interventions',
      subtitle: 'Automated cross-sector interventions and approvals',
      icon: Sparkles,
      shortcut: '⌘6',
      onSelect: () => { setActiveScreen('interventions'); onClose(); }
    },
    {
      id: 'screen-simulation',
      category: 'Screen',
      title: 'What-If Simulation Sandbox',
      subtitle: 'Weather, transit disruption, and crowd surge modeling',
      icon: FlaskConical,
      shortcut: '⌘7',
      onSelect: () => { setActiveScreen('simulation'); onClose(); }
    },
    {
      id: 'screen-dependency',
      category: 'Screen',
      title: 'Cascading Dependency Graph',
      subtitle: 'Visual DAG showing cross-sector failure propagation',
      icon: GitBranch,
      onSelect: () => { setActiveScreen('dependency'); onClose(); }
    },
    {
      id: 'screen-operators',
      category: 'Screen',
      title: 'Operator Dispatch Console',
      subtitle: 'Bilateral task delegation for hotels and transport',
      icon: Sliders,
      onSelect: () => { setActiveScreen('operators'); onClose(); }
    },
    {
      id: 'screen-attendee',
      category: 'Screen',
      title: 'Attendee Mobile Portal',
      subtitle: 'Public companion app with crowd forecasts and vouchers',
      icon: Smartphone,
      onSelect: () => { setActiveScreen('attendee'); onClose(); }
    },

    // Temporal Engine
    {
      id: 'temporal-play',
      category: 'Temporal',
      title: isForecastPlaying ? 'Pause 3-Hour Forecast' : 'Play 3-Hour Forecast',
      subtitle: 'Smoothly animates the predicted timeline (0 to 180 min)',
      icon: isForecastPlaying ? RotateCcw : Play,
      shortcut: 'Space',
      onSelect: () => {
        setIsForecastPlaying(!isForecastPlaying);
        onClose();
      }
    },
    {
      id: 'temporal-peak',
      category: 'Temporal',
      title: 'Jump to Peak Surge Window (+1 Hour)',
      subtitle: 'Fast-forwards to 60-minute forecast to inspect bottlenecks',
      icon: AlertTriangle,
      onSelect: () => {
        setTemporalMinutes(60);
        onClose();
      }
    },
    {
      id: 'temporal-reset',
      category: 'Temporal',
      title: 'Reset Timeline to Live Time (NOW)',
      subtitle: 'Returns all zones and transit corridors to live state',
      icon: RotateCcw,
      onSelect: () => {
        setTemporalMinutes(0);
        setIsForecastPlaying(false);
        onClose();
      }
    },

    // Scenarios
    {
      id: 'scenario-rain',
      category: 'Scenario',
      title: 'Trigger: Heavy Monsoon Event',
      subtitle: 'Simulates torrential rain, road chokepoints, and rail slowdowns',
      icon: CloudRain,
      onSelect: () => { setScenario('heavy_rain'); onClose(); }
    },
    {
      id: 'scenario-metro',
      category: 'Scenario',
      title: 'Trigger: Metro Line 3 Disruption',
      subtitle: 'Simulates underground metro halt shifting load to local trains',
      icon: Bus,
      onSelect: () => { setScenario('metro_disruption'); onClose(); }
    },
    {
      id: 'scenario-hotel',
      category: 'Scenario',
      title: 'Trigger: Acute Hotel Saturation',
      subtitle: 'Simulates zero rooms in 5km radius and hospital overflow',
      icon: Building2,
      onSelect: () => { setScenario('hotel_saturation'); onClose(); }
    },
    {
      id: 'scenario-normal',
      category: 'Scenario',
      title: 'Reset to Normal Metropolitan Flow',
      subtitle: 'Restores standard event telemetry across all 8 sectors',
      icon: RotateCcw,
      onSelect: () => { setScenario('normal'); onClose(); }
    },

    // Mega Events Context
    ...(events || []).map(ev => ({
      id: `event-${ev.id}`,
      category: 'Event' as const,
      title: `Switch Event: ${ev.name}`,
      subtitle: `${ev.venue} • ${ev.currentDay} (${(ev.expectedAttendance / 1000).toFixed(0)}k capacity)`,
      icon: Calendar,
      shortcut: ev.id === activeEventId ? 'ACTIVE' : undefined,
      onSelect: () => {
        setActiveEvent(ev.id);
        onClose();
      }
    })),

    // Zone Inspectors
    {
      id: 'zone-bkc',
      category: 'Zone',
      title: 'Inspect Sector: BKC (Bandra-Kurla Complex)',
      subtitle: 'Primary venue zone hosting Jio World Convention Centre',
      icon: MapPin,
      onSelect: () => {
        setSelectedZoneId('bkc');
        setActiveScreen('capacity');
        onClose();
      }
    },
    {
      id: 'zone-dadar',
      category: 'Zone',
      title: 'Inspect Sector: Dadar Central Transit Core',
      subtitle: 'Multimodal interchange hub for Central & Western railways',
      icon: MapPin,
      onSelect: () => {
        setSelectedZoneId('dadar');
        setActiveScreen('mobility');
        onClose();
      }
    },
    {
      id: 'zone-colaba',
      category: 'Zone',
      title: 'Inspect Sector: Colaba Heritage District',
      subtitle: 'Southern tourist and premium hotel zone',
      icon: MapPin,
      onSelect: () => {
        setSelectedZoneId('colaba');
        setActiveScreen('capacity');
        onClose();
      }
    },

    // Actions & Tools
    {
      id: 'action-export',
      category: 'Action',
      title: 'Export Executive Ops Briefing',
      subtitle: 'Generates print-ready incident post-mortem and Markdown report',
      icon: FileText,
      shortcut: '⌘P',
      onSelect: () => {
        onClose();
        if (onOpenExportModal) onOpenExportModal();
      }
    },
    {
      id: 'action-sound',
      category: 'Action',
      title: isAudioMuted ? 'Unmute Operational Audio Alarms' : 'Mute Operational Audio Alarms',
      subtitle: 'Toggle synthesized audio radar pings and alarm sounds',
      icon: isAudioMuted ? Volume2 : VolumeX,
      onSelect: () => {
        toggleAudioMute();
        onClose();
      }
    },

    // Mumbai Operational Themes
    {
      id: 'theme-rail',
      category: 'Theme',
      title: 'Switch Aesthetic: Suburban Rail Control Room (CR/WR)',
      subtitle: 'Indian Railways amber phosphor, hard edges, flat hardware console',
      icon: Palette,
      onSelect: () => {
        setTheme('rail');
        onClose();
      }
    },
    {
      id: 'theme-monsoon',
      category: 'Theme',
      title: 'Switch Aesthetic: Monsoon Meteorological Ops (IMD)',
      subtitle: 'India Meteorological Department deep rain-blue, doppler radar gradients',
      icon: Palette,
      onSelect: () => {
        setTheme('monsoon');
        onClose();
      }
    },
    {
      id: 'theme-metro',
      category: 'Theme',
      title: 'Switch Aesthetic: Civic Metro Line Signage',
      subtitle: 'Mumbai Metro line-coded wayfinding, high-contrast municipal styling',
      icon: Palette,
      onSelect: () => {
        setTheme('metro');
        onClose();
      }
    },
    {
      id: 'theme-glass',
      category: 'Theme',
      title: 'Switch Aesthetic: Classic Deep Glassmorphic',
      subtitle: 'Dark translucent glass cards with cyan accents',
      icon: Palette,
      onSelect: () => {
        setTheme('glass');
        onClose();
      }
    }
  ];

  // Filter commands by query
  const filteredCommands = allCommands.filter(cmd => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-fade-in"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-up">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, screen, sector (e.g. 'BKC', 'Monsoon', 'Forecast')..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Close Command Palette (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1 font-mono">
              <p>No matching commands found for "{query}"</p>
              <p className="text-slate-500">Try searching "Map", "BKC", "Forecast", or "Rain"</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.onSelect()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-sm' 
                      : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-semibold tracking-tight truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 uppercase">
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 border border-white/10">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer Help Keys */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">ESC</kbd> Close</span>
          </div>
          <span className="text-cyan-400 font-semibold hidden sm:inline">CrowdFlow OS Spotlight</span>
        </div>

      </div>
    </div>
  );
};
