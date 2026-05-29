// @ts-nocheck
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import https from "https";
import http from "http";


// --- IRSA BACKEND LOGIC ---
const PDF_CACHE = new Map();
// Cache each date's parsed PDF for 24h. Today's data is refreshed once per day
// after 11:00 local time (when pakirsa publishes new data).
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const PUBLISH_HOUR = 11;

function getTodayDateStr() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parsePdfText(text, date) {
  function sliceBetween(startKw, endKw) {
    const upper = text.toUpperCase();
    const s = upper.indexOf(startKw.toUpperCase());
    if (s === -1) return '';
    const e = endKw ? upper.indexOf(endKw.toUpperCase(), s + startKw.length) : text.length;
    return text.slice(s, e === -1 ? text.length : e);
  }

  function pick(slice, re, n = 0) {
    const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
    const all = [...slice.matchAll(new RegExp(re.source, flags))];
    if (n >= all.length) return null;
    const val = parseFloat(all[n][1].replace(/,/g, ''));
    return isNaN(val) ? null : val;
  }

  const row1 = sliceBetween('INDUS @ TARBELA', 'CHASHMA:');          
  const row2 = sliceBetween('CHASHMA:', 'TAUNSA:');                   
  const row3 = sliceBetween('TAUNSA:', 'KOTRI:');                     
  const row4 = sliceBetween('KOTRI:', 'CHENAB @ MARALA:');            
  const row5 = sliceBetween('CHENAB @ MARALA:', 'PANJNAD');           
  const row6 = sliceBetween('PANJNAD', '** Rim Stations');            
  const fullText = text;

  const tarbelLevel     = pick(row1, /LEVEL\s*=\s*([\d.]+)/i);
  const tarbelDeadLevel = pick(row1, /DEAD\s*LEVEL\s*=\s*([\d.]+)/i);
  const tarbelInflow    = pick(row1, /MEAN\s+INFLOW\s*=\s*([\d,]+)/i);
  const tarbelOutflow   = pick(row1, /MEAN\s+OUTFLOW\s*=\s*([\d,]+)/i);
  const kabulDischarge  = pick(row1, /MEAN\s+DISCHARGE\s*=\s*([\d,]+)/i);

  const chashmLevel     = pick(row2, /LEVEL\s*=\s*([\d.]+)/i);
  const chashmDeadLevel = pick(row2, /DEAD\s*LEVEL\s*=\s*([\d.]+)/i);
  const chashmInflow    = pick(row2, /MEAN\s+INFLOW\s*=\s*([\d,]+)/i);
  const chashmOutflow   = pick(row2, /MEAN\s+OUTFLOW\s*=\s*([\d,]+)/i);
  const cjLink          = pick(row2, /C-J\s+Link\s*=\s*([\d,]+)/i);
  const crbc            = pick(row2, /CRBC\s*=\s*([\d,]+)/i);

  const kalabaghUS  = pick(row2, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const kalabaghDS  = pick(row2, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const thalCanal   = pick(row2, /Thal\s*=\s*([\d,]+)/i);

  const taunsaUS    = pick(row3, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const taunsaDS    = pick(row3, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const tpLink      = pick(row3, /T-P\s*Link\s*=\s*([\d,]+)/i);
  const muzafargarh = pick(row3, /Muzafar\w*\s+Canal\s*=\s*([\d,]+)/i);
  const dgKhan      = pick(row3, /Dera\s+Ghazi[^=\n]+=\s*([\d,]+)/i);

  const gudduUS     = pick(row3, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 1);
  const gudduDS     = pick(row3, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 1);
  const gudduCanal  = pick(row3, /\*\s*Canal\s+W\/dls\s*=\s*([\d,]+)/i);

  const kotriUS     = pick(row4, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const kotriDS     = pick(row4, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 0);
  const kotriCanal  = pick(row4, /Canal\s+W\/dls\s*=\s*([\d,]+)/i, 0);

  const sukkurUS    = pick(row4, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 1);
  const sukkurDS    = pick(row4, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i, 1);
  const sukkurCanal = pick(row4, /\*\s*Canal\s+W\/dls\s*=\s*([\d,]+)/i);

  const chenabUS    = pick(row5, /MEAN\s+U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i);
  const chenabDS    = pick(row5, /MEAN\s+D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i);

  const manglaLevel     = pick(row5, /LEVEL\s*=\s*([\d.]+)/i);
  const manglaDeadLevel = pick(row5, /DEAD\s*LEVEL\s*=\s*([\d.]+)/i);
  const manglaInflow    = pick(row5, /MEAN\s+INFLOW\s*=\s*([\d,]+)/i);
  const manglaOutflow   = pick(row5, /MEAN\s+OUTFLOW\s*=\s*([\d,]+)/i);

  const rimTotalInflows  = pick(fullText, /RIM\s+STATION\s+INFLOWS[\s\S]{0,80}?TOTAL\s*=\s*([\d,]+)/i);
  const rimTotalOutflows = pick(fullText, /RIM\s+STATION\s+OUTFLOWS[\s\S]{0,80}?TOTAL\s*=\s*([\d,]+)/i);

  const panjnadUS = pick(row6, /U\/S\s+DISCHARGE\s*=\s*([\d,]+)/i);
  const panjnadDS = pick(row6, /D\/S\s+DISCHARGE\s*=\s*([\d,]+)/i);

  const punjabM      = row6.match(/Punjab:\s*([\d,]+)\s*Cs\s*([\d,]+)\s*Cs/i);
  const sindhM       = row6.match(/Sindh:\s*([\d,]+)\s*Cs\s*([\d,]+)\s*Cs/i);
  const kpM          = row6.match(/KP:\s*([\d,]+)\s*Cs\s*([\d,]+)\s*Cs/i);
  const baloM        = row6.match(/Balochistan:\s*([\d,]+)\s*Cs\s*([\d,]+)\s*Cs/i);

  function toNum(s) {
    if (!s) return null;
    const v = parseFloat(s.replace(/,/g, ""));
    return isNaN(v) ? null : v;
  }

  const inflowCompMatch = fullText.match(/rim station inflows are ([\d,]+) Cs against yesterday[^0-9]*([\d,]+) Cs[^(]*\(([\d]+)%\)\s*(More|Less)/i);
  const outflowCompMatch = fullText.match(/rim station outflows are ([\d,]+) Cs against yesterday[^0-9]*([\d,]+) Cs[^(]*\(([\d]+)%\)\s*(More|Less)/i);

  return {
    date,
    fetchedAt: new Date().toISOString(),
    tarbela: { level: tarbelLevel, deadLevel: tarbelDeadLevel, meanInflow: tarbelInflow, meanOutflow: tarbelOutflow },
    mangla: { level: manglaLevel, deadLevel: manglaDeadLevel, meanInflow: manglaInflow, meanOutflow: manglaOutflow },
    chashma: { level: chashmLevel, deadLevel: chashmDeadLevel, meanInflow: chashmInflow, meanOutflow: chashmOutflow, cjLink, crbc },
    kalabagh: { usDischarge: kalabaghUS, dsDischarge: kalabaghDS, thal: thalCanal },
    taunsa: { usDischarge: taunsaUS, dsDischarge: taunsaDS, tpLink, muzafargarh, dgKhan },
    panjnad: { usDischarge: panjnadUS, dsDischarge: panjnadDS },
    guddu: { usDischarge: gudduUS, dsDischarge: gudduDS, canalWithdrawals: gudduCanal },
    sukkur: { usDischarge: sukkurUS, dsDischarge: sukkurDS, canalWithdrawals: sukkurCanal },
    kotri: { usDischarge: kotriUS, dsDischarge: kotriDS, canalWithdrawals: kotriCanal },
    chenabMarala: { usDischarge: chenabUS, dsDischarge: chenabDS },
    kabulNowshera: kabulDischarge,
    rimStations: { totalInflows: rimTotalInflows ?? 0, totalOutflows: rimTotalOutflows ?? 0 },
    irsaReleases: {
      today:    { punjab: toNum(punjabM?.[1]), sindh: toNum(sindhM?.[1]), kp: toNum(kpM?.[1]), balochistan: toNum(baloM?.[1]) },
      lastYear: { punjab: toNum(punjabM?.[2]), sindh: toNum(sindhM?.[2]), kp: toNum(kpM?.[2]), balochistan: toNum(baloM?.[2]) },
    },
    comparison: {
      inflowsYesterdayCs: inflowCompMatch ? toNum(inflowCompMatch[2]) : null,
      inflowsChangePct: inflowCompMatch ? toNum(inflowCompMatch[3]) : null,
      inflowsChangeDirection: inflowCompMatch ? inflowCompMatch[4] : "",
      outflowsYesterdayCs: outflowCompMatch ? toNum(outflowCompMatch[2]) : null,
      outflowsChangePct: outflowCompMatch ? toNum(outflowCompMatch[3]) : null,
      outflowsChangeDirection: outflowCompMatch ? outflowCompMatch[4] : "",
    },
  };
}

async function fetchAndParsePdf(dateStr) {
  const cached = PDF_CACHE.get(dateStr);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  const url = `http://pakirsa.gov.pk/Doc/Data${dateStr}.pdf`;

  return new Promise((resolve) => {
    http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const { PDFParse } = await import('pdf-parse');
          const parser = new PDFParse({ data: new Uint8Array(buffer) });
          const parsed = await parser.getText();
          const text = parsed.text || (parsed.pages || []).map((p) => p.text).join('\n');
          const data = parsePdfText(text, dateStr);
          PDF_CACHE.set(dateStr, { data, expiresAt: Date.now() + CACHE_TTL_MS });
          resolve(data);
        } catch (e) {
          console.error('[IRSA] parse failed for', dateStr, e);
          resolve(null);
        }
      });
    }).on('error', (err) => { console.error('[IRSA] http err', err); resolve(null); });
  });
}

// Returns parsed data for "today" with the 11 AM publish rule.
// - Before 11:00 local time, today's PDF likely isn't published yet, so we
//   serve yesterday's cached data (and don't waste a network round-trip).
// - At/after 11:00, we try today; if it's still missing we fall back to
//   yesterday so the dashboard never goes blank.
async function fetchLatestPdf() {
  const now = new Date();
  const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  // Build the candidate list of recent dates to try (most recent first).
  // Before 11:00 today's PDF likely isn't published yet, so start from
  // yesterday. We walk back up to a week in case of weekends/holidays.
  const startOffset = now.getHours() < PUBLISH_HOUR ? 1 : 0;
  for (let i = startOffset; i < startOffset + 7; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const data = await fetchAndParsePdf(fmt(d));
    if (data) return data;
  }
  return null;
}
// --- END IRSA BACKEND LOGIC ---

let _irsaScheduled = false;
function scheduleIRSAFetch() {
  if (_irsaScheduled) return;
  _irsaScheduled = true;
  // Prime the latest available data immediately (respects 11 AM publish rule).
  (async () => { try { await fetchLatestPdf(); } catch (e) { /* ignore */ } })();
  // Refresh hourly so we pick up today's PDF as soon as it's published.
  setInterval(() => { fetchLatestPdf().catch(() => {}); }, 60 * 60 * 1000);
}



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  let cachedToken = "";
  let tokenExpiry = 0;

  const fetchToken = () => {
    return new Promise((resolve, reject) => {
      const clientId = env.VITE_SENTINEL_HUB_CLIENT_ID;
      const clientSecret = env.VITE_SENTINEL_HUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) return reject("Missing credentials");

      const data = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
      const options = {
        hostname: 'identity.dataspace.copernicus.eu',
        path: '/auth/realms/CDSE/protocol/openid-connect/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': data.length }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.access_token) {
              cachedToken = parsed.access_token;
              tokenExpiry = Date.now() + (parsed.expires_in - 60) * 1000;
              resolve(cachedToken);
            } else reject("No token");
          } catch (e) { reject("Parse failed"); }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      proxy: {
        '/api/sentinel': {
          target: 'https://sh.dataspace.copernicus.eu',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sentinel/, ''),
        },
        '/api/irsa': {
          target: 'http://pakirsa.gov.pk',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/irsa/, ''),
        }
      }
    },
    plugins: [
      react(), 
      mode === "development" && componentTagger(),
      {
        name: 'custom-backend-injector',
        configureServer(server) {
          scheduleIRSAFetch(); // start irsa cron job

          server.middlewares.use(async (req, res, next) => {
            // IRSA Memory Cache Endpoint
            
            if (req.url.startsWith('/api/water/irsa-daily')) {
              res.setHeader('Content-Type', 'application/json');
              try {
                const dateParam = new URL(req.url, 'http://localhost').searchParams.get('date');
                const data = dateParam
                  ? await fetchAndParsePdf(dateParam)
                  : await fetchLatestPdf();
                if (data) res.end(JSON.stringify(data));
                else { res.statusCode = 404; res.end(JSON.stringify({error: 'Not found'})); }
              } catch(e) { res.statusCode = 500; res.end(JSON.stringify({error: e.message})); }
              return;
            }

            if (req.url === '/api/water/irsa-summary') {
              res.setHeader('Content-Type', 'application/json');
              try {
                let data = await fetchLatestPdf();
                if (data) {
                  const d = data;
                  const fillPct = (c, dead, max) => { if(!c||!dead) return null; const pct = ((c-dead)/(max-dead))*100; return Math.max(0, Math.min(100, Math.round(pct*10)/10)); };
                  const comp = d.comparison || {};
                  const summary = {
                    date: d.date,
                    totalRimInflows: d.rimStations?.totalInflows || 0,
                    totalRimOutflows: d.rimStations?.totalOutflows || 0,
                    inflowChangeFromYesterday: comp.inflowsChangePct ? `${comp.inflowsChangePct}% ${comp.inflowsChangeDirection}` : "N/A",
                    outflowChangeFromYesterday: comp.outflowsChangePct ? `${comp.outflowsChangePct}% ${comp.outflowsChangeDirection}` : "N/A",
                    reservoirLevels: [
                      { name: "Tarbela", currentLevel: d.tarbela?.level, deadLevel: d.tarbela?.deadLevel, inflow: d.tarbela?.meanInflow, outflow: d.tarbela?.meanOutflow, fillPct: fillPct(d.tarbela?.level, d.tarbela?.deadLevel, 1550) },
                      { name: "Mangla", currentLevel: d.mangla?.level, deadLevel: d.mangla?.deadLevel, inflow: d.mangla?.meanInflow, outflow: d.mangla?.meanOutflow, fillPct: fillPct(d.mangla?.level, d.mangla?.deadLevel, 1242) },
                      { name: "Chashma", currentLevel: d.chashma?.level, deadLevel: d.chashma?.deadLevel, inflow: d.chashma?.meanInflow, outflow: d.chashma?.meanOutflow, fillPct: fillPct(d.chashma?.level, d.chashma?.deadLevel, 649) }
                    ],
                    provincialReleases: ["punjab", "sindh", "kp", "balochistan"].map(p => {
                      const todayCs = d.irsaReleases?.today?.[p];
                      const lastYearCs = d.irsaReleases?.lastYear?.[p];
                      const provLabels = {punjab:"Punjab", sindh:"Sindh", kp:"Khyber Pakhtunkhwa", balochistan:"Balochistan"};
                      return { province: provLabels[p], todayCs, lastYearCs, changePct: (todayCs && lastYearCs) ? Math.round(((todayCs - lastYearCs)/lastYearCs)*1000)/10 : null };
                    }),
                    riverFlows: [
                      { name: "Kabul @ Nowshera", usDischarge: d.kabulNowshera, dsDischarge: null },
                      { name: "Chenab @ Marala", usDischarge: d.chenabMarala?.usDischarge, dsDischarge: d.chenabMarala?.dsDischarge },
                      { name: "Kalabagh", usDischarge: d.kalabagh?.usDischarge, dsDischarge: d.kalabagh?.dsDischarge },
                      { name: "Taunsa", usDischarge: d.taunsa?.usDischarge, dsDischarge: d.taunsa?.dsDischarge },
                      { name: "Panjnad", usDischarge: d.panjnad?.usDischarge, dsDischarge: d.panjnad?.dsDischarge },
                      { name: "Guddu", usDischarge: d.guddu?.usDischarge, dsDischarge: d.guddu?.dsDischarge },
                      { name: "Sukkur", usDischarge: d.sukkur?.usDischarge, dsDischarge: d.sukkur?.dsDischarge },
                      { name: "Kotri", usDischarge: d.kotri?.usDischarge, dsDischarge: d.kotri?.dsDischarge }
                    ]
                  };
                  res.end(JSON.stringify(summary));
                } else {
                  res.statusCode = 502; res.end(JSON.stringify({error: 'No data'}));
                }
              } catch(e) { res.statusCode = 500; res.end(JSON.stringify({error: e.message})); }
              return;
            }


            // Sentinel Token Injector
            if (req.url && req.url.startsWith('/api/sentinel')) {
              try {
                if (!cachedToken || Date.now() >= tokenExpiry) await fetchToken();
                req.headers['authorization'] = `Bearer ${cachedToken}`;
              } catch (err) {
                console.error("Token Injection Failed:", err);
                res.statusCode = 500;
                res.end("Token Injection Failed");
                return;
              }
            }
            next();
          });
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});
