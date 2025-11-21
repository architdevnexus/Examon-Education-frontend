import React, { useEffect, useRef } from "react";

const SimpleMap = ({
  center = [28.4616212, 77.0905234], // Correct: [lat, lng]
  zoom = 13,
  address = "This is your selected location",
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const init = async () => {
      const L = await import("leaflet");

      // Fix missing marker icon issue in Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
      });

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current).setView(center, zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstance.current);
      }

      // Remove old markers
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
      });

      // Add new marker
      L.marker(center).addTo(mapInstance.current).bindPopup(address);
    };

    init();
  }, [center, zoom, address]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-300">
      <div ref={mapRef} className="w-full h-[350px] md:h-[450px]" />
    </div>
  );
};

export default SimpleMap;
