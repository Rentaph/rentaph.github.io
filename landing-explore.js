// Live listings on the landing page (read-only). Tapping a card opens it in the app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, doc, getDoc, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const ICON = {
  services:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/></svg>',
  cars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16H3v-4l2-5h14l2 5v4h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M9.5 16.5h5"/></svg>',
  apartments:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-3v19"/><path d="M12 9h8v12"/><path d="M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/></svg>',
  products:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
};
const CATS = {all:'All',services:'Services',cars:'Car & motor rental',apartments:'Apartments',products:'Products'};
const COLOR = {services:'#0e5a5f',cars:'#b9452c',apartments:'#3b5699',products:'#86600f'};
const EXAMPLES = [
  {id:'',cat:'services',sub:'Aircon & appliance',title:'Aircon cleaning, window or split type',price:800,unit:'job',city:'Mandaue',providerName:'Bisaya Cool Aircon Care'},
  {id:'',cat:'cars',sub:'Motorcycle',title:'Honda Click 125, with helmet',price:500,unit:'day',city:'Lapu-Lapu',providerName:'Mactan Wheels'},
  {id:'',cat:'apartments',sub:'Studio',title:'Furnished studio near IT Park',price:14000,unit:'month',city:'Cebu City',providerName:'Banilad Residences'},
  {id:'',cat:'products',sub:'Food & home-made',title:'Danggit and dried mango pasalubong set',price:450,unit:'item',city:'Talisay',providerName:'Lola Nena’s Kitchen'}
].map(x=>({...x,example:true}));

const esc = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const peso = n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});
const safeImg = u=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u||'')?u:'';
const catOf = c=>ICON[c]?c:'services';
const grid=document.getElementById('ex-grid'), chips=document.getElementById('ex-chips'), q=document.getElementById('ex-q'), allBtn=document.getElementById('ex-all');
let items=[], cat='all', db=null, isExamples=false; const photos=new Map();

chips.innerHTML=Object.entries(CATS).map(([k,l])=>`<button type="button" data-c="${k}" aria-pressed="${k==='all'}">${l}</button>`).join('');
chips.onclick=e=>{ const b=e.target.closest('[data-c]'); if(!b) return; cat=b.dataset.c; chips.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); allBtn.href='app.html#'+(cat==='all'?'explore':'explore-'+cat); draw(); };
q.oninput=()=>draw();

function card(it,i){
  const k=catOf(it.cat); const src=photos.get(it.id);
  const href=it.example?'app.html#explore':'app.html#l-'+encodeURIComponent(it.id);
  return `<a class="lcard" style="--i:${i}" href="${href}">${it.example?'<span class="lbadge">Example</span>':''}
    <div class="lthumb k-${k}" data-pid="${esc(it.id)}">${ICON[k]}${src?`<img alt="" src="${src}">`:''}</div>
    <div class="lbody"><div class="ltag" style="color:${COLOR[k]}">${esc(it.sub||CATS[k])}</div><h3>${esc(it.title)}</h3>
    <div class="lprov">${esc(it.providerName||'Provider')} · ${esc(it.city||'')}</div>
    <div class="lprice">${peso(it.price)} <span>/ ${esc(it.unit||'')}</span></div></div></a>`;
}
function draw(){
  const term=q.value.trim().toLowerCase();
  const list=items.filter(it=>cat==='all'||it.cat===cat).filter(it=>!term||[it.title,it.sub,it.city,it.providerName,it.desc].join(' ').toLowerCase().includes(term));
  if(!list.length){ grid.innerHTML=`<div class="ex-note">Nothing here yet${cat!=='all'?' in '+esc(CATS[cat]):''}. <a href="app.html#mine">Be the first to post one</a>.</div>`; return; }
  grid.innerHTML=(isExamples?'<div class="ex-note">Renta.ph is brand new. These are examples of what listings look like.</div>':'')+list.slice(0,8).map(card).join('');
  if(db) grid.querySelectorAll('[data-pid]').forEach(el=>{ const id=el.dataset.pid; const it=items.find(x=>x.id===id); if(!id||!it||!(it.photoCount||it.hasPhoto)||photos.has(id)) return;
    getDoc(doc(db,'photos',id)).then(d=>{ const s=d.exists()?safeImg(d.data().data):''; if(!s) return; photos.set(id,s);
      document.querySelectorAll(`[data-pid="${CSS.escape(id)}"]`).forEach(n=>{ if(!n.querySelector('img')) n.insertAdjacentHTML('beforeend',`<img alt="" src="${s}">`); }); }).catch(()=>{}); });
}
async function load(){
  const cfg=window.RENTA_FIREBASE;
  try{
    if(!cfg||!cfg.apiKey||cfg.apiKey.startsWith('PASTE')) throw new Error('no config');
    db=getFirestore(initializeApp(cfg));
    const s=await getDocs(query(collection(db,'listings'),orderBy('createdAt','desc'),limit(60)));
    items=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.title&&x.active!==false);
  }catch(_){ items=[]; }
  if(!items.length){ items=EXAMPLES; isExamples=true; }
  draw();
}
load();
