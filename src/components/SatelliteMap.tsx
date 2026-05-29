import { useEffect, useRef, useState } from 'react';
import { getSentinelHubToken } from '@/lib/sentinel';
import { useLanguage } from '@/contexts/LanguageContext';


import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Square, Trash2, Info, X, Search } from 'lucide-react';

interface SatelliteMapProps {
  onCoordinatesGenerated: (bbox: number[], geometry?: any) => void;
  onSearchLocation?: (query: string) => Promise<void>;
  onDrawPolygonRef?: (fn: () => void) => void;
  onResetPolygonRef?: (fn: () => void) => void;
  onFetchAnalysisRef?: (fn: (indexType: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI') => Promise<void>) => void;
  onTriggerSearch?: (query?: string) => void;
  onTriggerDraw?: () => void;
  onTriggerReset?: () => void;
  onTriggerAnalyze?: () => void;
}

const SatelliteMap = ({ onCoordinatesGenerated, onSearchLocation, onDrawPolygonRef, onResetPolygonRef, onFetchAnalysisRef, onTriggerSearch, onTriggerDraw, onTriggerReset, onTriggerAnalyze }: SatelliteMapProps) => {
  const { t } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number } | null>(null);
  const [isFetchingNdvi, setIsFetchingNdvi] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI' | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQueryLocal, setSearchQueryLocal] = useState('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Ensure container has a sensible minimum height in case parent's layout is not yet measured
    if (!mapContainer.current.style.minHeight) {
      mapContainer.current.style.minHeight = '320px';
    }

    // Defer initialization one frame to allow layout to settle (fixes 0-size container issues)
    const initId = window.setTimeout(() => {
      try {
        // Initialize map with free satellite tiles and labels (Hybrid)
            map.current = new maplibregl.Map({
              container: mapContainer.current,
              attributionControl: false,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, Maxar, Earthstar Geographics'
          },
          'satellite-labels': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri'
          }
        },
        layers: [
          {
            id: 'satellite-tiles',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 19
          },
          {
            id: 'satellite-labels',
            type: 'raster',
            source: 'satellite-labels',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [0, 20],
      zoom: 2,
    });

        // Add scale control
        map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }),
      'bottom-left'
    );

