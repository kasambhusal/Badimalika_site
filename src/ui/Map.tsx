"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LayerInfo } from "@/hooks/use-map-data";
import type { GeoJSONResponse } from "@/lib/map-api-client";

// Fix for default markers in Leaflet with Next.js
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  activeLayers: LayerInfo[];
  layerData: Map<string, GeoJSONResponse>;
}

export default function MapComponent({
  activeLayers,
  layerData,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, L.LayerGroup>>(new Map());
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Haripur Municipality
    const map = L.map(mapRef.current, {
      // Mobile-friendly options
      touchZoom: true,
      zoomControl: false, // We'll add it manually
    }).setView([27.02, 85.57], isMobile ? 11 : 12);

    // Add zoom control to bottom right
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add municipality boundary (approximate)
    const municipalityBounds: [number, number][] = [
      [26.97, 85.5],
      [27.07, 85.5],
      [27.07, 85.64],
      [26.97, 85.64],
      [26.97, 85.5],
    ];

    L.polygon(municipalityBounds, {
      color: "#1f2937",
      weight: 2,
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
      dashArray: "5, 5",
    })
      .addTo(map)
      .bindPopup(
        `<div class="p-3">
          <h3 class="font-semibold text-sm mb-1 text-blue-900">Haripur Municipality</h3>
          <p class="text-xs text-gray-600">Administrative Boundary</p>
          <p class="text-xs text-gray-500 mt-1">Government of Nepal</p>
        </div>`,
        { className: "custom-popup" }
      );

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMobile]);

  // Update layers based on active layers and available data
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove layers that are no longer active
    layersRef.current.forEach((layer, layerId) => {
      if (!activeLayers.find((l) => l.name === layerId)) {
        map.removeLayer(layer);
        layersRef.current.delete(layerId);
      }
    });

    // Add new active layers
    activeLayers.forEach((layerInfo) => {
      if (!layersRef.current.has(layerInfo.name)) {
        const geoJsonData = layerData.get(layerInfo.name);

        if (geoJsonData && geoJsonData.features) {
          const layer = L.geoJSON(geoJsonData, {
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: isMobile ? 5 : 6,
                fillColor: layerInfo.color,
                color: "#fff",
                weight: isMobile ? 1.5 : 2,
                opacity: 1,
                fillOpacity: 0.8,
              });
            },
            style: () => {
              // Style for non-point features
              return {
                color: layerInfo.color,
                weight: isMobile ? 1.5 : 2,
                opacity: 0.8,
                fillOpacity: 0.3,
              };
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                // Create popup content from properties
                const properties = feature.properties;
                let popupContent = `
                  <div class="p-3 min-w-[200px] max-w-[300px]">
                    <h3 class="font-semibold text-sm mb-2 text-blue-900 border-b border-blue-100 pb-1">
                      ${layerInfo.displayName}
                    </h3>
                `;

                // Handle village names specially
                if (properties.VIL_NAME) {
                  popupContent += `
                    <div class="mb-2 bg-blue-50 p-2 rounded">
                      <span class="font-medium text-xs text-blue-700">Village Name:</span>
                      <span class="text-sm text-blue-900 ml-1 font-semibold">${properties.VIL_NAME}</span>
                    </div>
                  `;
                }

                // Add other properties (limit on mobile)
                const propertyEntries = Object.entries(properties);
                const maxProperties = isMobile ? 3 : 6;

                propertyEntries
                  .slice(0, maxProperties)
                  .forEach(([key, value]) => {
                    if (
                      key !== "VIL_NAME" &&
                      value !== null &&
                      value !== undefined &&
                      value !== ""
                    ) {
                      const displayKey = key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());
                      popupContent += `
                      <div class="mb-1 flex justify-between">
                        <span class="font-medium text-xs text-gray-600">${displayKey}:</span>
                        <span class="text-xs text-gray-800 ml-2">${value}</span>
                      </div>
                    `;
                    }
                  });

                if (propertyEntries.length > maxProperties) {
                  popupContent += `
                    <div class="text-xs text-gray-500 mt-2 text-center italic">
                      +${
                        propertyEntries.length - maxProperties
                      } more properties available
                    </div>
                  `;
                }

                popupContent += `
                    <div class="mt-3 pt-2 border-t border-gray-200 text-center">
                      <span class="text-xs text-gray-500">Feature ID: ${feature.id}</span>
                    </div>
                  </div>
                `;

                layer.bindPopup(popupContent, {
                  maxWidth: isMobile ? 280 : 320,
                  className: "custom-popup",
                  closeButton: true,
                  autoPan: true,
                  autoPanPadding: [10, 10],
                });
              }
            },
          });

          layer.addTo(map);
          layersRef.current.set(layerInfo.name, layer);
        }
      }
    });

    // Fit map to show all active layers if any exist
    if (activeLayers.length > 0) {
      const group = new L.FeatureGroup();
      layersRef.current.forEach((layer) => {
        group.addLayer(layer);
      });

      if (group.getLayers().length > 0) {
        try {
          map.fitBounds(group.getBounds(), {
            padding: isMobile ? [20, 20] : [30, 30],
            maxZoom: isMobile ? 14 : 15,
          });
        } catch (error) {
          console.warn("Could not fit bounds:", error);
        }
      }
    }
  }, [activeLayers, layerData, isMobile]);

  return (
    <div ref={mapRef} className="h-full w-full" style={{ minHeight: "400px" }}>
      {/* Map loads here */}
    </div>
  );
}
