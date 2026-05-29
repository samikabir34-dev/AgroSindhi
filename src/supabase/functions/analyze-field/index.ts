// @ts-nocheck
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

interface AnalysisResult {
  ndvi: number;
  ndre: number;
  ndwi: number;
  date: string;
  stats: {
    ndvi_mean: number;
    ndvi_max: number;
    ndvi_min: number;
    ndre_mean: number;
    ndre_max: number;
    ndre_min: number;
    ndwi_mean: number;
    ndwi_max: number;
    ndwi_min: number;
  };
}

// Function to sign Planetary Computer URLs
async function signPlanetaryComputerUrl(url: string): Promise<string> {
  try {
    const signUrl = 'https://planetarycomputer.microsoft.com/api/sas/v1/sign';
    const response = await fetch(signUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ href: url }),
    });

    if (!response.ok) {
      console.warn('Failed to sign URL, using original:', url);
      return url;
    }

    const data = await response.json();
    return data.href || url;
  } catch (error) {
    console.warn('Error signing URL:', error);
    return url;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow requests that present the anon/publishable API key in the `apikey` header
  try {
    const authHeader = req.headers.get('authorization');
    const apiKeyHeader = req.headers.get('apikey') || req.headers.get('x-api-key');

    // Read possible env var names for the publishable/anon key (when running locally or in some envs)
    const envAnon = (typeof Deno !== 'undefined' && Deno?.env?.get)
      ? (Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || Deno.env.get('VITE_SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY'))
      : undefined;

    // If there's no Authorization header and the apikey doesn't match the env anon key,
    // return a helpful 401 so callers know to include a valid token or apikey.
    if (!authHeader) {
      if (!apiKeyHeader) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized', message: 'Missing Authorization header. Provide `Authorization: Bearer <token>` or include the publishable anon key in `apikey` header.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If an env anon key is available, validate it; otherwise accept any provided apikey (useful for local/ngrok setups)
      if (envAnon && apiKeyHeader !== envAnon) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized', message: 'Invalid apikey provided.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // If we reach here, either apiKeyHeader matched envAnon or no envAnon is available — proceed.
    }
  } catch (e) {
    // If env access fails for any reason, continue — we'll still accept requests with an `apikey` header.
    console.warn('Env access failed while validating apikey:', e);
  }

  try {
    const { bbox } = await req.json();

    if (!bbox || bbox.length !== 4) {
      return new Response(
        JSON.stringify({ error: 'Invalid bbox format. Expected [minLon, minLat, maxLon, maxLat]' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [minLon, minLat, maxLon, maxLat] = bbox;

    console.log('Analyzing field with bbox:', { minLon, minLat, maxLon, maxLat });

    // Calculate field area for weighting
    const fieldArea = Math.abs((maxLon - minLon) * (maxLat - minLat));
    console.log('Field area (degrees²):', fieldArea);

    // Search for Sentinel-2 imagery using Microsoft Planetary Computer STAC API
    const catalogUrl = 'https://planetarycomputer.microsoft.com/api/stac/v1';

    // Get current date and 60 days back for better coverage
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const searchUrl = `${catalogUrl}/search`;
    const searchBody = {
      collections: ['sentinel-2-l2a'],
      bbox: [minLon, minLat, maxLon, maxLat],
      datetime: `${startDate}/${endDate}`,
      limit: 30,
      query: {
        "eo:cloud_cover": {
          "lt": 30 // Less than 30% cloud cover for better quality
        }
      },
      sortby: [
        {
          field: "properties.datetime",
          direction: "desc"
        },
        {
          field: "properties.eo:cloud_cover",
          direction: "asc"
        }
      ]
    };

    console.log('Searching for imagery from', startDate, 'to', endDate);

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchBody),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('STAC search failed:', searchResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to search for satellite imagery' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();

    if (!searchData.features || searchData.features.length === 0) {
      console.log('No imagery found for the given area');
      return new Response(
        JSON.stringify({ error: 'No satellite imagery available for this area in the last 60 days. Try a different location.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Advanced image selection: prioritize recent images with low cloud cover
    const scoredFeatures = searchData.features.map((feature: any) => {
      const date = new Date(feature.properties.datetime);
      const daysOld = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      const cloudCover = feature.properties['eo:cloud_cover'] || 0;

      // Scoring: newer is better, less cloud is better
      const recencyScore = Math.max(0, 100 - daysOld * 2); // 0-100
      const cloudScore = Math.max(0, 100 - cloudCover * 3); // 0-100
      const totalScore = (recencyScore * 0.6) + (cloudScore * 0.4);

      return { feature, score: totalScore, daysOld, cloudCover };
    });

    scoredFeatures.sort((a: any, b: any) => b.score - a.score);
    const item = scoredFeatures[0].feature;
    const cloudCover = item.properties['eo:cloud_cover'] || 0;
    const imageDate = item.properties.datetime;

    console.log('Selected best image:', {
      date: imageDate,
      cloudCover: cloudCover + '%',
      score: scoredFeatures[0].score,
      daysOld: scoredFeatures[0].daysOld,
      id: item.id
    });

    // Get band asset URLs
    const redUrl = item.assets.B04?.href;
    const greenUrl = item.assets.B03?.href;
    const nirUrl = item.assets.B08?.href;
    const redEdgeUrl = item.assets.B05?.href;

    if (!redUrl || !greenUrl || !nirUrl || !redEdgeUrl) {
      console.error('Missing required bands in imagery');
      return new Response(
        JSON.stringify({ error: 'Selected imagery is missing required spectral bands' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sign all URLs using Planetary Computer signing service
    console.log('Signing URLs...');
    const [signedRedUrl, signedGreenUrl, signedNirUrl, signedRedEdgeUrl] = await Promise.all([
      signPlanetaryComputerUrl(redUrl),
      signPlanetaryComputerUrl(greenUrl),
      signPlanetaryComputerUrl(nirUrl),
      signPlanetaryComputerUrl(redEdgeUrl),
    ]);

    console.log('URLs signed successfully');

    // For production: Download actual raster data and compute pixel-by-pixel indices
    console.log('Fetching real pixel data from signed URLs...');

    // Import libraries dynamically to avoid loading them if not needed
    // @ts-ignore
    const { fromUrl } = await import("https://esm.sh/geotiff@2.1.3");

    // Helper to read a specific band
    const readBandStats = async (url: string, bbox: number[]) => {
      try {
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();

        // We need to map [minLon, minLat, maxLon, maxLat] to [minX, minY, maxX, maxY] in pixels.
        // We will use the `bbox` passed in the request.

        // We will use the `bbox` from the STAC item to interpolate.
        // The STAC item has `bbox` (Lat/Lon) and the image has `width` and `height`.
        // We can linearly interpolate our field's position within the image's Lat/Lon bbox.
        // This is an approximation but works well for small areas within a satellite tile.

        const itemBbox = item.bbox; // [minLon, minLat, maxLon, maxLat] of the whole tile
        const imageWidth = image.getWidth();
        const imageHeight = image.getHeight();

        // Calculate relative position of our field within the tile
        const xPercentStart = (bbox[0] - itemBbox[0]) / (itemBbox[2] - itemBbox[0]);
        const xPercentEnd = (bbox[2] - itemBbox[0]) / (itemBbox[2] - itemBbox[0]);

        // Latitude is inverted (usually) in pixel coordinates (0 is top)
        // In WGS84, higher lat is up. In pixels, lower y is up.
        const yPercentStart = (itemBbox[3] - bbox[3]) / (itemBbox[3] - itemBbox[1]); // Top of field relative to top of image
        const yPercentEnd = (itemBbox[3] - bbox[1]) / (itemBbox[3] - itemBbox[1]);   // Bottom of field relative to top of image

        // Convert to pixel coordinates
        const window = [
          Math.floor(xPercentStart * imageWidth),
          Math.floor(yPercentStart * imageHeight),
          Math.ceil(xPercentEnd * imageWidth),
          Math.ceil(yPercentEnd * imageHeight)
        ];

        // Clamp to image bounds
        const safeWindow = [
          Math.max(0, window[0]),
          Math.max(0, window[1]),
          Math.min(imageWidth, window[2]),
          Math.min(imageHeight, window[3])
        ];

        console.log(`Reading window for band: ${safeWindow.join(',')}`);

        const rasters = await image.readRasters({ window: safeWindow });
        const data = rasters[0]; // Band 1

        // Calculate stats
        let sum = 0;
        let count = 0;
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < data.length; i++) {
          const val = data[i];
          if (val > 0) { // Ignore nodata (usually 0)
            sum += val;
            count++;
            if (val < min) min = val;
            if (val > max) max = val;
          }
        }

        return {
          mean: count > 0 ? sum / count : 0,
          min: min === Infinity ? 0 : min,
          max: max === -Infinity ? 0 : max,
          valid: count > 0
        };
      } catch (e) {
        console.error('Error reading band:', e);
        return null;
      }
    };

    // Fetch stats for all required bands
    // Sentinel-2 bands: Red (B04), Green (B03), NIR (B08), Red Edge (B05)

    const [redStats, greenStats, nirStats, redEdgeStats] = await Promise.all([
      readBandStats(signedRedUrl, [minLon, minLat, maxLon, maxLat]),
      readBandStats(signedGreenUrl, [minLon, minLat, maxLon, maxLat]),
      readBandStats(signedNirUrl, [minLon, minLat, maxLon, maxLat]),
      readBandStats(signedRedEdgeUrl, [minLon, minLat, maxLon, maxLat]),
    ]);

    if (!redStats?.valid || !greenStats?.valid || !nirStats?.valid) {
      throw new Error('Failed to retrieve valid pixel data from satellite imagery');
    }

    console.log('Band stats:', { red: redStats.mean, green: greenStats.mean, nir: nirStats.mean });

    // Calculate Indices using the mean values
    // Sentinel-2 values are typically 0-10000 (reflectance * 10000)

    // NDVI = (NIR - Red) / (NIR + Red)
    const ndvi = (nirStats.mean - redStats.mean) / (nirStats.mean + redStats.mean);

    // NDRE = (NIR - RedEdge) / (NIR + RedEdge)
    // If RedEdge failed (sometimes missing), fallback to Red
    const reVal = redEdgeStats?.valid ? redEdgeStats.mean : redStats.mean;
    const ndre = (nirStats.mean - reVal) / (nirStats.mean + reVal);

    // NDWI = (Green - NIR) / (Green + NIR)
    const ndwi = (greenStats.mean - nirStats.mean) / (greenStats.mean + nirStats.mean);

    // Calculate health metrics
    const healthScore = Math.round(Math.max(0, ndvi) * 100);
    const vegetationStress = 1 - (ndvi / 0.9);
    const stressLevel = vegetationStress > 0.5 ? 'high' : vegetationStress > 0.3 ? 'moderate' : 'low';

    // Prepare stats object
    const stats = {
      ndvi_mean: parseFloat(ndvi.toFixed(3)),
      ndvi_max: parseFloat(((nirStats.max - redStats.min) / (nirStats.max + redStats.min)).toFixed(3)), // Approx max
      ndvi_min: parseFloat(((nirStats.min - redStats.max) / (nirStats.min + redStats.max)).toFixed(3)), // Approx min
      ndre_mean: parseFloat(ndre.toFixed(3)),
      ndre_max: 0, // Simplified
      ndre_min: 0, // Simplified
      ndwi_mean: parseFloat(ndwi.toFixed(3)),
      ndwi_max: 0, // Simplified
      ndwi_min: 0, // Simplified
      scenesFound: searchData.features.length,
      selectedDate: imageDate,
      cloudCover: cloudCover,
      healthScore,
      stressLevel,
      seasonalFactor: 1, // Real data doesn't need seasonal adjustment factors
      dataQuality: cloudCover < 10 ? 'excellent' : cloudCover < 20 ? 'good' : 'fair'
    };

    const result: AnalysisResult = {
      ndvi: parseFloat(ndvi.toFixed(3)),
      ndre: parseFloat(ndre.toFixed(3)),
      ndwi: parseFloat(ndwi.toFixed(3)),
      date: imageDate.split('T')[0],
      stats,
    };

    console.log('Real analysis complete:', {
      date: result.date,
      ndvi: result.ndvi,
      ndre: result.ndre,
      ndwi: result.ndwi,
      cloudCover: cloudCover.toFixed(1) + '%'
    });

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-field function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to analyze field. Please try drawing a larger area or try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
