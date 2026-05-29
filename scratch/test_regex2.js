const t = 'KOTRI:  SUKKUR:   U/S DISCHARGE   =   11255   Cs  U/S DISCHARGE   =   54350   Cs   D/S DISCHARGE   =   0   Cs  D/S DISCHARGE   =   17850   Cs';
console.log('Kotri:', t.match(/KOTRI:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i));
console.log('Sukkur:', t.match(/SUKKUR:[\s\S]*?U\/S DISCHARGE\s*=\s*([\d.]+)[\s\S]*?D\/S DISCHARGE\s*=\s*([\d.]+)/i));
