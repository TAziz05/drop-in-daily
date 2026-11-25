const DATA=window.__G.data;
const Q=DATA.questions, SEASONS=DATA.seasons, SBY=Object.fromEntries(SEASONS.map(s=>[s.id,s]));
const TIERS={e:{label:"Easy",tier:"Uncommon",who:"For the every-now-and-then player",key:"easy"},
 m:{label:"Medium",tier:"Rare",who:"For the weekly squad regular",key:"medium"},
 h:{label:"Hard",tier:"Legendary",who:"For the every-day player",key:"hard"},
 x:{label:"Impossible",tier:"Mythic",who:"For the ones who read the wiki for fun",key:"mythic"}};
const PER_DAY=5, CHAPTERS=[...new Set(SEASONS.map(s=>s.ch))];

const now=window.__NOW||new Date();
const dayKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
// Day 0 is launch day (Oct 13, 2026); every later day picks up where the last one stopped.
const dayNum=Math.abs(Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(2026,9,13))/864e5));
document.getElementById("date").textContent=now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});

function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,r=Math.random){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const withOpts=(x,r)=>({...x,opts:shuffle([x.a,...x.w],r)});
// Each tier has one rotation shared by By Difficulty and the Daily Drop. Through Oct 14, 2026
// a day used 5 slots; from Oct 15 each day uses 5 for By Difficulty, then the Daily Drop's share.
const MAIN_MIX={e:1,m:1,h:2,x:1};
const slotStart=(t,d)=>d<=1?d*PER_DAY:2*PER_DAY+(d-2)*(PER_DAY+MAIN_MIX[t]);
// Days that were already live when this version was published keep the exact questions they had.
const PINNED=window.__G.pin;
const pinFor=dn=>PINNED[new Date(Date.UTC(2026,9,13)+dn*864e5).toISOString().slice(0,10)];
// Planned days: question ids chosen at build time so nothing repeats until the bank runs out.
const SCHED=window.__G.sched;
const QBYID=Object.fromEntries(Q.map(q=>[q.id,q]));
const schedFor=dn=>SCHED[new Date(Date.UTC(2026,9,13)+dn*864e5).toISOString().slice(0,10)];
const fromIds=(ids,r)=>{const qs=ids.map(i=>QBYID[i]);return qs.every(Boolean)?qs.map(q=>withOpts(q,r)):null};
function todays(t,per=PER_DAY,salt={e:11,m:23,h:37,x:53}[t],start=slotStart(t,dayNum),dn=dayNum){
  {const p=pinFor(dn);if(p&&p[t]&&per===PER_DAY&&start===slotStart(t,dn))return p[t];}
  {const sc=schedFor(dn);if(sc&&sc[t]&&per===PER_DAY&&start===slotStart(t,dn)){const r=fromIds(sc[t],rng(dn*131+salt));if(r)return r;}}
  const pool=Q.filter(q=>q.t===t).sort((a,b)=>a.id<b.id?-1:1), L=pool.length, cache=[];
  // Each pass reshuffles within thirds of the previous pass's order, so a question
  // played late in one pass comes back late in the next (always days apart).
  const perm=c=>{for(let k=cache.length;k<=c;k++){
      if(k===0){cache.push(shuffle(pool.map((_,i)=>i),rng(salt)));continue}
      const prev=cache[k-1],r=rng(k*97+salt),cut=[0,Math.round(L/3),Math.round(2*L/3),L];
      cache.push([0,1,2].flatMap(s=>shuffle(prev.slice(cut[s],cut[s+1]),r)))}
    return cache[c]};
  const ids=[];for(let n=start;n<start+per;n++)ids.push(perm(Math.floor(n/L))[n%L]);
  const r=rng(dn*131+salt);
  return ids.map(i=>withOpts(pool[i],r));
}
// Daily Drop: 1 Easy, 1 Medium, 2 Hard, 1 Impossible, taken from the same rotation right after
// that day's By Difficulty set, so the two never overlap or repeat each other.
function mainSet(dn=dayNum){
  {const p=pinFor(dn);if(p&&p.main)return p.main;}
  {const sc=schedFor(dn);if(sc&&sc.main){const r=fromIds(sc.main,rng(dn*131+7));if(r)return r;}}
  const out=[];
  for(const t of Object.keys(MAIN_MIX)){
    const k=MAIN_MIX[t];
    if(dn>=2){out.push(...todays(t,k,undefined,slotStart(t,dn)+PER_DAY,dn));continue}
    // Launch days only: separate rotation, skipping that day's By Difficulty questions.
    const taken=new Set(todays(t,PER_DAY,undefined,slotStart(t,dn),dn).map(q=>q.id));
    const picks=todays(t,k+PER_DAY,{e:71,m:83,h:97,x:109}[t],dn*(k+PER_DAY),dn).filter(q=>!taken.has(q.id)).slice(0,k);
    out.push(...picks);
  }
  return out;
}
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const keyFor=t=>`dropin3:${dayKey}:${t}`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const eraLabel=id=>{const s=SBY[id];if(!s)return"";return s.ch==="Fortnite OG"?"Fortnite OG":`${s.ch} · ${s.name} · ${s.sub}`};
const srcLink=(u,cls,txt)=>/^https?:/.test(u)?`<a${cls?` class="${cls}"`:""} href="${u}" target="_blank" rel="noopener">${esc(txt||srcLabel(u))}</a>`:`<span${cls?` class="${cls}"`:""}>${esc(u)}</span>`;
const srcLabel=u=>u.includes("fortnite.gg")?"Fortnite.GG – "+u.replace(/^https:\/\/fortnite\.gg\//,"").replace(/\//g," "):(u.includes("wikipedia")?"Wikipedia":"Fortnite Wiki")+" – "+decodeURIComponent(u.split("/").pop()).replace(/_/g," ");
// Hide the season label when it would give the answer away: the answer is itself a season or
// chapter, or the answer shares a word with the label that none of the wrong options share.
const STOPW=new Set("the a an of and in on to for with at by from is was this season chapter".split(" "));
const wordsOf=x=>String(x).toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>2&&!STOPW.has(w));
function tagLeaks(q){const s=SBY[q.era];if(!s)return false;
  if(/\b(Season|Chapter)\b/.test(q.a))return true;
  const lab=wordsOf(s.ch+" "+s.name+" "+s.sub),ov=wordsOf(q.a).filter(w=>lab.includes(w));
  return ov.length>0&&!q.w.some(w=>wordsOf(w).some(x=>ov.includes(x)));}
// The season label to show above a question: the full label, or just "Chapter X · Season Y" when the
// season's name would give the answer away, or nothing when even that would.
function shownLabel(q){const s=SBY[q.era];if(!s)return"";
  if(!tagLeaks(q))return eraLabel(q.era);
  if(/\b(Season|Chapter)\b/.test(q.a)||s.ch==="Fortnite OG")return"";
  const short=`${s.ch} · ${s.name}`,ov=wordsOf(q.a).filter(w=>wordsOf(short).includes(w));
  return ov.length&&!q.w.some(w=>wordsOf(w).some(x=>ov.includes(x)))?"":short}
const chip=t=>`<span class="chip c-${t}">${TIERS[t].tier} · ${TIERS[t].label}</span>`;

const app=document.getElementById("app");
const PIN=`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#e2453c"/></svg>`;
let S=null, view="daily";

/* ---------- tabs ---------- */
function setView(v){view=v;S=null;document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===v)));
  ({main:mainView,daily:home,seasons:seasonsView,where:whereView,endless:endlessView,bank:bankView})[v]();window.scrollTo({top:0})}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setView(b.dataset.v));

