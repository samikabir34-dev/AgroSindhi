import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import http from 'http';

const parseIRSAText = (text) => {
  const report = {
    date: '', rimStations: { inflow: 0, outflow: 0, yesterdayInflow: 0, yesterdayOutflow: 0 },
    reservoirs: [], barrages: [], provincialReleases: []
  };
  try {
    const dateMatch = text.match(/Date\s+(\d{2}\.\d{2}\.\d{4})/i) || text.match(/Daily Water Situation\s+(\d{2}\.\d{2}\.\d{4})/i);
    if (dateMatch) report.date = dateMatch[1];
    
    const rimInflowMatch = text.match(/RIM STATION INFLOWS[\s\S]*?TOTAL\s*=\s*(\d+)\s+Cs/i);
    if (rimInflowMatch) report.rimStations.inflow = parseInt(rimInflowMatch[1]);
    const rimOutflowMatch = text.match(/RIM STATION OUTFLOWS[\s\S]*?TOTAL\s*=\s*(\d+)\s+Cs/i);
    if (rimOutflowMatch) report.rimStations.outflow = parseInt(rimOutflowMatch[1]);

    const tMatch = text.match(/INDUS @ TARBELA[\s\S]*?LEVEL\s*=\s*([\d.]+)[\s\S]*?DEAD LEVEL\s*=\s*([\d.]+)[\s\S]*?MEAN INFLOW\s*=\s*([\d.]+)[\s\S]*?MEAN OUTFLOW\s*=\s*([\d.]+)/i);
    if (tMatch) report.reservoirs.push({ name: 'Tarbela', level: parseFloat(tMatch[1]), deadLevel: parseFloat(tMatch[2]), maxLevel: 1550, inflow: parseFloat(tMatch[3]), outflow: parseFloat(tMatch[4]) });

    const mMatch = text.match(/JHELUM @ MANGLA[\s\S]*?LEVEL\s*=\s*([\d.]+)[\s\S]*?DEAD LEVEL\s*=\s*([\d.]+)[\s\S]*?MEAN INFLOW\s*=\s*([\d.]+)[\s\S]*?MEAN OUTFLOW\s*=\s*([\d.]+)/i);
    if (mMatch) report.reservoirs.push({ name: 'Mangla', level: parseFloat(mMatch[1]), deadLevel: parseFloat(mMatch[2]), maxLevel: 1242, inflow: parseFloat(mMatch[3]), outflow: parseFloat(mMatch[4]) });

    ['Punjab', 'Sindh', 'KP', 'Balochistan'].forEach(p => {
      const pMatch = text.match(new RegExp(`${p}:\\s+(\\d+)\\s+Cs\\s+(\\d+)\\s+Cs`, 'i'));
      if (pMatch) report.provincialReleases.push({ province: p, today: parseInt(pMatch[1]), lastYear: parseInt(pMatch[2]) });
    });

    const kMatch = text.match(/KALABAGH\s*:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i);
    if (kMatch) report.barrages.push({ name: 'Kalabagh', usDischarge: parseFloat(kMatch[1]), dsDischarge: parseFloat(kMatch[2]) });
    
    const taMatch = text.match(/TAUNSA\s*:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i);
    if (taMatch) report.barrages.push({ name: 'Taunsa', usDischarge: parseFloat(taMatch[1]), dsDischarge: parseFloat(taMatch[2]) });
    
    const gMatch = text.match(/GUDDU\s*:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i);
    if (gMatch) report.barrages.push({ name: 'Guddu', usDischarge: parseFloat(gMatch[1]), dsDischarge: parseFloat(gMatch[2]) });

    // Sukkur and Kotri are interleaved due to columns: KOTRI: SUKKUR: U/S(Kotri) U/S(Sukkur) D/S(Kotri) D/S(Sukkur)
    const ksMatch = text.match(/KOTRI\s*:\s*SUKKUR\s*:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i);
    if (ksMatch) {
      report.barrages.push({ name: 'Kotri', usDischarge: parseFloat(ksMatch[1]), dsDischarge: parseFloat(ksMatch[3]) });
      report.barrages.push({ name: 'Sukkur', usDischarge: parseFloat(ksMatch[2]), dsDischarge: parseFloat(ksMatch[4]) });
    }
  } catch (e) { console.error("Parse error", e); }
  return report;
};

const fetchIRSA = async () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'pakirsa.gov.pk',
            path: '/DailyData.aspx',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        };
        http.get(options, (res) => {
            let html = '';
            res.on('data', chunk => html += chunk);
            res.on('end', () => {
                const pdfMatch = html.match(/href=['"]?(Doc\/Data\d{2}-\d{2}-\d{4}\.pdf)['"]?/i) || html.match(/href=['"]?(Doc\/[^'"]+\.pdf)['"]?/i);
                if (pdfMatch && pdfMatch[1]) {
                    const pdfUrl = `http://pakirsa.gov.pk/${pdfMatch[1]}`;
                    const pdfOptions = {
                        hostname: 'pakirsa.gov.pk',
                        path: `/${pdfMatch[1]}`,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    };
                    http.get(pdfOptions, (res2) => {
                        const chunks = [];
                        res2.on('data', chunk => chunks.push(chunk));
                        res2.on('end', async () => {
                            const buffer = Buffer.concat(chunks);
                            try {
                                const getDocument = pdfjsLib.getDocument || pdfjsLib.default.getDocument;
                                const loadingTask = getDocument({ data: new Uint8Array(buffer) });
                                const pdfDocument = await loadingTask.promise;
                                let fullText = '';
                                for (let i = 1; i <= pdfDocument.numPages; i++) {
                                    const page = await pdfDocument.getPage(i);
                                    const textContent = await page.getTextContent();
                                    fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                                }
                                const data = parseIRSAText(fullText);
                                console.log('================ FULL TEXT ================');
                                console.log(fullText.substring(0, 3000));
                                console.log('===========================================');
                                console.log('Parsed Data:', JSON.stringify(data, null, 2));
                                resolve(data);
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }).on('error', reject);
                } else {
                    reject('No PDF found');
                }
            });
        }).on('error', reject);
    });
};

fetchIRSA().catch(console.error);
