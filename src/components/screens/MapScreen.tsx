import React, { useState, useEffect, useRef } from 'react';
import { useCrowdFlowStore } from '../../store/useCrowdFlowStore';
import { StatusBadge } from '../common/StatusBadge';
import { PressureScoreBadge } from '../common/PressureScoreBadge';
import { 
  Layers, 
  MapPin, 
  Building2, 
  Bus, 
  Sparkles, 
  ShieldAlert, 
  Navigation, 
  X, 
  Clock, 
  Users, 
  AlertTriangle,
  ArrowRight,
  Activity,
  Play,
  RotateCcw
} from 'lucide-react';
import L from 'leaflet';

export const MapScreen: React.FC = () => {
  const { 
    zones, 
    venues, 
    accommodations, 
    transitRoutes, 
    selectedZoneId, 
    setSelectedZoneId,
    setActiveScreen 
  } = useCrowdFlowStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [layers, setLayers] = useState({
    accommodations: true,
    transit: true,
    venues: true,
    crowdDensity: true,
    shuttleRoutes: true,
  });

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Trigger map invalidation for crisp canvas fit
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;

    lg.clearLayers();

    // 1. Polygons with restrained transparency (Section 10)
    zones.forEach(zone => {
      const getZoneColor = () => {
        switch (zone.status) {
          case 'critical': return '#EF4444';
          case 'high': return '#F97316';
          case 'watch': return '#F59E0B';
          case 'stable': return '#22C55E';
        }
      };

      const isSelected = selectedZoneId === zone.id;
      const color = getZoneColor();

      const polygon = L.polygon(zone.polygon as [number, number][], {
        color: color,
        weight: isSelected ? 2.5 : 1,
        fillColor: color,
        fillOpacity: isSelected ? 0.28 : 0.12,
        dashArray: isSelected ? undefined : '3, 3',
      });

      polygon.on('click', () => {
        setSelectedZoneId(zone.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(zone.coordinates, 13, { duration: 0.8 });
        }
      });

      polygon.bindTooltip(`
        <div style="font-family: inherit; padding: 2px;">
          <strong style="color: ${color}; font-size: 12px;">${zone.name}</strong><br/>
          <span style="font-size: 11px; opacity: 0.8;">Pressure: ${zone.pressureScore}/100 • ${zone.status.toUpperCase()}</span>
        </div>
      `, { sticky: true });

      lg.addLayer(polygon);

      if (layers.crowdDensity) {
        const centerIcon = L.divIcon({
          className: 'zone-badge-div',
          html: `
            <div style="
              display: flex; 
              align-items: center; 
              gap: 4px; 
              background: #0E121B; 
              border: 1px solid rgba(255,255,255,0.15); 
              border-radius: 9999px; 
              padding: 2px 7px; 
              color: #F8FAFC; 
              font-size: 10px; 
              font-weight: 600; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              white-space: nowrap;
            ">
              <span style="width: 5px; height: 5px; border-radius: 9999px; background: ${color};"></span>
              <span>${zone.shortName}</span>
              <span style="color: ${color}; font-family: monospace;">${zone.pressureScore}</span>
            </div>
          `,
          iconSize: [70, 20],
          iconAnchor: [35, 10]
        });

        const marker = L.marker(zone.coordinates, { icon: centerIcon });
        marker.on('click', () => {
          setSelectedZoneId(zone.id);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(zone.coordinates, 13, { duration: 0.8 });
          }
        });
        lg.addLayer(marker);
      }
    });

    // 2. Multimodal routes with animated flows
    if (layers.transit || layers.shuttleRoutes) {
      transitRoutes.forEach(route => {
        if (route.type === 'shuttle' && !layers.shuttleRoutes) return;
        if (route.type !== 'shuttle' && !layers.transit) return;

        const isCritical = route.status === 'critical';
        const lineColor = isCritical ? '#EF4444' : route.type === 'metro' ? '#22D3EE' : route.type === 'shuttle' ? '#F59E0B' : '#6366F1';

        const polyline = L.polyline(route.path as [number, number][], {
          color: lineColor,
          weight: route.type === 'shuttle' ? 3 : 2,
          opacity: 0.8,
          className: 'flow-transit-line'
        });

        polyline.bindTooltip(`
          <div style="font-family: inherit;">
            <strong style="color: ${lineColor}">${route.name}</strong><br/>
            <span style="font-size: 11px;">Headway: ${route.nextDeparture} • Delay: +${route.delayPercentage}%</span>
          </div>
        `);

        lg.addLayer(polyline);
      });
    }

    // 3. Venues
    if (layers.venues) {
      venues.forEach(venue => {
        const venueIcon = L.divIcon({
          className: 'venue-marker-div',
          html: `
            <div style="
              width: 24px; 
              height: 24px; 
              border-radius: 6px; 
              background: #22D3EE; 
              border: 1.5px solid white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              color: #090B10;
              font-weight: 800;
              font-size: 11px;
            ">
              V
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([venue.lat, venue.lng], { icon: venueIcon });
        marker.bindPopup(`
          <div style="padding: 2px;">
            <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700; color: #22D3EE;">${venue.name}</h4>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">Capacity: ${venue.capacity.toLocaleString()} • Active: ${venue.currentAttendance.toLocaleString()}</p>
          </div>
        `);
        lg.addLayer(marker);
      });
    }

  }, [zones, venues, accommodations, transitRoutes, selectedZoneId, layers]);

  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedZone.coordinates, 12, { duration: 0.8 });
    }
  }, [selectedZoneId]);

  return (
    <div className="space-y-4 pb-8 max-w-[1500px] mx-auto">
      
      {/* Header Bar with quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-electric" />
            <span>Live City Operations Map</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time geospatial crowd density, arterial transit flow lines, and contextual zone diagnostics.
          </p>
        </div>

        {/* Layer Controls Pill (Section 10) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-tab text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-cyan-electric" />
          <span className="text-slate-400 text-xs hidden sm:inline">Layers:</span>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.venues}
              onChange={e => setLayers({ ...layers, venues: e.target.checked })}
              className="accent-cyan-400 w-3 h-3 cursor-pointer"
            />
            <span className="text-slate-50">Venues</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.transit}
              onChange={e => setLayers({ ...layers, transit: e.target.checked })}
              className="accent-cyan-400 w-3 h-3 cursor-pointer"
            />
            <span className="text-slate-50">Transit</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.shuttleRoutes}
              onChange={e => setLayers({ ...layers, shuttleRoutes: e.target.checked })}
              className="accent-cyan-400 w-3 h-3 cursor-pointer"
            />
            <span className="text-slate-50">Shuttles</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.accommodations}
              onChange={e => setLayers({ ...layers, accommodations: e.target.checked })}
              className="accent-cyan-400 w-3 h-3 cursor-pointer"
            />
            <span className="text-slate-50">Hotels</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.crowdDensity}
              onChange={e => setLayers({ ...layers, crowdDensity: e.target.checked })}
              className="accent-cyan-400 w-3 h-3 cursor-pointer"
            />
            <span className="text-slate-50">Density</span>
          </label>
        </div>
      </div>

      {/* 70% / 30% Integrated Canvas Layout (Section 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-170px)] min-h-[580px]">
        
        {/* Left 70% (8-Cols): The Map Visual Hero */}
        <div className="lg:col-span-8 rounded-2xl panel-elevated overflow-hidden relative flex flex-col shadow-2xl">
          <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

          {/* Bottom Overlay: Live Flow & Timeline Status (Section 10) */}
          <div className="absolute bottom-3 left-3 right-3 z-10 p-2.5 rounded-xl glass-overlay flex items-center justify-between text-xs font-mono shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-50 font-semibold">Corridor Inflow:</span>
              <span className="text-cyan-electric">14,200/hr peak rate</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]"></span> Stable</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Watch</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F97316]"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Critical</span>
            </div>
          </div>
        </div>

        {/* Right 30% (4-Cols): Contextual Zone Diagnostic Panel (Section 10) */}
        <div className="lg:col-span-4 rounded-2xl panel-elevated p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
          {selectedZone ? (
            <div className="space-y-4">
              
              {/* Context Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold">
                    SELECTED ZONE
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedZone.name}
                  </h3>
                </div>
                <div className="text-right">
                  <StatusBadge status={selectedZone.status} size="sm" />
                  <div className="text-base font-mono font-bold text-white mt-1">
                    {selectedZone.pressureScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Metrics Tiles */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl glass-tab space-y-0.5 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase">Active Crowd</span>
                  <div className="text-base font-bold text-slate-50">{selectedZone.activeVisitors.toLocaleString()}</div>
                  <span className="text-xs text-slate-400">Limit: {selectedZone.capacityLimit.toLocaleString()}</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab space-y-0.5 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase">Hotels</span>
                  <div className={`text-base font-bold ${selectedZone.accommodationOccupancy > 90 ? 'text-rose-400' : 'text-slate-50'}`}>
                    {selectedZone.accommodationOccupancy}%
                  </div>
                  <span className="text-xs text-slate-400">Occupancy</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab space-y-0.5 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase">Transit Load</span>
                  <div className="text-base font-bold text-slate-50">{selectedZone.transitLoad}%</div>
                  <span className="text-xs text-slate-400">Arterial Dwell</span>
                </div>

                <div className="p-2.5 rounded-xl glass-tab space-y-0.5 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase">Peak Window</span>
                  <div className="text-xs font-bold text-cyan-electric mt-1">{selectedZone.predictedPeak}</div>
                </div>
              </div>

              {/* Primary Risk */}
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Primary Risk
                </span>
                <p className="text-xs text-rose-200 leading-snug">
                  {selectedZone.topRisk}
                </p>
              </div>

              {/* Contributing Weights */}
              <div className="space-y-1 text-xs">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Contributing Factors:
                </span>
                <div className="space-y-1">
                  {selectedZone.topContributors.map((c, i) => (
                    <div key={i} className="p-1.5 rounded-lg glass-tab flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{c.split(': ')[0]}</span>
                      <span className="font-bold text-white">{c.split(': ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescribed Action */}
              <div className="p-3 rounded-xl glass-tab border-cyan-500/20 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prescribed Action:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedZone.recommendedAction}
                </p>
              </div>

            </div>
          ) : null}

          {/* Action Trigger Button */}
          <div className="pt-3 border-t border-white/[0.08]">
            <button
              onClick={() => setActiveScreen('interventions')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#090B10] bg-cyan-electric hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Intervention Plan
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
