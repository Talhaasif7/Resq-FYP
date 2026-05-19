import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const crisisIcon = new L.DivIcon({
  className: "custom-icon",
  html: `<div style="background:#EF4444;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">⚠</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const shelterIcon = new L.DivIcon({
  className: "custom-icon",
  html: `<div style="background:#10B981;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">🏕</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const crisisMarkers = [
  { pos: [34.7724, 72.3597] as [number, number], label: "Flash Flood — Swat Valley", severity: "Critical", type: "Flood" },
  { pos: [30.1798, 66.975] as [number, number], label: "4.2 Earthquake — Quetta", severity: "High", type: "Earthquake" },
  { pos: [35.8884, 74.466] as [number, number], label: "Road Blockage — KKH", severity: "Moderate", type: "Road Block" },
  { pos: [31.5204, 74.3587] as [number, number], label: "Heavy Rainfall — Lahore", severity: "High", type: "Flood" },
  { pos: [34.0151, 71.5249] as [number, number], label: "Security Incident — Peshawar", severity: "Critical", type: "Security" },
];

const shelterMarkers = [
  { pos: [33.6844, 73.0479] as [number, number], label: "NDMA Relief Camp", capacity: "500", status: "Open" },
  { pos: [31.5204, 74.3587] as [number, number], label: "Al-Khidmat Shelter", capacity: "300", status: "Full" },
  { pos: [34.0151, 71.5249] as [number, number], label: "PDMA Emergency Camp", capacity: "400", status: "Open" },
  { pos: [24.8607, 67.0011] as [number, number], label: "Edhi Foundation", capacity: "600", status: "Open" },
];

// Safe route polylines
const safeRoutes = [
  { coords: [[33.6844, 73.0479], [33.5651, 73.0169], [33.0, 72.0], [31.5204, 74.3587]] as [number, number][], label: "Islamabad → Lahore (Safe Route)", color: "#10B981" },
  { coords: [[24.8607, 67.0011], [25.396, 68.3578]] as [number, number][], label: "Karachi → Hyderabad", color: "#3B82F6" },
];

const InteractiveMap: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card relative flex h-full flex-col overflow-hidden p-5"
    >
      <h2 className="mb-3 text-lg font-bold text-foreground">{t("safetyMap")}</h2>

      <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: 300 }}>
        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={5}
          style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Crisis markers */}
          {crisisMarkers.map((m, i) => (
            <Marker key={`crisis-${i}`} position={m.pos} icon={crisisIcon}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-red-600">{m.label}</p>
                  <p>Severity: <span className="font-semibold">{m.severity}</span></p>
                  <p>Type: {m.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelter markers */}
          {shelterMarkers.map((m, i) => (
            <Marker key={`shelter-${i}`} position={m.pos} icon={shelterIcon}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-green-600">{m.label}</p>
                  <p>Capacity: {m.capacity}</p>
                  <p>Status: <span className={m.status === "Open" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{m.status}</span></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Safe route polylines */}
          {safeRoutes.map((route, i) => (
            <Polyline
              key={`route-${i}`}
              positions={route.coords}
              pathOptions={{ color: route.color, weight: 4, dashArray: "10, 6" }}
            >
              <Popup><span className="text-xs font-semibold">{route.label}</span></Popup>
            </Polyline>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-border bg-card/90 p-2.5 backdrop-blur-sm">
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-alert" /> Crisis Zone</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-safety" /> Shelter</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-0.5 border-t-2 border-dashed border-info" style={{ width: 12 }} /> Safe Route</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;
