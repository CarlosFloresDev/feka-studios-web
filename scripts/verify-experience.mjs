import { chromium } from 'playwright';
import fs from 'node:fs';
const phase = process.argv[2] || 'after';
const dir = `capturas/experience-${phase}`;
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const routes = phase === 'before' ? ['/vacas', '/ceniza'] : ['/vacas', ...['historia','jugabilidad','galeria','personajes','bitacora'].map(x=>'/vacas/'+x), '/ceniza', ...['universo','wiki','bitacora','banda-sonora','hoja-de-ruta','descargar'].map(x=>'/ceniza/'+x)];
const report = [];
for (const mobile of [false, true]) {
  const context = await browser.newContext({ viewport: mobile ? {width:390,height:844} : {width:1440,height:900}, deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile });
  await context.addInitScript(()=>localStorage.setItem('feka-vacas-adulto','1'));
  const page = await context.newPage();
  // Sample WebGL immediately after render, before the default framebuffer clears.
  await page.addInitScript(()=>{ const raf=window.requestAnimationFrame; window.requestAnimationFrame=function(cb){return raf.call(window,t=>{cb(t); const c=document.querySelector('canvas'); if(!c || c.dataset.nonblack==='true')return; const gl=c.getContext('webgl2')||c.getContext('webgl'); if(!gl)return; const pixels=new Uint8Array(4*16*16); gl.readPixels(Math.floor(c.width*.7),Math.floor(c.height*.1),16,16,gl.RGBA,gl.UNSIGNED_BYTE,pixels); if(pixels.some((v,i)=>i%4!==3&&v>5))c.dataset.nonblack='true'; });}; });
  for (const route of routes) {
    const name=`${mobile?'mobile':'desktop'}-${route.slice(1).replaceAll('/','-')}`;
    const errors=[]; const onError=e=>errors.push(e.message); page.on('pageerror',onError);
    await page.goto((process.env.EXPERIENCE_URL || 'http://127.0.0.1:4173')+route,{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForSelector('.vhero, .cn-hero');
    const start=Date.now(); const frames=[];
    for(const t of [0,300,1000,2500]) {
      await page.waitForTimeout(Math.max(0,t-(Date.now()-start)));
      frames.push(await page.evaluate(()=>{const hero=document.querySelector('.vhero, .cn-hero');const img=hero.querySelector('img');const c=hero.querySelector('canvas');return {hero:hero.getBoundingClientRect().toJSON(),image:img.getBoundingClientRect().toJSON(),canvas:!!c,nonblack:c?.dataset.nonblack==='true'};}));
      await page.screenshot({path:`${dir}/${name}-${t}.png`});
    }
    for(const y of [700,1400,2600]) {await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(1000);await page.screenshot({path:`${dir}/${name}-scroll-${y}.png`});}
    const scroll=await page.evaluate(()=>({y:scrollY,sanity:document.querySelector('[data-sanity]')?.textContent,zone:document.querySelector('.vp')?.getAttribute('data-zone-now'),overflow:document.documentElement.scrollWidth>innerWidth}));
    report.push({name,frames,scroll,errors});page.off('pageerror',onError);
  }
  if(phase!=='before')for(const route of ['/vacas','/ceniza']) {await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('http://127.0.0.1:5173'+route);await page.waitForTimeout(3000);await page.screenshot({path:`${dir}/${mobile?'mobile':'desktop'}-${route.slice(1)}-reduced.png`});report.push({reduced:true,mobile,route,canvas:await page.locator('canvas').count(),nonblack:await page.locator('canvas[data-nonblack=true]').count()});}
  await context.close();
}
fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));
await browser.close();console.log(JSON.stringify(report.map(({name,errors,scroll,frames,...rest})=>({name,errors,scroll,frames:frames?.map(f=>({canvas:f.canvas,nonblack:f.nonblack,width:f.hero.width,height:f.hero.height})),...rest})),null,2));
