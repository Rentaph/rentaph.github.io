import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut, deleteUser }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit, onSnapshot, arrayUnion }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getMessaging, getToken, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js';

/* ---------- constants ---------- */
const ICON = {
  all:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  services:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/></svg>',
  cars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16H3v-4l2-5h14l2 5v4h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M9.5 16.5h5"/></svg>',
  apartments:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-3v19"/><path d="M12 9h8v12"/><path d="M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/></svg>',
  products:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  explore:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  saved:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  savedOn:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  requests:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  mine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 4l9 6v10H3z"/><path d="M9 20v-6h6v6"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-6 16-3-7z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
  google:'<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>'
};
const CATS = {
  services:{label:'Services', one:'Service', subs:['Aircon & appliance','Cleaning','Plumbing & electrical','Beauty & wellness','Tutoring','Moving & delivery','Events & catering','Tech & gadget repair','Other service'], unit:'job', act:'Book this service'},
  cars:{label:'Car & motor rental', one:'Vehicle rental', subs:['Self-drive car','Car with driver','Van / group','Motorcycle'], unit:'day', act:'Request to rent'},
  apartments:{label:'Apartments', one:'Apartment', subs:['Room / bedspace','Studio','1–2 bedroom','House','Short stay'], unit:'month', act:'Request a viewing'},
  products:{label:'Products', one:'Product', subs:['Food & home-made','Gadgets','Home & furniture','Fashion','Other product'], unit:'item', act:'Order / reserve'}
};
const UNITS = {hour:'hour',job:'job',visit:'visit',day:'day',night:'night',month:'month',item:'item'};
const PLACES = window.PH_PLACES||[];
const provOf = it=>it.province||(window.phProvinceOf?phProvinceOf(it.city):'')||'';
const areasOf = prov=>{ const p=PLACES.flatMap(r=>r.provinces).find(x=>x.name===prov); return p?p.areas:[]; };
const areaLabel = ()=>S.city?S.city:(S.prov||'');
function provOptions(sel,allLabel){ return `<option value="">${allLabel}</option>`+PLACES.map(r=>`<optgroup label="${esc(r.region)}">${r.provinces.map(p=>`<option ${p.name===sel?'selected':''}>${esc(p.name)}</option>`).join('')}</optgroup>`).join(''); }
const STATUS = {pending:'Waiting for reply',accepted:'Accepted',declined:'Declined',cancelled:'Cancelled',done:'Completed'};
const STATUS_MSG = {accepted:'Accepted the request',declined:'Declined the request',done:'Marked the request as completed',cancelled:'Cancelled the request'};
const MAX_PHOTOS = 6;
const EXAMPLES = [
  {id:'ex1',cat:'services',sub:'Aircon & appliance',title:'Aircon cleaning, window or split type',price:800,unit:'job',city:'Mandaue',providerName:'Bisaya Cool Aircon Care',desc:'General cleaning with chemical wash for split type (+₱500). Includes freon check.'},
  {id:'ex2',cat:'cars',sub:'Self-drive car',title:'Toyota Vios 2022, automatic',price:1800,unit:'day',city:'Lapu-Lapu',providerName:'Mactan Wheels',desc:'Self-drive with valid license and 1 valid ID. ₱3,000 refundable deposit.'},
  {id:'ex5',cat:'cars',sub:'Motorcycle',title:'Honda Click 125, with helmet',price:500,unit:'day',city:'Lapu-Lapu',providerName:'Mactan Wheels',desc:'Includes 2 helmets. Valid license required. ₱1,000 refundable deposit.'},
  {id:'ex3',cat:'apartments',sub:'Studio',title:'Furnished studio near IT Park',price:14000,unit:'month',city:'Cebu City',providerName:'Banilad Residences',desc:'22 sqm, aircon, own CR, Wi-Fi ready. 1 month advance, 1 month deposit.'},
  {id:'ex6',cat:'services',sub:'Cleaning',title:'House deep cleaning, 2 cleaners',price:1200,unit:'visit',city:'Cebu City',providerName:'Linis Ate Cleaning',desc:'4 hours, bring our own supplies. Kitchen, CR, floors and windows.'},
  {id:'ex4',cat:'products',sub:'Food & home-made',title:'Danggit and dried mango pasalubong set',price:450,unit:'item',city:'Talisay',providerName:'Lola Nena’s Kitchen',desc:'500 g danggit, 2 packs dried mangoes, 1 jar chicharon. Order 1 day ahead.'}
].map((x,i)=>({...x,ownerId:'example',example:true,active:true,createdAt:-i}));

/* ---------- state ---------- */
const S = {user:null,isAdmin:false,ready:false,error:'',profile:null,
  listings:[],reviews:[],mineList:[],recv:[],sent:[],saved:new Set(),cat:'all',q:'',city:'',prov:'',view:'explore',photos:new Map(),openThread:null};
let auth=null, db=null, fbApp=null, unsubs=[], threadUnsub=null, threadMsgs=[];

const $ = s=>document.querySelector(s);
const esc = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const peso = n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});
const fmtDate = d=>{ if(!d) return ''; const t=new Date(d+'T00:00:00'); return isNaN(t)?esc(d):t.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}); };
const ago = ms=>{ if(!ms) return ''; const s=(Date.now()-ms)/1000; if(s<60) return 'just now'; if(s<3600) return Math.round(s/60)+' min ago'; if(s<86400) return Math.round(s/3600)+' h ago'; return Math.round(s/86400)+' d ago'; };
const clock = ms=>new Date(ms).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const telHref = p=>'tel:'+String(p||'').replace(/[^\d+]/g,'');
const safeImg = u=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u||'')?u:'';
const catOf = c=>CATS[c]?c:'services';
const slotKey = (id,n)=>n?`${id}_${n}`:id;
function ratingOf(providerId){ const r=S.reviews.filter(x=>x.providerId===providerId); if(!r.length) return null; return {avg:r.reduce((s,x)=>s+(Number(x.stars)||0),0)/r.length,count:r.length,list:r}; }
const starsTxt = n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
function ratingBadge(providerId,long){ const r=ratingOf(providerId); if(!r) return long?'<span class="muted">No reviews yet</span>':''; return `<span class="rating">${ICON.star}<b class="num">${r.avg.toFixed(1)}</b><span class="muted">(${r.count}${long?` review${r.count>1?'s':''}`:''})</span></span>`; }
const photoCount = it=>Math.min(MAX_PHOTOS,Number(it.photoCount ?? (it.hasPhoto?1:0))||0);

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('show'),3600); }
function errText(e){
  const c=(e&&e.code)||'';
  if(c.includes('permission-denied')) return 'You don’t have permission to do that. Sign in again and retry.';
  if(c.includes('unavailable')) return 'You seem to be offline. Check your connection and try again.';
  if(c.includes('resource-exhausted')) return 'Renta.ph is busy right now. Try again in a minute.';
  return 'That didn’t save. Check your connection and try again.';
}
const authErr = e=>({
  'auth/invalid-credential':'Wrong email or password.','auth/wrong-password':'Wrong email or password.','auth/user-not-found':'No account with that email. Create one instead.',
  'auth/email-already-in-use':'That email already has an account. Sign in instead.','auth/weak-password':'Use a password with at least 6 characters.',
  'auth/invalid-email':'That email address doesn’t look right.','auth/too-many-requests':'Too many tries. Wait a few minutes and try again.',
  'auth/unauthorized-domain':'This website isn’t allowed to sign in yet. The owner needs to add it in Firebase → Authentication → Settings → Authorized domains.',
  'auth/network-request-failed':'No connection. Check your internet and try again.'
}[e&&e.code]||'Sign-in didn’t work. Try again.');

