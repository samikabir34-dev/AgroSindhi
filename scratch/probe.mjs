import http from 'http';
import { PDFParse } from 'pdf-parse';

const dates = [];
const now = new Date();
for (let i=1;i<8;i++){const d=new Date(now);d.setDate(d.getDate()-i);dates.push(`${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`);}

function fetchOne(date){
  return new Promise((resolve)=>{
    http.get(`http://pakirsa.gov.pk/Doc/Data${date}.pdf`,{headers:{'User-Agent':'Mozilla/5.0'}},(res)=>{
      if(res.statusCode!==200){resolve(null);return;}
      const chunks=[];res.on('data',c=>chunks.push(c));
      res.on('end',async()=>{
        const buf=Buffer.concat(chunks);
        const p=new PDFParse({data:new Uint8Array(buf)});
        const t=await p.getText();
        resolve({date,text:t.text});
      });
    }).on('error',()=>resolve(null));
  });
}

for (const d of dates){
  const r=await fetchOne(d);
  if(r){console.log('===',r.date,'===');console.log(r.text);break;}
}
