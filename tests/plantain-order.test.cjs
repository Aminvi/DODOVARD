const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const checkout=fs.readFileSync(require('node:path').join(__dirname,'../checkout.js'),'utf8');
function between(source,start,end) {return source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));}
function setup() {
  const elements=new Map();
  const get=id=>{if(!elements.has(id)) elements.set(id,{value:'',textContent:'',innerHTML:'',focus(){},classList:{add(){},remove(){}}});return elements.get(id);};
  const buttons=[{},{}];let opened=0,alerts=0,requests=0;
  get('checkoutModal').classList.add=()=>opened++;
  const ctx=vm.createContext({document:{getElementById:get,querySelectorAll:()=>buttons},naira:n=>'₦'+n,alert:()=>alerts++,syncVisibleViewport(){},refreshDeliveryDate(){},updateCheckoutTotal(){},currentDelivery:()=>({quote:true}),checkoutState:{busy:false},byId:get,fetch(){requests++;throw new Error('Unexpected external request');}});
  vm.runInContext('let cart=[];'+between(html,'const plantainOrderMessage=','function openCart()')+between(html,'function putInCart(','function openGroup(')+between(html,'function checkoutFromCart()','function scrollToOrder()')+between(html,'function openCheckout()','window.addEventListener("scroll"')+between(checkout,'async function submitOrder()','\nfilterDeliveryAreas();setFulfilment();'),ctx);
  return {ctx,get,buttons,run:code=>vm.runInContext(code,ctx),opened:()=>opened,alerts:()=>alerts,requests:()=>requests};
}
test('empty and add-on-only orders cannot check out or submit',async()=>{
  for(const c of [null,'drinks','sides','fries','extras','sauces']) {
    const app=setup();if(c) app.run(`putInCart('Add-on',900,1,'${c}')`);else app.run('renderCart()');
    assert.equal(app.run('hasPlantainDish()'),false);
    assert.ok(app.buttons.every(b=>b.disabled));
    app.run('openCheckout();checkoutFromCart()');assert.equal(app.opened(),0);assert.equal(app.alerts(),2);
    await app.run('submitOrder()');assert.match(app.get('orderStatus').textContent,/at least one plantain dish/);assert.equal(app.requests(),0);
  }
});
test('all four plantain meal categories unlock checkout, with or without add-ons',()=>{
  for(const c of ['boats','burgers','pancakes','loaded']) {
    const app=setup();app.run(`putInCart('Plantain meal',13800,1,'${c}')`);
    assert.equal(app.run('hasPlantainDish()'),true);assert.ok(app.buttons.every(b=>!b.disabled));
    app.run("putInCart('Drink',450,1,'drinks');openCheckout()");assert.equal(app.opened(),1);
    assert.equal(app.get('cartPlantainNotice').textContent,'');
  }
});
test('removing the last plantain dish immediately blocks both carts and final submission',async()=>{
  const app=setup();app.run("putInCart('Drink',450,1,'drinks');putInCart('Burger',13800,1,'burgers');removeItem(1)");
  assert.equal(app.run('hasPlantainDish()'),false);assert.ok(app.buttons.every(b=>b.disabled));
  assert.match(app.get('drawerPlantainNotice').textContent,/at least one plantain dish/);
  await app.run('submitOrder()');assert.equal(app.requests(),0);assert.match(app.get('orderStatus').textContent,/at least one plantain dish/);
});
test('a plantain dish named in add-on notes does not qualify an add-on',()=>{
  const app=setup();app.run("putInCart('Sauce — for Plantain Burger',900,1,'sauces')");assert.equal(app.run('hasPlantainDish()'),false);
});
test('zero portions do not qualify and repeated items retain category',()=>{
  const app=setup();app.run("putInCart('Burger',13800,0,'burgers')");assert.equal(app.run('hasPlantainDish()'),false);
  app.run("putInCart('Burger',13800,1,'burgers')");assert.equal(app.run('hasPlantainDish()'),true);assert.equal(app.run('cart.length'),1);
});
