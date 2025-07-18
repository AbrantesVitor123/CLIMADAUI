import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import type { Scenario, ScenarioProperties } from '../types';
import type { Feature, Point } from 'geojson';

interface MapWrapperProps {
  scenario: Scenario;
}

const worldBounds: L.LatLngBoundsExpression = [
    [-90, -180], // Southwest
    [90, 180]   // Northeast
];

const pointToLayer = (feature: Feature<Point, ScenarioProperties>, latlng: L.LatLng): L.Layer => {
  const { eai } = feature.properties;
  const radius = eai > 0 ? Math.max(8, 5 + Math.log10(eai + 1) * 2) : 6;
  
  return L.circleMarker(latlng, {
    radius: radius,
    color: eai > 0 ? '#b91c1c' : '#c2410c', // red-700, orange-700
    weight: 2,
    fillColor: eai > 0 ? '#ef4444' : '#f97316', // red-500, orange-500
    fillOpacity: 0.7,
  });
};

const onEachFeature = (feature: Feature<Point, ScenarioProperties>, layer: L.Layer) => {
    if (feature.properties && feature.geometry.type === 'Point') {
        const { value, eai } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;
        
        const popupContent = `
            <div class="text-slate-800">
                <h3 class="text-base font-bold text-slate-900 mb-2 border-b pb-1">Análise de Risco</h3>
                <p class="text-sm"><strong>Valor exposto:</strong> R$ ${value.toLocaleString('pt-BR')}</p>
                <p class="text-sm"><strong>Perda anual esperada:</strong> R$ ${eai.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p class="text-xs text-slate-500 mt-2">(${lat.toFixed(4)}°, ${lng.toFixed(4)}°)</p>
            </div>
        `;
        layer.bindPopup(popupContent);
    }
};

export default function MapWrapper({ scenario }: MapWrapperProps) {
  return (
    <MapContainer
      key={scenario.id}
      center={scenario.center}
      zoom={scenario.zoom}
      className="h-full w-full"
      scrollWheelZoom={true}
      maxBounds={worldBounds}
      minZoom={3}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        noWrap={true}
      />
      {scenario.data && (
        <GeoJSON
          data={scenario.data}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}