/* Checkout for the static website. Email is delivered by FormSubmit after recipient activation. */
const checkoutState={mode:'delivery',busy:false,sequence:0,results:[],cache:new Map(),emailSent:new Set(),draftKey:'',draftId:'',mapLocation:null};
const byId=id=>document.getElementById(id);
const allDeliveryAreas=Dodovard.zones.flatMap(zone=>zone.areas.map(area=>({area,zone}))).sort((a,b)=>a.area.localeCompare(b.area));
function filterDeliveryAreas() {
  const selected=byId('deliveryArea').value;
  const query=Dodovard.normalize(byId('areaSearch').value);
  const matches=allDeliveryAreas.filter(x=>Dodovard.normalize(x.area).includes(query));
  byId('deliveryArea').replaceChildren(new Option('Select your area',''));
  matches.forEach(x=>byId('deliveryArea').add(new Option(`${x.area} · ${naira(x.zone.rate)}`,x.area)));
  if(selected&&!matches.some(x=>x.area===selected)) {
    const previous=allDeliveryAreas.find(x=>x.area===selected);
    if(previous) byId('deliveryArea').add(new Option(`${previous.area} · ${naira(previous.zone.rate)}`,previous.area));
  }
  byId('deliveryArea').value=selected;
}
function currentDelivery() {
  if(checkoutState.mode==='pickup') return {rate:0,area:'Pickup',id:'pickup',quote:false};
  const selected=allDeliveryAreas.find(x=>x.area===byId('deliveryArea').value);
  if(byId('customDelivery').checked||!selected) return {rate:null,area:selected?selected.area:'Unlisted area',id:'L5',quote:true};
  return {rate:selected.zone.rate,area:selected.area,id:selected.zone.id,quote:false};
}
function setFulfilment() {
  checkoutState.mode=document.querySelector('input[name="fulfilment"]:checked').value;
  const pickup=checkoutState.mode==='pickup';
  byId('deliveryFields').hidden=pickup;byId('pickupInfo').hidden=!pickup;
  byId('pickupInfo').textContent=Dodovard.pickupNote;
  byId('deliveryDateLabel').textContent=pickup?'Preferred pickup date':'Preferred delivery date';
  clearOrderFeedback();updateCheckoutTotal();
}
function clearOrderFeedback() {
  byId('orderStatus').textContent='';
}
function resetMapResults() {
  checkoutState.sequence++;checkoutState.mapLocation=null;byId('mapResults').replaceChildren();byId('mapStatus').textContent='';
  byId('deliveryMap').src='https://www.openstreetmap.org/export/embed.html?bbox=3.08%2C6.35%2C3.72%2C6.80&layer=mapnik';
}
function addressChanged() {
  resetMapResults();byId('areaSearch').value='';filterDeliveryAreas();
  const match=Dodovard.matchArea(byId('customerArea').value);
  byId('deliveryArea').value=match?match.area:'';
  clearOrderFeedback();updateCheckoutTotal();
}
function chooseDeliveryArea() {clearOrderFeedback();updateCheckoutTotal();}
function updateCheckoutTotal() {
  const subtotal=cart.reduce((sum,item)=>sum+item.p*item.q,0),delivery=currentDelivery();
  const quote=delivery.quote;
  byId('checkoutTotal').textContent=quote?'Delivery quote needed':naira(subtotal+delivery.rate);
  byId('amountLabel').textContent=quote?'Confirm the delivery fee before paying':'Amount to pay';
  byId('checkoutBreakdown').textContent=`Meals & add-ons: ${naira(subtotal)} · ${checkoutState.mode==='pickup'?'Pickup: ₦0':quote?'Delivery: custom quote':`Delivery: ${naira(delivery.rate)}`}`;
  document.querySelector('.payment-details').hidden=quote;
  byId('deliveryRate').textContent=quote?'L5 · Custom quote. We’ll confirm the delivery fee before payment.':`${delivery.id} · ${naira(delivery.rate)}`;
  byId('paymentReference').closest('.form').querySelector('label[for="paymentReference"]').textContent=quote?'Sender’s name (optional until delivery is quoted)':'Sender’s name';
  byId('submitOrderButton').textContent='Proceed';
}
async function searchAddressMap() {
  const address=byId('customerArea').value.trim();
  if(address.length<3) {byId('mapStatus').textContent='Enter your address or area first.';return;}
  const sequence=++checkoutState.sequence;
  byId('mapSearch').disabled=true;byId('mapStatus').textContent='Searching nearby addresses…';byId('mapResults').replaceChildren();
  try {
    let data=checkoutState.cache.get(address);
    if(!data) {
      const url=new URL(Dodovard.geocoderUrl);
      Object.entries({q:address,limit:5,lat:6.55,lon:3.38,bbox:'2.65,6.35,4.35,7.15',lang:'en'}).forEach(([key,value])=>url.searchParams.set(key,value));
      const response=await fetch(url,{signal:AbortSignal.timeout(10000)});
      if(!response.ok) throw new Error('Map unavailable');
      data=await response.json();checkoutState.cache.set(address,data);
    }
    if(sequence!==checkoutState.sequence) return;
    checkoutState.results=(data.features||[]).filter(f=>f.properties.countrycode?.toUpperCase()==='NG');
    byId('mapStatus').textContent=checkoutState.results.length?'Choose the address that matches your destination.':'No map match. Keep your full address and select your delivery area above, or request a custom quote.';
    checkoutState.results.forEach((feature,index)=>{
      const p=feature.properties;
      const label=[p.name,[p.housenumber,p.street].filter(Boolean).join(' '),p.district,p.city,p.state].filter((x,i,a)=>x&&a.indexOf(x)===i).join(', ');
      const button=document.createElement('button');button.type='button';button.textContent=label;
      button.addEventListener('click',()=>chooseMapAddress(index,label));byId('mapResults').append(button);
    });
  } catch(error) {
    if(sequence===checkoutState.sequence) byId('mapStatus').textContent='Map search is unavailable. Enter your full address and select your area above; your delivery rate still works.';
  } finally {byId('mapSearch').disabled=false;}
}
function chooseMapAddress(index,label) {
  const feature=checkoutState.results[index];if(!feature) return;
  const [lon,lat]=feature.geometry.coordinates,p=feature.properties;
  checkoutState.mapLocation={label,lat,lon};
  // Match the smallest available locality before any wider city or county.
  let match=null;
  for(const locality of [p.district,p.locality,p.suburb,p.osm_key==='place'?p.name:null,p.city]) {
    if(locality&&(match=Dodovard.matchArea(locality))) break;
  }
  const typedMatch=Dodovard.matchArea(byId('customerArea').value);
  const resolved=typedMatch||match;
  byId('areaSearch').value='';filterDeliveryAreas();byId('deliveryArea').value=resolved?resolved.area:'';
  // Preserve a customer's house number and delivery details; map labels may be less precise.
  const box=[lon-.009,lat-.006,lon+.009,lat+.006].join(',');
  byId('deliveryMap').src=`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(box)}&layer=mapnik&marker=${lat}%2C${lon}`;
  byId('mapStatus').textContent=`Map location: ${label}. Check your full street address above.`;
  byId('mapResults').replaceChildren();updateCheckoutTotal();
}
async function submitOrder() {
  if(checkoutState.busy) return;
  const name=byId('customerName').value.trim(),phone=byId('customerPhone').value.trim(),address=byId('customerArea').value.trim(),sender=byId('paymentReference').value.trim();
  const delivery=currentDelivery(),pickup=checkoutState.mode==='pickup',date=byId('customerDay').value;
  const status=byId('orderStatus');
  function invalid(message,id) {status.textContent=message;byId(id).focus();}
  if(!hasPlantainDish()) {invalid(plantainOrderMessage,'submitOrderButton');return;}
  if(!name) {invalid('Please enter your name.','customerName');return;}
  if(phone.replace(/\D/g,'').length<7) {invalid('Please enter a valid phone number.','customerPhone');return;}
  if(!pickup&&address.length<8) {invalid('Please enter your full delivery address, including house number, street and area.','customerArea');return;}
  if(!allowedDeliveryDate(date)) {
    refreshDeliveryDate();byId('deliveryDateError').textContent=Dodovard.scheduleNote;
    invalid('Choose an available pickup / delivery date.','deliveryDateTrigger');return;
  }
  if(!delivery.quote&&!sender) {invalid('Enter the sender’s name on your bank transfer.','paymentReference');return;}
  const subtotal=cart.reduce((sum,item)=>sum+item.p*item.q,0),total=delivery.quote?null:subtotal+delivery.rate;
  const notes=byId('customerNotes').value.trim();
  const orderLines=cart.map(item=>`${item.q} × ${item.n} — ${naira(item.p*item.q)}`).join('\n');
  const order={Name:name,Phone:phone,Fulfilment:pickup?'Pickup':'Delivery',Address:pickup?Dodovard.pickupNote:address,Area:delivery.area,Zone:delivery.id,Date:deliveryDateLabel(date),'Order items':orderLines,Subtotal:naira(subtotal),'Delivery fee':delivery.quote?'Custom quote required':naira(delivery.rate),Total:delivery.quote?'Pending delivery quote — do not pay yet':naira(total),'Sender name':sender||'Awaiting delivery quote',Notes:notes||'None'};
  if(!pickup&&checkoutState.mapLocation) order['Map location']=checkoutState.mapLocation.label+' https://www.openstreetmap.org/?mlat='+checkoutState.mapLocation.lat+'&mlon='+checkoutState.mapLocation.lon;
  const key=JSON.stringify(order);
  if(checkoutState.draftKey!==key) {checkoutState.draftKey=key;checkoutState.draftId='DODO-'+Date.now().toString(36).toUpperCase()+'-'+crypto.randomUUID().slice(0,8).toUpperCase();}
  const reference=checkoutState.draftId;
  const message=`Hello Dodovard! ${delivery.quote?'Please quote delivery for this order request.':'I would like to place an order.'}\nOrder reference: ${reference}\n\n`+Object.entries(order).map(([k,v])=>`${k}: ${v}`).join('\n');
  const whatsappUrl=`https://wa.me/2349131101569?text=${encodeURIComponent(message)}`;
  checkoutState.busy=true;byId('submitOrderButton').disabled=true;
  status.textContent='Sending your order request…';byId('submitOrderButton').textContent='Sending…';
  try {
    if(!checkoutState.emailSent.has(reference)) {
      const response=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(Dodovard.emailRecipient)}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify({_subject:`Dodovard ${pickup?'pickup':'delivery'} request ${reference}`,_template:'table',Reference:reference,...order})});
      const result=await response.json();
      if(!response.ok||![true,'true'].includes(result.success)) throw new Error('Notification was not accepted');
      checkoutState.emailSent.add(reference);
    }
    status.textContent='Your request was sent. Opening WhatsApp…';
  } catch(error) {
    status.textContent='Email notification could not be confirmed. Opening WhatsApp so you can send your order directly.';
  } finally {
    checkoutState.busy=false;byId('submitOrderButton').disabled=false;byId('submitOrderButton').textContent='Proceed';
  }
  if(!allowedDeliveryDate(date)) {status.textContent='The ordering window just closed. Please choose another available date or contact Dodovard about your request.';refreshDeliveryDate();return;}
  alert(delivery.quote?'Thank you! We will confirm your delivery quote before payment.':'Thank you for your purchase');
  window.location.assign(whatsappUrl);
}
filterDeliveryAreas();setFulfilment();
byId('rateCards').innerHTML=Dodovard.zones.map(zone=>`<details><summary><span>${zone.id}</span><strong>${zone.rate===null?'Custom quote':naira(zone.rate)}</strong></summary><p>${zone.areas.length?zone.areas.join(', '):'Contact us with your address before making payment.'}</p></details>`).join('');
