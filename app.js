import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

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
  google:'<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>'
};
const CATS = {
  services:{label:'Services', one:'Service', subs:['Aircon & appliance','Cleaning','Plumbing & electrical','Beauty & wellness','Tutoring','Moving & delivery','Events & catering','Tech & gadget repair','Other service'], unit:'job', act:'Book this service'},
  cars:{label:'Car rental', one:'Car rental', subs:['Self-drive','With driver','Van / group','Motorcycle'], unit:'day', act:'Request to rent'},
  apartments:{label:'Apartments', one:'Apartment', subs:['Room / bedspace','Studio','1–2 bedroom','House','Short stay'], unit:'month', act:'Request a viewing'},
  products:{label:'Products', one:'Product', subs:['Food & home-made','Gadgets','Home & furniture','Fashion','Other product'], unit:'item', act:'Order / reserve'}
};
const UNITS = {hour:'hour',job:'job',day:'day',night:'night',month:'month',item:'item'};
const CITIES = ['Cebu City','Mandaue','Lapu-Lapu','Talisay','Consolacion','Liloan','Minglanilla','Danao','Carcar','Toledo'];
const STATUS = {pending:'Waiting for reply',accepted:'Accepted',declined:'Declined',cancelled:'Cancelled',done:'Completed'};
const EXAMPLES = [
  {id:'ex1',cat:'services',sub:'Aircon & appliance',title:'Aircon cleaning, window or split type',price:800,unit:'job',city:'Mandaue',providerName:'Bisaya Cool Aircon Care',desc:'General cleaning with chemical wash for split type (+₱500). Includes freon check.'},
  {id:'ex2',cat:'cars',sub:'Self-drive',title:'Toyota Vios 2022, automatic',price:1800,unit:'day',city:'Lapu-Lapu',providerName:'Mactan Wheels',desc:'Self-drive with valid license and 1 valid ID. ₱3,000 refundable deposit.'},
  {id:'ex3',cat:'apartments',sub:'Studio',title:'Furnished studio near IT Park',price:14000,unit:'month',city:'Cebu City',providerName:'Banilad Residences',desc:'22 sqm, aircon, own CR, Wi-Fi ready. 1 month advance, 1 month deposit.'},
  {id:'ex4',cat:'products',sub:'Food & home-made',title:'Danggit and dried mango pasalubong set',price:450,unit:'item',city:'Talisay',providerName:'Lola Nena’s Kitchen',desc:'500 g danggit, 2 packs dried mangoes, 1 jar chicharon. Order 1 day ahead.'}
].map(x=>({...x,ownerId:'example',example:true,active:true,createdAt:0}));

/* ---------- state ---------- */
const S = {user:null,isAdmin:false,ready:false,error:'',profile:null,
  listings:[],mineList:[],recv:[],sent:[],saved:new Set(),cat:'all',q:'',city:'',view:'explore',reqTab:'recv',photos:new Map()};
let auth=null, db=null, unsubs=[];

const $ = s=>document.querySelector(s);
const esc = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const peso = n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});
const fmtDate = d=>{ if(!d) return ''; const t=new Date(d+'T00:00:00'); return isNaN(t)?esc(d):t.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}); };
const ago = ms=>{ const s=(Date.now()-ms)/1000; if(s<3600) return Math.max(1,Math.round(s/60))+' min ago'; if(s<86400) return Math.round(s/3600)+' h ago'; return Math.round(s/86400)+' d ago'; };
const telHref = p=>'tel:'+String(p||'').replace(/[^\d+]/g,'');
const safeImg = u=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u||'')?u:'';
const catOf = c=>CATS[c]?c:'services';

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('show'),3400); }
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

