// Same-site checkout endpoint. The existing mail service retains its own key.
module.exports=async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({success:false});}
  const origins=['https://dodovard.vercel.app'];
  for(const host of [process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL])if(host)origins.push('https://'+host);
  if(process.env.NODE_ENV==='development')origins.push('http://127.0.0.1:8765');
  if(!origins.includes(req.headers.origin))return res.status(403).json({success:false});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({success:false});
  if(Number(req.headers['content-length']||0)>24000)return res.status(413).json({success:false});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({success:false});}
  if(!body||Buffer.byteLength(JSON.stringify(body))>24000)return res.status(400).json({success:false});
  try{
    const response=await fetch('https://www.abiryva.com/api/dodovard-order',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://dodovard.vercel.app'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    const result=await response.json();
    if(!response.ok||result.success!==true||!result.messageId){console.error('Order notification failed',{status:response.status,reference:body.reference});return res.status(response.status===429?429:502).json({success:false});}
    console.info('Order notification accepted',{reference:result.reference,messageId:result.messageId});
    return res.status(200).json({success:true,reference:result.reference,messageId:result.messageId});
  }catch{console.error('Order notification service unavailable');return res.status(502).json({success:false});}
};