/* ---------- daily drop ---------- */
function mainView(){
  const qs=mainSet(), done=store.get(keyFor("main"));
  if(done&&done.ids&&done.ids.join()===qs.map(q=>q.id).join()){S={mode:"main",title:"Daily Drop",qs,i:0,marks:done.marks};return results()}
  app.innerHTML=`<h2>Today's Daily Drop</h2><p class="muted">Five questions that climb in rarity, one shot each. Everyone gets the same set, and it resets at midnight your time.</p>
   <div class="ladder">${qs.map(q=>chip(q.t)).join("")}</div>
   <div class="row" style="margin-top:16px"><button class="btn" id="go">Drop in</button></div>
   <p class="muted" style="margin-top:14px;font-size:14px">Want more? Each difficulty has its own five-question daily under By Difficulty.</p>`;
  const part=store.get(partKey("main"));if(part&&part.ids&&part.ids.join()===qs.map(q=>q.id).join()&&part.marks&&part.marks.length)document.getElementById("go").textContent=`Continue (Q${Math.min(part.marks.length+1,qs.length)})`;
  document.getElementById("go").onclick=()=>{S={mode:"main",title:"Daily Drop",qs,i:0,marks:[]};resumeAt("main")};
}
/* ---------- daily by difficulty ---------- */
function home(){
  app.innerHTML=`<h2>Pick your drop</h2><p class="muted">Five questions a day per difficulty, one shot each. New questions at midnight your time.</p>
  <div class="diffs">${Object.keys(TIERS).map(t=>{const m=TIERS[t],done=store.get(keyFor(t));
   return `<button class="diff d-${t}" id="pick-${t}" data-t="${t}"><span class="tier">${m.tier}</span><span class="lvl">${m.label}</span><span class="who">${m.who}</span><span class="who">${Q.filter(q=>q.t===t).length} questions in rotation</span>${done?`<span class="done">Played today · ${done.marks.filter(Boolean).length}/${PER_DAY}</span>`:""}</button>`}).join("")}</div>`;
  app.insertAdjacentHTML("beforeend",shareAllBlock());wireShareAll();
  app.querySelectorAll(".diff").forEach(b=>b.onclick=()=>startDaily(b.dataset.t));
}
function startDaily(t){
  const done=store.get(keyFor(t));
  S={mode:"daily",t,qs:todays(t),i:0,marks:[]};
  if(done&&done.ids&&done.ids.join()===S.qs.map(q=>q.id).join()){S.marks=done.marks;return results()}
  resumeAt(t);
}
// Daily sets save after every answer, so leaving partway and coming back picks up at the next question: no do-overs.
const partKey=k=>keyFor(k)+":p";
// True when today's set for k was started and left partway (so it picks up again instead of starting over).
function inProgress(k,qs){const p=store.get(partKey(k)),d=store.get(keyFor(k)),ids=qs.map(q=>q.id).join();return !(d&&d.ids&&d.ids.join()===ids)&&!!(p&&p.ids&&p.ids.join()===ids&&p.marks&&p.marks.length)}
function resumeAt(k){const p=store.get(partKey(k)),ids=S.qs.map(x=>x.id);
  if(p&&p.ids&&p.ids.join()===ids.join()&&Array.isArray(p.marks)){S.marks=p.marks.slice(0,S.qs.length);S.i=Math.min(S.marks.length,S.qs.length-1)}
  if(S.marks.length>=S.qs.length){if(S.mode==="daily")store.set(keyFor(S.t),{marks:S.marks,ids});if(S.mode==="main"){store.set(keyFor("main"),{marks:S.marks,ids});if(window.dropinDone)try{window.dropinDone(S.marks,ids)}catch(e){}}return results(true)}
  question()}
