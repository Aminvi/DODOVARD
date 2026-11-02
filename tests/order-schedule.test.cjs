const {test}=require('node:test');
const assert=require('node:assert/strict');
const {allowedDate,scheduleNote}=require('../order-config.js');
const at=value=>new Date(value+'+01:00');
test('other days accept same-day orders until 4:30 p.m. WAT',()=>{
 for(const day of ['2026-11-02','2026-11-04','2026-11-06','2026-11-07']) {
  assert.equal(allowedDate(day,at(day+'T16:29:59')),true);
  assert.equal(allowedDate(day,at(day+'T16:30:00')),false);
 }
});
test('Tuesday and Thursday retain their 1 p.m. to 5:30 p.m. WAT same-day window',()=>{
 for(const day of ['2026-11-03','2026-11-05']) {
  assert.equal(allowedDate(day,at(day+'T12:59:59')),false);
  assert.equal(allowedDate(day,at(day+'T13:00:00')),true);
  assert.equal(allowedDate(day,at(day+'T17:29:59')),true);
  assert.equal(allowedDate(day,at(day+'T17:30:00')),false);
 }
 assert.equal(allowedDate('2026-11-03',at('2026-11-02T12:00:00')),false);
 assert.equal(allowedDate('2026-11-05',at('2026-11-04T12:00:00')),false);
});
test('next-day preorders close at 6 p.m. the evening before and Sundays remain closed',()=>{
 assert.equal(allowedDate('2026-11-04',at('2026-11-03T17:59:59')),true);
 assert.equal(allowedDate('2026-11-04',at('2026-11-03T18:00:00')),false);
 assert.equal(allowedDate('2026-11-08',at('2026-11-07T12:00:00')),false);
 assert.equal(allowedDate('2026-11-08',at('2026-11-08T13:00:00')),false);
});
test('schedule wording matches the supplied text',()=>{
 assert.equal(scheduleNote,'Tuesday & Thursday: same-day orders only, 1 p.m.–5:30 p.m. WAT\nOther days: same-day orders close at 4:30 p.m. WAT\nPre-orders close at 6 p.m. the evening before.\nClosed Sundays.');
});