/* ---------- shell ---------- */
function buildShell(){
  const cats=$('#cats');
  cats.innerHTML=[['all','All'],...Object.entries(CATS).map(([k,v])=>[k,v.label])].map(([k,l])=>`<button type="button" data-cat="${k}" aria-pressed="${S.cat===k}">${ICON[k]}${l}</button>`).join('');
  cats.onclick=e=>{const b=e.target.closest('[data-cat]'); if(!b) return; S.cat=b.dataset.cat; cats.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); if(S.view!=='explore') location.hash='explore'; else render();};
  $('#city').innerHTML='<option value="">All areas</option>'+CITIES.map(c=>`<option>${c}</option>`).join('');
  $('#city').onchange=e=>{S.city=e.target.value; if(S.view!=='explore') location.hash='explore'; else render();};
  $('#q').oninput=e=>{S.q=e.target.value.trim().toLowerCase(); clearTimeout(buildShell.t); buildShell.t=setTimeout(()=>{ if(S.view!=='explore') location.hash='explore'; else render(); },150);};
  const labels={explore:'Explore',saved:'Saved',requests:'Requests',mine:'My listings'};
  document.querySelectorAll('nav.tabs a').forEach(a=>{a.innerHTML=ICON[a.dataset.v]+labels[a.dataset.v];});
  $('#acct').onclick=()=>S.user?openAccount():openSignIn();
}
function route(){ const h=location.hash.slice(1); S.view=['explore','saved','requests','mine'].includes(h)?h:'explore'; render(); $('main').scrollTop=0; }
window.addEventListener('hashchange',route);
function renderAcct(){
  const b=$('#acct');
  if(S.user){ const n=(S.user.displayName||S.user.email||'?').trim(); b.textContent=n[0].toUpperCase(); b.classList.add('in'); b.setAttribute('aria-label','Your account'); }
  else { b.textContent='Sign in'; b.classList.remove('in'); b.removeAttribute('aria-label'); }
}

