
// Loose types matching the shape produced by the /api/water/* endpoints.
export type DailyWaterData = any;
export type WaterSummary = any;
export type AvailableDate = { date: string; label?: string };

export interface IRSAReport {
  date: string;
  rimStations: {
    inflow: number;
    outflow: number;
    yesterdayInflow: number;
    yesterdayOutflow: number;
  };
  reservoirs: {
    name: string;
    level: number;
    deadLevel: number;
    maxLevel: number;
    inflow: number;
    outflow: number;
  }[];
  barrages: {
    name: string;
    level?: number;
    usDischarge: number;
    dsDischarge: number;
    inflow?: number;
    outflow?: number;
    canalWithdrawals?: number;
  }[];
  provincialReleases: {
    province: string;
    today: number;
    lastYear: number;
  }[];
}

export const parseIRSAText = (text: string): IRSAReport => {
  const report: IRSAReport = {
    date: '',
    rimStations: { inflow: 0, outflow: 0, yesterdayInflow: 0, yesterdayOutflow: 0 },
    reservoirs: [],
    barrages: [],
    provincialReleases: []
  };

  try {
    // Extract Date
    const dateMatch = text.match(/Date\s+(\d{2}\.\d{2}\.\d{4})/i) || text.match(/Daily Water Situation\s+(\d{2}\.\d{2}\.\d{4})/i);
    if (dateMatch) report.date = dateMatch[1];

    // Extract Rim Station Totals
    const rimInflowMatch = text.match(/RIM STATION INFLOWS\s+TOTAL\s+=\s+(\d+)\s+Cs/i);
    if (rimInflowMatch) report.rimStations.inflow = parseInt(rimInflowMatch[1]);

    const rimOutflowMatch = text.match(/RIM STATION OUTFLOWS\s+TOTAL\s+=\s+(\d+)\s+Cs/i);
    if (rimOutflowMatch) report.rimStations.outflow = parseInt(rimOutflowMatch[1]);

    // Extract Reservoirs (Tarbela, Mangla, Chashma)
    // Indus @ Tarbela
    const tarbelaRegex = /INDUS @ TARBELA[\s\S]*?LEVEL = ([\d.]+)\s+[\s\S]*?DEAD LEVEL = ([\d.]+)[\s\S]*?MEAN INFLOW = ([\d.]+)\s+[\s\S]*?MEAN OUTFLOW = ([\d.]+)/i;
    const tarbelaMatch = text.match(tarbelaRegex);
    if (tarbelaMatch) {
      report.reservoirs.push({
        name: 'Tarbela',
        level: parseFloat(tarbelaMatch[1]),
        deadLevel: parseFloat(tarbelaMatch[2]),
        maxLevel: 1550, // Standard max
        inflow: parseFloat(tarbelaMatch[3]),
        outflow: parseFloat(tarbelaMatch[4])
      });
    }

    // Jhelum @ Mangla
    const manglaRegex = /JHELUM @ MANGLA[\s\S]*?LEVEL = ([\d.]+)\s+[\s\S]*?DEAD LEVEL = ([\d.]+)[\s\S]*?MEAN INFLOW = ([\d.]+)\s+[\s\S]*?MEAN OUTFLOW = ([\d.]+)/i;
    const manglaMatch = text.match(manglaRegex);
    if (manglaMatch) {
      report.reservoirs.push({
        name: 'Mangla',
        level: parseFloat(manglaMatch[1]),
        deadLevel: parseFloat(manglaMatch[2]),
        maxLevel: 1242,
        inflow: parseFloat(manglaMatch[3]),
        outflow: parseFloat(manglaMatch[4])
      });
    }

    // Provincial Releases
    const provinces = ['Punjab', 'Sindh', 'KP', 'Balochistan'];
    provinces.forEach(p => {
      const pRegex = new RegExp(`${p}:\\s+(\\d+)\\s+Cs\\s+(\\d+)\\s+Cs`, 'i');
      const pMatch = text.match(pRegex);
      if (pMatch) {
        report.provincialReleases.push({
          province: p,
          today: parseInt(pMatch[1]),
          lastYear: parseInt(pMatch[2])
        });
      }
    });

    // Barrages (Kalabagh, Taunsa, etc.)
    const kalabaghMatch = text.match(/KALABAGH:\s+LEVEL = ([\d.]+)\s+U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i);
    if (kalabaghMatch) {
      report.barrages.push({
        name: 'Kalabagh',
        level: parseFloat(kalabaghMatch[1]),
        usDischarge: parseFloat(kalabaghMatch[2]),
        dsDischarge: parseFloat(kalabaghMatch[3])
      });
    }

    const taunsaMatch = text.match(/TAUNSA:\s+U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i);
    if (taunsaMatch) {
      report.barrages.push({
        name: 'Taunsa',
        usDischarge: parseFloat(taunsaMatch[1]),
        dsDischarge: parseFloat(taunsaMatch[2])
      });
    }

    const sukkurMatch = text.match(/SUKKUR:\s+U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i);
    if (sukkurMatch) {
      report.barrages.push({
        name: 'Sukkur',
        usDischarge: parseFloat(sukkurMatch[1]),
        dsDischarge: parseFloat(sukkurMatch[2])
      });
    }

    const kotriMatch = text.match(/KOTRI:\s+U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i);
    if (kotriMatch) {
      report.barrages.push({
        name: 'Kotri',
        usDischarge: parseFloat(kotriMatch[1]),
        dsDischarge: parseFloat(kotriMatch[2])
      });
    }

    const gudduMatch = text.match(/GUDDU:[\s\S]*?U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i) || text.match(/GUDDU:\s+U\/S DISCHARGE = ([\d.]+)\s+[\s\S]*?D\/S DISCHARGE = ([\d.]+)/i);
    if (gudduMatch) {
      report.barrages.push({
        name: 'Guddu',
        usDischarge: parseFloat(gudduMatch[1]),
        dsDischarge: parseFloat(gudduMatch[2])
      });
    }

  } catch (e) {
    console.error("Failed to parse IRSA text", e);
  }

  return report;
};

