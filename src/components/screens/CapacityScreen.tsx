import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { StatusBadge } from '../common/StatusBadge';
import { accommodationService } from '../../services/accommodationService';
import { 
  Building2, 
  BedDouble, 
  Compass, 
  Check, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  UploadCloud, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const CapacityScreen: React.FC = () => {
  const { 
    accommodations, 
    zones, 
    updateAccommodationCapacity, 
    toggleEmergencyBeds 
  } = useCrowdFlowStore();

  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Overflow ranked recommendations
  const bkcZone = zones.find(z => z.id === 'bkc');
  const overflowOptions = accommodationService.getRankedOverflowOptions(accommodations, bkcZone?.pressureScore ?? 91);

  // Filtered accommodations
  const filteredAccommodations = accommodations.filter(acc => {
    const matchesZone = selectedZoneFilter === 'all' || acc.zoneId === selectedZoneFilter;
    const matchesStatus = selectedStatusFilter === 'all' || acc.status === selectedStatusFilter;
    const matchesQuery = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || acc.zoneName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesStatus && matchesQuery;
  });

  // Recharts Capacity Trend Data
  const capacityTrendData = [
    { time: '14:00', BKC: 78, Dadar: 70, Goregaon: 48, NaviMumbai: 35, Virar: 22 },
    { time: '15:00', BKC: 84, Dadar: 76, Goregaon: 52, NaviMumbai: 38, Virar: 24 },
    { time: '16:00', BKC: 89, Dadar: 82, Goregaon: 58, NaviMumbai: 42, Virar: 26 },
    { time: '17:00', BKC: 94, Dadar: 86, Goregaon: 62, NaviMumbai: 46, Virar: 28 },
    { time: '18:00', BKC: 98, Dadar: 91, Goregaon: 66, NaviMumbai: 50, Virar: 32 },
    { time: '19:00', BKC: 96, Dadar: 88, Goregaon: 68, NaviMumbai: 52, Virar: 34 },
    { time: '20:00', BKC: 92, Dadar: 84, Goregaon: 65, NaviMumbai: 48, Virar: 30 },
  ];

  const handlePublishUpdate = () => {
    setPublishSuccessMsg('Capacity telemetry published. Synchronized with Command Center & Attendee Portals.');
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <span>Capacity Intelligence & Overflow Engine</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multi-tier occupancy monitoring, predictive check-in curves, and automated buffer rerouting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {publishSuccessMsg && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              {publishSuccessMsg}
            </span>
          )}
          <button
            onClick={handlePublishUpdate}
            className="px-4 py-2 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-glow-cyan-sm transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Publish Capacity Update
          </button>
        </div>
      </div>

      {/* Overflow Accommodation Engine Spotlight (Core Requirement) */}
      <div className="p-5 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Automated Buffer Diversion
              </span>
              <span className="text-xs font-mono text-slate-300">
                Active Benchmark: BKC Pressure Score (91/100)
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Ranked Overflow Accommodation Alternatives
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Evaluated by: Available Beds • Travel Time • Crowd Score • Price Band • Transit Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overflowOptions.slice(0, 3).map(rec => (
            <div
              key={rec.provider.id}
              className="p-4 rounded-2xl bg-dark-900/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    Rank #{rec.rank} • {rec.provider.zoneName}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {rec.provider.name}
                  </h4>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  {rec.priceBand}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Available Beds</span>
                  <span className="text-sm font-bold text-emerald-400">{rec.availableBeds}</span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Travel to Venue</span>
                  <span className="text-sm font-bold text-white">{rec.travelTimeMin} min</span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Crowd Pressure</span>
                  <span className="text-sm font-bold text-cyan-300">{rec.crowdScore} / 100</span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Transit Access</span>
                  <span className="text-sm font-bold text-slate-200">{rec.transitEase}</span>
                </div>
              </div>

              {/* Transparent Recommendation Reason */}
              <div className="p-2.5 rounded-xl bg-dark-850 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
                {rec.explainabilityNote}
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => toggleEmergencyBeds(rec.provider.id, 100)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                >
                  +100 Reserve Beds
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  Safety Index: {rec.safetyScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Trend Chart: Multi-Zone Occupancy Projection */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Hourly Occupancy Dynamics by Zone (%)</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                14:00 - 20:00 Peak Window
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizes the widening gap between saturated central nodes and underutilized northern/eastern buffers.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={capacityTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBKC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDadar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVirar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="BKC" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBKC)" />
              <Area type="monotone" dataKey="Dadar" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorDadar)" />
              <Area type="monotone" dataKey="Goregaon" stroke="#6366F1" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="NaviMumbai" stroke="#38BDF8" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="Virar" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVirar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 25 Accommodation Providers Interactive Table */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Metropolitan Accommodation Inventory</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400">
                {filteredAccommodations.length} Properties Tracked
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live room availability, incoming check-in queues, and reserve buffer controls.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search hotel or zone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48"
              />
            </div>

            <select
              value={selectedZoneFilter}
              onChange={e => setSelectedZoneFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Zones (8)</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="critical">Critical</option>
              <option value="high">High Pressure</option>
              <option value="watch">Watch</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Property</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3 text-right">Total Rooms</th>
                <th className="py-2.5 px-3 text-right">Occupied</th>
                <th className="py-2.5 px-3 text-right">Available</th>
                <th className="py-2.5 px-3 text-right">Check-Ins</th>
                <th className="py-2.5 px-3">Pressure</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAccommodations.map(acc => (
                <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {acc.name}
                      {acc.isEmergencyBuffer && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Buffer
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans">{acc.priceBand} • ₹{acc.pricePerNight.toLocaleString()}/night</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {acc.zoneName}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200">
                    {acc.totalRooms}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 font-semibold">
                    {acc.occupiedRooms}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-bold ${acc.availableRooms < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {acc.availableRooms}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    +{acc.predictedCheckins}
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-24 bg-dark-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          acc.pressure > 90 ? 'bg-rose-500' : acc.pressure > 75 ? 'bg-orange-500' : acc.pressure > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${acc.pressure}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{acc.pressure}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={acc.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleEmergencyBeds(acc.id, 50)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-dark-800 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-white/10 hover:border-cyan-500/40 transition-colors"
                    >
                      +50 Beds
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