/* ---------- rendering ---------- */
const keyOf = it=>it.id;
function thumbHTML(it,cls){
  const k=catOf(it.cat); const src=S.photos.get(it.id);
  return `<div class="${cls} k-${k}" data-photo="${esc(it.id)}" data-has="${it.hasPhoto?1:0}">${ICON[k]}${src?`<img alt="" src="${src}">`:''}</div>`;
}
function cardHTML(it){
  const k=catOf(it.cat);
  return `<button type="button" class="card" data-open="${esc(it.id)}">
    ${it.example?'<span class="badge">Example</span>':''}${it.active===false?'<span class="badge paused">Paused</span>':''}
    ${thumbHTML(it,'thumb')}
    <div class="cbody">
      <div class="ctag" style="color:var(--c-${k})">${esc(it.sub||CATS[k].one)}</div>
      <h3>${esc(it.title)}</h3>
      <div class="prov">${esc(it.providerName||'Provider')} · ${esc(it.city||'')}</div>
      <div class="price num">${peso(it.price)} <span>/ ${esc(UNITS[it.unit]||CATS[k].unit)}</span></div>
    </div></button>`;
}
function liveListings(){ const real=S.listings.filter(it=>it.active!==false); return real.length?real:(S.ready?EXAMPLES:[]); }
function filtered(){
  return liveListings()
    .filter(it=>S.cat==='all'||it.cat===S.cat)
    .filter(it=>!S.city||(it.city||'').toLowerCase()===S.city.toLowerCase())
    .filter(it=>!S.q||[it.title,it.desc,it.sub,it.providerName,it.city].join(' ').toLowerCase().includes(S.q));
}
function signInNote(what){ return `<div class="note"><strong>Sign in to ${what}.</strong> It’s free. Use your Google account or an email. <button class="linkbtn" data-signin>Sign in</button></div>`; }
function render(){
  document.querySelectorAll('nav.tabs a').forEach(a=>{a.removeAttribute('aria-current'); if(a.dataset.v===S.view) a.setAttribute('aria-current','page');});
  const pend=S.recv.filter(r=>r.status==='pending').length;
  const ra=document.querySelector('nav.tabs a[data-v="requests"]'); ra.querySelector('.dot')?.remove(); if(pend) ra.insertAdjacentHTML('beforeend',`<span class="dot num">${pend}</span>`);
  const v=$('#view'); let h='';
  if(S.error) h+=`<div class="note">${esc(S.error)}</div>`;
  if(S.view==='explore'){
    if(!S.ready&&!S.error) h+='<div class="note">Loading listings…</div>';
    const list=filtered(); const catL=S.cat==='all'?'listings':CATS[S.cat].label.toLowerCase();
    if(S.ready&&!S.listings.some(x=>x.active!==false)) h+=`<div class="note"><strong>Renta.ph is brand new.</strong> These are examples of what listings look like. Post the first real one under My listings.</div>`;
    h+=`<div class="bar"><h2>${S.q?'Results':(S.cat==='all'?'Near you':CATS[S.cat].label)}</h2><span class="muted small num">${list.length} ${catL}${S.city?' in '+esc(S.city):''}</span></div>`;
    h+= list.length?`<div class="grid">${list.map(cardHTML).join('')}</div>`:(S.ready?`<div class="empty">${ICON.explore}<div>No listings match yet.</div><div class="small">Try another area or category, or be the first to post one.</div><a class="btn primary" href="#mine">Post a listing</a></div>`:'');
  } else if(S.view==='saved'){
    if(!S.user){ v.innerHTML=h+`<div class="bar"><h2>Saved</h2></div>`+signInNote('save listings'); return; }
    const list=S.listings.filter(it=>S.saved.has(it.id));
    h+=`<div class="bar"><h2>Saved</h2><span class="muted small num">${list.length} saved</span></div>`;
    h+= list.length?`<div class="grid">${list.map(cardHTML).join('')}</div>`:`<div class="empty">${ICON.saved}<div>Nothing saved yet.</div><div class="small">Tap Save on a listing to keep it here.</div></div>`;
  } else if(S.view==='requests'){ h+=renderRequests(); }
  else { h+=renderMine(); }
  v.innerHTML=h; loadPhotos(v);
}
function renderRequests(){
  let h=`<div class="bar"><h2>Requests</h2>${S.user?`<div class="seg" role="group" aria-label="Request type">
    <button type="button" data-rt="recv" aria-pressed="${S.reqTab==='recv'}">Received (${S.recv.length})</button>
    <button type="button" data-rt="sent" aria-pressed="${S.reqTab==='sent'}">Sent (${S.sent.length})</button></div>`:''}</div>`;
  if(!S.user) return h+signInNote('see your bookings and inquiries');
  const list=S.reqTab==='recv'?S.recv:S.sent;
  if(!list.length) return h+`<div class="empty">${ICON.requests}<div>${S.reqTab==='recv'?'No requests from customers yet.':'You haven’t sent any requests.'}</div><div class="small">${S.reqTab==='recv'?'When someone books or asks about your listing, it shows up here.':'Open a listing and tap the request button to contact a provider.'}</div></div>`;
  return h+'<div class="list">'+list.map(r=>{
    const k=catOf(r.cat); const recv=S.reqTab==='recv';
    const who=recv?(r.fromName||'A customer'):(r.providerName||'Provider');
    const when=[r.date1&&fmtDate(r.date1),r.date2&&('to '+fmtDate(r.date2)),r.time&&esc(r.time),r.qty&&('Qty '+esc(r.qty))].filter(Boolean).join(' · ');
    let acts='';
    if(recv&&r.status==='pending') acts=`<button class="btn sm primary" data-st="accepted" data-id="${esc(r.id)}">Accept</button><button class="btn sm danger" data-st="declined" data-id="${esc(r.id)}">Decline</button>`;
    else if(recv&&r.status==='accepted') acts=`<button class="btn sm" data-st="done" data-id="${esc(r.id)}">Mark completed</button>`;
    else if(!recv&&r.status==='pending') acts=`<button class="btn sm danger" data-st="cancelled" data-id="${esc(r.id)}">Cancel request</button>`;
    const reply = recv&&(r.status==='pending'||r.status==='accepted') ? `<form class="replyf" data-id="${esc(r.id)}" style="flex-direction:row;gap:6px"><input type="text" id="reply-${esc(r.id)}" aria-label="Reply to customer" placeholder="Reply, e.g. Available 9am" value="${esc(r.reply||'')}" maxlength="300"><button class="btn sm">Send</button></form>`:'';
    return `<div class="item"><div class="mini k-${k}">${ICON[k]}</div><div class="grow">
      <div class="row"><span class="pill s-${esc(r.status)}">${STATUS[r.status]||esc(r.status)}</span><span class="small muted">${r.createdAt?ago(r.createdAt):''}</span></div>
      <h3>${esc(r.itemTitle)}</h3>
      <div class="small muted">${recv?'From':'To'} <strong style="color:var(--ink)">${esc(who)}</strong>${when?' · '+when:''}</div>
      ${r.message?`<div class="quote">${esc(r.message)}</div>`:''}
      ${recv&&r.contact?`<div class="small">Customer’s number: <a href="${esc(telHref(r.contact))}" class="num">${esc(r.contact)}</a></div>`:''}
      ${!recv&&r.reply?`<div class="small muted">Provider replied:</div><div class="quote">${esc(r.reply)}</div>`:''}
      ${!recv&&r.providerPhone?`<div class="small">Provider’s number: <a href="${esc(telHref(r.providerPhone))}" class="num">${esc(r.providerPhone)}</a></div>`:''}
      ${reply}${acts?`<div class="row">${acts}</div>`:''}
    </div></div>`;}).join('')+'</div>';
}
function renderMine(){
  let h=`<div class="bar"><h2>My listings</h2>${S.user?`<button class="btn primary" data-new>${ICON.plus}Post a listing</button>`:''}</div>`;
  if(!S.user) return h+signInNote('post your services, cars, apartments or products');
  const me=S.profile;
  if(me) h+=`<div class="item"><div class="grow"><div class="small muted">Shown to customers as</div><h3>${esc(me.providerName||'')}</h3><div class="small num">${esc(me.phone||'')}</div></div><button class="btn sm" data-profile>Edit</button></div>`;
  const items=S.mineList;
  if(!items.length) return h+`<div class="empty">${ICON.mine}<div>You have no listings yet.</div><div class="small">Offer a service, rent out a car or a room, or sell a product. It takes a minute.</div></div>`;
  return h+'<div class="list">'+items.map(it=>{
    const n=S.recv.filter(r=>r.itemId===it.id&&r.status==='pending').length;
    return `<div class="item">${thumbHTML(it,'mini')}<div class="grow">
      <div class="row">${it.active===false?'<span class="pill s-declined">Paused</span>':'<span class="pill s-accepted">Live</span>'}${n?`<span class="pill s-pending">${n} new request${n>1?'s':''}</span>`:''}</div>
      <h3>${esc(it.title)}</h3><div class="small muted num">${peso(it.price)} / ${esc(UNITS[it.unit]||it.unit)} · ${esc(it.city)}</div>
      <div class="row"><button class="btn sm" data-edit="${esc(it.id)}">Edit</button><button class="btn sm" data-toggle="${esc(it.id)}">${it.active===false?'Go live':'Pause'}</button><button class="btn sm danger" data-del="${esc(it.id)}">Delete</button></div>
    </div></div>`;}).join('')+'</div>';
}

