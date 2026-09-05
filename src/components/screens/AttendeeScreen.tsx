import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { routingService } from '../../services/routingService';
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
  AlertTriangle
} from 'lucide-react';

export const AttendeeScreen: React.FC = () => {
  const { 
    activeMobileTab, 
    setActiveMobileTab, 
    accommodations, 
    weather, 
    attendeeIncentives, 
    claimIncentive, 
    reserveStayInterest 
  } = useCrowdFlowStore();

  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeRouteTier, setActiveRouteTier] = useState<'least_crowded' | 'fastest' | 'accessible'>('least_crowded');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  const smartRoutes = routingService.getSmartArrivalPlan('andheri', 'Jio World Convention Centre BKC');
  const currentRoute = smartRoutes.find(r => r.tier === activeRouteTier) || smartRoutes[0];

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

  return (
    <div className="w-full max-w-sm mx-auto min-h-[660px] bg-[#070D18]/90 backdrop-blur-2xl text-[#F8FAFC] rounded-[32px] border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between relative font-sans">
      
      {/* Mobile Top Bar */}
      <div className="pt-3 px-5 pb-2 flex items-center justify-between text-[11px] font-mono text-[#94A3B8] border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        <span>05:05 PM</span>
        <span className="font-semibold text-cyan-electric">CrowdFlow Guide</span>
        <span>5G • 100%</span>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-20">
        
        {/* Toast */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 1. HOME TAB (Sections 16 & 17) */}
        {activeMobileTab === 'home' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Friendly Greeting Header */}
            <div>
              <span className="text-xs text-[#94A3B8] block">Welcome back,</span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Aarav Sharma
              </h2>
            </div>

            {/* DOMINANT HERO CARD: YOUR SMARTEST ARRIVAL PLAN (Section 16) */}
            <div className="p-5 rounded-2xl panel-elevated border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-electric font-semibold">
                  YOUR SMARTEST ARRIVAL PLAN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/25">
                  Recommended
                </span>
              </div>

              {/* 4 Core Hero Data Points */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Departure</span>
                  <div className="text-lg font-bold text-cyan-electric">05:05 PM</div>
                  <span className="text-[10px] text-[#94A3B8]">In 8 mins</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">ETA</span>
                  <div className="text-lg font-bold text-white">42 min</div>
                  <span className="text-[10px] text-emerald-400">On Schedule</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Crowd</span>
                  <div className="text-lg font-bold text-emerald-400">LOW</div>
                  <span className="text-[10px] text-[#94A3B8]">Bypasses Dadar</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab">
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Gate</span>
                  <div className="text-lg font-bold text-cyan-electric">Gate 2 (C)</div>
                  <span className="text-[10px] text-emerald-400">4 min queue</span>
                </div>
              </div>

              {/* Primary Action Button (>= 44px touch target) */}
              <button
                onClick={() => {
                  setIsJourneyStarted(true);
                  setActiveMobileTab('plan');
                }}
                className="w-full h-11 rounded-xl text-xs font-bold text-[#090B10] bg-cyan-electric hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>{isJourneyStarted ? 'Continue Navigation' : 'Start Journey'}</span>
              </button>
            </div>

            {/* Weather / Risk Warning */}
            {weather.weatherRisk > 25 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Passing Coastal Shower</strong>
                  <span>Occasional light rain between 18:00 and 19:30. Covered shuttles operating normally.</span>
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
                    <div className="font-semibold text-white">{inc.reward}</div>
                    <span className="text-[11px] text-[#94A3B8]">{inc.title}</span>
                  </div>
                  <button
                    onClick={() => handleClaimReward(inc.id)}
                    disabled={inc.claimed}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      inc.claimed
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'glass-tab text-cyan-electric hover:text-white'
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
              <p className="text-xs text-[#94A3B8]">
                Stays ranked to help you avoid crowd congestion.
              </p>
            </div>

            <div className="flex gap-2 text-xs font-mono">
              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-tab text-slate-200"
              >
                <option value="all" className="bg-[#09101C]">All Zones</option>
                <option value="virar" className="bg-[#09101C]">Virār (Low Crowd Buffer)</option>
                <option value="navi_mumbai" className="bg-[#09101C]">Navi Mumbai</option>
                <option value="bkc" className="bg-[#09101C]">BKC (High Demand)</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredStays.slice(0, 4).map(stay => (
                <div key={stay.id} className="p-3.5 rounded-xl glass-tab space-y-2 text-xs shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white">{stay.name}</h4>
                      <span className="text-[11px] text-cyan-electric font-mono">{stay.zoneName}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-emerald-400">₹{stay.pricePerNight}</span>
                      <span className="text-[10px] text-[#94A3B8] block">/night</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>{stay.availableRooms} rooms free</span>
                    <span>{stay.travelTimeToVenue}m transit</span>
                    <span className="text-emerald-400 font-bold">Crowd: {stay.crowdScore}/100</span>
                  </div>

                  <button
                    onClick={() => handleClaimReward('rew_hotel')}
                    className="w-full py-2 rounded-lg bg-cyan-electric/15 text-cyan-electric hover:bg-cyan-500/25 border border-cyan-500/30 font-bold transition-colors font-mono"
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
          <div className="space-y-3 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-white">Live Route Guidance</h3>
              <p className="text-xs text-[#94A3B8]">
                Arrive smoothly without waiting in concourse queues.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              {[
                { id: 'least_crowded', label: 'Bypass' },
                { id: 'fastest', label: 'Fastest' },
                { id: 'accessible', label: 'Step-Free' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveRouteTier(t.id as any)}
                  className={`py-1.5 rounded-lg text-center border transition-colors ${
                    activeRouteTier === t.id
                      ? 'bg-cyan-500/20 text-cyan-electric border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'glass-tab text-[#94A3B8]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl panel-elevated space-y-3 text-xs shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div>
                  <span className="font-bold text-white block">{currentRoute.title}</span>
                  <span className="text-[11px] text-cyan-electric font-mono">{currentRoute.totalTimeMin} min total</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-emerald-400 block">ETA {currentRoute.eta}</span>
                  <span className="text-[10px] text-[#94A3B8]">{currentRoute.assignedGate}</span>
                </div>
              </div>

              {/* Turn by turn */}
              <div className="space-y-2">
                {currentRoute.steps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg glass-tab">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-electric font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-slate-200">{s.instruction}</div>
                      <span className="text-[10px] font-mono text-[#94A3B8]">{s.durationMin}m • {s.mode.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. ADVISORIES / ALERTS TAB */}
        {activeMobileTab === 'alerts' && (
          <div className="space-y-3 animate-fade-in text-xs">
            <div>
              <h3 className="text-base font-bold text-white">Attendee Advisories</h3>
              <p className="text-xs text-[#94A3B8]">
                Real-time updates regarding gate queues and transit shuttles.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1 backdrop-blur-md">
                <span className="text-[10px] font-mono text-cyan-electric font-bold uppercase">Gate 2 Express Open</span>
                <p className="text-slate-200">
                  Digital badge holders can use Gate 2 with under 4 minutes queue time.
                </p>
              </div>

              <div className="p-3.5 rounded-xl glass-tab space-y-1 shadow-sm">
                <span className="text-[10px] font-mono text-[#94A3B8] font-bold uppercase">Shuttle Departure</span>
                <p className="text-slate-300">
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
              <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-electric">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Aarav Sharma</h3>
                <span className="text-[11px] font-mono text-cyan-electric">Delegate Pass • Verified</span>
              </div>

              {/* QR representation */}
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl shadow-lg flex items-center justify-center text-black">
                <div className="w-full h-full border-2 border-black p-2 flex flex-col justify-between items-center">
                  <div className="w-full flex justify-between">
                    <div className="w-6 h-6 bg-black"></div>
                    <div className="w-6 h-6 bg-black"></div>
                  </div>
                  <div className="font-mono font-bold text-[10px] text-center">
                    CROWDFLOW-2026<br/>GATE-2-OK
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-6 h-6 bg-black"></div>
                    <div className="w-3 h-3 bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#94A3B8]">
                Assigned: Jio World Convention Centre<br/>
                Entry Window: 17:00 - 19:30
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation (Section 17) */}
      <nav className="h-16 border-t border-white/[0.08] bg-white/[0.03] backdrop-blur-lg flex items-center justify-around text-[10px] font-mono text-[#94A3B8]">
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
                isActive ? 'text-cyan-electric font-bold' : 'hover:text-white'
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