/* ---------- shared play loop ---------- */
function hud(){const label=S.mode==="daily"?chip(S.t):`<span class="chip c-m">${esc(S.title)}</span>`;
  return `<div class="hud">${label}<div class="pips" aria-label="Question ${S.i+1} of ${S.qs.length}">${S.qs.map((_,k)=>`<span class="pip ${k<S.marks.length?(S.marks[k]?"ok":"no"):k===S.i?"cur":""}"></span>`).join("")}</div></div>`}
function question(){
  const q=S.qs[S.i];
  app.innerHTML=hud()+(q.era&&shownLabel(q)?`<span class="era">${esc(shownLabel(q))}</span>`:"")+
   (S.mode!=="daily"?`<div>${chip(q.t)}</div>`:"")+
   (q.clue?`<span class="clue-head">${PIN}Where am I?</span><p class="clue">${esc(q.q)}</p>`:`<p class="q">${esc(q.q)}</p>`)+`<div class="opts">${q.opts.map((o,k)=>`<button class="opt" id="opt-${k}" data-o="${esc(o)}"><span class="k">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="after"></div>`;
  app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answer(b));
}
function answer(btn){
  const q=S.qs[S.i], ok=btn.dataset.o===q.a;S.marks.push(ok);
  if(S.mode==="main"||S.mode==="daily")store.set(partKey(S.mode==="main"?"main":S.t),{ids:S.qs.map(x=>x.id),marks:S.marks});
  app.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.o===q.a)b.classList.add("right");else if(b===btn)b.classList.add("wrong");else b.classList.add("dim")});
  app.querySelector(".hud").outerHTML=hud();
  const last=S.i===S.qs.length-1;
  document.getElementById("after").innerHTML=`<div class="explain" style="border-color:${ok?"var(--right)":"var(--wrong)"}">
    <span class="verdict" style="color:${ok?"var(--right)":"var(--wrong)"}">${ok?"Hit!":"Missed."}</span>
    <p>${esc(q.e)}</p><span class="src">${esc(q.id)} · Source: ${srcLink(q.s)}</span></div>
    <div class="row" style="margin-top:12px"><button class="btn" id="next">${last?"See results":"Next question"}</button></div>`;
  const nb=document.getElementById("next");
  nb.onclick=()=>{if(last){if(S.mode==="daily")store.set(keyFor(S.t),{marks:S.marks,ids:S.qs.map(x=>x.id)});if(S.mode==="main")store.set(keyFor("main"),{marks:S.marks,ids:S.qs.map(x=>x.id)});if(S.mode==="main"&&window.dropinDone)try{window.dropinDone(S.marks,S.qs.map(x=>x.id))}catch(e){}results(true)}else{S.i++;question()}};
  nb.focus();
}
function rank(n,total){const p=n/total;return p===1?"Victory Royale!":p>=.8?"Top 2":p>=.6?"Top 10":p>=.4?"Top 25":p>0?"Landed hot":"Eliminated"}
// Everything played today, in order: Daily Drop, then Easy, Medium, Hard, Impossible.
function shareAllText(){
  const rows=[["main","Daily Drop"],...Object.keys(TIERS).map(t=>[t,`${TIERS[t].label} (${TIERS[t].tier})`])]
    .map(([k,label])=>{const d=store.get(keyFor(k));if(!d||!d.marks)return null;
      return {label,n:d.marks.filter(Boolean).length,total:d.marks.length,grid:d.marks.map(x=>x?"🟩":"🟥").join("")}}).filter(Boolean);
  if(rows.length<2)return null;
  const n=rows.reduce((a,r)=>a+r.n,0),t=rows.reduce((a,r)=>a+r.total,0);
  return `Drop-In Daily ${dayKey}\n`+rows.map(r=>`${r.label} ${r.n}/${r.total}\n${r.grid}`).join("\n")+`\nTotal ${n}/${t}`;
}
function copyText(text,toastId,fallbackEl){const t=document.getElementById(toastId);
  navigator.clipboard.writeText(text).then(()=>t.textContent="Copied").catch(()=>{if(fallbackEl){const r=document.createRange();r.selectNodeContents(fallbackEl);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);t.textContent="Selected; press Ctrl/Cmd+C"}else t.textContent="Couldn't copy"})}
function shareAllBlock(){const txt=shareAllText();if(!txt)return "";
  const played=(txt.split("\n").length-2)/2===5;
  return `<div class="shareall"><p class="sa-title">${played?"All five done today!":"Share everything you've played today"}</p><pre class="share" id="share-all">${esc(txt)}</pre>
   <div class="row"><button class="btn" id="copy-all">Share all results</button><span class="toast" id="toast-all"></span></div></div>`}
function wireShareAll(){const b=document.getElementById("copy-all");if(b)b.onclick=()=>copyText(shareAllText(),"toast-all",document.getElementById("share-all"))}

// ---- Celebrations: confetti for any perfect set, a Victory Royale for 25/25 across all of today's sets ----
const REDUCED=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function confetti(ms=2600,count=170){
  if(REDUCED)return;
  const c=document.createElement("canvas");c.className="confetti";document.body.appendChild(c);
  const x=c.getContext("2d"),dpr=Math.min(1.5,window.devicePixelRatio||1);
  if(innerWidth<700)count=Math.round(count*.6);
  const size=()=>{c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0)};size();addEventListener("resize",size);
  const cols=["#ffd53d","#3d8bff","#b36bff","#ff5fa2","#4fd06b","#ffffff","#ff8a3d"];
  const P=Array.from({length:count},()=>({x:innerWidth*(.2+Math.random()*.6),y:innerHeight*.35+Math.random()*40,
    vx:(Math.random()-.5)*11,vy:-(7+Math.random()*9),w:6+Math.random()*7,h:9+Math.random()*9,r:Math.random()*6,vr:(Math.random()-.5)*.35,
    c:cols[Math.random()*cols.length|0],round:Math.random()<.25}));
  const t0=performance.now();
  (function frame(t){let el=t-t0;x.clearRect(0,0,innerWidth,innerHeight);
    x.globalAlpha=Math.max(0,1-Math.max(0,el-ms+700)/700);let live=0;
    for(const p of P){if(p.y>innerHeight+40)continue;live++;p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
      const co=Math.cos(p.r),si=Math.sin(p.r);x.setTransform(dpr*co,dpr*si,-dpr*si,dpr*co,dpr*p.x,dpr*p.y);x.fillStyle=p.c;
      if(p.round)x.fillRect(-p.w/3,-p.w/3,p.w/1.5,p.w/1.5);else x.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2)))}
    x.setTransform(dpr,0,0,dpr,0,0);if(!live)el=ms;
    if(el<ms)requestAnimationFrame(frame);else{removeEventListener("resize",size);c.remove()}})(t0);
}
const allPerfectToday=()=>["main","e","m","h","x"].every(k=>{const d=store.get(keyFor(k));return d&&d.marks&&d.marks.length&&d.marks.every(Boolean)});
function victory(){
  const o=document.createElement("div");o.className="vr";o.setAttribute("role","dialog");o.setAttribute("aria-label","Victory Royale");o.tabIndex=-1;
  o.innerHTML=`<div class="vr-in"><div class="vr-num">#1</div><div class="vr-title">Victory Royale</div>
    <p class="vr-sub">25/25 · Every Drop-In Daily set perfect today</p><button class="btn" id="vr-ok">Continue</button></div>`;
  document.body.appendChild(o);o.focus();
  const close=()=>{o.classList.add("out");setTimeout(()=>o.remove(),250);removeEventListener("keydown",esc_)};
  const esc_=e=>{if(e.key==="Escape")close()};addEventListener("keydown",esc_);
  o.onclick=e=>{if(e.target===o||e.target.id==="vr-ok")close()};
  confetti(4200,260);setTimeout(()=>confetti(3200,180),900);
}
function celebrate(dailyish){
  if(dailyish&&allPerfectToday())return victory();
  confetti();
}
function results(fresh){
  const n=S.marks.filter(Boolean).length,total=S.qs.length,grid=S.marks.map(x=>x?"🟩":"🟥").join("");
  const title=S.mode==="daily"?`${TIERS[S.t].label} (${TIERS[S.t].tier})`:S.title;
  const share=`Drop-In Daily ${dayKey}\n${title} ${n}/${total}\n${grid}`;
  app.innerHTML=`<div class="hud">${S.mode==="daily"?chip(S.t):`<span class="chip c-m">${esc(S.title)}</span>`}<span class="score">${n}/${total}</span></div>
   <p class="result-title" style="color:${n===total?"var(--mythic)":"var(--ink)"}">${rank(n,total)}</p>
   <ul class="recap">${S.qs.map((q,k)=>`<li><span class="m ${S.marks[k]?"ok":"no"}">${S.marks[k]?"✓":"✗"}</span><span>${esc(q.q)} <strong>${esc(q.a)}</strong> · ${srcLink(q.s,"src","source")}</span></li>`).join("")}</ul>
   <pre class="share" id="share">${esc(share)}</pre>
   <div class="row"><button class="btn" id="copy">Copy result</button>${S.mode!=="daily"&&S.mode!=="main"?`<button class="btn ghost" id="again">${S.mode==="where"?"Play 10 more":"Play this set again"}</button>`:""}<button class="btn ghost" id="back">${S.mode==="main"?"Play by difficulty":S.mode==="daily"?"Try another difficulty":S.mode==="where"?"Back to Where Am I?":"Pick another season"}</button><span class="toast" id="toast"></span></div>${S.mode==="daily"||S.mode==="main"?shareAllBlock():""}`;
  wireShareAll();
  document.getElementById("back").onclick=()=>setView(S.mode==="main"||S.mode==="daily"?"daily":S.mode==="where"?"where":"seasons");
  const again=document.getElementById("again");if(again)again.onclick=()=>S.mode==="where"?startWhere(S.size):startSeason(S.filter,S.size);
  if(fresh&&total>0&&n===total)celebrate(S.mode==="main"||S.mode==="daily");
  document.getElementById("copy").onclick=()=>{const t=document.getElementById("toast");
    navigator.clipboard.writeText(share).then(()=>t.textContent="Copied").catch(()=>{const r=document.createRange();r.selectNodeContents(document.getElementById("share"));const s=getSelection();s.removeAllRanges();s.addRange(r);t.textContent="Selected; press Ctrl/Cmd+C"})};
}

/* ---------- chapters & seasons ---------- */
let pick={ch:"Chapter 1",s:"C1S1"};
try{const p=JSON.parse(localStorage.getItem("dropin:pick"));if(p&&p.ch)pick=p}catch(e){}
const inSet=(q,f)=>f.s!=="all"?q.era===f.s:(f.ch==="all"?!!q.era:!!q.era&&SBY[q.era].ch===f.ch);
function seasonOptions(ch,sel,allLabel){const list=SEASONS.filter(s=>ch==="all"||s.ch===ch);
  return `<option value="all"${sel==="all"?" selected":""}>${allLabel}</option>`+list.map(s=>`<option value="${s.id}"${s.id===sel?" selected":""}>${esc(s.ch==="Fortnite OG"?"OG mode":(ch==="all"?s.ch+" · ":"")+s.name+" – "+s.sub)}</option>`).join("")}
function chapterOptions(sel,allLabel){return `<option value="all"${sel==="all"?" selected":""}>${allLabel}</option>`+CHAPTERS.map(c=>`<option${c===sel?" selected":""}>${esc(c)}</option>`).join("")}
const allLbl=c=>c==="all"?"Every season":c==="Game Modes"?"Every mode":c==="Events & Gameplay"?"Every event":c==="Loot & Lore"?"Every topic":"Every season in this chapter";
function seasonsView(){
  app.innerHTML=`<h2>Chapters &amp; Seasons</h2><p class="muted">Pick a chapter and season, or a game mode like Save the World or LEGO Fortnite, to play its questions. These questions also turn up in the Daily game.</p>
  <div class="row"><div class="field"><label for="ch-sel">Chapter</label><select id="ch-sel">${chapterOptions(pick.ch,"All chapters")}</select></div>
  <div class="field"><label for="s-sel">Season</label><select id="s-sel">${seasonOptions(pick.ch,pick.s,allLbl(pick.ch))}</select></div></div>
  <div id="s-info"></div>`;
  const ch=document.getElementById("ch-sel"),ss=document.getElementById("s-sel");
  ch.onchange=()=>{pick={ch:ch.value,s:"all"};ss.innerHTML=seasonOptions(pick.ch,"all",allLbl(pick.ch));info()};
  ss.onchange=()=>{pick.s=ss.value;info()};
  info();
}
function info(){
  try{localStorage.setItem("dropin:pick",JSON.stringify(pick))}catch(e){}
  const set=Q.filter(q=>inSet(q,pick)),s=SBY[pick.s];
  const counts=Object.keys(TIERS).map(t=>{const n=set.filter(q=>q.t===t).length;return n?`<span class="chip c-${t}">${n} ${TIERS[t].label}</span>`:""}).join("");
  document.getElementById("s-info").innerHTML=`<div class="season-card">
   ${s?`<span class="era">${esc(s.ch==="Fortnite OG"?"Fortnite OG":s.ch+" · "+s.name)}</span><span class="sub">${esc(s.sub)}</span><span class="src"><a href="${s.url}" target="_blank" rel="noopener">${s.ch==="Events & Gameplay"?"Event":s.ch==="Loot & Lore"?"Topic":s.ch==="Game Modes"?"Mode":"Season"} page on the Fortnite Wiki</a></span>`
     :`<span class="sub">${esc(pick.ch==="all"?"Every chapter":pick.ch)}</span>`}
   <span class="muted">${set.length} questions</span><div class="counts">${counts}</div></div>
   <div class="row"><button class="btn" id="play10"${set.length?"":" disabled"}>Play ${Math.min(10,set.length)}</button>${set.length>10&&set.length<=40?`<button class="btn ghost" id="playall">Play all ${set.length}</button>`:""}</div>`;
  document.getElementById("play10").onclick=()=>startSeason({...pick},10);
  const pa=document.getElementById("playall");if(pa)pa.onclick=()=>startSeason({...pick},set.length);
}
function startSeason(f,size){
  const s=SBY[f.s],set=Q.filter(q=>inSet(q,f));
  const title=s?(s.ch==="Fortnite OG"?"Fortnite OG":`${s.ch.replace("Chapter ","Ch ")} ${s.name}`):(f.ch==="all"?"All seasons":f.ch);
  S={mode:"season",filter:f,size,title,qs:shuffle(set).slice(0,size).map(q=>withOpts(q)),i:0,marks:[]};
  question();
}

/* ---------- where am I? ---------- */
const LOCQ=Q.filter(q=>q.kind==="loc");
function whereView(){
  const clues=LOCQ.filter(q=>q.clue).length;
  app.innerHTML=`<span class="clue-head">${PIN}Where am I?</span>
  <p class="muted">Each round gives you clues written by a named location, from the original 2017 map to the Chapter 7 island. Name the place, or say when it first showed up. These also turn up in the Daily game.</p>
  <div class="season-card"><span class="sub">${clues} location and landmark clues</span><span class="muted">Plus ${LOCQ.length-clues} trivia questions about places, like when they arrived or what replaced them</span>
  <div class="counts">${Object.keys(TIERS).map(t=>{const n=LOCQ.filter(q=>q.t===t).length;return n?`<span class="chip c-${t}">${n} ${TIERS[t].label}</span>`:""}).join("")}</div></div>
  <div class="row"><button class="btn" id="where10">Play 10</button></div>`;
  document.getElementById("where10").onclick=()=>startWhere(10);
}
/* ---------- endless ---------- */
const EKEY="dropin:endless";
const eStats=()=>Object.assign({best:0,right:0,total:0},store.get(EKEY)||{});
let eTier="all";
function endlessView(){
  const st=eStats();
  app.innerHTML=`<h2>Endless</h2><p class="muted">Questions keep coming until you stop. Build a streak; one miss resets it. Nothing repeats until you've seen every question in your pick.</p>
   <div class="estats"><div class="estat"><span>Best streak</span><b>${st.best}</b></div><div class="estat"><span>All-time</span><b>${st.right}/${st.total}</b></div><div class="estat"><span>Accuracy</span><b>${st.total?Math.round(100*st.right/st.total)+"%":"–"}</b></div></div>
   <div class="field"><label for="e-tier">Difficulty</label><select id="e-tier"><option value="all">Mixed (every difficulty)</option>${Object.keys(TIERS).map(t=>`<option value="${t}"${eTier===t?" selected":""}>${TIERS[t].label} (${TIERS[t].tier})</option>`).join("")}</select></div>
   <div class="row" style="margin-top:14px"><button class="btn" id="e-go">Start</button>${st.total?`<button class="btn ghost" id="e-reset">Reset stats</button>`:""}</div>`;
  const sel=document.getElementById("e-tier");sel.value=eTier;sel.onchange=()=>eTier=sel.value;
  document.getElementById("e-go").onclick=()=>{const pool=Q.filter(q=>eTier==="all"||q.t===eTier);
    S={mode:"endless",pool,deck:shuffle(pool),i:0,streak:0,right:0,total:0,best:eStats().best};endlessQ()};
  const r=document.getElementById("e-reset");if(r)r.onclick=()=>{if(confirm("Reset your Endless stats?")){store.set(EKEY,{best:0,right:0,total:0});endlessView()}};
}
function endlessHud(){return `<div class="hud"><span class="chip c-m">Endless</span><span class="score">${S.streak>=3?`<span class="streak-fire">🔥 </span>`:""}Streak ${S.streak} · ${S.right}/${S.total}</span></div>`}
function endlessQ(){
  if(S.i>=S.deck.length){S.deck=shuffle(S.pool);S.i=0}
  const q=withOpts(S.deck[S.i]);S.cur=q;
  app.innerHTML=endlessHud()+(q.era&&shownLabel(q)?`<span class="era">${esc(shownLabel(q))}</span>`:"")+`<div>${chip(q.t)}</div>`+
   (q.clue?`<span class="clue-head">${PIN}Where am I?</span><p class="clue">${esc(q.q)}</p>`:`<p class="q">${esc(q.q)}</p>`)+
   `<div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-o="${esc(o)}"><span class="k">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="after"></div>`;
  app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>endlessAnswer(b));
}
function endlessAnswer(btn){
  const q=S.cur,ok=btn.dataset.o===q.a;
  app.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.o===q.a)b.classList.add("right");else if(b===btn)b.classList.add("wrong");else b.classList.add("dim")});
  const lost=S.streak;S.total++;if(ok){S.right++;S.streak++}else S.streak=0;S.i++;
  const st=eStats();st.total++;if(ok)st.right++;const newBest=S.streak>st.best;if(newBest)st.best=S.streak;store.set(EKEY,st);
  app.querySelector(".hud").outerHTML=endlessHud();
  document.getElementById("after").innerHTML=`<div class="explain" style="border-color:${ok?"var(--right)":"var(--wrong)"}">
    <span class="verdict" style="color:${ok?"var(--right)":"var(--wrong)"}">${ok?(newBest&&S.streak>1?"New best streak!":"Hit!"):(lost>=3?`Streak over at ${lost}.`:"Missed.")}</span>
    <p>${esc(q.e)}</p><span class="src">${esc(q.id)} · Source: ${srcLink(q.s)}</span></div>
    <div class="row" style="margin-top:12px"><button class="btn" id="next">Next question</button><button class="btn ghost" id="stop">Stop</button></div>`;
  const nb=document.getElementById("next");nb.onclick=endlessQ;nb.focus();
  document.getElementById("stop").onclick=endlessEnd;
}
function endlessEnd(){
  const st=eStats(),share=`Drop-In Daily Endless\n${S.right}/${S.total} right · best streak ${st.best}`;
  app.innerHTML=`<div class="hud"><span class="chip c-m">Endless</span><span class="score">${S.right}/${S.total}</span></div>
   <p class="result-title">${S.total?Math.round(100*S.right/S.total):0}% this run</p>
   <div class="estats"><div class="estat"><span>This run</span><b>${S.right}/${S.total}</b></div><div class="estat"><span>Best streak</span><b>${st.best}</b></div><div class="estat"><span>All-time</span><b>${st.right}/${st.total}</b></div></div>
   <pre class="share" id="share">${esc(share)}</pre>
   <div class="row"><button class="btn" id="copy">Copy result</button><button class="btn ghost" id="again">Keep going</button><button class="btn ghost" id="back">Back</button><span class="toast" id="toast"></span></div>`;
  document.getElementById("copy").onclick=()=>copyText(share,"toast",document.getElementById("share"));
  document.getElementById("again").onclick=endlessQ;
  document.getElementById("back").onclick=()=>setView("endless");
}
function startWhere(size){S={mode:"where",size,title:"Where Am I?",qs:shuffle(LOCQ).slice(0,size).map(q=>withOpts(q)),i:0,marks:[]};question()}

/* ---------- question bank ---------- */
let bf={text:"",t:"all",ch:"all",s:"all",src:"all",kind:"all",shown:60};
function bankView(){
  app.innerHTML=`<h2>Question Bank</h2><p class="muted">Every question with its answer, the other options, and its source, for checking by hand. Use the ID (like C2S4-03) to point out one that needs fixing.</p>
  <div class="row"><div class="field" style="flex-basis:100%"><label for="b-text">Search</label><input type="search" id="b-text" placeholder="Search questions, answers or IDs" value="${esc(bf.text)}"></div></div>
  <div class="row">
   <div class="field"><label for="b-tier">Difficulty</label><select id="b-tier"><option value="all">All</option>${Object.keys(TIERS).map(t=>`<option value="${t}"${bf.t===t?" selected":""}>${TIERS[t].label} (${TIERS[t].tier})</option>`).join("")}</select></div>
   <div class="field"><label for="b-ch">Chapter</label><select id="b-ch">${chapterOptions(bf.ch,"All")}<option value="none"${bf.ch==="none"?" selected":""}>General (no season)</option></select></div>
   <div class="field"><label for="b-s">Season</label><select id="b-s"${bf.ch==="all"||bf.ch==="none"?" disabled":""}>${seasonOptions(bf.ch==="none"?"all":bf.ch,bf.s,"All")}</select></div>
   <div class="field"><label for="b-kind">Type</label><select id="b-kind"><option value="all">All</option><option value="trivia"${bf.kind==="trivia"?" selected":""}>Trivia</option><option value="loc"${bf.kind==="loc"?" selected":""}>Where Am I?</option></select></div>
   <div class="field"><label for="b-src">Source</label><select id="b-src"><option value="all">All</option><option value="g"${bf.src==="g"?" selected":""}>Fortnite Wiki</option><option value="w"${bf.src==="w"?" selected":""}>Wikipedia</option><option value="e"${bf.src==="e"?" selected":""}>Epic Games</option></select></div>
  </div><p class="muted" id="b-count"></p><ul class="bank" id="b-list"></ul>`;
  const t=document.getElementById("b-text");let timer;
  t.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>{bf.text=t.value;bf.shown=60;renderBank()},150)};
  document.getElementById("b-tier").onchange=e=>{bf.t=e.target.value;bf.shown=60;renderBank()};
  document.getElementById("b-ch").onchange=e=>{bf.ch=e.target.value;bf.s="all";bf.shown=60;const s=document.getElementById("b-s");
    s.innerHTML=seasonOptions(bf.ch==="none"?"all":bf.ch,"all","All");s.disabled=bf.ch==="all"||bf.ch==="none";renderBank()};
  document.getElementById("b-s").onchange=e=>{bf.s=e.target.value;bf.shown=60;renderBank()};
  document.getElementById("b-src").onchange=e=>{bf.src=e.target.value;bf.shown=60;renderBank()};
  document.getElementById("b-kind").onchange=e=>{bf.kind=e.target.value;bf.shown=60;renderBank()};
  renderBank();
}
function renderBank(){
  const txt=bf.text.trim().toLowerCase();
  const list=Q.filter(q=>(bf.t==="all"||q.t===bf.t)
    &&(bf.ch==="all"||(bf.ch==="none"?!q.era:q.era&&SBY[q.era].ch===bf.ch))
    &&(bf.s==="all"||q.era===bf.s)
    &&(bf.src==="all"||(bf.src==="w"?q.s.includes("wikipedia"):bf.src==="e"?!/^https?:/.test(q.s):/weirdgloop/.test(q.s)))
    &&(bf.kind==="all"||(bf.kind==="loc")===(q.kind==="loc"))
    &&(!txt||[q.id,q.q,q.a,...q.w,q.e].join(" ").toLowerCase().includes(txt)));
  document.getElementById("b-count").textContent=`Showing ${Math.min(bf.shown,list.length)} of ${list.length} matching questions (${Q.length} in total).`;
  document.getElementById("b-list").innerHTML=list.slice(0,bf.shown).map(q=>`<li class="bq">
    <div class="top"><span class="id">${esc(q.id)}</span>${chip(q.t)}${q.kind==="loc"?`<span class="chip c-loc">Where Am I?</span>`:""}${q.era?`<span class="era">${esc(eraLabel(q.era))}</span>`:""}</div>
    <p class="qq">${q.clue?"Where am I? ":""}${esc(q.q)}</p><p class="ans">✓ ${esc(q.a)}</p><p class="oth">Other options: ${q.w.map(esc).join(" · ")}</p>
    <p class="ex">${esc(q.e)}</p><span class="src">Source: ${srcLink(q.s)}</span></li>`).join("")+
    (list.length>bf.shown?`<li class="more"><button class="btn ghost" id="b-more">Show 60 more</button></li>`:"");
  const m=document.getElementById("b-more");if(m)m.onclick=()=>{bf.shown+=60;renderBank()};
}

// ---- Sync devices: progress lives in this browser, so move it with a copy/paste code ----
function syncKeys(){const o={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("dropin"))o[k]=localStorage.getItem(k)}}catch(e){}return o}
function syncView(){
  S=null;document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected","false"));
  const code=btoa(unescape(encodeURIComponent(JSON.stringify({v:1,d:syncKeys()}))));
  app.innerHTML=`<h2>Sync devices</h2>
   <p class="muted">Your results, streaks and Endless stats are saved in this browser only. To move them, copy this code, open Drop-In Daily on your other device, tap <strong>Sync devices</strong> and paste it under &ldquo;Load progress.&rdquo;</p>
   <textarea class="synccode" id="sync-code" readonly>${code}</textarea>
   <div class="row"><button class="btn" id="sync-copy">Copy code</button><span class="toast" id="sync-t1"></span></div>
   <h2 style="margin-top:22px">Load progress</h2>
   <textarea class="synccode" id="sync-paste" placeholder="Paste a code from your other device"></textarea>
   <p class="muted" style="font-size:14px;margin-bottom:8px">Days you&rsquo;ve already played on this device stay as they are; anything new from the other device is added. Endless keeps whichever stats are further along.</p>
   <div class="row"><button class="btn" id="sync-load">Load progress</button><button class="btn ghost" id="sync-back">Done</button><span class="toast" id="sync-t2"></span></div>`;
  document.getElementById("sync-copy").onclick=()=>{const t=document.getElementById("sync-t1");
    navigator.clipboard.writeText(code).then(()=>t.textContent="Copied").catch(()=>{const el=document.getElementById("sync-code");el.focus();el.select();t.textContent="Selected; press Ctrl/Cmd+C"})};
  document.getElementById("sync-load").onclick=()=>{const t=document.getElementById("sync-t2");
    try{const o=JSON.parse(decodeURIComponent(escape(atob(document.getElementById("sync-paste").value.trim()))));
      if(!o||!o.d)throw 0;let added=0;
      for(const [k,v] of Object.entries(o.d)){if(!k.startsWith("dropin"))continue;const cur=localStorage.getItem(k);
        if(k===EKEY){const a=JSON.parse(cur||"{}"),b=JSON.parse(v||"{}");
          const m={best:Math.max(a.best||0,b.best||0),...((b.total||0)>(a.total||0)?{right:b.right||0,total:b.total||0}:{right:a.right||0,total:a.total||0})};
          localStorage.setItem(k,JSON.stringify(m));added++;continue}
        if(cur===null){localStorage.setItem(k,v);added++}}
      t.textContent=added?"Progress loaded":"Nothing new to add";
    }catch(e){t.textContent="That code didn't work"}};
  document.getElementById("sync-back").onclick=()=>setView(view||"main");
  window.scrollTo({top:0});
}
document.getElementById("syncBtn").onclick=syncView;
setView("main");
