import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Bus, 
  Train, 
  Navigation, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Repeat, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Car,
  Compass,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const MobilityScreen: React.FC = () => {
  const { 
    transitRoutes, 
    congestionCorridors, 
    addEmergencyShuttle, 
    redirectTransitArrivals, 
    setActiveScreen
  } = useCrowdFlowStore();

  const [notification, setNotification] = useState<string | null>(null);

  // Multimodal Load Timeline Bar Chart Data
  const modalLoadData = [
    { time: '15:00', Metro: 64, Rail: 58, Bus: 42, Shuttle: 50, Rideshare: 72 },
    { time: '16:00', Metro: 72, Rail: 68, Bus: 48, Shuttle: 60, Rideshare: 78 },
    { time: '17:00', Metro: 82, Rail: 80, Bus: 58, Shuttle: 75, Rideshare: 86 },
    { time: '18:00', Metro: 91, Rail: 89, Bus: 70, Shuttle: 94, Rideshare: 95 },
    { time: '19:00', Metro: 88, Rail: 85, Bus: 68, Shuttle: 88, Rideshare: 92 },
    { time: '20:00', Metro: 78, Rail: 75, Bus: 55, Shuttle: 70, Rideshare: 80 },
  ];

  const handleAddShuttle = (routeId: string) => {
    addEmergencyShuttle(routeId, 4);
    setNotification('Dispatched 4 high-capacity electric emergency shuttles. Fleet throughput expanded by +180 seats/hr.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRedirectArrivals = () => {
    redirectTransitArrivals('dadar', 'navi_mumbai');
    setNotification('Rerouted 1,200 arriving transit passengers via MTHL Express Coach, reducing Dadar platform load.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bus className="w-6 h-6 text-cyan-400" />
            <span>Mobility Control & Multimodal Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time headway regulation, corridor dwell monitoring, and automated emergency shuttle fleet injection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              {notification}
            </span>
          )}
          <button
            onClick={handleRedirectArrivals}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white glass-tab border border-cyan-500/30 hover:border-cyan-500/60 shadow-sm transition-all flex items-center gap-2"
          >
            <Repeat className="w-4 h-4 text-cyan-400" />
            Redirect Dadar Arrivals
          </button>
        </div>
      </div>

      {/* Section 11 & 14: Real-Time Mobility Command (Pillars & Contextual Intelligence) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Multimodal Real-Time Utilization Pillars */}
        <div className="lg:col-span-8 p-5 rounded-2xl panel-elevated space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Multimodal Network Telemetry
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Live Headway Sync
              </span>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Overall Transit Load: 78%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 font-mono">
            {/* Metro */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-cyan-400" />
                  Metro Line 3
                </span>
                <span className="text-xs font-bold text-cyan-300">82%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '82%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Headway: 3.5m</span>
                <span className="text-amber-400 font-medium">Surging</span>
              </div>
            </div>

            {/* Bus Network */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-emerald-400" />
                  Bus Network
                </span>
                <span className="text-xs font-bold text-emerald-400">58%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '58%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Active: 84 units</span>
                <span className="text-emerald-400 font-medium">Optimal</span>
              </div>
            </div>

            {/* Shuttle Fleet */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-amber-400" />
                  Shuttle Fleet
                </span>
                <span className="text-xs font-bold text-amber-400">74%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '74%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Capacity: 4.8k/h</span>
                <span className="text-amber-400 font-medium">Elevated</span>
              </div>
            </div>

            {/* Parking Buffers */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-rose-400" />
                  Parking Hubs
                </span>
                <span className="text-xs font-bold text-rose-400">88%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '88%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>BKC: 180 spots</span>
                <span className="text-rose-400 font-medium">Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Intelligence Callout & Quick Action Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl panel-elevated border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                Contextual Intelligence
              </span>
              <span className="text-slate-500 font-mono">Real-time inference</span>
            </div>
            
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed font-sans">
                <strong className="text-white font-semibold">South Corridor traffic increased 22%</strong> after Main Stage program ended. Transit routing model recommends activating 4 extra shuttles on Dadar–BKC Express.
              </p>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 pt-1 border-t border-cyan-500/10">
                <span>Confidence: 94.2%</span>
                <span>Latency: 1.2s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAddShuttle('shuttle-bkc-dadar')}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Activate Shuttle</span>
            </button>
            <button
              onClick={() => setActiveScreen('map')}
              className="py-2 px-3 rounded-xl text-xs font-mono font-semibold text-slate-300 glass-tab hover:text-white transition-all flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Map</span>
            </button>
          </div>
        </div>

      </div>

      {/* Multimodal Timeline Bar Chart */}
      <div className="p-5 rounded-2xl panel-elevated space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Transit Mode Congestion Timeline (% Utilization)</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                Hourly Peak Projection
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative load across underground Metro, Western/Central Rail, BEST Buses, Shuttles, and Rideshare.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modalLoadData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} fontFamily="monospace" />
              <YAxis stroke="#64748B" fontSize={12} fontFamily="monospace" domain={[0, 100]} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: '#0E1528', 
                  borderColor: 'rgba(6,182,212,0.3)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
              <Bar dataKey="Metro" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Rail" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Bus" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Shuttle" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Rideshare" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Congestion Corridor Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Arterial Congestion Corridors</span>
              <span className="text-xs font-mono text-slate-400">(6 Monitored Segments)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live delay calculations comparing typical non-event flow against current event telemetry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {congestionCorridors.map(c => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl panel-interactive transition-all space-y-3 ${
                c.status === 'critical'
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : c.status === 'high'
                  ? 'border-orange-500/30 bg-orange-500/5'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <StatusBadge status={c.status} size="sm" />
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                    {c.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-mono font-bold ${c.delayPercentage > 100 ? 'text-rose-400' : 'text-amber-400'}`}>
                    +{c.delayPercentage}%
                  </span>
                  <span className="block text-xs text-slate-400 font-mono">Delay Index</span>
                </div>
              </div>

              {/* Travel Time Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-slate-400">Normal Travel</span>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">{c.normalTravelTime} min</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-slate-400">Current Travel</span>
                  <div className={`text-sm font-bold mt-0.5 ${c.currentTravelTime > 20 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {c.currentTravelTime} min
                  </div>
                </div>
              </div>

              {/* Peak & Primary Cause */}
              <div className="text-xs space-y-1 pt-1 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Predicted Peak:</span>
                  <strong className="text-white font-mono">{c.predictedPeakTime}</strong>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  <strong className="text-slate-300">Cause:</strong> {c.primaryCause}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shuttle Operations & Management Table */}
      <div className="p-5 rounded-2xl panel-elevated space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Event Shuttle Fleet Dispatch</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Live Headway Control
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct point-to-point stadium shuttles connecting transit hubs and overflow accommodation.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3">Route Corridor</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Vehicles Active</th>
                <th className="py-2.5 px-3 text-right">Seats Available</th>
                <th className="py-2.5 px-3 text-right">Wait Time</th>
                <th className="py-2.5 px-3">Next Departure</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transitRoutes.map(route => (
                <tr key={route.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-sans">{route.name}</div>
                    <div className="text-xs text-slate-400 font-mono">Tier: {route.routeTier.toUpperCase()}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 uppercase">
                    {route.type}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200 font-semibold">
                    {route.vehiclesActive}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {route.seatsRemaining.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {route.waitTime} min
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-semibold">
                    {route.nextDeparture}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={route.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleAddShuttle(route.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-all inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add Shuttle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
