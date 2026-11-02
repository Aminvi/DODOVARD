/* Edit these settings when moving from the demo to the business website. */
(function (root) {
  const zones = [
    {id:'L0',name:'L0',rate:3500,areas:['Iyana Ipaja','Abule Egba','Agege','Ikeja','Magodo','Omole','Ogba','Ifako','Isheri','Isheri North','Isheri South','Ojodu Berger','Ijaiye','Iju']},
    {id:'L1',name:'L1',rate:4500,areas:['Surulere','Yaba','Mushin','Oshodi','Ketu','Maryland','Palmgrove','Gbagada','Anthony','Isolo','Okota','Orile','Apapa','Ebute Metta','Ijora','Otto','CMS','Marina','Broad Street','Lagos Island']},
    {id:'L2',name:'L2',rate:5300,areas:['Ikorodu','Ojota','Mile 12','Agbado','Alakuko','Agbara','Ota','Sango','Mowe','Ofada','Arepo','Akute','Lambe','Lusada','Igbesa','Ayobo','Egbeda','Igando','Ago Palace Way','Festac','Trade Fair','Ojo','Amuwo Odofin','Mile 2','Mazamaza','Volks','Badagry Expressway','Alimosho','Ipaja','Dopemu','Meiran','Alagbado','Mangoro','Cement']},
    {id:'L3',name:'L3',rate:5500,areas:['Victoria Island','Lekki Phase 1','Ikoyi','Onikan','Falomo','Bar Beach','Eko Atlantic','Five Cowries','Osborne','Old Ikoyi','Banana Island','Dolphin Estate']},
    {id:'L4',name:'L4',rate:6200,areas:['Ajah','Sangotedo','Abijo','Chevron','VGC','Jakande','Ado','Abraham Adesanya','Lekki Phase 2','Lekki Phase 3','Awoyaya','Ibeju','Eleko','Lakowe','Bogije','Oribanwa','Ikate','Igbo Efon','Osapa London','Oral Estate','Agungi','Idado','Orchid','Thomas Estate','Mayfair Gardens']}
  ];
  zones.push({id:'L5',name:'L5',rate:null,areas:[]});
  const normalize = value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\blekki (?:phase )?i\b/g,'lekki phase 1').replace(/\blekki (?:phase )?ii\b/g,'lekki phase 2').replace(/\blekki (?:phase )?iii\b/g,'lekki phase 3');
  const aliases = {'vi':'Victoria Island','v i':'Victoria Island','victoria garden city':'VGC','berger':'Ojodu Berger','ojodu':'Ojodu Berger','ebute meta':'Ebute Metta','osapa':'Osapa London','ago palace':'Ago Palace Way','amuwo':'Amuwo Odofin','lekki 1':'Lekki Phase 1','lekki 2':'Lekki Phase 2','lekki 3':'Lekki Phase 3','sango ota':'Sango','festac town':'Festac'};
  const entries = zones.flatMap(zone => zone.areas.map(area => ({area,zone,key:normalize(area)})));
  Object.entries(aliases).forEach(([key,area])=>entries.push({...entries.find(x=>x.area===area),key}));
  function matchArea(address) {
    const text=' '+normalize(address)+' ';
    const found=entries.filter(x=>text.includes(' '+x.key+' '));
    // A specific locality takes precedence over the broader name inside it.
    const specific=found.filter(x=>!found.some(y=>y.key!==x.key && (' '+y.key+' ').includes(' '+x.key+' ')));
    if(new Set(specific.map(x=>x.zone.id)).size>1) return null;
    return specific.sort((a,b)=>b.key.length-a.key.length)[0]||null;
  }
  function clock(now=new Date()) {
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
    return {today:`${p.year}-${p.month}-${p.day}`,minutes:Number(p.hour)*60+Number(p.minute)};
  }
  function allowedDate(value,now=new Date()) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const c=clock(now),date=new Date(value+'T12:00:00Z');
    if(Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==value||date.getUTCDay()===0||value<c.today) return false;
    const restricted=[2,4].includes(date.getUTCDay());
    if(restricted) return value===c.today && c.minutes>=13*60 && c.minutes<17*60+30;
    if(value===c.today) return c.minutes<16*60+28;
    const tomorrow=new Date(c.today+'T12:00:00Z');tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
    return value!==tomorrow.toISOString().slice(0,10)||c.minutes<18*60;
  }
  const api={zones,normalize,matchArea,clock,allowedDate,extraPepperPrice:1250,
    emailRecipient:'dodovardng@gmail.com',
    pickupNote:'Pickup details will be shared after your order is confirmed.',
    geocoderUrl:'https://photon.komoot.io/api/',
    scheduleNote:'Tuesday & Thursday: same-day orders only, 1 p.m.–5:30 p.m. Lagos time. No pre-orders for these days. Other operating days: same-day orders close at 4:28 p.m.; pre-orders close at 6 p.m. the evening before. Closed Sundays.'};
  root.Dodovard=api;
  if(typeof module!=='undefined') module.exports=api;
})(typeof window==='undefined'?globalThis:window);
