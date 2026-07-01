"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icon issues in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function CowMap() {
  const [cows, setCows] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    async function fetchCows() {
      try {
        const res = await fetch("/api/cows");
        if (res.ok) {
          const data = await res.json();
          // Filter out cows with no location
          setCows(data.filter((c: any) => c.lat && c.lng));
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    fetchCows();
    const interval = setInterval(fetchCows, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-muted animate-pulse rounded-xl" />;

  const center: [number, number] = [28.6139, 77.2090]; // Dummy center (New Delhi)

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border">
      <MapContainer center={center} zoom={15} className="h-full w-full" style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Geo-fence Circle */}
        <Circle center={center} radius={500} pathOptions={{ color: 'var(--primary)', fillColor: 'var(--primary)', fillOpacity: 0.1 }} />

        {cows.map((cow) => (
          <Marker key={cow.id} position={[cow.lat, cow.lng]} icon={icon}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-sm m-0">Cow #{cow.id}</p>
                <p className={`text-xs m-0 ${cow.status === 'Critical' ? 'text-destructive font-bold' : cow.status === 'Warning' ? 'text-orange-500 font-bold' : 'text-primary'}`}>
                  Status: {cow.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
