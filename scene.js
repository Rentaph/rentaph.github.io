/* Renta.ph animated street scene. RentaScene(host, {mode:'hero'|'banner'}) */
window.RentaScene=function(host,opts){
  opts=opts||{}; const banner=opts.mode==='banner';
  const SK=['#f1c27d','#c68642','#8d5524','#e0ac69','#a8693c'];
  const person=(x,y,o={})=>{
    const s=o.skin||SK[0], c=o.shirt||'#3b5699', p=o.pants||'#26323f', h=o.hair||'#1d1a17', sc=(o.scale||1)*1.35;
    const legs=o.walk?`<rect class="legA" x="-7" y="14" width="6" height="20" rx="3" fill="${p}"/><rect class="legB" x="1" y="14" width="6" height="20" rx="3" fill="${p}"/>`
                     :`<rect x="-7" y="14" width="6" height="20" rx="3" fill="${p}"/><rect x="1" y="14" width="6" height="20" rx="3" fill="${p}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${sc})"><g class="${o.walk?'bob':''}">${legs}
      <rect x="-11" y="-14" width="22" height="32" rx="9" fill="${c}"/>${o.extra||''}
      <circle cx="0" cy="-24" r="10" fill="${s}"/><path d="M-10 -25a10 10 0 0 1 20 0q-4-6-10-5q-6-1-10 5z" fill="${h}"/>${o.cap?`<path d="M-11 -27h22v-4a11 9 0 0 0-22 0z" fill="${o.cap}"/><rect x="5" y="-29" width="12" height="3" rx="1.5" fill="${o.cap}"/>`:''}
    </g></g>`;
  };
  const bubble=(x,y,w,label,price,color,delay)=>`<g class="bubble" style="animation-delay:${delay}s"><g transform="translate(${x} ${y})">
    <rect x="${-w/2}" y="-56" width="${w}" height="56" rx="16" fill="#fff" stroke="#dfe2da" stroke-width="1.5"/><path d="M-9 -1 0 11 9 -1z" fill="#fff"/>
    <circle cx="${-w/2+22}" cy="-28" r="9" fill="${color}"/>
    <text x="${-w/2+40}" y="-32" font-family="Figtree,sans-serif" font-size="17" font-weight="700" fill="#152030">${label}</text>
    <text x="${-w/2+40}" y="-12" font-family="Figtree,sans-serif" font-size="15" fill="#56606e">${price}</text></g></g>`;

  const motor=(x,y,color,o={})=>`<g transform="translate(${x} ${y})${o.flip?' scale(-1 1)':''}">
    <g class="${o.ride?'wheel':''}"><circle cx="0" cy="0" r="11" fill="#1d232b"/><circle cx="0" cy="0" r="4" fill="#8a96a3"/>${o.ride?'<rect x="-1.5" y="-10" width="3" height="20" fill="#8a96a3"/>':''}</g>
    <g class="${o.ride?'wheel':''}"><circle cx="48" cy="0" r="11" fill="#1d232b"/><circle cx="48" cy="0" r="4" fill="#8a96a3"/>${o.ride?'<rect x="46.5" y="-10" width="3" height="20" fill="#8a96a3"/>':''}</g>
    <path d="M2 -4 L14 -18 H34 L46 -4 Z" fill="${color}"/><rect x="12" y="-26" width="22" height="8" rx="4" fill="#26323f"/>
    <path d="M40 -14 L48 -32" stroke="#26323f" stroke-width="4" stroke-linecap="round"/><rect x="42" y="-36" width="14" height="4" rx="2" fill="#26323f"/>
    <circle class="${o.ride?'':'lamp'}" cx="52" cy="-22" r="4" fill="#f6d77a"/>
    ${o.tag?`<rect x="6" y="-12" width="22" height="8" rx="2" fill="#fff"/><text x="17" y="-6" text-anchor="middle" font-family="Figtree,sans-serif" font-size="6.5" font-weight="800" fill="#152030">${o.tag}</text>`:''}
    ${o.rider||''}</g>`;
  const car=(x,y,color,o={})=>`<g transform="translate(${x} ${y})"><rect x="0" y="0" width="86" height="24" rx="8" fill="${color}"/><path d="M14 0 l12-16 h36 l12 16z" fill="${color}"/><path d="M22 -2 l8-11 h12 v11z M48 -2 v-11 h10 l8 11z" fill="#d9ecf5"/>
    ${o.roof?`<rect x="28" y="-27" width="32" height="11" rx="3" fill="#e9a514"/><text x="44" y="-18.5" text-anchor="middle" font-family="Figtree,sans-serif" font-size="7.5" font-weight="800" fill="#231600">${o.roof}</text>`:''}
    <circle cx="82" cy="10" r="3.5" fill="#f6d77a"/>
    <g class="${o.ride?'wheel':''}"><circle cx="20" cy="26" r="9" fill="#26323f"/>${o.ride?'<rect x="18.5" y="18" width="3" height="16" fill="#8a96a3"/>':''}</g>
    <g class="${o.ride?'wheel':''}"><circle cx="68" cy="26" r="9" fill="#26323f"/>${o.ride?'<rect x="66.5" y="18" width="3" height="16" fill="#8a96a3"/>':''}</g></g>`;

  let w=''; // apartment windows
  for(let r=0;r<6;r++) for(let c=0;c<4;c++){ const lit=(r*4+c)%3===0; w+=`<rect class="${lit?'win':''}" style="animation-delay:${-(r*1.3+c*.7)}s" x="${102+c*42}" y="${180+r*38}" width="26" height="24" rx="3" fill="${lit?'#f6d77a':'#c9d6e3'}"/>`; }
  let w2='';
  for(let r=0;r<5;r++) for(let c=0;c<3;c++){ const lit=(r+c)%2===0; w2+=`<rect class="${lit?'win':''}" style="animation-delay:${-(r*.9+c*1.7)}s" x="${782+c*38}" y="${222+r*36}" width="24" height="22" rx="3" fill="${lit?'#f6d77a':'#c9d6e3'}"/>`; }
  let stripes=''; for(let i=0;i<9;i++) stripes+=`<rect x="${322+i*19}" y="300" width="19" height="26" fill="${i%2?'#fff':'#b9452c'}"/>`;
  let lanes=''; for(let i=0;i<24;i++) lanes+=`<rect x="${i*60}" y="479" width="30" height="5" rx="2.5" fill="#f3f4ef"/>`;
  const cloud=(x,y,s,cls)=>`<g class="cloud ${cls}"><g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><ellipse cx="0" cy="0" rx="44" ry="18"/><ellipse cx="-22" cy="-8" rx="22" ry="16"/><ellipse cx="18" cy="-14" rx="26" ry="20"/></g></g>`;

  const svg=`<svg viewBox="0 70 1200 550" xmlns="http://www.w3.org/2000/svg">
  <circle class="sun" cx="1120" cy="140" r="40" fill="#f6c453"/><circle cx="1120" cy="140" r="56" fill="#f6c453" opacity=".18"/>
  ${cloud(120,90,1,'')}${cloud(600,60,.8,'c2')}${cloud(900,140,.6,'c3')}
  <path d="M0 360 Q150 300 300 340 T620 330 T900 320 T1200 330 V430 H0z" fill="#b9d8cf" opacity=".6"/>
  <rect x="0" y="420" width="1200" height="200" fill="#d7dccf"/>
  <rect x="0" y="420" width="1200" height="18" fill="#c5cbbd"/>
  <!-- palm -->
  <g transform="translate(300 300)"><rect x="-4" y="0" width="8" height="122" rx="4" fill="#8a6a3f"/><g fill="#3f8a5a"><ellipse cx="-30" cy="0" rx="34" ry="9" transform="rotate(-20)"/><ellipse cx="30" cy="0" rx="34" ry="9" transform="rotate(20)"/><ellipse cx="0" cy="-12" rx="10" ry="30"/><ellipse cx="-24" cy="-10" rx="30" ry="8" transform="rotate(30)"/></g></g>

  <!-- apartment block -->
  <rect x="84" y="150" width="190" height="272" rx="6" fill="#3b5699"/><rect x="76" y="140" width="206" height="16" rx="4" fill="#2c4278"/>
  ${w}
  <rect x="160" y="378" width="38" height="44" rx="3" fill="#2c4278"/>
  <g class="sign"><line x1="252" y1="300" x2="252" y2="312" stroke="#152030" stroke-width="2"/><rect x="222" y="312" width="62" height="26" rx="5" fill="#e9a514"/><text x="253" y="329" text-anchor="middle" font-family="Figtree,sans-serif" font-size="11" font-weight="800" fill="#231600">FOR RENT</text></g>

  <!-- sari-sari store -->
  <rect x="326" y="326" width="164" height="96" fill="#f2e3c4"/>
  ${stripes}<path d="M322 326 h171 l-6 8 h-159z" fill="#9c3a24" opacity=".35"/>
  <rect x="336" y="276" width="146" height="24" rx="4" fill="#0e5a5f"/><text x="409" y="293" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-size="14" font-weight="800" fill="#fff">SARI-SARI STORE</text>
  <rect x="340" y="352" width="90" height="70" fill="#dfcda6"/>
  ${person(386,360,{skin:SK[2],shirt:'#e9a514',hair:'#2a1a10'})}
  <rect x="336" y="382" width="100" height="40" rx="3" fill="#b88a4a"/>
  <g fill="#b9452c"><rect x="346" y="370" width="10" height="12" rx="2"/><rect x="360" y="372" width="10" height="10" rx="2" fill="#3b5699"/><rect x="412" y="368" width="12" height="14" rx="2" fill="#0e5a5f"/></g>
  <rect x="444" y="352" width="36" height="70" rx="3" fill="#8a6a3f"/>

  <!-- house + plumber -->
  <path d="M528 330 L612 270 L696 330z" fill="#b9452c"/>
  <rect x="540" y="328" width="144" height="94" fill="#fbf6ea"/>
  <rect x="560" y="350" width="36" height="30" rx="3" fill="#9fc5e0" stroke="#e7dcc2" stroke-width="4"/>
  <rect x="624" y="360" width="34" height="62" rx="3" fill="#0e5a5f"/><circle cx="651" cy="392" r="2.5" fill="#e9a514"/>
  <rect x="700" y="378" width="8" height="44" fill="#8a96a3"/><rect x="700" y="378" width="30" height="8" fill="#8a96a3"/><rect x="722" y="372" width="12" height="18" rx="2" fill="#6f7b88"/>
  <circle class="drop" cx="728" cy="394" r="3" fill="#4aa3df"/><circle class="drop d2" cx="725" cy="394" r="2.5" fill="#4aa3df"/><circle class="drop d3" cx="731" cy="394" r="2" fill="#4aa3df"/>
  ${person(752,392,{skin:SK[1],shirt:'#0e5a5f',pants:'#1c3b6b',cap:'#e9a514',extra:'<g class="wrench"><rect x="-26" y="-6" width="24" height="5" rx="2.5" fill="#8a96a3"/><circle cx="-26" cy="-3.5" r="5" fill="none" stroke="#8a96a3" stroke-width="3"/></g>'})}
  <rect x="770" y="410" width="30" height="16" rx="3" fill="#b9452c"/><rect x="778" y="406" width="14" height="5" rx="2" fill="#7d2e1d"/>

  <!-- condo + cleaner -->
  <rect x="770" y="200" width="138" height="222" rx="6" fill="#e9a514" opacity=".9"/><rect x="764" y="190" width="150" height="14" rx="4" fill="#c4870a"/>
  ${w2}
  <rect x="822" y="380" width="36" height="42" rx="3" fill="#8a5b0a"/>
  ${person(880,398,{skin:SK[3],shirt:'#b9452c',pants:'#26323f',hair:'#3a2416',extra:'<g class="mop"><rect x="8" y="-6" width="4" height="46" rx="2" fill="#8a6a3f"/><rect x="2" y="38" width="18" height="7" rx="3" fill="#9fc5e0"/></g>'})}
  <path d="M860 438 q20 6 44 0" stroke="#9fc5e0" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>

  <!-- car & motor rental lot -->
  <rect x="936" y="330" width="244" height="92" fill="#fbf6ea"/><rect x="928" y="316" width="258" height="20" rx="4" fill="#0e5a5f"/>
  <text x="1057" y="330.5" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-size="12.5" font-weight="800" fill="#fff">CAR &amp; MOTOR RENTAL</text>
  <rect x="946" y="342" width="70" height="30" rx="4" fill="#dcefeb"/><text x="981" y="355" text-anchor="middle" font-family="Figtree,sans-serif" font-size="8.5" font-weight="800" fill="#0e5a5f">MOTOR ₱500</text><text x="981" y="366" text-anchor="middle" font-family="Figtree,sans-serif" font-size="8.5" font-weight="800" fill="#0e5a5f">CAR ₱1,800</text>
  <g class="rock">${car(1026,384,'#b9452c')}</g>
  ${motor(1124,410,'#3b5699',{tag:'RENT'})}
  ${person(954,396,{skin:SK[1],shirt:'#0e5a5f',pants:'#26323f',hair:'#1d1a17',extra:'<g class="keys"><rect x="10" y="-8" width="6" height="16" rx="3" fill="#0e5a5f"/><circle cx="18" cy="-12" r="5" fill="none" stroke="#e9a514" stroke-width="2.5"/><rect x="21" y="-13" width="9" height="2.5" fill="#e9a514"/></g>'})}
  ${person(1002,400,{skin:SK[0],shirt:'#e9a514',pants:'#3b5699',scale:.9,hair:'#3a2416',extra:'<g class="wave"><rect x="-16" y="-10" width="6" height="16" rx="3" fill="#e9a514"/></g>'})}
  <!-- road -->
  <rect x="0" y="446" width="1200" height="74" fill="#3c4652"/>
  <g class="lane">${lanes}</g>
  <rect x="0" y="520" width="1200" height="100" fill="#cfd4c6"/>

  <!-- jeepney -->
  <g class="car"><g transform="translate(0 452)">
    <rect x="0" y="6" width="150" height="34" rx="6" fill="#e9a514"/><rect x="8" y="-14" width="130" height="22" rx="5" fill="#f3f4ef"/>
    <g fill="#9fc5e0">${[0,1,2,3,4].map(i=>`<rect x="${14+i*24}" y="-10" width="18" height="14" rx="2"/>`).join('')}</g>
    <rect x="138" y="12" width="22" height="22" rx="4" fill="#b9452c"/><rect x="0" y="22" width="150" height="5" fill="#0e5a5f"/>
    <rect x="12" y="-22" width="120" height="9" rx="4" fill="#0e5a5f"/><text x="72" y="-15" text-anchor="middle" font-family="Figtree,sans-serif" font-size="7" font-weight="800" fill="#fff">RENTA.PH · CEBU</text>
    <g class="wheel" transform-origin="30 42"><circle cx="30" cy="42" r="10" fill="#1d232b"/><rect x="28" y="34" width="4" height="16" fill="#8a96a3"/></g>
    <g class="wheel"><circle cx="124" cy="42" r="10" fill="#1d232b"/><rect x="122" y="34" width="4" height="16" fill="#8a96a3"/></g>
    <circle class="smoke" cx="-6" cy="34" r="6" fill="#c5cbbd"/>
  </g></g>
  <!-- rented car following the jeep -->
  <g class="car c-rent"><g transform="translate(0 0)">${car(0,454,'#3b5699',{ride:true,roof:'RENTED'})}</g></g>
  <!-- rented motorcycles -->
  <g class="moto">${motor(0,508,'#b9452c',{ride:true,tag:'RENT',rider:person(24,-46,{skin:SK[2],shirt:'#0e5a5f',pants:'#26323f',scale:.6,cap:'#e9a514'})})}</g>
  <g class="moto m2">${motor(0,508,'#3b5699',{ride:true,tag:'RENT',rider:person(24,-46,{skin:SK[3],shirt:'#b9452c',pants:'#26323f',scale:.6,cap:'#152030'})+person(6,-42,{skin:SK[0],shirt:'#e9a514',pants:'#3b5699',scale:.52,hair:'#3a2416'})})}</g>
  <!-- delivery scooter -->
  <g class="scooter"><g transform="translate(0 490) scale(-1 1)">
    <rect x="-40" y="-8" width="44" height="14" rx="6" fill="#0e5a5f"/><rect x="-34" y="-30" width="22" height="20" rx="3" fill="#e9a514"/>
    <rect x="2" y="-26" width="4" height="22" rx="2" fill="#26323f"/>
    ${person(-10,-36,{skin:SK[4],shirt:'#b9452c',scale:.62,cap:'#0e5a5f'})}
    <g class="wheel"><circle cx="-34" cy="12" r="8" fill="#1d232b"/><rect x="-35.5" y="5" width="3" height="14" fill="#8a96a3"/></g>
    <g class="wheel"><circle cx="2" cy="12" r="8" fill="#1d232b"/><rect x="0.5" y="5" width="3" height="14" fill="#8a96a3"/></g>
  </g></g>

  <!-- sidewalk people -->
  <g class="walker">${person(0,560,{skin:SK[0],shirt:'#0e5a5f',pants:'#3a4452',walk:true,extra:'<rect x="10" y="-8" width="8" height="14" rx="2" fill="#152030"/>'})}</g>
  <g class="walker w2">${person(0,566,{skin:SK[2],shirt:'#e9a514',pants:'#26323f',hair:'#2a1a10',walk:true})}${person(34,566,{skin:SK[1],shirt:'#b9452c',pants:'#3b5699',walk:true,scale:.78})}</g>

  <!-- customer booking on phone -->
  <g transform="translate(560 560)">
    ${person(0,0,{skin:SK[3],shirt:'#3b5699',pants:'#26323f',hair:'#3a2416',extra:'<g class="wave"><rect x="9" y="-12" width="6" height="18" rx="3" fill="#3b5699"/><rect x="8" y="-24" width="11" height="17" rx="2.5" fill="#152030"/><rect x="10" y="-22" width="7" height="12" rx="1" fill="#9fe0d8"/></g>'})}
    <circle class="ring" cx="14" cy="-18" r="10" fill="none" stroke="#0e5a5f" stroke-width="2.5"/>
  </g>
  <path class="link" d="M574 538 C 600 470, 700 420, 752 330" fill="none" stroke="#0e5a5f" stroke-width="2.5"/>
  <path class="link" d="M574 538 C 520 470, 380 420, 409 266" fill="none" stroke="#e9a514" stroke-width="2.5"/>
  <path class="link" d="M574 538 C 650 500, 900 470, 1055 312" fill="none" stroke="#b9452c" stroke-width="2.5"/>

  <!-- listing bubbles -->
  ${bubble(190,138,200,'Studio for rent','₱14,000 / month','#3b5699',0)}
  ${bubble(420,262,196,'Sari-sari order','Ready for pick-up','#86600f',1.5)}
  ${bubble(700,330,250,'Plumber nearby','₱350 / hour · Accepted','#0e5a5f',3)}
  ${bubble(850,180,196,'House cleaning','₱1,200 / visit','#b9452c',4.5)}
  ${bubble(1060,296,190,'Vios self-drive','₱1,800 / day','#b9452c',6)}
  ${bubble(1092,388,196,'Motorcycle rental','₱500 / day · Booked','#3b5699',7.5)}
  </svg>`;
  host.innerHTML=svg;
  const sv=host.querySelector('svg');
  const V = banner ? {full:[0,250,1200,370], y:250, h:370, narrow:560} : {full:[0,70,1200,550], y:105, h:515, narrow:560};
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches; let t0=performance.now(), raf=0;
  const pan=now=>{ if(!sv.isConnected) return; const p=(1-Math.cos(((now-t0)/26000)*2*Math.PI))/2; sv.setAttribute('viewBox',`${(40+p*520).toFixed(1)} ${V.y} 640 ${V.h}`); raf=requestAnimationFrame(pan); };
  const fit=()=>{ cancelAnimationFrame(raf); if(!sv.isConnected) return;
    if(host.clientWidth<V.narrow){ if(still) sv.setAttribute('viewBox',`560 ${V.y} 640 ${V.h}`); else raf=requestAnimationFrame(pan); }
    else sv.setAttribute('viewBox',V.full.join(' ')); };
  fit(); addEventListener('resize',fit);
  return ()=>{ cancelAnimationFrame(raf); removeEventListener('resize',fit); };
};