export const fetchIRSADailyData = async (): Promise<IRSAReport> => {
  try {
    // 1. Fetch from the memory-cached backend endpoint
    const pageResponse = await fetch('/api/water/irsa-data');
    if (pageResponse.ok) {
      const data = await pageResponse.json();
      if (data.date || data.rimStations.inflow > 0) {
        return data;
      }
    }
  } catch (error) {
    console.error("Error fetching IRSA data from backend cache:", error);
  }

  // Fallback to mock data if the fetch fails (e.g., website down)
  const mockData = `
    INDUS @ TARBELA KABUL @ NOWSHERA
    LEVEL = 1466.37 MEAN DISCHARGE = 32900 Cs
    DEAD LEVEL = 1402.00
    MEAN INFLOW = 21200 Cs
    MEAN OUTFLOW = 8000 Cs
    CHASHMA:
    KALABAGH: LEVEL = 648.50
    U/S DISCHARGE = 44392 Cs DEAD LEVEL = 638.15
    D/S DISCHARGE = 40842 Cs MEAN INFLOW = 48639 Cs
    Thal = 3550 Cs MEAN OUTFLOW = 37219 Cs
    C-J Link = 10041 Cs
    CRBC = 1379 Cs
    TAUNSA:
    U/S DISCHARGE = 63983 Cs GUDDU:
    D/S DISCHARGE = 63583 Cs U/S DISCHARGE = 80555 Cs
    T-P Link = 0 Cs D/S DISCHARGE = 80555 Cs
    Muzafarghar Canal = 0 Cs * Canal W/dls = 0 Cs
    Dera Ghazi Khan Canal = 0 Cs
    KOTRI:
    SUKKUR: U/S DISCHARGE = 8295 Cs
    U/S DISCHARGE = 55870 Cs D/S DISCHARGE = 0 Cs
    D/S DISCHARGE = 27650 Cs Canal W/dls = 8895 Cs
    * Canal W/dls = 28220 Cs
    CHENAB @ MARALA:
    JHELUM @ MANGLA: MEAN U/S DISCHARGE = 15384 Cs
    LEVEL = 1157.85 MEAN D/S DISCHARGE = 8984 Cs
    DEAD LEVEL = 1050.00
    MEAN INFLOW = 28001 Cs **RIM STATION INFLOWS
    MEAN OUTFLOW = 8000 Cs TOTAL = 97485 Cs
    RIM STATION OUTFLOWS
    TOTAL = 64284 Cs
    PANJNAD
    U/S DISCHARGE = 20096 Cs IRSA RELEASES
    D/S DISCHARGE = 15196 Cs Today Last Year
    Date 14.04.2026 14.04.2025
    Punjab: 40700 Cs 41400 Cs
    Sindh: 40000 Cs 35000 Cs
    KP: 2300 Cs 1900 Cs
    Balochistan: 0 Cs 500 Cs
  `;

  return parseIRSAText(mockData);
};
