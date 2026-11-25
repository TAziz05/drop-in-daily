if(typeof Element!=="undefined"&&Element.prototype.animate){
const R=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
/* ---- sky ---- */
const cloud=(x,y,s,o)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="14" rx="70" ry="22" fill="#cfe6ff"/><circle cx="-34" cy="0" r="26" fill="#fff"/><circle cx="2" cy="-14" r="36" fill="#fff"/><circle cx="40" cy="2" r="24" fill="#fff"/><ellipse cx="0" cy="10" rx="66" ry="18" fill="#fff"/></g>`;
/* Clouds are laid out to fit the screen: each one stays fully in view top to bottom, and a cloud drifting
   past the edge carries on from the other side, so none get sliced in half. They also stay above the island and the storm. */
const CLOUDS=[[[120,140,.8,.55],[520,90,.6,.5],[820,240,.9,.5],[300,420,.7,.45]],[[80,560,1.3,.95],[460,330,1.1,.9],[760,620,1.5,.95],[960,150,.9,.85]]];
const layer=(list)=>{const W=innerWidth||1000,H=innerHeight||800,k=Math.max(W/1000,H/800),vw=W/k,vh=H/k,m=Math.min(1,Math.sqrt(vw/1000));
  const g=list.map(([x,y,sc,o])=>{const c=sc*m,X=x*vw/1000,Y=Math.min(Math.max(y*vh/800,52*c+10),vh*(W<600?.62:.66)-38*c);return [X-vw,X,X+vw].map(xx=>cloud(xx.toFixed(1),Y.toFixed(1),c.toFixed(3),o)).join("")}).join("");
  const one=`<svg viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" preserveAspectRatio="none" aria-hidden="true">${g}</svg>`;return one+one};
const sky=document.createElement("div");sky.className="fn-sky";sky.setAttribute("aria-hidden","true");
sky.innerHTML=`<div class="fn-clouds">${layer(CLOUDS[0])}</div>
 <div class="fn-clouds b">${layer(CLOUDS[1])}</div><div class="fn-storm"></div>`;
{let cw=innerWidth,ch=innerHeight,tm;addEventListener("resize",()=>{clearTimeout(tm);tm=setTimeout(()=>{if(Math.abs(innerWidth-cw)<2&&Math.abs(innerHeight-ch)<80)return;cw=innerWidth;ch=innerHeight;
  sky.querySelectorAll(".fn-clouds").forEach((d,i)=>d.innerHTML=layer(CLOUDS[i]))},200)})}
document.body.prepend(sky);
const feed=document.createElement("div");feed.className="fn-feed";feed.setAttribute("aria-hidden","true");document.body.appendChild(feed);

const TC={e:"#4fd06b",m:"#59a8ff",h:"#ffae3d",x:"#f2c200"};
const XP={e:100,m:150,h:250,x:400};
const CROSS=c=>`<svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 0v5M8 11v5M0 8h5M11 8h5" stroke="${c}" stroke-width="2"/></svg>`;
const BOLT=`<svg width="14" height="14" viewBox="0 0 16 16"><path d="M9 0 2 9h5l-1 7 8-10H9z" fill="#c04bff"/></svg>`;
const PERSON=`<svg width="13" height="14" viewBox="0 0 13 14"><circle cx="6.5" cy="3.5" r="3" fill="#fff"/><path d="M1 14c0-4 2.5-6 5.5-6s5.5 2 5.5 6z" fill="#fff"/></svg>`;
function pushFeed(html,c){const d=document.createElement("div");d.style.setProperty("--c",c);d.innerHTML=html;feed.appendChild(d);setTimeout(()=>d.remove(),4100);while(feed.children.length>4)feed.firstChild.remove()}
function dmgNum(el,text,blue){if(R)return;const r=el.getBoundingClientRect(),d=document.createElement("div");d.className="fn-dmg"+(blue?" blue":"");d.textContent=text;
  d.style.left=(r.left+r.width*(.55+Math.random()*.3))+"px";d.style.top=(r.top+r.height/2)+"px";document.body.appendChild(d);
  d.animate([{transform:"translate(-50%,-50%) scale(.4)",opacity:0},{transform:"translate(-50%,-90%) scale(1.25)",opacity:1,offset:.25},{transform:"translate(-50%,-220%) scale(1)",opacity:0}],{duration:1100,easing:"cubic-bezier(.2,.8,.3,1)"}).onfinish=()=>d.remove()}
function hurt(){if(R)return;const v=document.createElement("div");v.className="fn-hurt";document.body.appendChild(v);setTimeout(()=>v.remove(),650);
  app.classList.remove("fn-shake");void app.offsetWidth;app.classList.add("fn-shake")}

/* ---- players-left counter in the HUD ---- */
const PLACE=(n,t)=>{const p=n/t;return p===1?1:p>=.8?2:p>=.6?7:p>=.4?19:p>0?42:77};
function alive(){if(!S||!S.qs)return 100;const k=S.marks.length,t=S.qs.length;
  if(k>=t)return PLACE(S.marks.filter(Boolean).length,t);
  return Math.max(3,Math.round(100*Math.pow(1-k/t,1.4)))}
function decorateHud(){const h=app.querySelector(".hud");if(!h||!S||!S.qs||h.querySelector(".fn-alive"))return;
  h.insertAdjacentHTML("beforeend",`<span class="fn-alive">${PERSON}<b>${alive()}</b> left</span>`)}

/* ---- skydive intro ---- */
function dropIn(then,short){
  if(R){then();return}
  window.SND&&SND.play("skydive",short);
  const o=document.createElement("div");o.className="fn-jump";o.setAttribute("role","presentation");
  let bits="";for(let i=0;i<16;i++)bits+=`<span class="streak" style="left:${Math.random()*100}%;height:${60+Math.random()*120}px;animation-duration:${.35+Math.random()*.4}s;animation-delay:-${Math.random()}s"></span>`;
  for(let i=0;i<22;i++)bits+=`<span class="jstar" style="left:${Math.random()*100}%;animation-duration:${2.2+Math.random()*2}s;animation-delay:-${Math.random()*3}s"></span>`;
  for(let i=0;i<7;i++)bits+=`<span class="puff" style="--s:${90+Math.random()*160}px;left:${Math.random()*90-10}%;animation-duration:${.9+Math.random()*.8}s;animation-delay:-${Math.random()*1.5}s"></span>`;
  o.innerHTML=bits+`<div class="fn-jump-in"><div class="fn-jump-t">Dropping in</div><div class="fn-alt"><span id="fn-alt">1,000</span><small>m</small></div><div class="fn-skip">Tap to skip</div></div>`;
  document.body.appendChild(o);
  const dur=short?950:1600,t0=performance.now(),alt=o.querySelector("#fn-alt"),title=o.querySelector(".fn-jump-t");let done=false;
  const finish=()=>{if(done)return;done=true;then();o.classList.add("out");setTimeout(()=>o.remove(),300)};
  o.onclick=finish;
  (function tick(t){if(done)return;const p=Math.min(1,(t-t0)/dur),a=Math.round(1000*(1-p)*(1-p*.15));
    alt.textContent=a.toLocaleString();if(p>.6)title.textContent="Glider out";if(p<1)requestAnimationFrame(tick);else setTimeout(finish,180)})(t0);
}

/* ---- wrap the game's functions ---- */
const _main=mainView,_home=home,_q=question,_a=answer,_r=results,_ea=endlessAnswer;
mainView=function(){_main();const go=document.getElementById("go");if(go){const orig=go.onclick;go.onclick=()=>inProgress("main",mainSet())?orig():dropIn(orig)}};
home=function(){_home();app.querySelectorAll(".diff").forEach(b=>{const t=b.dataset.t;b.onclick=()=>{
  const d=store.get(keyFor(t)),qs=todays(t);if(d&&d.ids&&d.ids.join()===qs.map(q=>q.id).join()||inProgress(t,qs))startDaily(t);else dropIn(()=>startDaily(t),true)}})};
question=function(){_q();decorateHud()};
function onAnswer(btn,ok,t,label){
  if(ok){dmgNum(btn,"+"+XP[t],t==="m");pushFeed(`<b>You</b>${CROSS(TC[t])}<span>${label}</span>`,TC[t])}
  else{hurt();pushFeed(`<b>You</b>${BOLT}<span>took storm damage</span>`,"#c04bff")}
}
answer=function(btn){const q=S.qs[S.i],ok=btn.dataset.o===q.a;_a(btn);decorateHud();onAnswer(btn,ok,q.t,`Q${S.i+1} · ${TIERS[q.t].tier}`)};
endlessAnswer=function(btn){const q=S.cur,ok=btn.dataset.o===q.a;_ea(btn);onAnswer(btn,ok,q.t,`${TIERS[q.t].tier} question`);
  if(ok&&S.streak>=3)pushFeed(`<b>${S.streak}</b><span>question streak</span>`,"#ffe14a")};
results=function(fresh){_r(fresh);
  const n=S.marks.filter(Boolean).length,t=S.qs.length,place=PLACE(n,t),title=app.querySelector(".result-title");if(!title)return;
  const xp=S.qs.reduce((a,q,k)=>a+(S.marks[k]?XP[q.t]:0),0),max=S.qs.reduce((a,q)=>a+XP[q.t],0);
  const acc=[];
  if(n===t)acc.push(["#f2c200","Victory Royale","Every answer landed"]);
  const xi=S.qs.findIndex(q=>q.t==="x");if(xi>=0&&S.marks[xi])acc.push(["#c99a00","Mythic Mind","Cracked the Impossible one"]);
  if(S.marks[0]&&n<t)acc.push(["#4fd06b","Hot Drop","Nailed the first question"]);
  if(!S.marks[0]&&S.marks[t-1]&&n<t)acc.push(["#59a8ff","Clutch","Missed early, finished strong"]);
  if(n===t-1)acc.push(["#ffae3d","So Close","One away from the win"]);
  if(n===0)acc.push(["#8a96b8","Back to the Lobby","Tomorrow's a new drop"]);
  const medal=c=>`<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 30 9.5v15L17 32 4 24.5v-15z" fill="${c}" stroke="#0d1b3d" stroke-width="2"/><path d="m17 9 2.4 5 5.4.6-4 3.7 1.1 5.3L17 21l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#fff"/></svg>`;
  const wrap=document.createElement("div");wrap.className="fn-end";
  wrap.innerHTML=`<div class="fn-place${n===t?" win":""}" aria-label="Placed number ${place}"><i>#</i><b>${place}</b></div>`;
  title.replaceWith(wrap);wrap.appendChild(title);
  wrap.insertAdjacentHTML("afterend",`<div class="fn-xp"><div class="fn-xp-top"><span>Match XP</span><b id="fn-xpn">+${fresh&&!R?0:xp.toLocaleString()}</b></div><div class="fn-bar"><span id="fn-xpb"></span></div></div>
    ${acc.length?`<div class="fn-acc">${acc.slice(0,3).map(([c,a,b])=>`<div class="fn-medal">${medal(c)}<div><b>${a}</b><span>${b}</span></div></div>`).join("")}</div>`:""}`);
  const bar=document.getElementById("fn-xpb"),num=document.getElementById("fn-xpn"),pct=max?100*xp/max:0;
  if(fresh&&!R){requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.width=pct+"%"));const t0=performance.now();
    (function tick(tt){const p=Math.min(1,(tt-t0)/1200),e=1-Math.pow(1-p,3);num.textContent="+"+Math.round(xp*e).toLocaleString();if(p<1)requestAnimationFrame(tick)})(t0)}
  else{bar.style.transition="none";bar.style.width=pct+"%"}
};
setView(view==="daily"?"main":view);
/* >>> day-night cycle */
/* ===== Real-time sky: dawn, day, dusk and night follow the player's own clock =====
   Sunrise and sunset are estimated from the date (for about 40° N, close for most of the US and Europe), so there is
   no location prompt. The sky colours blend smoothly between four looks, and the stars, moon, sun and clouds follow. */
