import React, { useState } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Hotel, 
  Bus, 
  Utensils, 
  Plus, 
  CheckCircle2, 
  BedDouble, 
  Users, 
  Clock, 
  Layers, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  HeartPulse,
  Radio,
  Sparkles
} from 'lucide-react';

export const OperatorsScreen: React.FC = () => {
  const { 
    activeOperatorTab, 
    setActiveOperatorTab, 
    accommodations, 
    transitRoutes, 
    restaurants, 
    toggleEmergencyBeds,
    addEmergencyShuttle,
    updateRestaurantCapacity
  } = useCrowdFlowStore();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Section 14: Compact Operational Field Units
  const fieldUnits = [
    {
      id: 'sec-alpha',
      unitName: 'Security Unit Alpha',
      role: 'Crowd Holding & Gate Screening',
      location: 'Gate 1 Concourse',
      status: 'critical',
      progress: 92,
      assignedLead: 'Inspector R. Shinde',
      icon: ShieldAlert,
      accent: 'rose'
    },
    {
      id: 'med-3',
      unitName: 'Medical Unit 3',
      role: 'Hydration & Rapid Triage',
      location: 'South Arena Plaza',
      status: 'stable',
      progress: 100,
      assignedLead: 'Dr. A. Verma',
      icon: HeartPulse,
      accent: 'emerald'
    },
    {
      id: 'trans-ctrl',
      unitName: 'Transport Control',
      role: 'Shuttle Injection & Headway',
      location: 'Dadar Multi-Tier Hub',
      status: 'warning',
      progress: 78,
      assignedLead: 'Dispatcher K. Mehta',
      icon: Radio,
      accent: 'amber'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Dedicated Operator Control Consoles</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Real-time frontline portals for accommodation operators, transit controllers, and hospitality dining managers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveOperatorTab('hotel')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeOperatorTab === 'hotel'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Accommodation</span>
          </button>
          <button
            onClick={() => setActiveOperatorTab('transport')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeOperatorTab === 'transport'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transport</span>
          </button>
          <button
            onClick={() => setActiveOperatorTab('restaurant')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeOperatorTab === 'restaurant'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Concessions Hub</span>
          </button>
        </div>
      </div>

      {/* Sync Banner */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Section 14: Compact Operational Field Units */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-semibold">
            Active Tactical Field Units & Deployment Progress
          </span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            3 Tactical Squads On-Site
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
          {fieldUnits.map(unit => {
            const Icon = unit.icon;
            return (
              <div 
                key={unit.id}
                className={`p-4 rounded-2xl panel-interactive border transition-all space-y-3 ${
                  unit.status === 'critical'
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : unit.status === 'warning'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-emerald-500/30 bg-emerald-500/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${
                      unit.status === 'critical' 
                        ? 'bg-rose-500/20 text-rose-400' 
                        : unit.status === 'warning' 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{unit.unitName}</h4>
                      <span className="text-xs text-slate-400">{unit.location}</span>
                    </div>
                  </div>
                  <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-md ${
                    unit.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : unit.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-sans">
                    <span>Task: {unit.role}</span>
                    <span className="font-mono text-white font-bold">{unit.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        unit.status === 'critical'
                          ? 'bg-rose-400'
                          : unit.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${unit.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-white/5 font-sans">
                  <span>Lead: <strong className="text-slate-300 font-normal">{unit.assignedLead}</strong></span>
                  <span className="text-cyan-300 font-mono">Channel 04</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. ACCOMMODATION OPERATOR PORTAL */}
      {activeOperatorTab === 'hotel' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl panel-elevated space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Property Room Inventory & Demand Forecast
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Manage standard room availability, activate emergency buffer dorms, and block group delegate bookings.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                ● Connected to Central State Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.slice(0, 6).map(acc => (
                <div key={acc.id} className="p-4 rounded-2xl panel-interactive space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{acc.name}</h4>
                      <span className="text-xs font-mono text-cyan-400">{acc.zoneName}</span>
                    </div>
                    <StatusBadge status={acc.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Available</span>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{acc.availableRooms}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">6h Demand</span>
                      <div className="text-sm font-bold text-white mt-0.5">+{acc.predictedCheckins}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (!window.confirm(`Activate 50 Emergency Reserve Beds at ${acc.name}? This action cannot be undone.`)) return;
                        toggleEmergencyBeds(acc.id, 50);
                        showNotification(`Added 50 Emergency Reserve Beds to ${acc.name}. Zone pressure recalculated instantly.`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      +50 Beds
                    </button>
                    <button
                      onClick={() => showNotification(`Created VIP Group Block of 20 rooms for ${acc.name}.`)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white glass-tab transition-colors"
                    >
                      Group Block
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TRANSPORT OPERATOR PORTAL */}
      {activeOperatorTab === 'transport' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl panel-elevated space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Fleet Operations & Headway Management
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Monitor active transit lines, track vehicle loads, and deploy emergency stadium express shuttles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transitRoutes.map(route => (
                <div key={route.id} className="p-4 rounded-2xl panel-interactive space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{route.name}</h4>
                      <span className="text-xs font-mono text-slate-400 uppercase">From: {route.fromZone} → {route.toZone}</span>
                    </div>
                    <StatusBadge status={route.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Active Fleet</span>
                      <div className="text-sm font-bold text-white mt-0.5">{route.vehiclesActive}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Headway</span>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{route.nextDeparture}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Delay</span>
                      <div className={`text-sm font-bold mt-0.5 ${route.delayPercentage > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        +{route.delayPercentage}%
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">
                      Seats: {route.seatsRemaining}
                    </span>
                    <button
                      onClick={() => {
                        if (!window.confirm(`Inject 4 Emergency Shuttles on ${route.name}? This action cannot be undone.`)) return;
                        addEmergencyShuttle(route.id, 4);
                        showNotification(`Injected 4 Extra Electric Shuttles into ${route.name}. Dwell time reduced.`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add 4 Shuttles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESTAURANT OPERATOR PORTAL */}
      {activeOperatorTab === 'restaurant' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl panel-elevated space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Concessions, Food Courts & Seating Load
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Update table turnaround times, meal pack reserves, and publish live queue statuses to attendees.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="p-4 rounded-2xl panel-interactive space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{rest.name}</h4>
                      <span className="text-xs font-mono text-cyan-400 uppercase">Zone: {rest.zoneId.toUpperCase()}</span>
                    </div>
                    <StatusBadge status={rest.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Covers</span>
                      <div className="text-sm font-bold text-white mt-0.5">{rest.currentOccupied}/{rest.seatingCapacity}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Wait Time</span>
                      <div className={`text-sm font-bold mt-0.5 ${rest.queueTimeMin > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rest.queueTimeMin} min
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-slate-400 text-xs">Meals Ready</span>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{rest.mealInventoryPacks}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">
                      Peak: {rest.peakForecast}
                    </span>
                    <button
                      onClick={() => {
                        updateRestaurantCapacity(rest.id, Math.max(50, rest.currentOccupied - 150), rest.mealInventoryPacks + 500);
                        showNotification(`Published Capacity Update for ${rest.name}: Restocked +500 meals.`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                    >
                      Restock +500
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
