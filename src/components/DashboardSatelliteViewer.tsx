import { useEffect, useRef, useState } from 'react';
import { getSentinelHubToken } from '@/lib/sentinel';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, TrendingUp, Droplets, Loader2, Map as MapIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardMapProps {
  bbox: number[];
  geometry: any;
  currentIndex: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI';
  onIndexChange: (index: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI') => void;
}


const DashboardSatelliteViewer = ({ bbox, geometry, currentIndex, onIndexChange }: DashboardMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { t } = useLanguage();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const centerLng = (bbox[0] + bbox[2]) / 2;
    const centerLat = (bbox[1] + bbox[3]) / 2;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          },
          'satellite-labels': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
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
      center: [centerLng, centerLat],
      zoom: 15,
      interactive: false
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    map.current.on('load', () => {
      map.current?.fitBounds([
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ], { padding: 40, animate: false });

      // Auto-fetch NDVI on load
      fetchRaster(currentIndex);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [bbox, geometry]);

  const fetchRaster = async (indexType: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI') => {
    if (!map.current || !geometry) return;
    setIsFetching(true);
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

      if (!response.ok) {
        const errText = await response.text();
        console.error("Sentinel Hub Error:", errText);
        throw new Error(errText || 'Failed to fetch satellite imagery');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      if (map.current.getLayer('raster-layer')) {
        map.current.removeLayer('raster-layer');
        map.current.removeSource('raster-source');
      }

      map.current.addSource('raster-source', {
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
        id: 'raster-layer',
        type: 'raster',
        source: 'raster-source',
        paint: {
          'raster-opacity': 0,
          'raster-opacity-transition': { duration: 1000 }
        }
      });

      setTimeout(() => {
        map.current?.setPaintProperty('raster-layer', 'raster-opacity', 0.85);
      }, 100);

    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleIndexChange = (val: 'NDVI' | 'NDRE' | 'NDWI' | 'MSAVI' | 'NDMI') => {
    onIndexChange(val);
    fetchRaster(val);
  };

  return (
    <Card className="relative overflow-hidden w-full h-[400px] sm:h-[450px] bg-midnight/80 backdrop-blur-3xl border-white/10 rounded-3xl group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 z-10" />
      
      {/* Interactive Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Loading Overlay */}
      {isFetching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
             <div className="flex flex-col items-center gap-3 bg-midnight/90 border border-white/10 p-5 rounded-2xl">
                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                 <span className="text-xs font-black text-white/70 uppercase tracking-widest">Processing Imagery...</span>
             </div>
        </div>
      )}

      {/* Floating UI Panel like EOS */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-midnight/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-xl shadow-black/50">
          <Select value={currentIndex} onValueChange={handleIndexChange as any}>
            <SelectTrigger className="w-[140px] bg-white/5 border-none text-white h-10 rounded-xl focus:ring-0">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-emerald-400" />
                <SelectValue placeholder="Select Index" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-midnight/95 backdrop-blur-3xl border-white/10 text-white rounded-xl">
              <SelectItem value="NDVI" className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg mb-1">
                 <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" /> فصل جي حالت
                 </div>
              </SelectItem>
              <SelectItem value="NDRE" className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg mb-1">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> ڀاڻ جي حالت
                 </div>
              </SelectItem>

              <SelectItem value="MSAVI" className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg mb-1">
                 <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-lime-400" /> مٽي جي حالت
                 </div>
              </SelectItem>
              <SelectItem value="NDMI" className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                 <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" /> نمي جي حالت
                 </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Legend moved to parent Dashboard for sidebar layout */}
    </Card>
  );
};

export default DashboardSatelliteViewer;