/* ---------- photos ---------- */
const photoLoading=new Set();
function loadPhotos(root){
  if(!db) return;
  root.querySelectorAll('[data-photo][data-has="1"]').forEach(el=>{
    const id=el.dataset.photo; if(S.photos.has(id)||photoLoading.has(id)) return;
    photoLoading.add(id);
    getDoc(doc(db,'photos',id)).then(d=>{
      const src=d.exists()?safeImg(d.data().data):''; if(!src) return;
      S.photos.set(id,src);
      document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{ if(!n.querySelector('img')) n.insertAdjacentHTML('beforeend',`<img alt="" src="${src}">`); });
    }).catch(()=>{}).finally(()=>photoLoading.delete(id));
  });
}

/* ---------- sheet ---------- */
let lastFocus=null;
function openSheet(title,body,onMount){
  lastFocus=document.activeElement;
  $('#sheet').innerHTML=`<div class="shead"><h2 id="sheetTitle">${title}</h2><button type="button" class="x" data-close aria-label="Close">${ICON.close}</button></div><div class="sbody">${body}</div>`;
  $('#scrim').classList.add('open'); onMount&&onMount($('#sheet')); loadPhotos($('#sheet'));
  setTimeout(()=>$('#sheet [data-close]')?.focus(),0);
}
function closeSheet(){ $('#scrim').classList.remove('open'); $('#sheet').innerHTML=''; lastFocus?.focus?.(); }
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
      <form id="ef">
        ${mode==='up'?'<label>Your name<input type="text" id="a-n" name="name" required maxlength="60" autocomplete="name"></label>':''}
        <label>Email<input type="email" id="a-e" name="email" required autocomplete="email" style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px"></label>
        <label>Password<input type="password" id="a-p" name="password" required minlength="6" autocomplete="${mode==='up'?'new-password':'current-password'}" style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px"></label>
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
    b.querySelector('#ef').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); const btn=e.target.querySelector('button'); btn.disabled=true;
      try{
        if(mode==='up'){ const c=await createUserWithEmailAndPassword(auth,f.get('email'),f.get('password')); await updateProfile(c.user,{displayName:String(f.get('name')).trim()}); S.user=c.user; renderAcct(); }
        else await signInWithEmailAndPassword(auth,f.get('email'),f.get('password'));
        done();
      }catch(x){ btn.disabled=false; err(authErr(x)); } };
  };
  const done=()=>{ closeSheet(); toast('You’re signed in.'); const n=afterSignIn; afterSignIn=null; n&&setTimeout(n,300); };
  openSheet('Sign in to Renta.ph','',draw);
}
function openAccount(){
  const u=S.user;
  openSheet('Your account',`<div><h3>${esc(u.displayName||'Renta.ph user')}</h3><div class="small muted">${esc(u.email||'')}</div></div>
    ${S.isAdmin?'<div class="note">You’re an admin. You can remove any listing that breaks the rules.</div>':''}
    <div class="row"><a class="btn" href="#mine" data-close>My listings</a><a class="btn" href="#requests" data-close>Requests</a></div>
    <button class="btn danger" id="so">Sign out</button>`,sh=>{
    sh.querySelector('#so').onclick=async()=>{ await signOut(auth); closeSheet(); toast('Signed out.'); };
  });
}
const needUser = fn=>{ if(S.user) fn(); else openSignIn(fn); };

