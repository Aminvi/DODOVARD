const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../api/order-notification.js'),'utf8');
function setup(result={success:true,reference:'test',messageId:'mail-test-id'}) {
  const calls=[];const ctx={module:{exports:{}},process:{env:{}},Buffer,AbortSignal,console:{info(){},error(){}},fetch:async(url,options)=>{calls.push({url,options});return {ok:true,status:200,json:async()=>result};}};
  vm.runInNewContext(source,ctx);
  return {calls,async call(overrides={}){const req={method:'POST',headers:{origin:'https://dodovard.vercel.app','content-type':'application/json'},body:{reference:'test',order:{}},...overrides};const res={code:200,setHeader(){},status(c){this.code=c;return this;},json(data){this.data=data;return this;}};await ctx.module.exports(req,res);return res;}};
}
test('same-site notification forwards to the approved service and returns its receipt',async()=>{const app=setup();const res=await app.call();assert.equal(res.code,200);assert.equal(res.data.messageId,'mail-test-id');assert.equal(app.calls[0].url,'https://www.abiryva.com/api/dodovard-order');});
test('foreign origins and unconfirmed upstream responses never report success',async()=>{const app=setup({success:true});assert.equal((await app.call({headers:{origin:'https://other.example'}})).code,403);assert.equal(app.calls.length,0);assert.equal((await app.call()).code,502);});
