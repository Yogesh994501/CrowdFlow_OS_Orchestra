import React, { useState, useEffect } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { routingService } from '../../services/routingService';
import { soundService } from '../../services/soundService';
import { 
  Home, 
  MapPin, 
  Navigation, 
  Bell, 
  User, 
  QrCode, 
  Clock, 
  CloudRain, 
  Check, 
  Gift, 
  BedDouble, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Bus,
  Sparkles,
  Ticket,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Train,
  Footprints,
  CheckCheck,
  Flag,
  Radio
} from 'lucide-react';

export const AttendeeScreen: React.FC = () => {
  const { 
    activeMobileTab, 
    setActiveMobileTab, 
    accommodations, 
    weather, 
    attendeeIncentives, 
    claimIncentive, 
    reserveStayInterest,
    currentScenario 
  } = useCrowdFlowStore();

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<'andheri' | 'dadar' | 'colaba' | 'navi_mumbai'>('andheri');
  const [activeRouteTier, setActiveRouteTier] = useState<'least_crowded' | 'fastest' | 'accessible'>('least_crowded');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  // Scenario-reactive & Origin-specific dynamic smart routes
  const smartRoutes = routingService.getSmartArrivalPlan(selectedOrigin, 'Jio World Convention Centre BKC', currentScenario);
  const currentRoute = smartRoutes.find(r => r.tier === activeRouteTier) || smartRoutes[0];

  // Speech synthesis helper
  const speakInstruction = (text: string) => {
    if (isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is disabled or blocked
    }
  };

  // Auto-simulate GPS walkthrough
  useEffect(() => {
    let timer: any = null;
    if (isAutoSimulating) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < currentRoute.steps.length - 1) {
            const next = prev + 1;
            soundService.playTickClick();
            return next;
          } else {
            setIsAutoSimulating(false);
            soundService.playSuccessChime();
            setToastMsg('Destination reached! Welcome to Jio World Convention Centre.');
            setTimeout(() => setToastMsg(null), 4000);
            return prev;
          }
        });
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoSimulating, currentRoute.steps.length]);

  // Read instruction aloud when step changes during active navigation
  useEffect(() => {
    if ((isNavigating || isAutoSimulating) && currentRoute.steps[currentStepIndex]) {
      speakInstruction(currentRoute.steps[currentStepIndex].instruction);
    }
  }, [currentStepIndex, isNavigating, isAutoSimulating]);

  const handleOriginChange = (origin: 'andheri' | 'dadar' | 'colaba' | 'navi_mumbai') => {
    setSelectedOrigin(origin);
    setCurrentStepIndex(0);
    setIsAutoSimulating(false);
    soundService.playTickClick();
    setToastMsg(`Route updated from ${origin.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTierChange = (tier: 'least_crowded' | 'fastest' | 'accessible') => {
    setActiveRouteTier(tier);
    setCurrentStepIndex(0);
    setIsAutoSimulating(false);
    soundService.playTickClick();
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setIsJourneyStarted(true);
    soundService.playSuccessChime();
    setToastMsg(`Turn-by-turn guidance active for ${currentRoute.title}`);
    setTimeout(() => setToastMsg(null), 3000);
    speakInstruction(currentRoute.steps[currentStepIndex]?.instruction || 'Navigation started');
  };

  const handleToggleAutoSim = () => {
    if (isAutoSimulating) {
      setIsAutoSimulating(false);
      soundService.playTickClick();
      setToastMsg('GPS route simulation paused.');
      setTimeout(() => setToastMsg(null), 2500);
    } else {
      setIsNavigating(true);
      setIsAutoSimulating(true);
      soundService.playTickClick();
      setToastMsg('GPS route simulation running (auto-advancing waypoints)...');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentRoute.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      soundService.playTickClick();
    } else {
      soundService.playSuccessChime();
      setToastMsg('You have arrived at the event pavilion!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      soundService.playTickClick();
    }
  };

  const handleResetNavigation = () => {
    setCurrentStepIndex(0);
    setIsAutoSimulating(false);
    soundService.playTickClick();
    setToastMsg('Waypoints reset to start.');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const filteredStays = accommodations.filter(acc => {
    return selectedZone === 'all' || acc.zoneId === selectedZone;
  });

  const handleReserveInterest = (id: string, name: string) => {
    reserveStayInterest(id);
    setToastMsg(`Interest noted for ${name}. Digital pass updated.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleClaimReward = (id: string) => {
    claimIncentive(id);
    setToastMsg('Reward voucher added to your event wallet!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const originLabels: Record<string, string> = {
    andheri: 'Andheri Hub',
    dadar: 'Dadar Junction',
    colaba: 'Colaba Gateway',
    navi_mumbai: 'Navi Mumbai'
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originLabels[selectedOrigin] + ' Mumbai')}&destination=Jio+World+Convention+Centre+BKC+Mumbai&travelmode=transit`;

  const getStepModeIcon = (mode: string) => {
    switch (mode) {
      case 'rail':
      case 'metro':
        return <Train className="w-3.5 h-3.5 text-cyan-400" />;
      case 'bus':
      case 'shuttle':
        return <Bus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'walking':
      default:
        return <Footprints className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full md:max-w-sm mx-auto min-h-screen md:min-h-[680px] panel-elevated text-slate-100 rounded-none md:rounded-[32px] border-0 md:border md:border-white/15 shadow-none md:shadow-2xl overflow-hidden flex flex-col justify-between relative font-sans">
      
      {/* Mobile Top Bar */}
      <div className="pt-3 px-5 pb-2 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
        <span>05:05 PM</span>
        <span className="font-semibold text-cyan-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          CrowdFlow Companion
        </span>
        <span>5G • 100%</span>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-20">
        
        {/* Toast */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in backdrop-blur-md shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 1. HOME TAB (Section 17: Mobile-First Attendee Architecture) */}
        {activeMobileTab === 'home' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Friendly Greeting Header & Status Beacon */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-sans">Good Evening 👋</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Entry Normal
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Aarav Sharma</span>
              </h1>
            </div>

            {/* DOMINANT HERO CARD: Recommended Action (Section 17) */}
            <div className="p-5 rounded-2xl panel-elevated border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  RECOMMENDED ACTION
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25">
                  Optimal Flow
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-snug font-sans">
                  Use Gate B (🚶 6 min walk, 👥 Moderate crowd)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">
                  Turnstile congestion at Gate 1 is surging. Gate B offers express badge screening with minimal dwell time.
                </p>
              </div>

              {/* 4 Core Hero Data Points */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-xs text-slate-400 uppercase block">Departure</span>
                  <div className="text-lg font-bold text-cyan-300">05:05 PM</div>
                  <span className="text-xs text-slate-400">In 8 mins</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-xs text-slate-400 uppercase block">ETA</span>
                  <div className="text-lg font-bold text-white">42 min</div>
                  <span className="text-xs text-emerald-400">On Schedule</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-xs text-slate-400 uppercase block">Crowd</span>
                  <div className="text-lg font-bold text-emerald-400">LOW</div>
                  <span className="text-xs text-slate-400">Bypasses Dadar</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-xs text-slate-400 uppercase block">Concourse</span>
                  <div className="text-lg font-bold text-cyan-300">Gate B (North)</div>
                  <span className="text-xs text-emerald-400 font-medium">3 min queue</span>
                </div>
              </div>

              {/* Primary Action Button (>= 44px touch target) */}
              <button
                onClick={() => {
                  setIsJourneyStarted(true);
                  setIsNavigating(true);
                  setActiveMobileTab('plan');
                }}
                className="w-full h-11 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>{isJourneyStarted ? 'Continue Navigation' : 'Start Navigation'}</span>
              </button>
            </div>

            {/* Quick Access Tiles (Section 17) */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Quick Access Modules
              </span>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono text-center">
                <button
                  onClick={() => setActiveMobileTab('map')}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <BedDouble className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-200">🏨 Stay</span>
                </button>
                <button
                  onClick={() => setActiveMobileTab('plan')}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <Bus className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-200">🚇 Travel</span>
                </button>
                <button
                  onClick={() => setActiveMobileTab('profile')}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-200">🎟 Pass</span>
                </button>
                <button
                  onClick={() => setActiveMobileTab('alerts')}
                  className="p-3 rounded-xl glass-tab hover:border-cyan-400/40 transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span className="text-xs text-slate-200">🔔 Alerts</span>
                </button>
              </div>
            </div>

            {/* Weather Alert */}
            {weather.weatherRisk >= 40 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <strong className="block font-semibold">Passing Coastal Shower</strong>
                  <span className="text-xs text-amber-200/90">Occasional light rain between 18:00 and 19:30. Covered shuttles operating normally.</span>
                </div>
              </div>
            )}

            {/* Attendee Perks & Vouchers */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">
                Recommended Off-Peak Rewards
              </span>
              {attendeeIncentives.slice(0, 2).map(inc => (
                <div key={inc.id} className="p-3 rounded-xl glass-tab flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <div className="font-semibold text-white font-sans">{inc.reward}</div>
                    <span className="text-xs text-slate-400 font-sans">{inc.title}</span>
                  </div>
                  <button
                    onClick={() => handleClaimReward(inc.id)}
                    disabled={inc.claimed}
                    className={`h-8 px-3 rounded-xl text-xs font-mono font-semibold transition-colors shrink-0 ${
                      inc.claimed
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'glass-tab text-cyan-300 hover:text-white'
                    }`}
                  >
                    {inc.claimed ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 2. STAYS / MAP TAB */}
        {activeMobileTab === 'map' && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-white">Recommended Accommodation</h3>
              <p className="text-xs text-slate-400">
                Stays ranked to help you avoid crowd congestion.
              </p>
            </div>

            <div className="flex gap-2 text-xs font-mono">
              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-tab text-slate-200 focus:outline-none"
              >
                <option value="all" className="bg-slate-900">All Zones</option>
                <option value="virar" className="bg-slate-900">Virār (Low Crowd Buffer)</option>
                <option value="navi_mumbai" className="bg-slate-900">Navi Mumbai</option>
                <option value="bkc" className="bg-slate-900">BKC (High Demand)</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredStays.slice(0, 4).map(stay => (
                <div key={stay.id} className="p-3.5 rounded-xl glass-tab space-y-2 text-xs shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white font-sans">{stay.name}</h4>
                      <span className="text-xs text-cyan-300 font-mono">{stay.zoneName}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-emerald-400">₹{stay.pricePerNight}</span>
                      <span className="text-xs text-slate-400 block">/night</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{stay.availableRooms} rooms free</span>
                    <span>{stay.travelTimeToVenue}m transit</span>
                    <span className="text-emerald-400 font-bold">Crowd: {stay.crowdScore}/100</span>
                  </div>

                  <button
                    onClick={() => handleReserveInterest(stay.id, stay.name)}
                    className="w-full py-2 rounded-xl bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 font-bold transition-colors font-mono text-xs"
                  >
                    Reserve Buffer Stay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PLAN / LIVE ROUTE TAB */}
        {activeMobileTab === 'plan' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-sans">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  Live Route Guidance
                </h3>
                <p className="text-xs text-slate-400">
                  Turn-by-turn multi-modal navigation to BKC.
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold ${
                isNavigating 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-white/10'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isNavigating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {isNavigating ? (isAutoSimulating ? 'SIMULATING' : 'GPS ACTIVE') : 'STANDBY'}
              </span>
            </div>

            {/* Departure Origin Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 uppercase tracking-wider text-cyan-300 font-semibold">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Departure Hub
                </span>
                <span className="text-[10px] text-slate-400">Tap to reroute</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {[
                  { id: 'andheri', label: 'Andheri Hub', subtitle: 'Western Rail / Metro 3' },
                  { id: 'dadar', label: 'Dadar Junction', subtitle: 'Central Line & Depot' },
                  { id: 'colaba', label: 'Colaba Gateway', subtitle: 'Coastal Road Express' },
                  { id: 'navi_mumbai', label: 'Navi Mumbai', subtitle: 'Atal Setu / Harbour' },
                ].map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => handleOriginChange(hub.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedOrigin === hub.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md font-semibold'
                        : 'glass-tab text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs text-white font-bold leading-none">{hub.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">{hub.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Route Tier Strategy */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Route Strategy
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {[
                  { id: 'least_crowded', label: 'Bypass (Low Crowd)' },
                  { id: 'fastest', label: 'Fastest Transit' },
                  { id: 'accessible', label: 'Step-Free Access' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleTierChange(t.id as any)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all text-xs ${
                      activeRouteTier === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                        : 'glass-tab text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Turn-by-Turn Navigation HUD Card */}
            <div className="p-4 rounded-2xl panel-elevated border-cyan-500/40 space-y-3.5 text-xs shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div>
                  <span className="font-bold text-white block font-sans text-sm leading-snug">{currentRoute.title}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-cyan-300">
                    <span>{currentRoute.totalTimeMin} min</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">ETA {currentRoute.eta}</span>
                    <span>•</span>
                    <span className="text-slate-400">{currentRoute.assignedGate}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentRoute.crowdRating === 'Low' 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {currentRoute.crowdRating.toUpperCase()} CROWD
                  </span>
                </div>
              </div>

              {/* Waypoint Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>WAYPOINT {currentStepIndex + 1} OF {currentRoute.steps.length}</span>
                  <span>{Math.round(((currentStepIndex + 1) / currentRoute.steps.length) * 100)}% COMPLETED</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / currentRoute.steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Active Waypoint Card */}
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold">
                    {getStepModeIcon(currentRoute.steps[currentStepIndex]?.mode || 'walking')}
                    <span className="uppercase">{currentRoute.steps[currentStepIndex]?.mode} LEG</span>
                    <span className="text-[10px] text-slate-400 font-normal">({currentRoute.steps[currentStepIndex]?.durationMin}m • {currentRoute.steps[currentStepIndex]?.distanceMeters}m)</span>
                  </div>
                  <button
                    onClick={() => speakInstruction(currentRoute.steps[currentStepIndex]?.instruction || '')}
                    className="p-1 rounded-lg glass-tab hover:text-cyan-300 text-slate-400 transition-colors"
                    title="Speak instruction aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-white text-xs font-semibold leading-relaxed font-sans">
                  {currentRoute.steps[currentStepIndex]?.instruction}
                </div>
              </div>

              {/* Navigation Action Buttons Row */}
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className={`py-2 px-2 rounded-xl text-center border flex items-center justify-center gap-1 transition-all ${
                    currentStepIndex === 0
                      ? 'opacity-40 cursor-not-allowed glass-tab text-slate-500'
                      : 'glass-tab text-slate-200 hover:text-white hover:border-cyan-400/40'
                  }`}
                  title="Previous Step"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={handleToggleAutoSim}
                  className={`py-2 px-2 rounded-xl text-center border flex items-center justify-center gap-1 transition-all ${
                    isAutoSimulating
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25 font-bold'
                  }`}
                  title="Auto-step through waypoints at 3.5s interval"
                >
                  {isAutoSimulating ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Auto</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex >= currentRoute.steps.length - 1}
                  className={`py-2 px-2 rounded-xl text-center border flex items-center justify-center gap-1 transition-all ${
                    currentStepIndex >= currentRoute.steps.length - 1
                      ? 'opacity-40 cursor-not-allowed glass-tab text-slate-500'
                      : 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold hover:brightness-110 shadow-sm'
                  }`}
                  title="Next Step"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetNavigation}
                  className="py-2 px-2 rounded-xl text-center glass-tab text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
                  title="Reset to beginning"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Secondary Controls Bar */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <button
                  onClick={() => {
                    setIsVoiceMuted(!isVoiceMuted);
                    soundService.playTickClick();
                    setToastMsg(isVoiceMuted ? 'Voice prompts enabled' : 'Voice prompts muted');
                    setTimeout(() => setToastMsg(null), 2000);
                  }}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  {isVoiceMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>Voice: Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Voice: Audio On</span>
                    </>
                  )}
                </button>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>External Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Arrival Celebration State Banner */}
            {currentStepIndex === currentRoute.steps.length - 1 && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs space-y-2.5 animate-fade-in shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-300 font-bold font-sans">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm">Arrived at Venue Perimeter!</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">
                  You have successfully reached {currentRoute.assignedGate}. Security queue is currently under 4 minutes.
                </p>
                <button
                  onClick={() => {
                    setActiveMobileTab('profile');
                    soundService.playSuccessChime();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 text-slate-950 font-bold text-xs font-mono shadow-md flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Digital Pass QR Code</span>
                </button>
              </div>
            )}

            {/* Interactive Step-by-Step Waypoint List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <span>All Waypoints (Tap any step to jump)</span>
                <span>{currentRoute.steps.length} Steps</span>
              </div>

              <div className="space-y-2">
                {currentRoute.steps.map((s, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isPassed = idx < currentStepIndex;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setIsNavigating(true);
                        soundService.playTickClick();
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                          : isPassed
                          ? 'bg-emerald-500/5 border-emerald-500/25 opacity-75 hover:opacity-100'
                          : 'glass-tab border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isPassed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-500/40">
                            <CheckCheck className="w-3.5 h-3.5" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-mono text-xs font-bold shadow-sm animate-pulse">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center font-mono text-xs font-bold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono">
                            {getStepModeIcon(s.mode)}
                            <span className="uppercase text-slate-300 font-semibold">{s.mode}</span>
                            <span className="text-slate-500">• {s.durationMin} min</span>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                          {isPassed && (
                            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
                              Passed
                            </span>
                          )}
                        </div>

                        <div className={`font-sans text-xs leading-relaxed ${
                          isCurrent 
                            ? 'text-white font-semibold' 
                            : isPassed 
                            ? 'text-slate-300' 
                            : 'text-slate-400'
                        }`}>
                          {s.instruction}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. ADVISORIES / ALERTS TAB */}
        {activeMobileTab === 'alerts' && (
          <div className="space-y-3 animate-fade-in text-xs">
            <div>
              <h3 className="text-base font-bold text-white">Attendee Advisories</h3>
              <p className="text-xs text-slate-400">
                Real-time updates regarding gate queues and transit shuttles.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1 backdrop-blur-md">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">Gate 2 Express Open</span>
                <p className="text-slate-200 font-sans leading-relaxed">
                  Digital badge holders can use Gate 2 with under 4 minutes queue time.
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-tab space-y-1 shadow-sm">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase">Shuttle Departure</span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Electric express coaches departing every 6 minutes from Dadar East Depot.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. PASS TAB */}
        {activeMobileTab === 'profile' && (
          <div className="space-y-4 animate-fade-in text-center text-xs">
            <div className="p-5 rounded-2xl panel-elevated space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-300">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">Aarav Sharma</h3>
                <span className="text-xs font-mono text-cyan-300">Delegate Pass • Verified</span>
              </div>

              {/* QR representation */}
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl shadow-lg flex items-center justify-center text-black">
                <div className="w-full h-full border-2 border-black p-2 flex flex-col justify-between items-center">
                  <div className="w-full flex justify-between">
                    <div className="w-6 h-6 bg-black"></div>
                    <div className="w-6 h-6 bg-black"></div>
                  </div>
                  <div className="font-mono font-bold text-xs text-center">
                    CROWDFLOW-2026<br/>GATE-B-OK
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-6 h-6 bg-black"></div>
                    <div className="w-3 h-3 bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Assigned: Jio World Convention Centre<br/>
                Entry Window: 17:00 - 19:30
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation (Section 17) */}
      <nav className="h-16 border-t border-white/[0.08] bg-black/50 backdrop-blur-lg flex items-center justify-around text-xs font-mono text-slate-400">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'map', label: 'Stays', icon: BedDouble },
          { id: 'plan', label: 'Route', icon: Navigation },
          { id: 'alerts', label: 'Alerts', icon: Bell },
          { id: 'profile', label: 'Pass', icon: QrCode },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeMobileTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMobileTab(item.id as any)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
                isActive ? 'text-cyan-300 font-bold' : 'hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
