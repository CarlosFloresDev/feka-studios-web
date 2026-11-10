import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

const request = (method, body) => new Request('https://feka.test/api/ceniza/ranking', { method, ...(body !== undefined ? {body:JSON.stringify(body),headers:{'Content-Type':'application/json'}} : {}) });
function database({recent = 0, fail = false} = {}) {
  const writes=[];
  return { writes, prepare(sql) {
    if(fail)throw Error('offline');
    return { values: [], bind(...args){this.values=args;return this;}, async all(){return {results:[{name:'Portador',seconds:60,hits:2,date:'2026-11-10'}]};}, async first(){return {n:sql.includes('ip_hash') ? recent : 3};}, async run(){writes.push(this.values);} };
  }};
}
test('GET top 20, CORS, no cache',async()=>{
  const res=await worker.fetch(request('GET'),{DB:database()});
  assert.equal(res.status,200);assert.equal((await res.json()).ranking.length,1);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'),'*');assert.equal(res.headers.get('Cache-Control'),'no-store');
});
test('POST sanitizes name, stores rounded time, truncates hits and version, hashes IP',async()=>{
  const DB=database();const res=await worker.fetch(request('POST',{name:' <Ana> 🎮 ',seconds:42.56,hits:3.8,version:'v'.repeat(30)}),{DB});
  assert.deepEqual(await res.json(),{place:4});assert.equal(DB.writes.length,1);
  assert.deepEqual(DB.writes[0].slice(0,4),['Ana',42.6,3,'v'.repeat(20)]);assert.match(DB.writes[0][4],/^[a-f0-9]{24}$/);
});
test('rejects invalid input without writes',async()=>{
  for(const body of [null,[],{}, {seconds:29,hits:0},{seconds:14401,hits:0},{seconds:60,hits:-1},{seconds:60,hits:10000}]) {
    const DB=database();const res=await worker.fetch(request('POST',body),{DB});assert.equal(res.status,400);assert.equal(DB.writes.length,0);
  }
  assert.equal((await worker.fetch(new Request('https://feka.test/api/ceniza/ranking',{method:'POST',body:'invalid'}),{DB:database()})).status,400);
});
test('hourly limit, database failure, OPTIONS and unsupported method',async()=>{
  assert.equal((await worker.fetch(request('POST',{seconds:60,hits:0}),{DB:database({recent:20})})).status,429);
  assert.equal((await worker.fetch(request('GET'),{DB:database({fail:true})})).status,503);
  assert.equal((await worker.fetch(request('OPTIONS'),{})).status,204);
  assert.equal((await worker.fetch(request('DELETE'),{})).status,405);
});
test('other requests delegate to ASSETS for SPA handling',async()=>{
  const req=new Request('https://feka.test/ceniza/wiki');let received;
  const res=await worker.fetch(req,{ASSETS:{fetch(r){received=r;return new Response('SPA');}}});
  assert.equal(received,req);assert.equal(await res.text(),'SPA');
});
