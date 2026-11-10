import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try {
  for(const mobile of [false,true])for(const reduced of [false,true]) {
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},deviceScaleFactor:mobile?3:1,isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
    await context.addInitScript(()=>{
      localStorage.setItem('feka-vacas-adulto','1');
      const raf=requestAnimationFrame;
      window.requestAnimationFrame=cb=>raf(t=>{cb(t);const c=document.querySelector('canvas');if(!c||c.dataset.nonblack)return;const gl=c.getContext('webgl2')||c.getContext('webgl');if(!gl)return;const pixels=new Uint8Array(32*32*4);gl.readPixels(Math.floor(c.width*.7),Math.floor(c.height*.1),32,32,gl.RGBA,gl.UNSIGNED_BYTE,pixels);if(pixels.some((v,i)=>i%4!==3&&v>2))c.dataset.nonblack='true';});
    });
    const page=await context.newPage();
    for(const route of ['/vacas/historia','/ceniza']) {
      await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle',timeout:90000});
      await page.waitForSelector('canvas[data-nonblack=true]',{timeout:20000});
      const canvas=await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2')||c.getContext('webgl');return {nonblack:c.dataset.nonblack,alpha:gl.getContextAttributes().alpha,dpr:c.width/c.clientWidth};});
      assert.equal(canvas.alpha,true);assert.ok(canvas.dpr<=1.51);
      await page.screenshot({path:`capturas/experience-after/confirmed-${mobile?'mobile':'desktop'}-${reduced?'reduced':'normal'}-${route.slice(1).replaceAll('/','-')}.png`});
      const cover=await page.locator('.vhero__visual > img, .cn-hero-art > img').evaluate(img=>({fit:getComputedStyle(img).objectFit,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height}));
      assert.equal(cover.fit,'cover');assert.ok(cover.width>=(mobile?390:1440));assert.ok(cover.height>=(mobile?844:900));
      await page.evaluate(()=>scrollTo({top:500,behavior:'instant'}));await page.waitForTimeout(1000);
      const effects=await page.evaluate(()=>({hero:getComputedStyle(document.querySelector('.vhero__visual, .cn-hero-art')).transform,sanity:document.querySelector('[data-sanity]')?.textContent,drip:document.querySelector('.drip')?.style.transform,lines:document.querySelectorAll('.scroll-line').length}));
      assert.ok(effects.lines>0,'real rendered lines');
      if(!reduced)assert.notEqual(effects.hero,'none','hero parallax');
      if(route.startsWith('/vacas')) {
        assert.ok(Number(effects.sanity)<100);assert.ok(effects.drip.includes('scale'));
        for(const zone of ['piso','matadero','alcantarillas']) {
          await page.locator(`[data-scroll-zone=${zone}]`).evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.2,behavior:'instant'}));await page.waitForTimeout(700);
          assert.equal(await page.locator('.vp').getAttribute('data-zone-now'),zone);
        }
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(800);
        assert.equal(await page.locator('[data-sanity]').textContent(),'100');
      }
      results.push({mobile,reduced,route,canvas,cover,effects});
      if (!reduced) {
        const headings = route.startsWith('/vacas') ? '.zone__head h2' : '.cn-content h2';
        const spanish = await page.locator(headings).allTextContents();
        await page.getByRole('button',{name:'EN',exact:true}).click();await page.waitForTimeout(400);
        assert.notEqual((await page.locator(headings).allTextContents())[0],spanish[0],'SplitText preserves React language updates');
        await page.getByRole('button',{name:'ES',exact:true}).click();await page.waitForTimeout(400);
        assert.deepEqual(await page.locator(headings).allTextContents(),spanish);
      }
    }
    await context.close();
  }
  // Fallbacks preserve the full cover without requiring any device permission.
  for(const fallback of ['saveData','webgl']) {
    const context=await browser.newContext();await context.addInitScript(kind=>{localStorage.setItem('feka-vacas-adulto','1');if(kind==='saveData')Object.defineProperty(navigator,'connection',{value:{saveData:true}});else{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(String(type).includes('webgl'))return null;return get.call(this,type,...args);};}},fallback);
    const page=await context.newPage();for(const route of ['/vacas','/ceniza']){await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>{const c=document.querySelector('canvas');return !!c && !!(c.getContext('webgl2')||c.getContext('webgl'));}),false);assert.equal(await page.locator('.vhero__visual > img, .cn-hero-art > img').evaluate(img=>img.complete&&img.naturalWidth>0),true);results.push({fallback,route,passed:true});}await context.close();
  }
} finally {await browser.close();fs.writeFileSync('capturas/experience-after/assertions.json',JSON.stringify(results,null,2));}
console.log('Passed: transparent nonblack WebGL, cover, desktop/mobile/reduced motion, scroll effects, all three zones, reverse scroll and fallbacks.');
