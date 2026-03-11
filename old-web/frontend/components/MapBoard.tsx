
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Incident, RoadStatus, Shelter, Location } from '../types/index';
import { AlertTriangle, Home, Truck, Stethoscope, Package, AlertOctagon, Waves, LocateFixed, RefreshCw, MapPin } from 'lucide-react';
import { DEMO_CENTER } from '../constants/index';

interface MapBoardProps {
  incidents: Incident[];
  shelters: Shelter[];
  roads: RoadStatus[];
  onMapClick?: (loc: Location) => void;
  onMarkerClick: (incident: Incident) => void;
  filter: 'ALL' | 'SOS' | 'TRAFFIC' | 'SHELTER' | 'WATER' | 'NONE';
  interactive: boolean;
  draftPoints?: Location[];
  showControls?: boolean;
  draggable?: boolean;
}

const createIcon = (icon: React.ReactNode, bgColor: string, pulse: boolean = false) => {
  const iconHtml = ReactDOMServer.renderToString(
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 shadow-xl ${bgColor} ${pulse ? 'animate-pulse' : ''}`}>
      {icon}
    </div>
  );
  
  return L.divIcon({
    html: iconHtml,
    className: 'bg-transparent',
    iconSize: [36, 36],
    iconAnchor: [16, 16]
  });
};

// Custom Blue Dot Icon for User Location
const userIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
      <div class="absolute w-8 h-8 bg-blue-500/40 rounded-full animate-pulse"></div>
      <div class="w-5 h-5 bg-blue-600 border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] z-20"></div>
    </div>
  `,
  className: 'bg-transparent',
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

const MapController = ({ 
  onMapClick, 
  interactive, 
  draftPoints,
  userPosition,
  showControls = true
}: { 
  onMapClick?: (loc: Location) => void, 
  interactive: boolean,
  draftPoints?: Location[],
  userPosition: Location | null,
  showControls?: boolean
}) => {
  const map = useMap();
  const controlsRef = useRef<HTMLDivElement>(null);

  // Fix map tiles not loading on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (controlsRef.current) {
      L.DomEvent.disableClickPropagation(controlsRef.current);
      L.DomEvent.disableScrollPropagation(controlsRef.current);
    }
  }, []);

  useEffect(() => {
    if (draftPoints && draftPoints.length > 0 && !interactive) {
      if (draftPoints.length === 1) {
        // Zoom to max level (18) for single point in form view
        map.setView([draftPoints[0].lat, draftPoints[0].lng], 18);
      } else {
        const bounds = L.latLngBounds(draftPoints.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [draftPoints, interactive, map]);

  useMapEvents({
    click(e) {
      if (interactive && onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  if (!showControls) return null;

  const goToMyLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userPosition) {
      // If we already have the position from the watcher, fly there instantly
      map.flyTo([userPosition.lat, userPosition.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    } else {
      // Fallback if watcher hasn't caught it yet
      alert("กำลังค้นหาตำแหน่งของคุณ... โปรดรอสักครู่");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, {
            duration: 1.2,
            easeLinearity: 0.25
          });
        },
        () => alert("ไม่สามารถระบุตำแหน่งได้ โปรดตรวจสอบการอนุญาต GPS"),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  const resetView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    map.flyTo([DEMO_CENTER.lat, DEMO_CENTER.lng], 16, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  };

  return (
    <div ref={controlsRef} className="absolute bottom-28 right-4 flex flex-col gap-3 z-[1000] pointer-events-auto">
      <button 
        type="button"
        onClick={resetView}
        className="w-12 h-12 glass dark:bg-slate-900/90 rounded-2xl shadow-xl flex items-center justify-center text-slate-500 dark:text-slate-400 border border-white/20 active:scale-95 transition-all hover:text-gold-500"
      >
        <RefreshCw size={20} />
      </button>
      <button 
        type="button"
        onClick={goToMyLocation}
        className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl shadow-xl flex items-center justify-center text-white dark:text-slate-900 active:scale-95 transition-all"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
};

const MapBoard: React.FC<MapBoardProps> = ({ incidents, shelters, roads, onMapClick, onMarkerClick, filter, interactive, draftPoints = [], showControls = true, draggable = true }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const [userPosition, setUserPosition] = useState<Location | null>(null);

  // Unified Geolocation Watcher
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPosition(newPos);
      },
      (err) => console.debug("Watcher error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  
  const getIncidentIcon = (type: string, status: string) => {
    let iconNode;
    switch(type) {
      case 'MEDICAL': iconNode = <Stethoscope size={20} className="text-white" />; break;
      case 'EVACUATION': iconNode = <Truck size={20} className="text-white" />; break;
      case 'SUPPLIES': iconNode = <Package size={20} className="text-white" />; break;
      case 'ROAD_BLOCKED': iconNode = <AlertOctagon size={20} className="text-white" />; break;
      case 'LEVEE_BREACH': iconNode = <Waves size={20} className="text-white" />; break;
      default: iconNode = <AlertTriangle size={20} className="text-white" />;
    }

    // Determine base color by incident type for quick visual distinction
    let colorClass = 'bg-slate-500';
    switch(type) {
      case 'MEDICAL': colorClass = 'bg-rose-500 shadow-rose-500/50'; break;
      case 'EVACUATION': colorClass = 'bg-sky-500 shadow-sky-500/50'; break;
      case 'SUPPLIES': colorClass = 'bg-amber-500 shadow-amber-500/50'; break;
      case 'ROAD_BLOCKED': colorClass = 'bg-slate-700 shadow-slate-700/50'; break;
      case 'LEVEE_BREACH': colorClass = 'bg-blue-500 shadow-blue-500/50'; break;
      default: colorClass = 'bg-slate-500 shadow-slate-500/50';
    }

    // Add pulsing effect for open incidents (high priority)
    const isPulse = status === 'OPEN';

    return createIcon(iconNode, colorClass, isPulse);
  };

  const shelterIcon = createIcon(<Home size={18} className="text-white" />, 'bg-gold-500 shadow-gold-500/50');
  
  const draftIcon = createIcon(
    <MapPin size={18} className={isDarkMode ? "text-white" : "text-slate-900"} />, 
    isDarkMode ? "bg-slate-800" : "bg-slate-200"
  );

  // Filter logic: show incidents based on filter type
  const filteredIncidents = filter === 'ALL' 
    ? incidents 
    : filter === 'SOS' 
      ? incidents.filter(i => ['MEDICAL', 'SUPPLIES', 'EVACUATION', 'RISK_AREA'].includes(i.type))
      : filter === 'TRAFFIC'
        ? incidents.filter(i => i.type === 'ROAD_BLOCKED')
        : filter === 'WATER'
          ? incidents.filter(i => i.type === 'LEVEE_BREACH')
          : [];
  
  console.log('🗺️ MapBoard:', {
    filter,
    totalIncidents: incidents.length,
    filteredIncidents: filteredIncidents.length,
    incidents: incidents.map(i => ({ id: i.id, type: i.type, location: i.location }))
  });
  
  const showRoads = filter === 'ALL' || filter === 'TRAFFIC';
  const showShelters = filter === 'ALL' || filter === 'SHELTER';

  return (
    <div className="w-full h-full z-0 relative bg-slate-100 dark:bg-slate-900">
      <MapContainer 
        center={[DEMO_CENTER.lat, DEMO_CENTER.lng]} 
        zoom={13} 
        scrollWheelZoom={draggable} 
        dragging={draggable}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Sukhothai Province Boundary */}
        <GeoJSON
          data={{
            type: "Feature",
            properties: { name: "สุโขทัย" },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [99.5, 17.4], [99.5, 16.8], [100.2, 16.8], [100.2, 17.4], [99.5, 17.4]
              ]]
            }
          } as any}
          style={() => ({
            fillColor: '#dbb842',
            fillOpacity: 0.05,
            color: '#c5a039',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10'
          })}
        />
        
        <MapController 
          onMapClick={onMapClick} 
          interactive={interactive} 
          draftPoints={draftPoints} 
          userPosition={userPosition}
          showControls={showControls} 
        />
        
        {/* User Marker */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} interactive={false} zIndexOffset={3000} />
        )}

        {showRoads && roads.map(road => (
          <Polyline 
            key={road.id}
            positions={road.path?.map(p => [p.lat, p.lng]) || [[road.start.lat, road.start.lng], [road.end.lat, road.end.lng]]}
            pathOptions={{ 
              color: road.status === 'CLOSED' ? '#ef4444' : road.status === 'HEAVY_VEHICLE' ? '#f59e0b' : '#10b981',
              weight: 6,
              opacity: 0.8
            }}
          />
        ))}

        {showRoads && filteredIncidents.filter(i => i.path && i.path.length > 0).map(incident => {
           const normalize = (raw: any[]) => raw.map(p => Array.isArray(p) ? [p[0], p[1]] : [p.lat ?? p.latitude, p.lng ?? p.longitude]);
           const positions = normalize(incident.path || []);
           return (
             <Polyline 
               key={`path-${incident.id}`}
               positions={positions}
               pathOptions={{ 
                 color: '#ef4444',
                 weight: 6,
                 opacity: 0.8,
                 dashArray: incident.status === 'OPEN' ? '10, 10' : undefined
               }}
               eventHandlers={{
                 click: (e) => {
                   L.DomEvent.stopPropagation(e);
                   onMarkerClick(incident);
                 }
               }}
             />
           );
        })}

        {showShelters && shelters.map(shelter => (
          <Marker 
            key={shelter.id}
            position={[shelter.location.lat, shelter.location.lng]}
            icon={shelterIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 dark:text-slate-800">
                <h4 className="font-black text-slate-900 leading-tight">{shelter.name}</h4>
                <div className="flex justify-between items-center mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Capacity</span>
                  <span className="text-gold-600">{shelter.occupied}/{shelter.capacity}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 mt-1.5 rounded-full overflow-hidden">
                   <div className="bg-gold-500 h-full transition-all duration-500" style={{ width: `${(shelter.occupied/shelter.capacity)*100}%` }}></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {filteredIncidents.filter(i => !i.path || i.path.length === 0).map(incident => (
          <Marker 
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={getIncidentIcon(incident.type, incident.status)}
            eventHandlers={{
              click: () => onMarkerClick(incident)
            }}
          />
        ))}

        {draftPoints.length > 0 && (
          <>
            {draftPoints.map((p, idx) => (
              <Marker key={`draft-${idx}`} position={[p.lat, p.lng]} icon={draftIcon} />
            ))}
            {draftPoints.length >= 2 && (
              <Polyline positions={draftPoints.map(p => [p.lat, p.lng])} pathOptions={{ color: isDarkMode ? '#94a3b8' : '#334155', weight: 4, dashArray: '5, 10' }} />
            )}
          </>
        )}

        {interactive && draftPoints.length === 0 && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] flex flex-col items-center">
             <div className="animate-bounce">
               <MapPin 
                 size={36} 
                 className="text-white drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)]" 
                 fill="#dbb842" 
                 fillOpacity={1}
                 strokeWidth={2} 
               />
             </div>
             {/* precision target dot */}
             <div className="w-2 h-2 bg-white rounded-full shadow-2xl ring-2 ring-black -mt-2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>
           </div>
        )}
      </MapContainer>
    </div>
  );
};

export default MapBoard;
