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
  CheckCircle2 
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
    zones 
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
    setNotification('Added 4 high-capacity electric emergency shuttles. Route capacity expanded by +180 seats/hr.');
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
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-dark-800 hover:bg-dark-750 border border-cyan-500/30 hover:border-cyan-500/60 shadow-glow-cyan-sm transition-all flex items-center gap-2"
          >
            <Repeat className="w-4 h-4 text-cyan-400" />
            Redirect Dadar Arrivals
          </button>
        </div>
      </div>

      {/* Multimodal Timeline Bar Chart */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
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
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
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
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
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
              className={`p-4 rounded-2xl glass-panel border transition-all space-y-3 ${
                c.status === 'critical'
                  ? 'border-rose-500/40 bg-rose-500/5 shadow-glow-critical'
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
                  <span className="block text-[10px] text-slate-400 font-mono">Delay Index</span>
                </div>
              </div>

              {/* Travel Time Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-dark-900 border border-white/5">
                  <span className="text-[10px] text-slate-400">Normal Travel</span>
                  <div className="text-sm font-bold text-slate-300">{c.normalTravelTime} min</div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-white/5">
                  <span className="text-[10px] text-slate-400">Current Travel</span>
                  <div className={`text-sm font-bold ${c.currentTravelTime > 20 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {c.currentTravelTime} min
                  </div>
                </div>
              </div>

              {/* Peak & Primary Cause */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Predicted Peak:</span>
                  <strong className="text-white">{c.predictedPeakTime}</strong>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-tight">
                  <strong className="text-slate-300">Cause:</strong> {c.primaryCause}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shuttle Operations & Management Table */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Event Shuttle Fleet Dispatch</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-cyan-300">
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
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
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
                    <div className="font-bold text-white">{route.name}</div>
                    <div className="text-[10px] text-slate-400 font-sans">Tier: {route.routeTier.toUpperCase()}</div>
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
                      className="px-3 py-1 rounded-lg text-xs font-bold text-dark-950 bg-cyan-400 hover:bg-cyan-300 shadow-glow-cyan-sm transition-all inline-flex items-center gap-1"
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
