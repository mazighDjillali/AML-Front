// components/alg-map.tsx
"use client";

import { useEffect, useState, type JSX } from "react";
import { MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import { DashboardStore } from "@/stores/dashboard-store";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

export default function AlgeriaMap() {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [riskMarkers, setRiskMarkers] = useState<JSX.Element[]>([]);
  const {
    hoveredFeature,
    clickedFeature,
    setHoveredFeature,
    setClickedFeature,
  } = DashboardStore();

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch("/dz.geojson");
        const data = await response.json();
        setGeoData(data);
        console.log("Loaded geojson data. ");
      } catch (error) {
        console.error("Failed to load GeoJSON:", error);
      }
    };
    fetchGeoData();
  }, []);

  useEffect(() => {
    if (!geoData) return;

    const markers: JSX.Element[] = [];

    geoData.features.forEach((feature, index) => {
      const name = feature.properties?.name;
      const risk = getRisks(name);

      if (!risk) return;

      let lat = 0;
      let lng = 0;

      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0] as number[][];
        lat =
          coordinates.reduce((sum, coord) => sum + coord[1], 0) /
          coordinates.length;
        lng =
          coordinates.reduce((sum, coord) => sum + coord[0], 0) /
          coordinates.length;
      }

      if (feature.geometry.type === "MultiPolygon") {
        const firstPolygon = feature.geometry.coordinates[0][0] as number[][];
        lat =
          firstPolygon.reduce((sum, coord) => sum + coord[1], 0) /
          firstPolygon.length;
        lng =
          firstPolygon.reduce((sum, coord) => sum + coord[0], 0) /
          firstPolygon.length;
      }

      const icon = L.divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      markers.push(
        <Marker key={`marker-${index}`} position={[lat, lng]} icon={icon}>
          <Popup>
            <strong>{name}</strong>
            <ul className="text-sm mt-1">
              {risk.risks.map((r, i) => (
                <li key={i}>⚠️ {r}</li>
              ))}
            </ul>
          </Popup>
        </Marker>,
      );
    });

    setRiskMarkers(markers);
  }, [geoData]);

  const onEachFeature = (
    feature: Feature<Geometry, { name?: string; id?: string | number }>,
    layer: L.Layer,
  ) => {
    const pathLayer = layer as L.Path;

    const handleMouseOver = () => {
      setHoveredFeature(feature);
      pathLayer.bringToFront();
      pathLayer.setStyle({
        fillColor: "#efefef",
        fillOpacity: 0.7,
        color: "black",
        weight: 2,
      });
    };

    const handleMouseOut = () => {
      setHoveredFeature(null);
      pathLayer.setStyle({
        fillColor: "#1B2163",
        fillOpacity: 0.4,
        color: "white",
        weight: 1,
      });
    };

    const handleClick = () => {
      const stateName = feature.properties?.name ?? "Unknown";
      const stateId = feature.properties?.id ?? null;
      setClickedFeature?.(feature);
    };

    layer.on({
      mouseover: handleMouseOver,
      mouseout: handleMouseOut,
      click: handleClick,
    });
  };

  const style = {
    fillColor: "#005fad",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.5,
    interactive: true,
  };

  const getRisks = (wilayaName: string | undefined) => {
    const name = wilayaName?.toLowerCase() ?? "";

    if (["tlemcen", "bechar", "béchar", "tindouf"].includes(name)) {
      return {
        country: "Morocco",
        risks: ["Unstable political relations", "PEGASUS affair"],
      };
    }

    if (["el oued", "ain amenas"].includes(name)) {
      return {
        country: "Mauritania",
        risks: [
          "Unstable security situation",
          "Terrorism",
          "Trafficking and smuggling",
        ],
      };
    }

    if (["ain guezzam", "in guezzam"].includes(name)) {
      return {
        country: "Mali & Niger",
        risks: [
          "Terrorism",
          "Trafficking and smuggling",
          "Illegal immigration",
        ],
      };
    }

    if (["bordj baji mokhtar"].includes(name)) {
      return {
        country: "Libya",
        risks: ["Trafficking and smuggling", "Illegal immigration"],
      };
    }

    return null;
  };

  return (
    <div className="grid grid-cols-5 grid-rows-6 gap-1 h-full w-full relative">
      <div className="col-span-2 row-span-6 bg-gradient-to-br from-blue-200 to-white shadow-md border border-yellow-300 rounded-2xl px-6 py-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4 border-b pb-2">
          🗺️ Wilaya Info
        </h2>
        {clickedFeature ? (
          <div className="space-y-4 text-gray-800 text-base">
            <div className="p-4 bg-white rounded-xl border border-yellow-300">
              <div className="text-gray-500 text-sm">Wilaya Name</div>
              <div className="text-xl font-semibold text-blue-900">
                {clickedFeature.properties?.name}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-yellow-300">
              <div className="text-gray-500 text-sm">Wilaya ID</div>
              <div className="text-lg font-semibold text-blue-800">
                {clickedFeature.properties?.id}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-yellow-300">
              <div className="text-yellow-600 text-sm font-medium">
                Border Risk
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1 text-blue-900 text-base">
                {(() => {
                  const risk = getRisks(clickedFeature.properties?.name);
                  if (risk) {
                    return (
                      <>
                        <li>
                          <strong>{risk.country}</strong>
                        </li>
                        {risk.risks.map((r, index) => (
                          <li key={index}>{r}</li>
                        ))}
                      </>
                    );
                  } else {
                    return <li>No international risks identified</li>;
                  }
                })()}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">
            Click on a wilaya to see its details.
          </p>
        )}
      </div>

      <div className="col-span-3 row-span-6 col-start-3 shadow-md rounded-2xl bg-gradient-to-br from-blue-200 to-white border border-yellow-300">
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            background: "white",
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            width: "10rem",
          }}
        >
          <strong>{clickedFeature?.properties?.name}</strong>
          <p>{hoveredFeature?.properties?.name}</p>
        </div>
        <MapContainer
          center={[28.0339, 1.6596]}
          zoom={5}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "1rem",
            backgroundColor: "#DBEAFE",
          }}
        >
          {geoData && (
            <>
              <GeoJSON
                data={geoData}
                style={style}
                onEachFeature={onEachFeature}
              />
              {riskMarkers}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