const SKY=(()=>{
  const PAL={"night": ["#060b26", "#0f1d55", "#24397f", "#2a4185", "#243a7b"], "dawn": ["#33378f", "#c8679a", "#ffb071", "#9c6f9c", "#a678a0"], "day": ["#0f4fc4", "#2f86f0", "#a8d8ff", "#5a92bd", "#669cc4"], "dusk": ["#27266f", "#c0507a", "#ff9452", "#8c5786", "#965e8a"]};
  const doy=d=>Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  function sunTimes(d){
    const lat=40*Math.PI/180,decl=23.44*Math.PI/180*Math.sin(2*Math.PI*(284+doy(d))/365);
    const c=(Math.sin(-0.833*Math.PI/180)-Math.sin(lat)*Math.sin(decl))/(Math.cos(lat)*Math.cos(decl));
    const half=Math.acos(Math.max(-1,Math.min(1,c)))*12/Math.PI;
    const y=d.getFullYear(),std=Math.max(new Date(y,0,1).getTimezoneOffset(),new Date(y,6,1).getTimezoneOffset());
    const noon=12.2+(d.getTimezoneOffset()<std?1:0);          // solar noon on the clock, with daylight saving
    return {rise:noon-half,set:noon+half};
  }
  const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mix=(a,b,t)=>{const A=hex(a),B=hex(b);return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")};
  const ease=t=>t*t*(3-2*t);
  // keyframes through the day: [hour, look, nightness, warmth]
  function frames(rise,set){return [[rise-1.3,"night",1,0],[rise-.35,"dawn",.55,1],[rise+.9,"day",0,0],[set-.9,"day",0,0],[set+.35,"dusk",.55,1],[set+1.3,"night",1,0]]}
  let forced=null,last=null;
  function state(d){
    const now=d||new Date(),{rise,set}=sunTimes(now);let h=forced!=null?forced:now.getHours()+now.getMinutes()/60;
    const F=frames(rise,set);let a,b,t;
    if(h<F[0][0]||h>=F[F.length-1][0]){a=b=F[0];t=0}
    else for(let i=0;i<F.length-1;i++)if(h>=F[i][0]&&h<F[i+1][0]){a=F[i];b=F[i+1];t=ease((h-a[0])/(b[0]-a[0]));break}
    const pa=PAL[a[1]],pb=PAL[b[1]];
    return {top:mix(pa[0],pb[0],t),mid:mix(pa[1],pb[1],t),bot:mix(pa[2],pb[2],t),isle:pa[3]?mix(pa[3],pb[3],t):null,isle2:pa[4]?mix(pa[4],pb[4],t):null,night:a[2]+(b[2]-a[2])*t,warm:a[3]+(b[3]-a[3])*t,hour:h,rise,set,
      phase:(a[1]===b[1]?a[1]:(t<.5?a[1]:b[1]))};
  }
  function paint(){
    const s=state(),r=document.documentElement.style;last=s;
    r.setProperty("--sky-top",s.top);r.setProperty("--sky-mid",s.mid);r.setProperty("--sky-bot",s.bot);if(s.isle){r.setProperty("--isle",s.isle);r.setProperty("--isle2",s.isle2)}
    // the sun crosses the sky from sunrise to sunset; the moon crosses it overnight (left = east, right = west)
    const arc=(p)=>({x:6+88*p,y:42-36*Math.sin(Math.PI*p)});   // one smooth arc that carries on below the horizon
    const dayLen=s.set-s.rise,ps=(s.hour-s.rise)/dayLen,pm=(((s.hour-s.set)%24)+24)%24/(24-dayLen);
    const sun=arc(Math.min(1.35,Math.max(-.35,ps))),moon=arc(pm>1.5?Math.max(-.35,pm-(24/(24-dayLen))):Math.min(1.35,pm));
    r.setProperty("--sun-x",sun.x.toFixed(2)+"vw");r.setProperty("--sun-y",sun.y.toFixed(2)+"vh");
    r.setProperty("--moon-x",moon.x.toFixed(2)+"vw");r.setProperty("--moon-y",moon.y.toFixed(2)+"vh");
    r.setProperty("--night",s.night.toFixed(3));r.setProperty("--day",(1-s.night).toFixed(3));r.setProperty("--warm",s.warm.toFixed(3));
    const tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.content=s.top;
    document.documentElement.dataset.sky=s.phase;
  }
  paint();setInterval(()=>{if(forced==null)paint()},60000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&forced==null)paint()});
  return {now:()=>last||state(),isNight:()=>(last||state()).night>.5,set:h=>{forced=h;paint()},live:()=>{forced=null;paint()},sunTimes};
})();
window.SKY=SKY;