/* ---------- threads (requests + chat) ---------- */
const roleOf = t=>S.user&&t.ownerId===S.user.uid?'owner':'customer';
const seenOf = t=>roleOf(t)==='owner'?(t.ownerSeen||0):(t.fromSeen||0);
const seenField = t=>roleOf(t)==='owner'?'ownerSeen':'fromSeen';
const lastAtOf = t=>t.lastAt||t.updatedAt||t.createdAt||0;
function isUnread(t){
  if(!S.user) return false;
  if(t.lastFrom) return t.lastFrom!==S.user.uid && lastAtOf(t)>seenOf(t);
  return roleOf(t)==='owner' ? (t.status==='pending' && !t.ownerSeen) : (!!t.reply && !t.fromSeen);
}
function threads(){
  const m=new Map(); [...S.recv,...S.sent].forEach(t=>m.set(t.id,t));
  return [...m.values()].sort((a,b)=>lastAtOf(b)-lastAtOf(a));
}
const unreadCount = ()=>threads().filter(isUnread).length;

/* ---------- notifications ---------- */
let swReg=null;
if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').then(r=>swReg=r).catch(()=>{}); }
const canNotify = ()=>'Notification' in window;
async function enableNotifs(){
  if(!canNotify()) return toast('This browser can’t show notifications.');
  const p=await Notification.requestPermission();
  toast(p==='granted'?'Alerts are on. You’ll be notified about new requests and replies.':'Alerts are off. You can turn them on in your browser settings.');
  if(p==='granted') registerPush();
  render();
}
function notify(title,body,threadId){
  if(S.openThread!==threadId) toast(`${title}: ${body}`);
  if(canNotify()&&Notification.permission==='granted'&&document.hidden){
    const opts={body,icon:'icon-192.png',badge:'icon-192.png',tag:threadId,data:{url:location.pathname+'#requests'}};
    if(swReg) swReg.showNotification(title,opts).catch(()=>{}); else try{ new Notification(title,opts); }catch(_){}
  }
}
const known={recv:null,sent:null};
function watchChanges(kind,list){
  const prev=known[kind]; const next={}; list.forEach(t=>next[t.id]=lastAtOf(t)); known[kind]=next;
  if(!prev) return;
  list.forEach(t=>{
    const before=prev[t.id];
    if(before===undefined){ if(kind==='recv') notify('New request',`${t.fromName||'A customer'} · ${t.itemTitle}`,t.id); return; }
    if(lastAtOf(t)>before && t.lastFrom && t.lastFrom!==S.user.uid){
      const who=kind==='recv'?(t.fromName||'Customer'):(t.providerName||'Provider');
      notify(who,t.lastMsg||STATUS[t.status]||'New message',t.id);
    }
  });
}
function updateBadges(){
  const n=unreadCount();
  const ra=document.querySelector('nav.tabs a[data-v="requests"]'); ra.querySelector('.dot')?.remove();
  if(n) ra.insertAdjacentHTML('beforeend',`<span class="dot num">${n}</span>`);
  document.title=(n?`(${n}) `:'')+'Renta.ph';
}

