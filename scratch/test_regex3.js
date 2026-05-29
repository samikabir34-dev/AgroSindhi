const text = `TAUNSA:  U/S DISCHARGE   =   99660   Cs   GUDDU:  D/S DISCHARGE   =   78138   Cs   U/S DISCHARGE   =   62904   Cs  T-P Link   =   8022   Cs   D/S DISCHARGE   =   59493   Cs
KOTRI:  SUKKUR:   U/S DISCHARGE   =   11255   Cs  U/S DISCHARGE   =   54350   Cs   D/S DISCHARGE   =   0   Cs  D/S DISCHARGE   =   17850   Cs`;

console.log('U/S:', [...text.matchAll(/U\/S DISCHARGE\s*=\s*([\d.]+)/gi)].map(m => m[1]));
console.log('D/S:', [...text.matchAll(/D\/S DISCHARGE\s*=\s*([\d.]+)/gi)].map(m => m[1]));