/* Drop-In's sky decorations for the day/night cycle: stars, tonight's real moon, a sun glow and a warm dawn/dusk glow */
{const css=document.createElement("style");css.textContent=`
html{background:var(--sky-top) linear-gradient(180deg,var(--sky-top) 0%,var(--sky-mid) 52%,var(--sky-bot) 100%) fixed!important}
.fn-sky::before{opacity:calc(var(--day) + var(--warm)*.5);background:repeating-conic-gradient(from 0deg at var(--sun-x,50vw) var(--sun-y,0vh),rgba(255,255,255,.07) 0 6deg,transparent 6deg 14deg)!important}
.fn-glow{position:absolute;left:-20%;right:-20%;bottom:-10%;height:75%;background:radial-gradient(ellipse at 50% 100%,rgba(255,170,90,.55),rgba(255,120,140,.25) 45%,transparent 70%);opacity:var(--warm)}
.fn-sun{position:absolute;left:var(--sun-x,50vw);top:var(--sun-y,0vh);width:280px;height:280px;margin:-140px 0 0 -140px;border-radius:50%;background:radial-gradient(circle,rgba(255,250,220,.9) 0 18%,rgba(255,240,180,.35) 32%,transparent 66%);opacity:calc((var(--day) - .3)*1.3)}
.fn-stars{position:absolute;inset:0;opacity:var(--night)}
.fn-stars i{position:absolute;inset:0;background-image:radial-gradient(2px 2px at 8% 14%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 22% 38%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 41% 9%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 63% 27%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 79% 12%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 91% 41%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 33% 58%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 56% 49%,#fff 50%,transparent 51%);background-size:460px 460px;animation:fnTwinkle 3s ease-in-out infinite}
.fn-stars i+i{background-size:330px 330px;background-position:90px 60px;opacity:.7;animation-delay:-1.5s}
@keyframes fnTwinkle{50%{opacity:.4}}
.fn-moon{position:absolute;left:var(--moon-x,82vw);top:var(--moon-y,7vh);margin:-37px 0 0 -37px;width:74px;height:74px;opacity:calc((var(--night) - .45)*2.2);filter:drop-shadow(0 0 14px rgba(255,246,210,.35)) drop-shadow(0 0 36px rgba(200,220,255,.2))}
.fn-moon svg{width:100%;height:100%;display:block}
.fn-clouds{filter:brightness(calc(1 - var(--night)*.5)) saturate(calc(1 - var(--night)*.4)) sepia(calc(var(--warm)*.4))}
.fn-isle{position:absolute;left:0;right:0;bottom:15vh;height:16vh;min-height:70px}
.fn-isle svg{width:100%;height:100%;display:block}
.fn-isle .far{fill:var(--isle,#6fa7c9)}.fn-isle .near{fill:var(--isle2,#4f8f8a)}
.fn-isle .shore{fill:none;stroke:rgba(255,255,255,calc(.35 - var(--night)*.2));stroke-width:2}
.fn-isle .lights{opacity:calc((var(--night) - .3)*1.5)}
@media (max-width:600px){.fn-isle{height:15vh;bottom:19vh}}
@media (prefers-reduced-motion:reduce){.fn-stars i{animation:none}}`;document.head.appendChild(css);
 const add=(cls,html="")=>{const el=document.createElement("div");el.className=cls;el.innerHTML=html;return el};
 sky.prepend(add("fn-stars","<i></i><i></i>"),add("fn-moon"),add("fn-sun"),add("fn-glow"));
 const syn=29.530588853,ref=Date.UTC(2000,0,6,18,14)/864e5,p=((((Date.now()/864e5-ref)%syn)+syn)%syn)/syn;
 const k=Math.cos(2*Math.PI*p),rx=(40*Math.abs(k)).toFixed(2),wax=p<.5;
 const lit=`M50 10A40 40 0 0 ${wax?1:0} 50 90A${rx} 40 0 0 ${wax?(k>0?0:1):(k>0?1:0)} 50 10Z`;
 const CR=[[38,36,6],[62,30,3.5],[60,60,7],[34,63,4]];
 const surf=(f,o)=>CR.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" opacity="${o}"/>`).join("");
 sky.querySelector(".fn-moon").innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="fnml" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#e9eefc"/><stop offset="1" stop-color="#c9d3ef"/></radialGradient><clipPath id="fnmc"><path d="${lit}"/></clipPath></defs>
  <circle cx="50" cy="50" r="40" fill="#1a2a66"/>${surf("#14215a",.9)}<path d="${lit}" fill="url(#fnml)"/><g clip-path="url(#fnmc)">${surf("#b8c3e6",.8)}</g></svg>`
 /* one made-up island far off on the horizon: a big mountain toward the right, smaller peaks and hills stepping down to the left,
    tapering into the sea at both ends. It takes on the sky's colours and shows a few lights after dark. */
 {const land="M150 120C190 119 225 116 260 113C290 110 310 106 335 105C365 104 385 108 410 107C440 106 460 100 490 98C520 96 540 101 570 100C600 99 625 93 655 91C685 89 705 94 735 92C762 90 780 84 805 80L830 76L852 81C872 85 892 86 915 83C940 80 960 72 985 66L1012 58L1036 65C1052 70 1070 72 1090 68C1115 63 1140 54 1170 44L1210 30L1240 20L1262 15L1286 22L1316 34C1340 46 1360 60 1385 74C1410 88 1440 100 1470 108C1500 115 1530 118 1560 120Z";
  const shore="M150 120C190 119 225 116 260 113M1470 108C1500 115 1530 118 1560 120";
  const lights=[[372,104],[520,97],[700,89],[905,82],[1060,68],[1190,40],[1262,17],[1350,58],[1440,96]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3.5" height="3.5" rx="1" fill="#ffd979"/>`).join("");
  const isle=document.createElement("div");isle.className="fn-isle";
  isle.innerHTML=`<svg preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path class="far" d="${land}"/><path class="shore" d="${shore}"/><g class="lights">${lights}</g></svg>`;
  const svg=isle.firstChild,fit=()=>svg.setAttribute("viewBox",innerWidth<600?"620 0 980 122":"80 0 1520 122");  // phones zoom in on the mountain end
  fit();addEventListener("resize",fit);
  sky.querySelector(".fn-storm").before(isle)}}

/* <<< day-night cycle */
}