/* ---------- shell ---------- */
function fillCities(){
  const sel=$('#city'); if(!sel) return;
  if(!S.prov){ sel.hidden=true; sel.innerHTML=''; return; }
  const fromListings=S.listings.filter(it=>provOf(it)===S.prov).map(it=>it.city).filter(Boolean);
  const all=[...new Set([...areasOf(S.prov),...fromListings].map(x=>x.trim()))].sort((x,y)=>x.localeCompare(y));
  sel.hidden=false;
  sel.innerHTML=`<option value="">All of ${esc(S.prov)}</option>`+all.map(c=>`<option ${c===S.city?'selected':''}>${esc(c)}</option>`).join('');
}
function buildShell(){
  const cats=$('#cats');
  cats.innerHTML=[['all','All'],...Object.entries(CATS).map(([k,v])=>[k,v.label])].map(([k,l])=>`<button type="button" data-cat="${k}" aria-pressed="${S.cat===k}">${ICON[k]}${l}</button>`).join('');
  cats.onclick=e=>{const b=e.target.closest('[data-cat]'); if(!b) return; S.cat=b.dataset.cat; cats.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); if(S.view!=='explore') location.hash='explore'; else render();};
  $('#prov').innerHTML=provOptions(S.prov,'All Philippines');
  $('#prov').onchange=e=>{S.prov=e.target.value; S.city=''; fillCities(); if(S.view!=='explore') location.hash='explore'; else render();};
  $('#city').onchange=e=>{S.city=e.target.value; if(S.view!=='explore') location.hash='explore'; else render();};
  fillCities();
  $('#q').oninput=e=>{S.q=e.target.value.trim().toLowerCase(); clearTimeout(buildShell.t); buildShell.t=setTimeout(()=>{ if(S.view!=='explore') location.hash='explore'; else render(); },150);};
  const labels={explore:'Explore',saved:'Saved',requests:'Inbox',mine:'My listings'};
  document.querySelectorAll('nav.tabs a').forEach(a=>{a.innerHTML=ICON[a.dataset.v]+labels[a.dataset.v];});
  $('#acct').onclick=()=>S.user?openAccount():openSignIn();
  if(window.RentaScene) RentaScene($('#appscene'),{mode:'banner'});
}
let pendingOpen=null;
function route(){
  let h=location.hash.slice(1);
  if(h.startsWith('l-')){ pendingOpen=h.slice(2); history.replaceState(null,'','#explore'); h='explore'; }
  if(h.startsWith('explore-')){ const c=h.slice(8); if(CATS[c]){ S.cat=c; document.querySelectorAll('#cats button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cat===c)); } history.replaceState(null,'','#explore'); h='explore'; }
  S.view=['explore','saved','requests','mine'].includes(h)?h:'explore';
  const v=$('#view'); v.classList.add('anim'); clearTimeout(route.t); route.t=setTimeout(()=>v.classList.remove('anim'),1200);
  render(); $('main').scrollTop=0;
}
window.addEventListener('hashchange',route);
function renderAcct(){
  const b=$('#acct');
  if(S.user){ const n=(S.user.displayName||S.user.email||'?').trim(); b.textContent=n[0].toUpperCase(); b.classList.add('in'); b.setAttribute('aria-label','Your account'); }
  else { b.textContent='Sign in'; b.classList.remove('in'); b.removeAttribute('aria-label'); }
  const first=(S.user?.displayName||'').trim().split(/\s+/)[0];
  $('#hi').textContent=first?`Hi ${first}!`:'Hi!';
}

/* ---------- rendering ---------- */
function thumbHTML(it,cls){
  const k=catOf(it.cat); const src=S.photos.get(it.id); const has=photoCount(it)>0;
  return `<div class="${cls} k-${k}" data-photo="${esc(it.id)}" data-has="${has?1:0}">${ICON[k]}${src?`<img alt="" src="${src}">`:''}</div>`;
}
function cardHTML(it,i){
  const k=catOf(it.cat); const n=photoCount(it);
  return `<button type="button" class="card" style="--i:${Math.min(i,12)}" data-open="${esc(it.id)}">
    ${it.example?'<span class="badge">Example</span>':''}${it.active===false?'<span class="badge paused">Paused</span>':''}
    ${n>1?`<span class="badge count">${ICON.camera}${n}</span>`:''}
    ${thumbHTML(it,'thumb')}
    <div class="cbody">
      <div class="ctag" style="color:var(--c-${k})">${esc(it.sub||CATS[k].one)}</div>
      <h3>${esc(it.title)}</h3>
      <div class="prov">${esc(it.providerName||'Provider')} · ${esc(it.city||'')}</div>
      ${ratingBadge(it.ownerId)}
      <div class="price num">${peso(it.price)} <span>/ ${esc(UNITS[it.unit]||CATS[k].unit)}</span></div>
    </div></button>`;
}
function liveListings(){ const real=S.listings.filter(it=>it.active!==false); return real.length?real:(S.ready?EXAMPLES:[]); }
function filtered(){
  return liveListings()
    .filter(it=>S.cat==='all'||it.cat===S.cat)
    .filter(it=>!S.prov||provOf(it)===S.prov)
    .filter(it=>!S.city||(it.city||'').toLowerCase()===S.city.toLowerCase())
    .filter(it=>!S.q||[it.title,it.desc,it.sub,it.providerName,it.city,provOf(it)].join(' ').toLowerCase().includes(S.q));
}
function signInNote(what){ return `<div class="note"><strong>Sign in to ${what}.</strong> It’s free. Use your Google account or an email. <button class="linkbtn" data-signin>Sign in</button></div>`; }
function render(){
  document.querySelectorAll('nav.tabs a').forEach(a=>{a.removeAttribute('aria-current'); if(a.dataset.v===S.view) a.setAttribute('aria-current','page');});
  updateBadges();
  $('#welcome').hidden = !(S.view==='explore' && !S.q);
  const v=$('#view'); let h='';
  if(S.error) h+=`<div class="note">${esc(S.error)}</div>`;
  if(S.view==='explore'){
    if(!S.ready&&!S.error) h+='<div class="note">Loading listings…</div>';
    const list=filtered(); const catL=S.cat==='all'?(list.length===1?'listing':'listings'):CATS[S.cat].label.toLowerCase();
    if(S.ready&&!S.listings.some(x=>x.active!==false)) h+=`<div class="note"><strong>Renta.ph is brand new.</strong> These are examples of what listings look like. Post the first real one under My listings.</div>`;
    h+=`<div class="bar"><h2>${S.q?'Results':(S.cat==='all'?'Near you':CATS[S.cat].label)}</h2><span class="muted small num">${list.length} ${catL}${areaLabel()?' in '+esc(areaLabel()):''}</span></div>`;
    if(list.length) h+=`<div class="grid">${list.map(cardHTML).join('')}</div>`;
    else if(S.ready){
      const what=[S.cat!=='all'?CATS[S.cat].label.toLowerCase():'listings',areaLabel()?'in '+esc(areaLabel()):'',S.q?`for “${esc(S.q)}”`:''].filter(Boolean).join(' ');
      h+=`<div class="empty">${ICON.explore}<div><strong style="color:var(--ink)">No ${what} yet.</strong></div><div class="small">Be the first to post one, or widen your search.</div>
        <div class="row" style="justify-content:center">${areaLabel()?'<button class="btn sm" data-clear="city">Show all areas</button>':''}${S.cat!=='all'?'<button class="btn sm" data-clear="cat">Show all categories</button>':''}${S.q?'<button class="btn sm" data-clear="q">Clear search</button>':''}<a class="btn sm primary" href="#mine">Post a listing</a></div></div>`;
      const all=liveListings();
      let more=all.filter(it=>S.cat!=='all'&&it.cat===S.cat); let label=S.cat!=='all'?`${CATS[S.cat].label} in other areas`:'';
      if(!more.length&&S.city){ more=all.filter(it=>provOf(it)===S.prov); label=`Other listings in ${esc(S.prov)}`; }
      if(!more.length&&areaLabel()){ more=all.filter(it=>(!S.prov||provOf(it)===S.prov)&&(!S.city||(it.city||'').toLowerCase()===S.city.toLowerCase())); label=`Other listings in ${esc(areaLabel())}`; }
      if(!more.length){ more=all; label='Other listings you might like'; }
      if(more.length) h+=`<div class="bar"><h2 style="font-size:20px">${label}</h2><span class="muted small num">${more.length}</span></div><div class="grid">${more.slice(0,12).map(cardHTML).join('')}</div>`;
    }
  } else if(S.view==='saved'){
    h+=`<div class="bar"><h2>Saved</h2>${S.user?`<span class="muted small num">${S.saved.size} saved</span>`:''}</div>`;
    if(!S.user) h+=signInNote('save listings');
    else { const list=S.listings.filter(it=>S.saved.has(it.id));
      h+= list.length?`<div class="grid">${list.map(cardHTML).join('')}</div>`:`<div class="empty">${ICON.saved}<div>Nothing saved yet.</div><div class="small">Tap Save on a listing to keep it here.</div></div>`; }
  } else if(S.view==='requests'){ h+=renderInbox(); }
  else { h+=renderMine(); }
  v.innerHTML=h; loadPhotos(v);
}
function renderInbox(){
  let h=`<div class="bar"><h2>Inbox</h2>${S.user?`<span class="muted small num">${unreadCount()} unread</span>`:''}</div>`;
  if(!S.user) return h+signInNote('see your requests and messages');
  if(canNotify()&&Notification.permission==='default') h+=`<div class="alertbar">${ICON.bell}<span>Get alerted when someone books you or replies.</span><button class="btn sm primary" data-notif>Turn on</button></div>`;
  const list=threads();
  if(!list.length) return h+`<div class="empty">${ICON.requests}<div>No requests yet.</div><div class="small">Requests you send and requests customers send you both show up here as conversations.</div></div>`;
  return h+'<div class="list">'+list.map((t,i)=>{
    const k=catOf(t.cat); const owner=roleOf(t)==='owner'; const un=isUnread(t);
    const who=owner?(t.fromName||'A customer'):(t.providerName||'Provider');
    const prev=t.lastMsg||t.message||'';
    return `<button type="button" class="item${un?' unread':''}" style="--i:${Math.min(i,12)}" data-thread="${esc(t.id)}">
      <div class="mini k-${k}">${ICON[k]}</div>
      <div class="grow">
        <div class="row" style="justify-content:space-between"><span class="role">${owner?'Customer request':'Your request'}</span><span class="small muted">${ago(lastAtOf(t))}</span></div>
        <h3>${esc(t.itemTitle)}</h3>
        <div class="row"><span class="pill s-${esc(t.status)}">${STATUS[t.status]||esc(t.status)}</span><span class="small muted">${owner?'From':'To'} <strong style="color:var(--ink)">${esc(who)}</strong></span></div>
        ${prev?`<div class="preview">${t.lastFrom===S.user.uid?'You: ':''}${esc(prev)}</div>`:''}
      </div>${un?'<span class="udot" aria-label="Unread"></span>':''}</button>`;}).join('')+'</div>';
}
function renderMine(){
  let h=`<div class="bar"><h2>My listings</h2>${S.user?`<button class="btn primary" data-new>${ICON.plus}Post a listing</button>`:''}</div>`;
  if(!S.user) return h+signInNote('post your services, vehicles, apartments or products');
  const me=S.profile;
  if(me) h+=`<div class="item"><div class="grow"><div class="small muted">Shown to customers as</div><h3>${esc(me.providerName||'')}</h3><div class="small num">${esc(me.phone||'')}</div></div><button class="btn sm" data-profile>Edit</button></div>`;
  const items=S.mineList;
  if(!items.length) return h+`<div class="empty">${ICON.mine}<div>You have no listings yet.</div><div class="small">Offer a service, rent out a car, motorbike or room, or sell a product. It takes a minute.</div></div>`;
  return h+'<div class="list">'+items.map((it,i)=>{
    const n=S.recv.filter(r=>r.itemId===it.id&&r.status==='pending').length;
    return `<div class="item" style="--i:${Math.min(i,12)}">${thumbHTML(it,'mini')}<div class="grow">
      <div class="row">${it.active===false?'<span class="pill s-declined">Paused</span>':'<span class="pill s-accepted">Live</span>'}${n?`<span class="pill s-pending">${n} new request${n>1?'s':''}</span>`:''}<span class="small muted">${photoCount(it)} photo${photoCount(it)===1?'':'s'}</span></div>
      <h3>${esc(it.title)}</h3><div class="small muted num">${peso(it.price)} / ${esc(UNITS[it.unit]||it.unit)} · ${esc(it.city)}</div>
      <div class="row"><button class="btn sm" data-edit="${esc(it.id)}">Edit</button><button class="btn sm" data-toggle="${esc(it.id)}">${it.active===false?'Go live':'Pause'}</button><button class="btn sm danger" data-del="${esc(it.id)}">Delete</button></div>
    </div></div>`;}).join('')+'</div>';
}

/* ---------- photos ---------- */
const photoLoading=new Map();
function getPhoto(key){
  if(S.photos.has(key)) return Promise.resolve(S.photos.get(key));
  if(photoLoading.has(key)) return photoLoading.get(key);
  const p=getDoc(doc(db,'photos',key)).then(d=>{ const src=d.exists()?safeImg(d.data().data):''; if(src) S.photos.set(key,src); return src; })
    .catch(()=>'').finally(()=>photoLoading.delete(key));
  photoLoading.set(key,p); return p;
}
function loadPhotos(root){
  if(!db) return;
  root.querySelectorAll('[data-photo][data-has="1"]').forEach(el=>{
    const key=el.dataset.photo; if(el.querySelector('img')) return;
    getPhoto(key).then(src=>{ if(!src) return;
      document.querySelectorAll(`[data-photo="${CSS.escape(key)}"]`).forEach(n=>{ if(!n.querySelector('img')) n.insertAdjacentHTML('beforeend',`<img alt="" src="${src}">`); });
    });
  });
}

/* ---------- sheet ---------- */
let lastFocus=null, onSheetClose=null;
function openSheet(title,body,onMount,cls){
  lastFocus=document.activeElement; onSheetClose?.(); onSheetClose=null;
  const sh=$('#sheet'); sh.className='sheet'+(cls?' '+cls:'');
  sh.innerHTML=`<div class="shead"><h2 id="sheetTitle">${title}</h2><button type="button" class="x" data-close aria-label="Close">${ICON.close}</button></div>${cls==='chat'?body:`<div class="sbody">${body}</div>`}`;
  $('#scrim').classList.add('open'); onMount&&onMount(sh); loadPhotos(sh);
  setTimeout(()=>sh.querySelector('[data-close]')?.focus(),0);
}
function closeSheet(){ onSheetClose?.(); onSheetClose=null; $('#scrim').classList.remove('open'); $('#sheet').innerHTML=''; lastFocus?.focus?.(); }
$('#scrim').addEventListener('click',e=>{ if(e.target===$('#scrim')||e.target.closest('[data-close]')) closeSheet(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#scrim').classList.contains('open')) closeSheet(); });

/* ---------- auth ---------- */
let afterSignIn=null;
function openSignIn(next){
  afterSignIn=next||null; let mode='in';
  const draw=sh=>{
    const b=sh.querySelector('.sbody');
    b.innerHTML=`<p class="muted" style="margin:0">Sign in to post listings, send requests and save favorites. Browsing is open to everyone.</p>
      <button class="btn gbtn" id="g-in">${ICON.google}Continue with Google</button>
      <div class="divider">or use email</div>
      <form id="af">
        ${mode==='up'?'<label>Your name<input type="text" id="a-n" name="name" required maxlength="60" autocomplete="name"></label>':''}
        <label>Email<input type="email" id="a-e" name="email" required autocomplete="email"></label>
        <label>Password<input type="password" id="a-p" name="password" required minlength="6" autocomplete="${mode==='up'?'new-password':'current-password'}"></label>
        <div class="err" id="a-err" hidden></div>
        <button class="btn primary">${mode==='up'?'Create account':'Sign in'}</button>
      </form>
      <div class="small row" style="justify-content:space-between">
        <button class="linkbtn" id="a-mode">${mode==='up'?'I already have an account':'New here? Create an account'}</button>
        ${mode==='in'?'<button class="linkbtn" id="a-reset">Forgot password?</button>':''}
      </div>`;
    const err=m=>{const x=b.querySelector('#a-err'); x.hidden=false; x.textContent=m;};
    b.querySelector('#g-in').onclick=async()=>{
      const p=new GoogleAuthProvider();
      try{ await signInWithPopup(auth,p); done(); }
      catch(e){ if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment','auth/cancelled-popup-request'].includes(e.code)){ try{ await signInWithRedirect(auth,p);}catch(x){err(authErr(x));} } else if(e.code!=='auth/popup-closed-by-user') err(authErr(e)); }
    };
    b.querySelector('#a-mode').onclick=()=>{mode=mode==='in'?'up':'in'; draw(sh);};
    b.querySelector('#a-reset')?.addEventListener('click',async()=>{ const em=b.querySelector('#a-e').value.trim(); if(!em) return err('Type your email first, then tap Forgot password.');
      try{ await sendPasswordResetEmail(auth,em); toast('Check your email for a reset link.'); }catch(e){ err(authErr(e)); } });
    b.querySelector('#af').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); const btn=e.target.querySelector('button'); btn.disabled=true;
      try{
        if(mode==='up'){ const c=await createUserWithEmailAndPassword(auth,f.get('email'),f.get('password')); await updateProfile(c.user,{displayName:String(f.get('name')).trim()}); S.user=c.user; renderAcct(); }
        else await signInWithEmailAndPassword(auth,f.get('email'),f.get('password'));
        done();
      }catch(x){ btn.disabled=false; err(authErr(x)); } };
  };
  const done=()=>{ closeSheet(); toast('You’re signed in.'); const n=afterSignIn; afterSignIn=null; n&&setTimeout(n,400); };
  openSheet('Sign in to Renta.ph','',draw);
}
function openAccount(){
  const u=S.user;
  openSheet('Your account',`<div><h3>${esc(u.displayName||'Renta.ph user')}</h3><div class="small muted">${esc(u.email||'')}</div></div>
    ${S.isAdmin?'<div class="note">You’re an admin. You can remove any listing that breaks the rules.</div>':''}
    <div class="row"><a class="btn" href="#mine" data-close>My listings</a><a class="btn" href="#requests" data-close>Inbox</a>${/Android/i.test(navigator.userAgent)&&!matchMedia('(display-mode: standalone)').matches&&!document.referrer.startsWith('android-app://')?'<a class="btn" href="https://github.com/Rentaph/rentaph.github.io/releases/latest/download/renta-ph.apk">Get the Android app</a>':''}${canNotify()&&Notification.permission!=='granted'?'<button class="btn" data-notif>Turn on alerts</button>':''}</div>
    <button class="btn danger" id="so">Sign out</button>
    <div class="small muted row" style="justify-content:space-between"><span><a href="privacy.html">Privacy policy</a> · <a href="terms.html">Terms</a></span><button class="linkbtn small" data-delacct style="color:var(--bad)">Delete my account</button></div>`,sh=>{
    sh.querySelector('#so').onclick=async()=>{ await signOut(auth); closeSheet(); toast('Signed out.'); };
  });
}
const needUser = fn=>{ if(S.user) fn(); else openSignIn(fn); };

/* ---------- listing detail ---------- */
function findItem(id){ return S.listings.find(x=>x.id===id)||S.mineList.find(x=>x.id===id)||EXAMPLES.find(x=>x.id===id); }
function activeRequest(itemId){ return S.sent.filter(r=>r.itemId===itemId&&(r.status==='pending'||r.status==='accepted')).sort((a,b)=>b.createdAt-a.createdAt)[0]; }
function galleryHTML(it){
  const k=catOf(it.cat); const n=Math.max(1,photoCount(it)); let slides='';
  for(let i=0;i<n;i++){ const key=slotKey(it.id,i); const src=S.photos.get(key);
    slides+=`<div class="slide k-${k}" data-photo="${esc(key)}" data-has="${photoCount(it)?1:0}">${ICON[k]}${src?`<img alt="Photo ${i+1} of ${esc(it.title)}" src="${src}">`:''}</div>`; }
  return `<div class="gallery"><div class="slides" id="slides">${slides}</div>${n>1?`<span class="gcount num" id="gcount">1 / ${n}</span><div class="dots">${Array.from({length:n},(_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}</div>`;
}
function openItem(id){
  const it=findItem(id); if(!it) return; const k=catOf(it.cat); const mine=S.user&&it.ownerId===S.user.uid; const saved=S.saved.has(id);
  const req=!mine&&!it.example?activeRequest(id):null;
  const action = mine?`<button class="btn" data-edit="${esc(it.id)}">Edit my listing</button>`
    : req?'' : `<button class="btn accent" data-req="${esc(id)}">${esc(CATS[k].act)}</button>`;
  const body=`${galleryHTML(it)}
    <div><div class="ctag" style="color:var(--c-${k})">${esc(CATS[k].one)} · ${esc(it.sub||'')}</div><h2 style="font-size:25px;margin-top:4px">${esc(it.title)}</h2></div>
    <div class="price num" style="font-size:24px;padding:0">${peso(it.price)} <span>/ ${esc(UNITS[it.unit]||it.unit)}</span></div>
    <div class="facts"><div class="fact"><b>Area</b>${esc(it.city)}${provOf(it)&&provOf(it)!==it.city?', '+esc(provOf(it)):''}</div><div class="fact"><b>Provider</b>${esc(it.providerName||'Provider')}</div></div>
    ${it.desc?`<div class="desc">${esc(it.desc)}</div>`:''}
    ${it.example?'':reviewsHTML(it)}
    ${req?`<div class="sentbox"><div class="row"><strong>You already sent a request</strong><span class="pill s-${esc(req.status)}">${STATUS[req.status]}</span></div>
      <div class="small muted">Sent ${ago(req.createdAt)}${req.date1?' · for '+fmtDate(req.date1):''}. ${req.status==='pending'?'The provider will reply in your Inbox.':'Message the provider to finalize.'}</div>
      <div class="row"><button class="btn primary sm" data-thread="${esc(req.id)}">${ICON.requests}Open conversation</button></div></div>`:''}
    ${it.example?'<div class="note">This is an example listing to show how Renta.ph works. You can’t book it.</div>':`
    <div class="row">
      ${action}
      ${it.phone&&!mine?`<a class="btn" href="${esc(telHref(it.phone))}">${ICON.phone}<span class="num">${esc(it.phone)}</span></a>`:''}
      ${!mine?`<button class="btn" data-save="${esc(id)}" aria-pressed="${saved}">${saved?ICON.savedOn:ICON.saved}${saved?'Saved':'Save'}</button>`:''}
      ${S.isAdmin&&!mine?`<button class="btn danger" data-mod="${esc(id)}">Remove (admin)</button>`:''}
    </div>`}`;
  openSheet(esc(CATS[k].one),body,sh=>{
    const sl=sh.querySelector('#slides'); if(!sl) return;
    sl.addEventListener('scroll',()=>{ const i=Math.round(sl.scrollLeft/sl.clientWidth); const c=sh.querySelector('#gcount'); if(c) c.textContent=`${i+1} / ${sl.children.length}`;
      sh.querySelectorAll('.dots i').forEach((d,j)=>d.classList.toggle('on',j===i)); },{passive:true});
  });
}
function openRequest(id){
  const it=findItem(id); if(!it||it.example) return; const k=catOf(it.cat);
  const existing=activeRequest(id); if(existing){ openThread(existing.id); return; }
  if(S.user&&it.ownerId===S.user.uid){ toast('This is your own listing.'); return; }
  const today=new Date().toISOString().slice(0,10);
  let fields='';
  if(k==='services') fields=`<div class="two"><label>Preferred date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>Preferred time<input type="time" id="r-t" name="time"></label></div>`;
  else if(k==='cars') fields=`<div class="two"><label>Pick-up date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>Return date<input type="date" id="r-d2" name="date2" min="${today}" required></label></div>`;
  else if(k==='apartments') fields=`<div class="two"><label>Viewing or move-in date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>How long?<input type="text" id="r-q" name="qty" placeholder="e.g. 6 months" maxlength="40"></label></div>`;
  else fields=`<div class="two"><label>Quantity<input type="number" id="r-q" name="qty" min="1" value="1" required></label><label>Needed by<input type="date" id="r-d1" name="date1" min="${today}"></label></div>`;
  openSheet('Send a request',`<div class="small muted">To <strong style="color:var(--ink)">${esc(it.providerName)}</strong> for “${esc(it.title)}”</div>
    <form id="reqf">${fields}
      <label>Message<textarea id="r-m" name="message" maxlength="800" placeholder="Hi! Is this available? Add details like your address or what you need."></textarea></label>
      <label>Your mobile number<span class="hint">Shared only with this provider so they can reach you.</span><input type="tel" id="r-c" name="contact" placeholder="09XX XXX XXXX" required maxlength="20"></label>
      <div class="err" id="r-err" hidden></div>
      <button class="btn accent" id="r-send">Send request</button></form>`,sh=>{
    sh.querySelector('#reqf').onsubmit=async e=>{
      e.preventDefault(); const f=new FormData(e.target); const btn=sh.querySelector('#r-send'); const err=sh.querySelector('#r-err');
      const d1=f.get('date1')||'', d2=f.get('date2')||'';
      if(d2&&d1&&d2<d1){ err.hidden=false; err.textContent='The return date must be on or after the pick-up date.'; return; }
      if(activeRequest(id)){ closeSheet(); openThread(activeRequest(id).id); return; }
      btn.disabled=true; const now=Date.now(); const msg=String(f.get('message')||'').trim().slice(0,800);
      try{
        const data={ownerId:it.ownerId,itemId:it.id,itemTitle:String(it.title).slice(0,80),cat:k,providerName:it.providerName||'',providerPhone:it.phone||'',
          fromId:S.user.uid,fromName:(S.user.displayName||'').slice(0,60),date1:d1,date2:d2,time:f.get('time')||'',qty:String(f.get('qty')||'').slice(0,40),
          message:msg,contact:String(f.get('contact')||'').slice(0,20),status:'pending',reply:'',createdAt:now,updatedAt:now,
          lastMsg:(msg||'Sent a request').slice(0,140),lastAt:now,lastFrom:S.user.uid,fromSeen:now,ownerSeen:0};
        const ref=await addDoc(collection(db,'inquiries'),data);
        if(!S.sent.some(x=>x.id===ref.id)) S.sent=[{id:ref.id,...data},...S.sent];
        closeSheet(); toast('Request sent. The provider will reply in your Inbox.');
        setTimeout(()=>openThread(ref.id),350);
      }catch(x){ btn.disabled=false; toast(errText(x)); }
    };
  });
}

/* ---------- conversation ---------- */
function threadById(id){ return threads().find(t=>t.id===id); }
function threadInfoHTML(t){
  const owner=roleOf(t)==='owner';
  const when=[t.date1&&fmtDate(t.date1),t.date2&&('to '+fmtDate(t.date2)),t.time&&esc(t.time),t.qty&&('Qty '+esc(t.qty))].filter(Boolean).join(' · ');
  let acts='';
  if(owner&&t.status==='pending') acts=`<button class="btn sm primary" data-st="accepted" data-id="${esc(t.id)}">Accept</button><button class="btn sm danger" data-st="declined" data-id="${esc(t.id)}">Decline</button>`;
  else if(owner&&t.status==='accepted') acts=`<button class="btn sm" data-st="done" data-id="${esc(t.id)}">Mark completed</button>`;
  else if(!owner&&t.status==='pending') acts=`<button class="btn sm danger" data-st="cancelled" data-id="${esc(t.id)}">Cancel request</button>`;
  const num = owner ? (t.contact?`Customer’s number: <a class="num" href="${esc(telHref(t.contact))}">${esc(t.contact)}</a>`:'')
                    : (t.providerPhone?`Provider’s number: <a class="num" href="${esc(telHref(t.providerPhone))}">${esc(t.providerPhone)}</a>`:'');
  return `<div class="row"><span class="role">${owner?'Customer request':'Your request'}</span><span class="pill s-${esc(t.status)}">${STATUS[t.status]||esc(t.status)}</span></div>
    <div class="small"><strong>${esc(owner?(t.fromName||'A customer'):(t.providerName||'Provider'))}</strong>${when?' · '+when:''}</div>
    ${num?`<div class="small">${num}</div>`:''}${acts?`<div class="row">${acts}</div>`:''}${threadReviewHTML(t)}`;
}
function reviewsHTML(it){
  const r=ratingOf(it.ownerId);
  if(!r) return `<div class="reviews"><div class="row"><strong>Reviews</strong>${ratingBadge(it.ownerId,true)}</div><div class="small muted">Customers can rate ${esc(it.providerName||'this provider')} after a completed request.</div></div>`;
  return `<div class="reviews"><div class="row"><strong>Reviews of ${esc(it.providerName||'this provider')}</strong>${ratingBadge(it.ownerId,true)}</div>
    ${r.list.slice(0,4).map(v=>`<div class="review"><div class="row"><span class="stars" aria-label="${v.stars} out of 5">${starsTxt(v.stars)}</span><span class="small muted">${esc(v.fromName||'Customer')} · ${ago(v.at)}</span></div>${v.text?`<div class="small">${esc(v.text)}</div>`:''}<div class="small muted">${esc(v.itemTitle||'')}</div></div>`).join('')}
    ${r.count>4?`<div class="small muted">and ${r.count-4} more</div>`:''}</div>`;
}
function threadReviewHTML(t){
  if(t.status!=='done') return '';
  const v=S.reviews.find(x=>x.id===t.id); const owner=roleOf(t)==='owner';
  if(v) return `<div class="review"><div class="row"><span class="stars">${starsTxt(v.stars)}</span><span class="small muted">${owner?esc(v.fromName||'Customer')+' rated you':'Your rating'}</span>${!owner?`<button class="linkbtn small" data-rate="${esc(t.id)}">Edit</button>`:''}</div>${v.text?`<div class="small">${esc(v.text)}</div>`:''}</div>`;
  return owner?'':`<button class="btn sm accent" data-rate="${esc(t.id)}">${ICON.star}Rate ${esc(t.providerName||'the provider')}</button>`;
}
function openReview(id){
  const t=threadById(id); if(!t) return; const old=S.reviews.find(x=>x.id===id);
  const prevThread=S.openThread;
  openSheet('Rate '+esc(t.providerName||'the provider'),`<div class="small muted">For “${esc(t.itemTitle)}”</div>
    <form id="rvf"><fieldset><legend>How was it?</legend><div class="starpick" role="radiogroup" aria-label="Stars">
      ${[5,4,3,2,1].map(n=>`<label><input type="radio" name="stars" value="${n}" ${old&&old.stars===n?'checked':''} required><span aria-hidden="true">★</span><span class="sr">${n} star${n>1?'s':''}</span></label>`).join('')}</div></fieldset>
      <label>Comment<span class="hint">Optional. What went well, or what could be better?</span><textarea id="rv-t" name="text" maxlength="500">${esc(old?.text||'')}</textarea></label>
      <button class="btn primary" id="rv-save">${old?'Update rating':'Post rating'}</button></form>`,sh=>{
    sh.querySelector('#rvf').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); const b=sh.querySelector('#rv-save'); b.disabled=true;
      const data={providerId:t.ownerId,itemId:t.itemId,itemTitle:String(t.itemTitle||'').slice(0,80),fromId:S.user.uid,fromName:(S.user.displayName||'Customer').slice(0,60),stars:Number(f.get('stars')),text:String(f.get('text')||'').trim().slice(0,500),at:Date.now()};
      try{ await setDoc(doc(db,'reviews',id),data); toast('Thanks! Your rating is posted.'); closeSheet(); if(prevThread) setTimeout(()=>openThread(prevThread),300); }
      catch(x){ b.disabled=false; toast(errText(x)); } };
  });
}
function messagesHTML(t){
  const me=S.user.uid; const out=[];
  out.push({from:t.fromId,text:t.message||'Sent a request.',at:t.createdAt});
  if(t.reply&&!threadMsgs.length) out.push({from:t.ownerId,text:t.reply,at:t.updatedAt||t.createdAt});
  threadMsgs.forEach(m=>out.push(m));
  return out.map(m=> m.kind==='status'
    ? `<div class="msg sys">${esc(m.from===me?'You':(m.from===t.ownerId?(t.providerName||'Provider'):(t.fromName||'Customer')))} ${esc(String(m.text).toLowerCase())} · ${clock(m.at)}</div>`
    : `<div class="msg ${m.from===me?'me':'them'}">${esc(m.text)}<time>${clock(m.at)}</time></div>`).join('');
}
function markSeen(t){
  if(!t||!isUnread(t)) return;
  const f=seenField(t); const now=Date.now(); t[f]=now; updateBadges();
  updateDoc(doc(db,'inquiries',t.id),{[f]:now}).catch(()=>{});
}
function openThread(id){
  const t=threadById(id); if(!t){ toast('That conversation isn’t available yet. Try again in a moment.'); return; }
  threadMsgs=[];
  openSheet(esc(t.itemTitle),`<div class="thread-info" id="tinfo">${threadInfoHTML(t)}</div>
    <div class="msgs" id="msgs" aria-live="polite">${messagesHTML(t)}</div>
    <form class="composer" id="composer"><textarea id="c-text" aria-label="Write a message" placeholder="Write a message…" maxlength="1000" rows="1"></textarea><button class="btn primary" id="c-send" aria-label="Send">${ICON.send}</button></form>`,sh=>{
    S.openThread=id;
    const box=sh.querySelector('#msgs'); const scroll=()=>box.scrollTop=box.scrollHeight; scroll();
    threadUnsub=onSnapshot(query(collection(db,'inquiries',id,'messages'),orderBy('at','asc'),limit(300)),s=>{
      threadMsgs=s.docs.map(d=>d.data()).filter(m=>m&&m.text);
      const cur=threadById(id)||t; box.innerHTML=messagesHTML(cur); scroll(); markSeen(cur);
    },()=>{});
    markSeen(t);
    const ta=sh.querySelector('#c-text');
    ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&matchMedia('(pointer:fine)').matches){ e.preventDefault(); sh.querySelector('#composer').requestSubmit(); } });
    sh.querySelector('#composer').onsubmit=async e=>{ e.preventDefault(); const text=ta.value.trim(); if(!text) return; const b=sh.querySelector('#c-send'); b.disabled=true;
      try{ await sendMessage(threadById(id)||t,text); ta.value=''; }catch(x){ toast(errText(x)); } finally{ b.disabled=false; ta.focus(); } };
  },'chat');
  onSheetClose=()=>{ threadUnsub?.(); threadUnsub=null; S.openThread=null; threadMsgs=[]; if(S.view==='requests') render(); };
}
async function sendMessage(t,text,kind){
  const now=Date.now(); const me=S.user.uid;
  await addDoc(collection(db,'inquiries',t.id,'messages'),{from:me,text:text.slice(0,1000),at:now,...(kind?{kind}:{})});
  await updateDoc(doc(db,'inquiries',t.id),{lastMsg:text.slice(0,140),lastAt:now,lastFrom:me,[seenField(t)]:now,updatedAt:now});
}
async function setStatus(id,st){
  const t=threadById(id); if(!t) return;
  const now=Date.now(); const me=S.user.uid;
  await updateDoc(doc(db,'inquiries',id),{status:st,updatedAt:now,lastMsg:STATUS_MSG[st],lastAt:now,lastFrom:me,[seenField(t)]:now});
  addDoc(collection(db,'inquiries',id,'messages'),{from:me,text:STATUS_MSG[st],at:now,kind:'status'}).catch(()=>{});
}

/* ---------- my listings ---------- */
function compress(file){
  return new Promise((res,rej)=>{
    const img=new Image(); const url=URL.createObjectURL(file);
    img.onload=()=>{ URL.revokeObjectURL(url);
      let w=img.naturalWidth,h=img.naturalHeight,max=1000,q=.72,out='';
      for(let i=0;i<6;i++){ const s=Math.min(1,max/Math.max(w,h)); const c=document.createElement('canvas'); c.width=Math.round(w*s); c.height=Math.round(h*s);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height); out=c.toDataURL('image/jpeg',q); if(out.length<170000) break; max*=.85; q=Math.max(.45,q-.07); }
      out.length<280000?res(out):rej(new Error('big'));
    };
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('img'));};
    img.src=url;
  });
}
function openProfile(after){
  const me=S.profile;
  openSheet('Your provider profile',`<form id="pf">
    <label>Business or display name<span class="hint">Customers see this on every listing.</span><input type="text" id="p-n" name="providerName" required maxlength="60" value="${esc(me?.providerName||S.user.displayName||'')}" placeholder="e.g. Jessie’s Aircon Services"></label>
    <label>Mobile number<span class="hint">Shown on your listings so customers can call or text.</span><input type="tel" id="p-p" name="phone" required maxlength="20" value="${esc(me?.phone||'')}" placeholder="09XX XXX XXXX"></label>
    <button class="btn primary">Save profile</button></form>`,sh=>{
    sh.querySelector('#pf').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); const b=e.target.querySelector('button'); b.disabled=true;
      const p={providerName:String(f.get('providerName')).trim(),phone:String(f.get('phone')).trim(),updatedAt:Date.now()};
      try{
        await setDoc(doc(db,'providers',S.user.uid),p); S.profile=p;
        await Promise.all(S.mineList.filter(x=>x.providerName!==p.providerName||x.phone!==p.phone).map(x=>updateDoc(doc(db,'listings',x.id),{providerName:p.providerName,phone:p.phone,updatedAt:Date.now()})));
        closeSheet(); toast('Profile saved.'); render(); after&&setTimeout(after,350);
      }catch(x){ b.disabled=false; toast(errText(x)); } };
  });
}
function openEditor(id){
  if(!S.profile||!S.profile.providerName){ openProfile(()=>openEditor(id)); return; }
  const it=id?S.mineList.find(x=>x.id===id):null; const cat=it?.cat||(S.cat!=='all'?S.cat:'services');
  const subOpts=c=>CATS[c].subs.map(s=>`<option ${it?.sub===s?'selected':''}>${s}</option>`).join('');
  const oldCount=it?photoCount(it):0;
  let pics=[]; // {src, from: original slot index, or -1 for new}
  openSheet(it?'Edit listing':'New listing',`<form id="ef">
    <fieldset><legend>What are you offering?</legend><div class="radios">${Object.entries(CATS).map(([k,v])=>`<label><input type="radio" name="cat" value="${k}" ${k===cat?'checked':''}>${v.label}</label>`).join('')}</div></fieldset>
    <label>Type<select id="e-sub" name="sub">${subOpts(cat)}</select></label>
    <label>Title<input type="text" id="e-t" name="title" required maxlength="80" value="${esc(it?.title||'')}" placeholder="e.g. Aircon cleaning, window or split type"></label>
    <div class="two"><label>Price (₱)<input type="number" id="e-p" name="price" required min="0" step="1" value="${esc(it?.price??'')}"></label>
    <label>Per<select id="e-u" name="unit">${Object.keys(UNITS).map(u=>`<option value="${u}" ${(it?.unit||CATS[cat].unit)===u?'selected':''}>${u}</option>`).join('')}</select></label></div>
    <div class="two"><label>Province<select id="e-pr" name="province" required>${provOptions(it?provOf(it):(S.profile?.province||S.prov||'Cebu'),'Choose…')}</select></label>
    <label>City or town<input type="text" id="e-c" name="city" list="citylist" required maxlength="40" value="${esc(it?.city||'')}" placeholder="e.g. Mandaue"></label></div>
    <datalist id="citylist"></datalist>
    <label>Details<span class="hint">Inclusions, schedule, requirements, location landmarks.</span><textarea id="e-d" name="desc" maxlength="1500">${esc(it?.desc||'')}</textarea></label>
    <fieldset><legend>Photos <span class="small muted" id="e-pc" style="font-family:var(--body);font-weight:500"></span></legend>
      <div class="small muted" style="margin-top:-6px">Add up to ${MAX_PHOTOS}. The first photo is the cover. They’re resized automatically.</div>
      <div class="pgrid" id="e-grid"></div></fieldset>
    <div class="err" id="e-err" hidden></div>
    <button class="btn primary" id="e-save">${it?'Save changes':'Post listing'}</button></form>`,sh=>{
    const f=sh.querySelector('#ef'); const grid=sh.querySelector('#e-grid'); const err=sh.querySelector('#e-err');
    const showErr=m=>{err.hidden=!m; err.textContent=m||'';};
    const drawPics=()=>{
      grid.innerHTML=pics.map((p,i)=>`<div class="ptile"><img alt="Photo ${i+1}" src="${p.src}">${i===0?'<span class="cover">Cover</span>':''}<button type="button" class="rm" data-rm="${i}" aria-label="Remove photo ${i+1}">${ICON.close}</button></div>`).join('')
        +(pics.length<MAX_PHOTOS?`<label class="padd">${ICON.camera}<span>Add photo</span><input type="file" id="e-f" accept="image/*" multiple aria-label="Add photos"></label>`:'');
      sh.querySelector('#e-pc').textContent=`${pics.length} of ${MAX_PHOTOS}`;
      const inp=sh.querySelector('#e-f'); if(inp) inp.onchange=async e=>{
        const all=[...e.target.files]; const files=all.slice(0,MAX_PHOTOS-pics.length); let bad=0;
        showErr(all.length>files.length?`Only ${MAX_PHOTOS} photos per listing. The extra ones were skipped.`:'');
        for(const file of files){ try{ pics.push({src:await compress(file),from:-1}); }catch(_){ bad++; } drawPics(); }
        if(bad) showErr(`${bad} photo${bad>1?'s':''} couldn’t be used. Try JPG or PNG.`);
      };
    };
    grid.addEventListener('click',e=>{ const b=e.target.closest('[data-rm]'); if(!b) return; e.preventDefault(); pics.splice(Number(b.dataset.rm),1); drawPics(); });
    drawPics();
    if(it&&oldCount){ Promise.all(Array.from({length:oldCount},(_,i)=>getPhoto(slotKey(it.id,i)).then(src=>({src,from:i})))).then(arr=>{ pics=[...arr.filter(p=>p.src),...pics.filter(p=>p.from<0)].slice(0,MAX_PHOTOS); drawPics(); }); }
    const fillList=()=>{ sh.querySelector('#citylist').innerHTML=areasOf(sh.querySelector('#e-pr').value).map(c=>`<option value="${esc(c)}">`).join(''); };
    fillList(); sh.querySelector('#e-pr').addEventListener('change',fillList);
    f.addEventListener('change',e=>{ if(e.target.name==='cat'){ const c=e.target.value; sh.querySelector('#e-sub').innerHTML=subOpts(c); sh.querySelector('#e-u').value=CATS[c].unit; } });
    f.onsubmit=async e=>{ e.preventDefault(); const d=new FormData(f); const b=sh.querySelector('#e-save'); b.disabled=true; b.textContent='Saving…';
      const ref=it?doc(db,'listings',it.id):doc(collection(db,'listings'));
      const rec={ownerId:S.user.uid,providerName:S.profile.providerName,phone:S.profile.phone,cat:d.get('cat'),sub:d.get('sub'),title:String(d.get('title')).trim(),
        price:Math.max(0,Number(d.get('price'))||0),unit:d.get('unit'),city:String(d.get('city')).trim(),province:String(d.get('province')||''),desc:String(d.get('desc')||'').trim(),
        photoCount:pics.length,hasPhoto:pics.length>0,active:it?it.active!==false:true,createdAt:it?.createdAt||Date.now(),updatedAt:Date.now()};
      try{
        for(let i=0;i<pics.length;i++){ const key=slotKey(ref.id,i); if(pics[i].from===i) continue;
          await setDoc(doc(db,'photos',key),{ownerId:S.user.uid,data:pics[i].src}); S.photos.set(key,pics[i].src); }
        await setDoc(ref,rec);
        for(let i=pics.length;i<oldCount;i++){ const key=slotKey(ref.id,i); S.photos.delete(key); deleteDoc(doc(db,'photos',key)).catch(()=>{}); }
        closeSheet(); toast(it?'Listing updated.':'Your listing is live.'); if(!it) location.hash='mine'; else render();
      }catch(x){ b.disabled=false; b.textContent=it?'Save changes':'Post listing'; toast(errText(x)); }
    };
  });
}
function confirmSheet(title,text,label,fn){
  openSheet(title,`<p style="margin:0">${text}</p><div class="row"><button class="btn danger" id="cf-yes">${label}</button><button class="btn" data-close>Keep it</button></div>`,sh=>{
    sh.querySelector('#cf-yes').onclick=async e=>{ e.target.disabled=true; try{ await fn(); closeSheet(); }catch(x){ e.target.disabled=false; toast(errText(x)); } };
  });
}
function deletePhotos(it){ for(let i=0;i<photoCount(it);i++) deleteDoc(doc(db,'photos',slotKey(it.id,i))).catch(()=>{}); }

/* ---------- account deletion ---------- */
function confirmDeleteAccount(){
  confirmSheet('Delete your account?','This removes your listings, photos, provider profile and saved items, then deletes your sign-in. Conversations you already had stay visible to the other person. This can’t be undone.','Delete my account',async()=>{
    const uid=S.user.uid;
    for(const it of S.mineList){ deletePhotos(it); await deleteDoc(doc(db,'listings',it.id)); }
    await Promise.all([deleteDoc(doc(db,'providers',uid)),deleteDoc(doc(db,'users',uid,'private','saved')),deleteDoc(doc(db,'users',uid,'private','push'))].map(p=>p.catch(()=>{})));
    try{ await deleteUser(auth.currentUser); toast('Your account was deleted.'); }
    catch(e){ if(e.code==='auth/requires-recent-login'){ toast('Your listings were removed. For security, sign out, sign in again, then tap Delete my account once more.'); } else throw e; }
  });
}

/* ---------- push alerts (work when the app is closed) ---------- */
async function registerPush(){
  try{
    const vapid=window.RENTA_VAPID; if(!S.user||!vapid||!canNotify()||Notification.permission!=='granted') return;
    if(!(await isSupported())) return;
    const reg=swReg||await navigator.serviceWorker.ready;
    const token=await getToken(getMessaging(fbApp),{vapidKey:vapid,serviceWorkerRegistration:reg});
    if(token) await setDoc(doc(db,'users',S.user.uid,'private','push'),{tokens:arrayUnion(token),updatedAt:Date.now()},{merge:true});
  }catch(_){}
}

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
  const t=e.target.closest('button,[data-open]'); if(!t) return;
  const D=t.dataset;
  if(D.open) openItem(D.open);
  else if(D.thread){ needUser(()=>openThread(D.thread)); }
  else if(D.rate){ openReview(D.rate); }
  else if(D.delacct!==undefined){ confirmDeleteAccount(); }
  else if(D.clear){ if(D.clear==='city'){ S.city=''; S.prov=''; $('#prov').value=''; fillCities(); } if(D.clear==='cat'){ S.cat='all'; document.querySelectorAll('#cats button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cat==='all')); } if(D.clear==='q'){ S.q=''; $('#q').value=''; } render(); }
  else if(D.signin!==undefined) openSignIn();
  else if(D.notif!==undefined) enableNotifs();
  else if(D.req) needUser(()=>openRequest(D.req));
  else if(D.new!==undefined) openEditor(null);
  else if(D.profile!==undefined) openProfile();
  else if(D.edit) openEditor(D.edit);
  else if(D.toggle){ const it=S.mineList.find(x=>x.id===D.toggle); if(!it) return; t.disabled=true;
    updateDoc(doc(db,'listings',it.id),{active:it.active===false,updatedAt:Date.now()}).then(()=>toast(it.active===false?'Listing is live again.':'Listing paused.')).catch(x=>toast(errText(x))).finally(()=>t.disabled=false); }
  else if(D.del){ const id=D.del; const it=S.mineList.find(x=>x.id===id);
    confirmSheet('Delete listing?','Customers won’t see it anymore. Conversations you already have stay in your Inbox.','Delete',async()=>{
      await deleteDoc(doc(db,'listings',id)); if(it) deletePhotos(it); toast('Listing deleted.'); }); }
  else if(D.save){ const id=D.save; needUser(async()=>{ const s=new Set(S.saved); s.has(id)?s.delete(id):s.add(id);
      try{ await setDoc(doc(db,'users',S.user.uid,'private','saved'),{keys:[...s].slice(0,300)}); S.saved=s; openItem(id); toast(s.has(id)?'Saved.':'Removed from saved.'); }catch(x){ toast(errText(x)); } }); }
  else if(D.mod){ const id=D.mod; const it=findItem(id);
    confirmSheet('Remove this listing?','As an admin you can take down listings that break the rules.','Remove',async()=>{
      await deleteDoc(doc(db,'listings',id)); if(it) deletePhotos(it); toast('Listing removed.'); }); }
  else if(D.st){ t.disabled=true; try{ await setStatus(D.id,D.st); toast(D.st==='accepted'?'Accepted. The customer was notified.':'Request updated.'); }catch(x){ t.disabled=false; toast(errText(x)); } }
});

/* ---------- data ---------- */
const byNew=a=>a.sort((x,y)=>(y.createdAt||0)-(x.createdAt||0));
function refreshOpenThread(){
  if(!S.openThread) return; const t=threadById(S.openThread); if(!t) return;
  const info=$('#tinfo'); if(info) info.innerHTML=threadInfoHTML(t);
}
function watchUser(u){
  unsubs.forEach(f=>f()); unsubs=[]; S.recv=[]; S.sent=[]; S.mineList=[]; S.saved=new Set(); S.profile=null; S.isAdmin=false; known.recv=null; known.sent=null;
  if(!u){ render(); return; }
  const quiet=()=>{};
  unsubs.push(onSnapshot(doc(db,'providers',u.uid),d=>{ S.profile=d.exists()?d.data():null; if(S.view==='mine') render(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'listings'),where('ownerId','==',u.uid)),s=>{ S.mineList=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); if(S.view==='mine') render(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'inquiries'),where('ownerId','==',u.uid)),s=>{ S.recv=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); watchChanges('recv',S.recv); refreshOpenThread(); if(S.view==='requests'||S.view==='mine') render(); else updateBadges(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'inquiries'),where('fromId','==',u.uid)),s=>{ S.sent=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); watchChanges('sent',S.sent); refreshOpenThread(); if(S.view==='requests') render(); else updateBadges(); },quiet));
  unsubs.push(onSnapshot(doc(db,'users',u.uid,'private','saved'),d=>{ S.saved=new Set(d.exists()&&Array.isArray(d.data().keys)?d.data().keys:[]); if(S.view==='saved') render(); },quiet));
  getDoc(doc(db,'admins',u.uid)).then(d=>{ S.isAdmin=d.exists(); }).catch(()=>{});
}
function start(){
  buildShell(); route();
  const cfg=window.RENTA_FIREBASE;
  if(!cfg||!cfg.apiKey||cfg.apiKey.startsWith('PASTE')){ S.error='Renta.ph isn’t connected to its database yet. The owner needs to add the Firebase settings in config.js.'; S.ready=true; render(); return; }
  const app=initializeApp(cfg); fbApp=app; auth=getAuth(app); db=getFirestore(app);
  getRedirectResult(auth).then(r=>{ if(r) toast('You’re signed in.'); }).catch(e=>toast(authErr(e)));
  onAuthStateChanged(auth,u=>{ S.user=u; renderAcct(); watchUser(u); if(u) registerPush(); });
  onSnapshot(query(collection(db,'reviews'),orderBy('at','desc'),limit(1000)),s=>{
    S.reviews=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.providerId&&x.stars>=1&&x.stars<=5);
    if(S.view==='explore'||S.view==='saved') render(); refreshOpenThread();
  },()=>{});
  const timer=setTimeout(()=>{ if(!S.ready){ S.error='Listings can’t be reached yet. Check your connection; this page keeps trying.'; render(); } },10000);
  onSnapshot(query(collection(db,'listings'),orderBy('createdAt','desc'),limit(500)),s=>{
    clearTimeout(timer); S.error=''; S.ready=true;
    S.listings=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.title).map(x=>({...x,cat:catOf(x.cat)}));
    fillCities();
    if(S.view==='explore'||S.view==='saved') render();
    if(pendingOpen){ const id=pendingOpen; pendingOpen=null; setTimeout(()=>{ if(findItem(id)) openItem(id); },700); }
  },e=>{ clearTimeout(timer); S.ready=true; S.error='Listings couldn’t load. '+(e.code==='permission-denied'?'The database rules haven’t been published yet.':'Try reloading the page.'); render(); });
}
start();
