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
  TrendingUp
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

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Dedicated Operator Control Consoles</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time frontline portals for accommodation operators, transit controllers, and hospitality dining managers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-900 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveOperatorTab('hotel')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeOperatorTab === 'hotel'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Accommodation Console</span>
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
            <span>Transport Controller</span>
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
            <span>Dining / Concession Hub</span>
          </button>
        </div>
      </div>

      {/* Sync Banner */}
      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. ACCOMMODATION OPERATOR PORTAL */}
      {activeOperatorTab === 'hotel' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Property Room Inventory & Demand Forecast
                </h3>
                <p className="text-xs text-slate-400">
                  Manage standard room availability, activate emergency buffer dorms, and block group delegate bookings.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                ● Connected to Central State Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.slice(0, 6).map(acc => (
                <div key={acc.id} className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{acc.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{acc.zoneName}</span>
                    </div>
                    <StatusBadge status={acc.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Available</span>
                      <div className="text-sm font-bold text-emerald-400">{acc.availableRooms}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">6h Demand</span>
                      <div className="text-sm font-bold text-white">+{acc.predictedCheckins}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        toggleEmergencyBeds(acc.id, 50);
                        showNotification(`Added 50 Emergency Reserve Beds to ${acc.name}. Zone pressure recalculated instantly.`);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      +50 Emerg. Beds
                    </button>
                    <button
                      onClick={() => showNotification(`Created VIP Group Block of 20 rooms for ${acc.name}.`)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-white bg-dark-800 border border-white/10 transition-colors"
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
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Fleet Operations & Headway Management
                </h3>
                <p className="text-xs text-slate-400">
                  Monitor active transit lines, track vehicle loads, and deploy emergency stadium express shuttles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transitRoutes.map(route => (
                <div key={route.id} className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{route.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">From: {route.fromZone} → {route.toZone}</span>
                    </div>
                    <StatusBadge status={route.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Active Fleet</span>
                      <div className="text-sm font-bold text-white">{route.vehiclesActive}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Headway</span>
                      <div className="text-sm font-bold text-cyan-300">{route.nextDeparture}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Delay</span>
                      <div className={`text-sm font-bold ${route.delayPercentage > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        +{route.delayPercentage}%
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Seats: {route.seatsRemaining}
                    </span>
                    <button
                      onClick={() => {
                        addEmergencyShuttle(route.id, 4);
                        showNotification(`Injected 4 Extra Electric Shuttles into ${route.name}. Dwell time reduced.`);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-400 hover:bg-cyan-300 text-dark-950 shadow-glow-cyan-sm transition-all flex items-center gap-1"
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
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Concessions, Food Courts & Seating Load
                </h3>
                <p className="text-xs text-slate-400">
                  Update table turnaround times, meal pack reserves, and publish live queue statuses to attendees.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rest.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">Zone: {rest.zoneId.toUpperCase()}</span>
                    </div>
                    <StatusBadge status={rest.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Covers</span>
                      <div className="text-sm font-bold text-white">{rest.currentOccupied}/{rest.seatingCapacity}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Wait Time</span>
                      <div className={`text-sm font-bold ${rest.queueTimeMin > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rest.queueTimeMin} min
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-800 border border-white/5">
                      <span className="text-slate-400 text-[10px]">Meals Ready</span>
                      <div className="text-sm font-bold text-emerald-400">{rest.mealInventoryPacks}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Peak: {rest.peakForecast}
                    </span>
                    <button
                      onClick={() => {
                        updateRestaurantCapacity(rest.id, Math.max(50, rest.currentOccupied - 150), rest.mealInventoryPacks + 500);
                        showNotification(`Published Capacity Update for ${rest.name}: Restocked +500 meals.`);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
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
