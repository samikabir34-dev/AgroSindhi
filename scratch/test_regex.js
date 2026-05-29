const t = 'INDUS @ TARBELA   KABUL @ NOWSHERA  LEVEL   =   1449.41   MEAN DISCHARGE   =   39800   Cs  DEAD LEVEL   =   1402.00  MEAN INFLOW   =   67600   Cs  MEAN OUTFLOW   =   70000   Cs';
console.log('LEVEL:', t.match(/LEVEL\s*=\s*([\d.]+)/));
console.log('DEAD LEVEL:', t.match(/DEAD LEVEL\s*=\s*([\d.]+)/));
console.log('MEAN INFLOW:', t.match(/MEAN INFLOW\s*=\s*([\d.]+)/));
console.log('MEAN OUTFLOW:', t.match(/MEAN OUTFLOW\s*=\s*([\d.]+)/));
console.log('Full:', t.match(/INDUS @ TARBELA[\s\S]*?LEVEL\s*=\s*([\d.]+)[\s\S]*?DEAD LEVEL\s*=\s*([\d.]+)[\s\S]*?MEAN INFLOW\s*=\s*([\d.]+)[\s\S]*?MEAN OUTFLOW\s*=\s*([\d.]+)/i));
