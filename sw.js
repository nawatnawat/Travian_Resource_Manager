// Service worker ของ TResource + TScout (PWA) · ไฟล์เดียวที่รากของเว็บ ใช้ร่วมกันทั้ง 2 แอป
// หน้าแอปและไฟล์ในเว็บเรา: ขอจากเน็ตก่อนเสมอ (ได้เวอร์ชันล่าสุด) ถ้าไม่มีเน็ตค่อยใช้สำเนาในเครื่อง
// Firebase SDK (gstatic, URL มีเลขเวอร์ชัน): ใช้สำเนาในเครื่องก่อน · อย่างอื่น (Firestore, map.sql, GitHub API) ไม่แตะ
const C='trm-pwa-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;let u;try{u=new URL(r.url);}catch(_){return;}
  const put=x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c)).catch(()=>{});return x;};
  if(u.origin===location.origin&&u.pathname.startsWith(new URL(self.registration.scope).pathname)){
    e.respondWith(fetch(r).then(x=>x.ok?put(x):x).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||Response.error())));return;}
  if(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>(x.ok||x.type==='opaque')?put(x):x)));}
});