/* ---------- listing detail & requests ---------- */
function findItem(id){ return S.listings.find(x=>x.id===id)||S.mineList.find(x=>x.id===id)||EXAMPLES.find(x=>x.id===id); }
function openItem(id){
  const it=findItem(id); if(!it) return; const k=catOf(it.cat); const mine=S.user&&it.ownerId===S.user.uid; const saved=S.saved.has(id);
  const body=`<div class="hero k-${k}" data-photo="${esc(id)}" data-has="${it.hasPhoto?1:0}">${ICON[k]}${S.photos.get(id)?`<img alt="" src="${S.photos.get(id)}">`:''}</div>
    <div><div class="ctag" style="color:var(--c-${k})">${esc(CATS[k].one)} · ${esc(it.sub||'')}</div><h2 style="font-size:24px;margin-top:4px">${esc(it.title)}</h2></div>
    <div class="price num" style="font-size:22px;padding:0">${peso(it.price)} <span>/ ${esc(UNITS[it.unit]||it.unit)}</span></div>
    <div class="facts"><div class="fact"><b>Area</b>${esc(it.city)}</div><div class="fact"><b>Provider</b>${esc(it.providerName||'Provider')}</div></div>
    ${it.desc?`<div class="desc">${esc(it.desc)}</div>`:''}
    ${it.example?'<div class="note">This is an example listing to show how Renta.ph works. You can’t book it.</div>':`
    <div class="row">
      ${mine?`<button class="btn" data-edit="${esc(it.id)}">Edit my listing</button>`:`<button class="btn accent" data-req="${esc(id)}">${esc(CATS[k].act)}</button>`}
      ${it.phone&&!mine?`<a class="btn" href="${esc(telHref(it.phone))}">${ICON.phone}<span class="num">${esc(it.phone)}</span></a>`:''}
      ${!mine?`<button class="btn" data-save="${esc(id)}" aria-pressed="${saved}">${saved?ICON.savedOn:ICON.saved}${saved?'Saved':'Save'}</button>`:''}
      ${S.isAdmin&&!mine?`<button class="btn danger" data-mod="${esc(id)}">Remove (admin)</button>`:''}
    </div>`}`;
  openSheet(esc(CATS[k].one),body);
}
function openRequest(id){
  const it=findItem(id); if(!it||it.example) return; const k=catOf(it.cat);
  const today=new Date().toISOString().slice(0,10);
  let fields='';
  if(k==='services') fields=`<div class="two"><label>Preferred date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>Preferred time<input type="time" id="r-t" name="time"></label></div>`;
  else if(k==='cars') fields=`<div class="two"><label>Pick-up date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>Return date<input type="date" id="r-d2" name="date2" min="${today}" required></label></div>`;
  else if(k==='apartments') fields=`<div class="two"><label>Viewing or move-in date<input type="date" id="r-d1" name="date1" min="${today}" required></label><label>How long?<input type="text" id="r-q" name="qty" placeholder="e.g. 6 months" maxlength="40"></label></div>`;
  else fields=`<div class="two"><label>Quantity<input type="number" id="r-q" name="qty" min="1" value="1" required></label><label>Needed by<input type="date" id="r-d1" name="date1" min="${today}"></label></div>`;
  openSheet('Send a request',`<div class="small muted">To <strong style="color:var(--ink)">${esc(it.providerName)}</strong> for “${esc(it.title)}”</div>
    <form id="reqf">${fields}
      <label>Message<textarea id="r-m" name="message" maxlength="800" placeholder="Hi! Is this available? Add details like address or what you need."></textarea></label>
      <label>Your mobile number<span class="hint">Shared only with this provider so they can reach you.</span><input type="tel" id="r-c" name="contact" placeholder="09XX XXX XXXX" required maxlength="20"></label>
      <div class="err" id="r-err" hidden></div>
      <button class="btn accent">Send request</button></form>`,sh=>{
    sh.querySelector('#reqf').onsubmit=async e=>{
      e.preventDefault(); const f=new FormData(e.target); const btn=e.target.querySelector('button'); const err=sh.querySelector('#r-err');
      const d1=f.get('date1')||'', d2=f.get('date2')||'';
      if(d2&&d1&&d2<d1){ err.hidden=false; err.textContent='The return date must be on or after the pick-up date.'; return; }
      btn.disabled=true;
      try{
        await addDoc(collection(db,'inquiries'),{ownerId:it.ownerId,itemId:it.id,itemTitle:String(it.title).slice(0,80),cat:k,providerName:it.providerName||'',providerPhone:it.phone||'',
          fromId:S.user.uid,fromName:(S.user.displayName||'').slice(0,60),date1:d1,date2:d2,time:f.get('time')||'',qty:String(f.get('qty')||'').slice(0,40),
          message:String(f.get('message')||'').slice(0,800),contact:String(f.get('contact')||'').slice(0,20),status:'pending',reply:'',createdAt:Date.now(),updatedAt:Date.now()});
        closeSheet(); toast('Request sent. You’ll see the reply under Requests.'); S.reqTab='sent';
      }catch(x){ btn.disabled=false; toast(errText(x)); }
    };
  });
}