    // Add navigation controls FIRST (will be leftmost in horizontal layout)
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      }),

      'top-left'
    );

    // Add drawing controls WITHOUT UI buttons (controlled from navbar)
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: 'simple_select',
      styles: [
        // Active polygon fill - bright yellow/green with higher opacity
        {
          'id': 'gl-draw-polygon-fill-active',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#fbce1b',
            'fill-opacity': 0.5
          }
        },
        // Inactive polygon fill
        {
          'id': 'gl-draw-polygon-fill-inactive',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
          'paint': {
            'fill-color': '#10b981',
            'fill-opacity': 0.4
          }
        },
        // Active polygon stroke - bright yellow
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          'paint': {
            'line-color': '#eab308',
            'line-width': 4
          }
        },
        // Inactive polygon stroke - green
        {
          'id': 'gl-draw-polygon-stroke-inactive',
          'type': 'line',
          'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon']],
          'paint': {
            'line-color': '#22c55e',
            'line-width': 3
          }
        },
        // Mid-drawing line (while drawing polygon) - BRIGHT YELLOW
        {
          'id': 'gl-draw-line-active',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          'paint': {
            'line-color': '#eab308',
            'line-width': 4,
            'line-dasharray': [2, 1]
          }
        },
        // Static/inactive line
        {
          'id': 'gl-draw-line-inactive',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'false']],
          'paint': {
            'line-color': '#22c55e',
            'line-width': 3
          }
        },
        // Vertex points (while drawing) - BRIGHT with glow effect
        {
          'id': 'gl-draw-point-active',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 8,
            'circle-color': '#eab308',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        },
        // Midpoint (between vertices)
        {
          'id': 'gl-draw-point-midpoint',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'midpoint'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#eab308',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        },
        // Feature point
        {
          'id': 'gl-draw-point',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'feature'], ['==', '$type', 'Point']],
          'paint': {
            'circle-radius': 6,
            'circle-color': '#22c55e',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        }
      ]
    });

    map.current.addControl(draw.current as any);

    // Add coordinate display on mouse move
    map.current.on('mousemove', (e) => {
      setCoordinates({
        lng: parseFloat(e.lngLat.lng.toFixed(6)),
        lat: parseFloat(e.lngLat.lat.toFixed(6))
      });
    });

    map.current.on('mouseout', () => {
      setCoordinates(null);
    });

    // Handle polygon creation
    map.current.on('draw.create', updateArea);
    map.current.on('draw.delete', deleteArea);
    map.current.on('draw.update', updateArea);

    function updateArea() {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];

          // Calculate bounding box
          const lngs = coordinates.map((coord: number[]) => coord[0]);
          const lats = coordinates.map((coord: number[]) => coord[1]);

          const bbox = [
            Math.min(...lngs),
            Math.min(...lats),
            Math.max(...lngs),
            Math.max(...lats),
          ];

          onCoordinatesGenerated(bbox, feature.geometry);
        }
      }
    }

    function deleteArea() {
      // Area cleared
    }

    // Auto-Trigger Geolocation Request (Aggressive Watch on Load)
    const requestLocation = () => {
      if ("geolocation" in navigator) {
        // Use setTimeout to ensure browser is 'ready' for the popup
        setTimeout(() => {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates({ lng: longitude, lat: latitude });
              if (map.current) {
                map.current.flyTo({
                  center: [longitude, latitude],
                  zoom: 18,
                  duration: 3000,
                  essential: true
                });
              }
              // Clear watch after first successful position to avoid constant jumping
              navigator.geolocation.clearWatch(watchId);
            },
            (error) => {
              console.error("Geolocation Error:", error);
              if (error.code === error.PERMISSION_DENIED) {
                alert("Location permission denied. If you are on a local connection (localhost), please ensure your browser has SSL enabled or you have manually whitelisted this origin in chrome://flags.");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        }, 1000);
      }
    };

        // Ensure map resizes after initial render
        map.current.once('load', () => {
          try { map.current?.resize(); } catch (e) { console.warn('resize error', e); }
          requestLocation();
          if (onSearchLocation) {
            (window as any).mapSearchLocation = async (query: string) => {
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
                );

                const data = await response.json();

                if (data && data.length > 0) {
                  const { lat, lon } = data[0];
                  map.current?.flyTo({
                    center: [parseFloat(lon), parseFloat(lat)],
                    zoom: 15,
                    duration: 2000
                  });
                }
              } catch (error) {
                console.error("Search failed:", error);
              }
            };
          }
        });

        // Also trigger an additional resize after a short delay
        setTimeout(() => { try { map.current?.resize(); } catch (e) { console.warn('resize error', e); } }, 300);

      } catch (err) {
        // If maplibre fails (WebGL/CORS), log error for debugging
        console.error('Map initialization failed:', err);
      }
    }, 50);

    return () => {
      window.clearTimeout(initId);
      map.current?.remove();
    };
  }, [onCoordinatesGenerated]);

  // Expose draw and reset methods to parent
  useEffect(() => {
    if (onDrawPolygonRef) {
      const triggerDraw = () => {
        if (draw.current) {
          draw.current.changeMode('draw_polygon');
          return;
        }
        const poll = window.setInterval(() => {
          if (draw.current) {
            draw.current.changeMode('draw_polygon');
            clearInterval(poll);
          }
        }, 100);
      };
      onDrawPolygonRef(triggerDraw);
    }

    if (onResetPolygonRef) {
      const triggerReset = () => {
        if (draw.current) {
          draw.current.deleteAll();
          if (map.current?.getLayer('ndvi-layer')) {
            map.current.removeLayer('ndvi-layer');
            map.current.removeSource('ndvi-source');
            setSelectedIndex(null);
          }
          return;
        }
        const poll = window.setInterval(() => {
          if (draw.current) {
            draw.current.deleteAll();
            if (map.current?.getLayer('ndvi-layer')) {
              map.current.removeLayer('ndvi-layer');
              map.current.removeSource('ndvi-source');
              setSelectedIndex(null);
            }
            clearInterval(poll);
          }
        }, 100);
      };
      onResetPolygonRef(triggerReset);
    }

    if (onFetchAnalysisRef && draw.current && map.current) {
      const fetchAnalysisMap = async (indexType: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI') => {
        if (!draw.current || !map.current) return;

        const data = draw.current.getAll();
        if (!data.features.length) {
          return;
        }

        const feature = data.features[0];
        const geometry = feature.geometry;

        // Calculate bbox for image source alignment
        const coords = (geometry as any).coordinates[0];
        const lngs = coords.map((c: any) => c[0]);
        const lats = coords.map((c: any) => c[1]);
        const bbox = [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];

        setIsFetchingNdvi(true);

        try {
          // Note: Token injection is now handled by the Vite proxy in vite.config.ts
          const evalscript = `//VERSION=3
const INDEX_TYPE = "${indexType}"; 
function setup() {
  return {
    input: ["B03", "B04", "B05", "B08", "B11", "dataMask"],
    output: { bands: 4 }
  };
}
const VEGETATION_PALETTE = [
  [0.86, 0.13, 0.16, 1], [0.93, 0.43, 0.15, 1], [0.96, 0.69, 0.14, 1], [1.00, 0.88, 0.10, 1], 
  [0.85, 0.88, 0.16, 1], [0.65, 0.82, 0.20, 1], [0.44, 0.74, 0.23, 1], [0.24, 0.60, 0.22, 1], 
  [0.18, 0.53, 0.21, 1], [0.08, 0.35, 0.14, 1]
];
const MOISTURE_PALETTE = [
  [0.55, 0.14, 0.05, 1], [0.80, 0.35, 0.08, 1], [0.95, 0.65, 0.25, 1], [0.98, 0.92, 0.75, 1],
  [0.88, 0.95, 0.95, 1], [0.67, 0.88, 0.95, 1], [0.38, 0.72, 0.93, 1], [0.18, 0.52, 0.85, 1],
  [0.05, 0.30, 0.70, 1], [0.00, 0.10, 0.45, 1]
];
function evaluatePixel(sample) {
  if (sample.dataMask === 0) return [0, 0, 0, 0];
  let indexValue = 0;
  let palette = VEGETATION_PALETTE;
  let limits = [0.05, 0.14, 0.23, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85];
  
  if (INDEX_TYPE === "NDVI") {
    indexValue = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
    limits = [0.05, 0.14, 0.23, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85];
  } else if (INDEX_TYPE === "NDRE") {
    indexValue = (sample.B08 - sample.B05) / (sample.B08 + sample.B05);
    limits = [0.05, 0.14, 0.23, 0.32, 0.41, 0.50, 0.59, 0.68, 0.77, 0.85];
  } else if (INDEX_TYPE === "MSAVI") {
    indexValue = (2 * sample.B08 + 1 - Math.sqrt(Math.pow(2 * sample.B08 + 1, 2) - 8 * (sample.B08 - sample.B04))) / 2;
    limits = [0.0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.70];
  } else if (INDEX_TYPE === "NDMI") {
    indexValue = (sample.B08 - sample.B11) / (sample.B08 + sample.B11);
    palette = MOISTURE_PALETTE;
    limits = [-0.6, -0.43, -0.26, -0.09, 0.08, 0.25, 0.42, 0.59, 0.76, 0.9];
  } else if (INDEX_TYPE === "NDWI") {
    indexValue = (sample.B03 - sample.B08) / (sample.B03 + sample.B08);
    palette = MOISTURE_PALETTE;
    limits = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  }
  
  if (INDEX_TYPE !== "NDWI" && INDEX_TYPE !== "NDMI" && indexValue < -0.1) return [0, 0, 0, 0]; 
  
  return colorBlend(indexValue, limits, palette);
}`;

          const toDate = new Date();
          const fromDate = new Date();
          fromDate.setMonth(fromDate.getMonth() - 6);

          const requestBody = {
            input: {
              bounds: {
                geometry: geometry,
                properties: { crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84" }
              },
              data: [{
                type: "sentinel-2-l2a",
                dataFilter: {
                  timeRange: {
                    from: fromDate.toISOString(),
                    to: toDate.toISOString()
                  },
                  mosaickingOrder: "leastCC",
                  maxCloudCoverage: 30
                },
                processing: {
                  upsampling: "BICUBIC"
                }
              }]
            },
            output: {
              width: 512,
              height: 512,
              responses: [{ identifier: "default", format: { type: "image/png" } }]
            },
            evalscript: evalscript
          };

          const response = await fetch('/api/sentinel/api/v1/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) throw new Error('Failed to fetch satellite imagery');

          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          // Remove both current layer if any
          if (map.current.getLayer('ndvi-layer')) {
            map.current.removeLayer('ndvi-layer');
            map.current.removeSource('ndvi-source');
          }

          map.current.addSource('ndvi-source', {
            type: 'image',
            url: imageUrl,
            coordinates: [
              [bbox[0], bbox[3]], // top-left
              [bbox[2], bbox[3]], // top-right
              [bbox[2], bbox[1]], // bottom-right
              [bbox[0], bbox[1]]  // bottom-left
            ]
          });

          map.current.addLayer({
            id: 'ndvi-layer',
            type: 'raster',
            source: 'ndvi-source',
            paint: {
              'raster-opacity': 0,
              'raster-opacity-transition': { duration: 1000 }
            }
          });

          // Show legend for whichever index was requested
          setSelectedIndex(indexType);

          setTimeout(() => {
            map.current?.setPaintProperty('ndvi-layer', 'raster-opacity', 0.85);
          }, 100);

        } catch (error: any) {
          console.error(error);
          toast.error(`${t('common.error')}: ${error.message || 'Unauthorized'}`);
        } finally {
          setIsFetchingNdvi(false);
        }
      };

      onFetchAnalysisRef(fetchAnalysisMap);
    }
  }, [onDrawPolygonRef, onResetPolygonRef, onFetchAnalysisRef]);

  // Expose search method to parent via ref
  useEffect(() => {
    if (onSearchLocation && map.current) {
      (window as any).mapSearchLocation = async (query: string) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
          );

          const data = await response.json();

          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            map.current?.flyTo({
              center: [parseFloat(lon), parseFloat(lat)],
              zoom: 15,
              duration: 2000
            });
          }
        } catch (error) {
          console.error("Search failed:", error);
        }
      };
    }
  }, [onSearchLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading Glow State */}
      {isFetchingNdvi && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px] animate-in fade-in duration-500">
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="bg-midnight/80 px-6 py-2 rounded-full">
              <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                Processing Satellite Data
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Coordinate Display - Enhanced */}
      {coordinates && (
        <div className="absolute bottom-12 sm:bottom-14 left-4 z-10 animate-fade-in">
          <Card className="px-5 py-3 bg-gradient-to-br from-card/98 via-muted/90 to-card/95 backdrop-blur-xl border-primary/40 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
            <div className="text-sm font-mono font-semibold" dir="ltr">
              <span className="text-primary font-bold drop-shadow-lg">Lng:</span> <span className="text-foreground font-bold">{coordinates.lng}°</span>
              <span className="text-muted-foreground mx-3">|</span>
              <span className="text-primary font-bold drop-shadow-lg">Lat:</span> <span className="text-foreground font-bold">{coordinates.lat}°</span>
            </div>
          </Card>
        </div>
      )}

      {/* Floating vertical toolbar placed inside the map box */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 sm:gap-4">
        <div className="relative">
        <button
          title="ڳوليو"
          aria-label="ڳوليو"
          className="flex flex-col items-center justify-center gap-1 w-14 h-14 bg-white/[0.06] hover:bg-white/[0.14] text-white rounded-full shadow-lg border border-white/[0.14] transition-all hover:scale-105 active:scale-95"
          onClick={() => { setShowSearchInput(true); setTimeout(() => { const el = document.getElementById('map-inline-search'); el?.focus(); }, 50); }}
        >
          <Search className="w-5 h-5 text-[#55e6ff]" />
          <span className="text-sm text-[#55e6ff] font-semibold">ڳوليو</span>
        </button>

        {showSearchInput && (
          <div className="absolute -left-[220px] top-1/2 -translate-y-1/2 z-40">
              <input
              id="map-inline-search"
              value={searchQueryLocal}
              onChange={(e) => setSearchQueryLocal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQueryLocal.trim()) {
                  const q = searchQueryLocal.trim();
                  setShowSearchInput(false);
                  setSearchQueryLocal('');
                  if (onSearchLocation) onSearchLocation(q);
                  else if (onTriggerSearch) onTriggerSearch(q);
                }
                if (e.key === 'Escape') {
                  setShowSearchInput(false);
                }
              }}
              onBlur={() => setTimeout(() => setShowSearchInput(false), 150)}
              placeholder="ڳوليو..."
              className="w-56 px-3 py-2 rounded-lg bg-[#07172f] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#55e6ff] shadow-lg"
            />
          </div>
        )}
        </div>

        <button
          title="ٺاھيو"
          aria-label="ٺاھيو"
          className="flex flex-col items-center justify-center gap-1 w-14 h-14 bg-white/[0.06] hover:bg-white/[0.14] text-white rounded-full shadow-lg border border-white/[0.14] transition-all hover:scale-105 active:scale-95"
          onClick={() => {
            if (onTriggerDraw) {
              onTriggerDraw();
            } else if (draw.current) {
              // Directly activate draw mode when no trigger callback provided
              draw.current.changeMode('draw_polygon');
            }
          }}
        >
          <Square className="w-5 h-5 text-[#55e6ff]" />
          <span className="text-sm text-[#55e6ff] font-semibold">ٺاھيو</span>
        </button>

        <button
          title="ڊاھيو"
          aria-label="ڊاھيو"
          className="flex flex-col items-center justify-center gap-1 w-14 h-14 bg-white/[0.06] hover:bg-white/[0.14] text-white rounded-full shadow-lg border border-white/[0.14] transition-all hover:scale-105 active:scale-95"
          onClick={() => { if (onTriggerReset) onTriggerReset(); else if (onResetPolygonRef && draw.current) { draw.current.deleteAll(); } }}
        >
          <X className="w-5 h-5 text-[#55e6ff]" />
          <span className="text-sm text-[#55e6ff] font-semibold">ڊاھيو</span>
        </button>
      </div>
    </div>
  );
};

export default SatelliteMap;
