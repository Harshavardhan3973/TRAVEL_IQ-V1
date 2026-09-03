import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  ZoomIn, 
  ZoomOut, 
  Locate, 
  Layers, 
  Globe, 
  Navigation,
  Sparkles,
  MapPin,
  ExternalLink,
  Compass,
  Eye,
  EyeOff
} from 'lucide-react';
import { MapPOI, WorldLocation } from '../types';
import { WORLD_SETTLEMENTS, WorldSettlement } from '../data/settlements';

export interface WorldMapLayers {
  attractions: boolean;
  hotels: boolean;
  restaurants: boolean;
  busStations: boolean;
  trainStations: boolean;
  airports: boolean;
  vehicleRentals: boolean;
  hospitals: boolean;
  touristInfo: boolean;
  routes: boolean;
  weather: boolean;
}

export interface WorldMapRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  color?: string;
  mode?: 'car' | 'bus' | 'train' | 'flight' | 'walk' | 'itinerary';
  dashArray?: string;
  weight?: number;
}

export type MapDisplayStyle = 'satellite-hybrid' | 'streets' | 'terrain' | 'satellite-pure';

export interface WorldMapProps {
  center: [number, number];
  zoom: number;
  markers?: MapPOI[];
  selectedDestination?: WorldLocation | null;
  selectedPOI?: MapPOI | null;
  routes?: WorldMapRoute[];
  mapLayers: WorldMapLayers;
  onSelectPOI?: (poi: MapPOI) => void;
  onSelectSettlement?: (settlement: WorldSettlement) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onLocateSuccess?: (lat: number, lng: number) => void;
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  center,
  zoom,
  markers = [],
  selectedDestination = null,
  selectedPOI = null,
  routes = [],
  mapLayers,
  onSelectPOI,
  onSelectSettlement,
  onMapClick,
  onLocateSuccess,
  className = "w-full h-full min-h-[500px]"
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Layer refs
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const settlementsOverlayRef = useRef<L.TileLayer | null>(null);
  const settlementsPinsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);

  // Map state
  const [mapStyle, setMapStyle] = useState<MapDisplayStyle>('satellite-hybrid');
  const [showSettlementsLabels, setShowSettlementsLabels] = useState(true);
  const [showSettlementPins, setShowSettlementPins] = useState(true);
  const [activeSettlementCount, setActiveSettlementCount] = useState(WORLD_SETTLEMENTS.length);
  const [isLocating, setIsLocating] = useState(false);
  const [serverProvider, setServerProvider] = useState('Esri Satellite & Global Settlements');
  const [usingFallback, setUsingFallback] = useState(false);

  // 1. Fetch server map provider configuration
  useEffect(() => {
    fetch('/api/maptiler-config')
      .then((res) => res.json())
      .then((config) => {
        if (config.provider) {
          setServerProvider(config.provider);
        }
      })
      .catch((err) => {
        console.warn("Map provider config lookup failed:", err);
      });
  }, []);

  // 2. Initialize Leaflet Map Instance Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center || [20.5937, 78.9629],
        zoom: zoom || 5,
        zoomControl: false,
        attributionControl: false,
        worldCopyJump: true,
        maxBoundsViscosity: 0.8,
      });

      // Layer groups for smooth partial updates
      const settlementsPinsLayer = L.layerGroup().addTo(map);
      const markersLayer = L.layerGroup().addTo(map);
      const routesLayer = L.layerGroup().addTo(map);

      settlementsPinsLayerRef.current = settlementsPinsLayer;
      markersLayerRef.current = markersLayer;
      routesLayerRef.current = routesLayer;
      mapInstanceRef.current = map;

      // Handle map click for dynamic reverse geocoding
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    // Ensure map container calculates dimensions properly
    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    ro.observe(mapContainerRef.current);

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 3. Update Map Tiles based on style & settlement overlay toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    // Remove existing settlements overlay
    if (settlementsOverlayRef.current) {
      map.removeLayer(settlementsOverlayRef.current);
      settlementsOverlayRef.current = null;
    }

    let baseLayer: L.TileLayer;

    if (mapStyle === 'satellite-hybrid' || mapStyle === 'satellite-pure') {
      // High-Definition Satellite Imagery (Esri World Imagery)
      baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics',
      });

      // If hybrid mode and settlement labels are active, add the settlements and boundaries overlay
      if (mapStyle === 'satellite-hybrid' && showSettlementsLabels) {
        const settlementsLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            pane: 'overlayPane',
            opacity: 0.95,
            attribution: 'Settlements & Boundaries &copy; Esri',
          }
        );
        settlementsLayer.addTo(map);
        settlementsOverlayRef.current = settlementsLayer;
      }
    } else if (mapStyle === 'streets') {
      // Real-World Street & Settlements Map (OpenStreetMap Standard with Carto Voyager fallback)
      const streetUrl = usingFallback
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      baseLayer = L.tileLayer(streetUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      });
    } else {
      // Topographic & Elevation Relief with Settlements
      baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ',
      });
    }

    // Gracefully handle tile loading errors
    baseLayer.on('tileerror', () => {
      if (!usingFallback) {
        console.warn("Base tile server reported error, switching to resilient fallback provider.");
        setUsingFallback(true);
      }
    });

    baseLayer.addTo(map);
    baseTileLayerRef.current = baseLayer;

    // Safely bring any vector path layers forward if supported
    routesLayerRef.current?.eachLayer((layer: any) => {
      if (typeof layer?.bringToFront === 'function') {
        layer.bringToFront();
      }
    });
  }, [mapStyle, showSettlementsLabels, usingFallback]);

  // 4. Render Global Settlements Pins Layer
  useEffect(() => {
    const settlementsPinsLayer = settlementsPinsLayerRef.current;
    if (!settlementsPinsLayer) return;

    settlementsPinsLayer.clearLayers();

    if (!showSettlementPins) {
      setActiveSettlementCount(0);
      return;
    }

    setActiveSettlementCount(WORLD_SETTLEMENTS.length);

    WORLD_SETTLEMENTS.forEach((settlement) => {
      const isSelected = selectedDestination?.name.toLowerCase().includes(settlement.name.toLowerCase());

      const pinHtml = `
        <div class="relative group cursor-pointer transition-all duration-200 ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-10'}">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl border border-white/40 backdrop-blur-xs whitespace-nowrap">
            <span class="text-xs">${settlement.flag}</span>
            <span class="text-[11px] font-bold tracking-tight">${settlement.name}</span>
            ${
              settlement.population
                ? `<span class="hidden group-hover:inline text-[9px] px-1 py-0.2 rounded-xs bg-blue-500/30 text-blue-200 font-semibold border border-blue-400/40">${settlement.population}</span>`
                : ''
            }
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-slate-950 text-white text-[9px] font-medium rounded shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none z-50">
            <span class="font-bold text-amber-300">${settlement.typeLabel}</span> • ${settlement.country}
          </div>
        </div>
      `;

      const settlementIcon = L.divIcon({
        className: 'settlement-custom-marker',
        html: pinHtml,
        iconSize: [110, 26],
        iconAnchor: [55, 13],
      });

      const marker = L.marker([settlement.lat, settlement.lng], { icon: settlementIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onSelectSettlement) {
          onSelectSettlement(settlement);
        } else if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([settlement.lat, settlement.lng], 13, { duration: 1.2 });
        }
      });

      marker.addTo(settlementsPinsLayer);
    });
  }, [showSettlementPins, selectedDestination?.name, onSelectSettlement]);

  // 5. Smooth Pan/Fly when center or zoom changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    const dist = Math.sqrt(
      Math.pow(currentCenter.lat - center[0], 2) + Math.pow(currentCenter.lng - center[1], 2)
    );

    if (dist > 0.0005 || Math.abs(map.getZoom() - zoom) > 0.5) {
      map.flyTo(center, zoom, {
        duration: dist > 10 ? 1.8 : 0.9,
        easeLinearity: 0.25,
      });
    }
  }, [center[0], center[1], zoom]);

  // 6. Render Destination Pin when selectedDestination changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    if (selectedDestination) {
      const destHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer animate-bounce">
          <div class="absolute -inset-2 bg-blue-500/30 rounded-full blur-sm"></div>
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-blue-500/50">
            <span class="text-sm font-black">${selectedDestination.flag || '📍'}</span>
          </div>
          <div class="absolute bottom-full mb-1 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none">
            ${selectedDestination.name}
          </div>
        </div>
      `;

      const destIcon = L.divIcon({
        className: 'dest-custom-marker',
        html: destHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([selectedDestination.lat, selectedDestination.lng], { icon: destIcon })
        .addTo(map)
        .on('click', () => {
          if (onMapClick) onMapClick(selectedDestination.lat, selectedDestination.lng);
        });

      destMarkerRef.current = marker;
    }
  }, [selectedDestination?.lat, selectedDestination?.lng, selectedDestination?.name]);

  // 7. Render POI Markers with category filters
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    const filteredMarkers = markers.filter((poi) => {
      if (poi.category === 'attraction' && !mapLayers.attractions) return false;
      if (poi.category === 'hotel' && !mapLayers.hotels) return false;
      if (poi.category === 'restaurant' && !mapLayers.restaurants) return false;
      if (poi.category === 'bus' && !mapLayers.busStations) return false;
      if (poi.category === 'train' && !mapLayers.trainStations) return false;
      if (poi.category === 'airport' && !mapLayers.airports) return false;
      if (poi.category === 'rental' && !mapLayers.vehicleRentals) return false;
      if (poi.category === 'hospital' && !mapLayers.hospitals) return false;
      if (poi.category === 'tourist_info' && !mapLayers.touristInfo) return false;
      if (poi.category === 'transport') {
        if (poi.transportType === 'train' && !mapLayers.trainStations) return false;
        if (poi.transportType === 'airport' && !mapLayers.airports) return false;
        if (poi.transportType === 'rental' && !mapLayers.vehicleRentals) return false;
        if (poi.transportType === 'bus' && !mapLayers.busStations) return false;
      }
      return true;
    });

    filteredMarkers.forEach((poi) => {
      const isSelected = selectedPOI?.id === poi.id;

      let bgClass = "from-amber-500 to-orange-500";
      let ringClass = "ring-amber-400";
      let iconSymbol = poi.icon || "📍";

      if (poi.category === 'hotel') {
        bgClass = "from-indigo-600 to-blue-600";
        ringClass = "ring-indigo-400";
      } else if (poi.category === 'restaurant') {
        bgClass = "from-rose-500 to-red-600";
        ringClass = "ring-rose-400";
      } else if (poi.category === 'bus' || (poi.category === 'transport' && poi.transportType === 'bus')) {
        bgClass = "from-emerald-600 to-teal-600";
        ringClass = "ring-emerald-400";
      } else if (poi.category === 'train' || (poi.category === 'transport' && poi.transportType === 'train')) {
        bgClass = "from-blue-700 to-indigo-800";
        ringClass = "ring-blue-400";
      } else if (poi.category === 'airport' || (poi.category === 'transport' && poi.transportType === 'airport')) {
        bgClass = "from-sky-600 to-cyan-600";
        ringClass = "ring-sky-400";
      } else if (poi.category === 'rental') {
        bgClass = "from-purple-600 to-fuchsia-600";
        ringClass = "ring-purple-400";
      } else if (poi.category === 'hospital') {
        bgClass = "from-red-600 to-rose-700";
        ringClass = "ring-red-400";
      } else if (poi.category === 'tourist_info') {
        bgClass = "from-teal-600 to-cyan-600";
        ringClass = "ring-teal-400";
      }

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr ${bgClass} text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ${ringClass} text-xs">
            <span>${iconSymbol}</span>
          </div>
          ${
            poi.isOpen !== undefined
              ? `<span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${poi.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}"></span>`
              : ''
          }
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-md whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 z-50">
            ${poi.name} ${poi.rating ? `⭐ ${poi.rating}` : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'poi-custom-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onSelectPOI) {
          onSelectPOI(poi);
        }
      });

      marker.addTo(markersLayer);
    });
  }, [markers, selectedPOI?.id, mapLayers]);

  // 8. Render Routes & Navigation Paths
  useEffect(() => {
    const routesLayer = routesLayerRef.current;
    if (!routesLayer) return;

    routesLayer.clearLayers();

    if (!mapLayers.routes) return;

    routes.forEach((route) => {
      if (!route.coordinates || route.coordinates.length < 2) return;

      const isItinerary = route.mode === 'itinerary';
      const color = route.color || (isItinerary ? '#3b82f6' : '#10b981');
      const weight = route.weight || (isItinerary ? 4 : 5);

      // Halo
      L.polyline(route.coordinates, {
        color: color,
        weight: weight + 4,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routesLayer);

      // Main line
      L.polyline(route.coordinates, {
        color: color,
        weight: weight,
        opacity: 0.95,
        dashArray: route.dashArray || (route.mode === 'bus' ? '6, 8' : route.mode === 'train' ? '12, 6' : undefined),
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routesLayer);

      // Waypoints if itinerary
      if (isItinerary) {
        route.coordinates.forEach((coord, idx) => {
          const waypointHtml = `
            <div class="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center border-2 border-white shadow-md">
              ${idx + 1}
            </div>
          `;
          const waypointIcon = L.divIcon({
            className: 'itinerary-waypoint',
            html: waypointHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          L.marker(coord, { icon: waypointIcon }).addTo(routesLayer);
        });
      }
    });
  }, [routes, mapLayers.routes]);

  // 9. Location & Zoom Callbacks
  const handleLocateMe = useCallback(() => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;

        if (map) {
          map.flyTo([latitude, longitude], 14, { duration: 1.2 });

          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userHtml = `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></div>
              <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
            </div>
          `;

          const userIcon = L.divIcon({
            className: 'user-marker',
            html: userHtml,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          userMarkerRef.current = marker;
        }

        if (onLocateSuccess) {
          onLocateSuccess(latitude, longitude);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn("Geolocation denied or unavailable:", error.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [onLocateSuccess]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetWorld = () => mapInstanceRef.current?.flyTo([20.5937, 78.9629], 5, { duration: 1.4 });

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl border border-slate-200/80 shadow-inner bg-slate-900`}>
      {/* MAP CANVAS CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* FLOATING ACTION CONTROLS (Right side stack) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Map Style Selector */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1">
          <button
            id="btn-style-hybrid"
            onClick={() => setMapStyle('satellite-hybrid')}
            title="Satellite + Indian Settlements Hybrid (Photorealistic with City & State Labels)"
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'satellite-hybrid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs">🛰️</span>
            <span className="hidden sm:inline text-[11px]">Satellite + Settlements</span>
          </button>

          <button
            id="btn-style-streets"
            onClick={() => setMapStyle('streets')}
            title="All-India Street Cartography (Every Indian City, Town & Highway)"
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'streets' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs">🗺️</span>
            <span className="hidden sm:inline text-[11px]">All-India Street Map</span>
          </button>

          <button
            id="btn-style-terrain"
            onClick={() => setMapStyle('terrain')}
            title="Topographic Terrain & Himalayan Relief"
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'terrain' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs">🏔️</span>
            <span className="hidden sm:inline text-[11px]">Terrain & Relief</span>
          </button>

          <button
            id="btn-style-sat-pure"
            onClick={() => setMapStyle('satellite-pure')}
            title="Pure Satellite Imagery (Aerial Photo Only)"
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapStyle === 'satellite-pure' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs">🔭</span>
            <span className="hidden sm:inline text-[11px]">Pure Satellite</span>
          </button>
        </div>

        {/* Settlement Toggles */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1.5">
          <button
            id="btn-toggle-settlement-labels"
            onClick={() => setShowSettlementsLabels(!showSettlementsLabels)}
            title="Toggle Indian Settlements, State Borders & City Overlay"
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
              showSettlementsLabels ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1">
              🏷️ <span className="hidden sm:inline">City & State Labels</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${showSettlementsLabels ? 'bg-indigo-600' : 'bg-slate-300'}`}></span>
          </button>

          <button
            id="btn-toggle-settlement-pins"
            onClick={() => setShowSettlementPins(!showSettlementPins)}
            title="Toggle Settlement Explorer Markers across India"
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
              showSettlementPins ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1">
              📍 <span className="hidden sm:inline">Indian City Pins ({activeSettlementCount})</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${showSettlementPins ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          </button>
        </div>

        {/* Zoom & Location Controls */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1">
          <button
            id="btn-map-zoom-in"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-map-zoom-out"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 mx-1"></div>
          <button
            id="btn-map-reset-world"
            onClick={handleResetWorld}
            title="Reset to All-India View"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
          </button>
          <button
            id="btn-map-locate-me"
            onClick={handleLocateMe}
            title="Use My Location"
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              isLocating ? 'bg-blue-50 text-blue-600 animate-spin' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Locate className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* TILE PROVIDER & SETTLEMENTS WATERMARK BADGE */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-[10px] text-slate-200 border border-slate-700/60 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">{serverProvider}</span>
          <span className="text-slate-400 border-l border-slate-700 pl-2">
            {mapStyle === 'satellite-hybrid' ? 'Satellite + All-India Settlements' : mapStyle === 'streets' ? 'OpenStreetMap India Cartography' : mapStyle === 'terrain' ? 'Topographic Relief' : 'Pure Aerial Photo'}
          </span>
        </div>
      </div>
    </div>
  );
};
