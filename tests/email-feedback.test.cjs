const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(require('node:path').join(__dirname,'../checkout.js'),'utf8');
function setup(response) {
  const elements=new Map();
  for(const [id,value] of Object.entries({customerName:'TEST ONLY',customerPhone:'00000000000',customerArea:'',paymentReference:'TEST ONLY',customerDay:'2026-11-04',customerNotes:'No real order'}))elements.set(id,{value});
  const byId=id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id);};
  const alerts=[],destinations=[],requests=[];
  const ctx=vm.createContext({byId,crypto:webcrypto,AbortSignal,
    checkoutState:{mode:'pickup',busy:false,emailSent:new Set()},
    Dodovard:{emailRecipient:'dodovardng@gmail.com',pickupNote:'Details shared after confirmation'},
    hasPlantainDish:()=>true,currentDelivery:()=>({rate:0,area:'Pickup',id:'pickup',quote:false}),
    allowedDeliveryDate:()=>true,deliveryDateLabel:()=> 'Wednesday, 4 November 2026',
    cart:[{n:'Plantain burger',p:7500,q:1}],naira:n=>'₦'+n,
    alert:message=>alerts.push(message),window:{location:{assign:url=>destinations.push(url)}},
    fetch:async(...args)=>{requests.push(args);if(response instanceof Error)throw response;return response;}
  });
  vm.runInContext(source.slice(source.indexOf('async function submitOrder()'),source.indexOf('\nfilterDeliveryAreas();setFulfilment();')),ctx);
  return {run:()=>vm.runInContext('submitOrder()',ctx),byId,alerts,destinations,requests};
}
test('a failed email never shows a purchase success message and still provides WhatsApp',async()=>{
  for(const response of [new Error('offline'),{ok:false,json:async()=>({success:false})},{ok:true,json:async()=>({success:false})}]) {
    const app=setup(response);await app.run();
    assert.match(app.alerts[0],/email notification could not be sent/i);
    assert.match(app.alerts[0],/tap Send in WhatsApp/);
    assert.doesNotMatch(app.alerts[0],/thank you|purchase/i);
    assert.equal(app.destinations.length,1);
    assert.match(app.destinations[0],/^https:\/\/wa\.me\/2349131101569\?text=/);
    assert.equal(app.byId('submitOrderButton').disabled,false);
  }
});
test('accepted requests give truthful request feedback and repeated clicks do not duplicate email',async()=>{
  const app=setup({ok:true,json:async()=>({success:true})});
  await app.run();await app.run();
  assert.match(app.alerts[0],/order request was emailed/);
  assert.doesNotMatch(app.alerts[0],/purchase/);
  assert.equal(app.requests.length,1);
});