/* ---------- my listings ---------- */
function compress(file){
  return new Promise((res,rej)=>{
    const img=new Image(); const url=URL.createObjectURL(file);
    img.onload=()=>{ URL.revokeObjectURL(url);
      let w=img.naturalWidth,h=img.naturalHeight,max=1080,q=.75,out='';
      for(let i=0;i<5;i++){ const s=Math.min(1,max/Math.max(w,h)); const c=document.createElement('canvas'); c.width=Math.round(w*s); c.height=Math.round(h*s);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height); out=c.toDataURL('image/jpeg',q); if(out.length<220000) break; max*=.8; q=Math.max(.45,q-.08); }
      out.length<290000?res(out):rej(new Error('big'));
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
        // keep name and number on existing listings in step
        await Promise.all(S.mineList.filter(x=>x.providerName!==p.providerName||x.phone!==p.phone).map(x=>updateDoc(doc(db,'listings',x.id),{providerName:p.providerName,phone:p.phone,updatedAt:Date.now()})));
        closeSheet(); toast('Profile saved.'); render(); after&&after();
      }catch(x){ b.disabled=false; toast(errText(x)); } };
  });
}
function openEditor(id){
  if(!S.profile||!S.profile.providerName){ openProfile(()=>openEditor(id)); return; }
  const it=id?S.mineList.find(x=>x.id===id):null; const cat=it?.cat||(S.cat!=='all'?S.cat:'services');
  const subOpts=c=>CATS[c].subs.map(s=>`<option ${it?.sub===s?'selected':''}>${s}</option>`).join('');
  openSheet(it?'Edit listing':'New listing',`<form id="ef">
    <fieldset><legend>What are you offering?</legend><div class="radios">${Object.entries(CATS).map(([k,v])=>`<label><input type="radio" name="cat" value="${k}" ${k===cat?'checked':''}>${v.label}</label>`).join('')}</div></fieldset>
    <label>Type<select id="e-sub" name="sub">${subOpts(cat)}</select></label>
    <label>Title<input type="text" id="e-t" name="title" required maxlength="80" value="${esc(it?.title||'')}" placeholder="e.g. Aircon cleaning, window or split type"></label>
    <div class="two"><label>Price (₱)<input type="number" id="e-p" name="price" required min="0" step="1" value="${esc(it?.price??'')}"></label>
    <label>Per<select id="e-u" name="unit">${Object.keys(UNITS).map(u=>`<option value="${u}" ${(it?.unit||CATS[cat].unit)===u?'selected':''}>${u}</option>`).join('')}</select></label></div>
    <label>Area<input type="text" id="e-c" name="city" list="citylist" required maxlength="40" value="${esc(it?.city||'')}" placeholder="e.g. Mandaue"></label>
    <datalist id="citylist">${CITIES.map(c=>`<option value="${c}">`).join('')}</datalist>
    <label>Details<span class="hint">Inclusions, schedule, requirements, location landmarks.</span><textarea id="e-d" name="desc" maxlength="1500">${esc(it?.desc||'')}</textarea></label>
    <label>Photo<span class="hint">One clear photo helps a lot. It’s resized automatically.</span><input type="file" id="e-f" accept="image/*"></label>
    <img class="photo-prev" id="e-prev" alt="" hidden>
    <div class="err" id="e-err" hidden></div>
    <button class="btn primary" id="e-save">${it?'Save changes':'Post listing'}</button></form>`,sh=>{
    const f=sh.querySelector('#ef'); let photo=null;
    const prev=sh.querySelector('#e-prev'); const cur=it&&S.photos.get(it.id); if(cur){prev.src=cur;prev.hidden=false;}
    f.addEventListener('change',e=>{ if(e.target.name==='cat'){ const c=e.target.value; sh.querySelector('#e-sub').innerHTML=subOpts(c); sh.querySelector('#e-u').value=CATS[c].unit; } });
    sh.querySelector('#e-f').onchange=async e=>{ const file=e.target.files[0]; if(!file) return; const err=sh.querySelector('#e-err');
      try{ photo=await compress(file); prev.src=photo; prev.hidden=false; err.hidden=true; }catch(_){ photo=null; err.hidden=false; err.textContent='That photo couldn’t be used. Try a JPG or PNG.'; } };
    f.onsubmit=async e=>{ e.preventDefault(); const d=new FormData(f); const b=sh.querySelector('#e-save'); b.disabled=true;
      const ref=it?doc(db,'listings',it.id):doc(collection(db,'listings'));
      const rec={ownerId:S.user.uid,providerName:S.profile.providerName,phone:S.profile.phone,cat:d.get('cat'),sub:d.get('sub'),title:String(d.get('title')).trim(),
        price:Math.max(0,Number(d.get('price'))||0),unit:d.get('unit'),city:String(d.get('city')).trim(),desc:String(d.get('desc')||'').trim(),
        hasPhoto:!!(photo||it?.hasPhoto),active:it?it.active!==false:true,createdAt:it?.createdAt||Date.now(),updatedAt:Date.now()};
      try{
        if(photo){ await setDoc(doc(db,'photos',ref.id),{ownerId:S.user.uid,data:photo}); S.photos.set(ref.id,photo); }
        await setDoc(ref,rec);
        closeSheet(); toast(it?'Listing updated.':'Your listing is live.'); if(!it) location.hash='mine';
      }catch(x){ b.disabled=false; toast(errText(x)); }
    };
  });
}
function confirmSheet(title,text,label,fn){
  openSheet(title,`<p style="margin:0">${text}</p><div class="row"><button class="btn danger" id="cf-yes">${label}</button><button class="btn" data-close>Keep it</button></div>`,sh=>{
    sh.querySelector('#cf-yes').onclick=async e=>{ e.target.disabled=true; try{ await fn(); closeSheet(); }catch(x){ e.target.disabled=false; toast(errText(x)); } };
  });
}

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
  const t=e.target.closest('button,[data-open]'); if(!t) return;
  const D=t.dataset;
  if(D.open) openItem(D.open);
  else if(D.signin!==undefined) openSignIn();
  else if(D.req) needUser(()=>openRequest(D.req));
  else if(D.rt){ S.reqTab=D.rt; render(); }
  else if(D.new!==undefined) openEditor(null);
  else if(D.profile!==undefined) openProfile();
  else if(D.edit) openEditor(D.edit);
  else if(D.toggle){ const it=S.mineList.find(x=>x.id===D.toggle); if(!it) return; t.disabled=true;
    updateDoc(doc(db,'listings',it.id),{active:it.active===false,updatedAt:Date.now()}).then(()=>toast(it.active===false?'Listing is live again.':'Listing paused.')).catch(x=>toast(errText(x))).finally(()=>t.disabled=false); }
  else if(D.del){ const id=D.del; const it=S.mineList.find(x=>x.id===id);
    confirmSheet('Delete listing?','Customers won’t see it anymore. Requests you already received stay under Requests.','Delete',async()=>{
      await deleteDoc(doc(db,'listings',id)); if(it?.hasPhoto) deleteDoc(doc(db,'photos',id)).catch(()=>{}); toast('Listing deleted.'); }); }
  else if(D.save){ const id=D.save; needUser(async()=>{ const s=new Set(S.saved); s.has(id)?s.delete(id):s.add(id);
      try{ await setDoc(doc(db,'users',S.user.uid,'private','saved'),{keys:[...s].slice(0,300)}); S.saved=s; openItem(id); toast(s.has(id)?'Saved.':'Removed from saved.'); }catch(x){ toast(errText(x)); } }); }
  else if(D.mod){ const id=D.mod; const it=findItem(id);
    confirmSheet('Remove this listing?','As an admin you can take down listings that break the rules.','Remove',async()=>{
      await deleteDoc(doc(db,'listings',id)); if(it?.hasPhoto) deleteDoc(doc(db,'photos',id)).catch(()=>{}); toast('Listing removed.'); }); }
  else if(D.st){ t.disabled=true; try{ await updateDoc(doc(db,'inquiries',D.id),{status:D.st,updatedAt:Date.now()}); toast(D.st==='accepted'?'Accepted. Call or text the customer to confirm.':'Request updated.'); }catch(x){ t.disabled=false; toast(errText(x)); } }
});
document.addEventListener('submit',async e=>{
  const f=e.target.closest('.replyf'); if(!f) return; e.preventDefault();
  const val=f.querySelector('input').value.trim(); const b=f.querySelector('button'); b.disabled=true;
  try{ await updateDoc(doc(db,'inquiries',f.dataset.id),{reply:val.slice(0,300),updatedAt:Date.now()}); toast('Reply sent.'); }catch(x){ toast(errText(x)); } finally{ b.disabled=false; }
});

/* ---------- data ---------- */
const byNew=a=>a.sort((x,y)=>(y.createdAt||0)-(x.createdAt||0));
function watchUser(u){
  unsubs.forEach(f=>f()); unsubs=[]; S.recv=[]; S.sent=[]; S.mineList=[]; S.saved=new Set(); S.profile=null; S.isAdmin=false;
  if(!u){ render(); return; }
  const quiet=()=>{};
  unsubs.push(onSnapshot(doc(db,'providers',u.uid),d=>{ S.profile=d.exists()?d.data():null; if(S.view==='mine') render(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'listings'),where('ownerId','==',u.uid)),s=>{ S.mineList=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); if(S.view==='mine') render(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'inquiries'),where('ownerId','==',u.uid)),s=>{ S.recv=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); render(); },quiet));
  unsubs.push(onSnapshot(query(collection(db,'inquiries'),where('fromId','==',u.uid)),s=>{ S.sent=byNew(s.docs.map(d=>({id:d.id,...d.data()}))); if(S.view==='requests') render(); },quiet));
  unsubs.push(onSnapshot(doc(db,'users',u.uid,'private','saved'),d=>{ S.saved=new Set(d.exists()&&Array.isArray(d.data().keys)?d.data().keys:[]); if(S.view==='saved') render(); },quiet));
  getDoc(doc(db,'admins',u.uid)).then(d=>{ S.isAdmin=d.exists(); }).catch(()=>{});
}
function start(){
  buildShell(); route();
  const cfg=window.RENTA_FIREBASE;
  if(!cfg||!cfg.apiKey||cfg.apiKey.startsWith('PASTE')){ S.error='Renta.ph isn’t connected to its database yet. The owner needs to add the Firebase settings in config.js.'; S.ready=true; render(); return; }
  const app=initializeApp(cfg); auth=getAuth(app); db=getFirestore(app);
  getRedirectResult(auth).then(r=>{ if(r) toast('You’re signed in.'); }).catch(e=>toast(authErr(e)));
  onAuthStateChanged(auth,u=>{ S.user=u; renderAcct(); watchUser(u); });
  const timer=setTimeout(()=>{ if(!S.ready){ S.error='Listings can’t be reached yet. Check your connection; this page keeps trying.'; render(); } },10000);
  onSnapshot(query(collection(db,'listings'),orderBy('createdAt','desc'),limit(500)),s=>{
    clearTimeout(timer); S.error=''; S.ready=true;
    S.listings=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.title).map(x=>({...x,cat:catOf(x.cat)}));
    render();
  },e=>{ clearTimeout(timer); S.ready=true; S.error='Listings couldn’t load. '+(e.code==='permission-denied'?'The database rules haven’t been published yet.':'Try reloading the page.'); render(); });
}
start();
