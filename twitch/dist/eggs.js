if(typeof Element!=="undefined"&&Element.prototype.animate){
/* Achievements: milestones worked out from saved play, plus hidden secrets with a counter for each. */
function makeAch(C){
  const CK=C.pfx+":eggcounts",SK=C.pfx+":secrets",AK=C.pfx+":ach";
  let counts={},found=new Set(),seen=new Set();
  const SETS=["main","e","m","h","x"],perfect=v=>v&&v.marks&&v.marks.length&&v.marks.every(Boolean);
  function stats(){const days={};
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i),m=k&&k.match(C.dayRe);if(!m)continue;const v=store.get(k);if(v&&v.marks)(days[m[1]]=days[m[1]]||{})[m[2]]=v}}catch(e){}
    const list=Object.values(days),sets=list.flatMap(d=>Object.values(d));
    return {days:list.length,mains:list.filter(d=>d.main).length,
      perfectMain:list.some(d=>perfect(d.main))?1:0,fullDay:list.some(d=>SETS.every(k=>d[k]))?1:0,perfectDay:list.some(d=>SETS.every(k=>perfect(d[k])))?1:0,
      topRight:sets.reduce((a,v)=>a+(v.ids||[]).filter((id,i)=>v.marks[i]&&QBYID[id]&&QBYID[id].t==="x").length,0),
      best:eStats().best,secrets:found.size}}
  const prog=(m,st)=>{const [c,g]=m[3](st);return [Math.min(c,g),g]};
  const earned=st=>C.miles.filter(m=>{const [c,g]=prog(m,st);return c>=g}).map(m=>m[0]);
  // Read saved state (again after the Discord Activity merges in progress from other devices).
  function load(){counts=Object.assign({},store.get(CK)||{});found=new Set((store.get(SK)||[]).filter(id=>C.eggs.some(e=>e[0]===id)));
    let s=store.get(AK);if(!Array.isArray(s)){s=earned(stats());store.set(AK,s)}seen=new Set(s)}
  load();
  function check(){const st=stats();for(const id of earned(st))if(!seen.has(id)){seen.add(id);store.set(AK,[...seen]);const m=C.miles.find(x=>x[0]===id);C.notify("Achievement unlocked",`${m[1]}: ${m[2]}`)}refresh()}
  function secret(id){counts[id]=(counts[id]||0)+1;store.set(CK,counts);
    if(!found.has(id)){found.add(id);store.set(SK,[...found]);const e=C.eggs.find(x=>x[0]===id);C.notify("Secret achievement",`${e[1]}: ${e[2]}`);check()}else refresh()}
  const times=n=>n===1?"Done once":`Done ${n.toLocaleString()} times`;
  function render(){
    const st=stats(),done=earned(st),total=C.miles.length+C.eggs.length,have=done.length+found.size,pct=Math.round(100*have/total);
    app.innerHTML=`<div id="ach-root"><h2>Achievements</h2><p class="muted">${have} of ${total} unlocked. Milestones come from playing; secrets stay hidden until you find them.</p>
     <div class="ach-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>${window.YS?YS.mineHTML():""}
     <h3 class="ach-h">Milestones</h3><ul class="ach-list">${C.miles.map(m=>{const [c,g]=prog(m,st),ok=c>=g;
       return `<li class="${ok?"":"no"}">${C.medal(ok,"mile")}<div class="ach-txt"><b>${m[1]}</b><span>${m[2]}</span>${!ok&&g>1?`<div class="ach-mini"><span style="width:${100*c/g}%"></span></div><span class="ach-n">${c.toLocaleString()}/${g.toLocaleString()}</span>`:""}</div></li>`}).join("")}</ul>
     <h3 class="ach-h">Secrets <small>${found.size}/${C.eggs.length}</small></h3><ul class="ach-list">${C.eggs.map(([id,n,d,h])=>found.has(id)
       ?`<li>${C.medal(true,"secret")}<div class="ach-txt"><b>${n}</b><span>${d}</span><span class="ach-n">${times(counts[id]||1)}</span></div></li>`
       :`<li class="no">${C.medal(false,"secret")}<div class="ach-txt"><b>Secret achievement</b><span>Find it to reveal it.</span><details><summary>Show hint</summary><span>${h}</span></details></div></li>`).join("")}</ul></div>`}
  const tab=document.createElement("button");tab.className="tab";tab.setAttribute("role","tab");tab.id="tab-ach";tab.dataset.v="ach";tab.textContent="Achievements";
  document.querySelector(".tabs").appendChild(tab);
  tab.onclick=()=>{S=null;document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b===tab)));render();scrollTo({top:0})};
  function refresh(){if(document.getElementById("ach-root"))render()}
  const _r=results;results=function(f){_r(f);if(f)check()};
  const _ee=endlessAnswer;endlessAnswer=function(b){_ee(b);check()};
  return {secret,check,has:id=>found.has(id),reload(){load();refresh()}};
}

const R=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const EGGS=[
 ["crate","Supply Drop","Opened a supply drop","Sometimes something falls from the sky. Grab it."],
 ["storm","Storm Chaser","Poked the storm until it surged","The purple wall at the bottom doesn't like being touched."],
 ["title","Mythic Title","Upgraded the title to Mythic","The game's name looks tappable. Keep going."],
 ["party","Lobby Party","Started a lobby party","An old cheat code, or hold the date for a couple of seconds."],
 ["driver","Good Manners","Thanked the bus driver","While dropping, someone up front deserves a thank-you."],
 ["owl","Night Owl","Finished the Daily Drop after midnight","Some drops happen while everyone else is asleep."],
 ["fullmoon","Full Moon","Tapped the full moon","Once a month, the moon is worth a closer look."],
 ["bus","Bus Spotter","Spotted the Battle Bus flying over","Every so often, something big crosses the sky. Tap it."],
 ["llama","Loot Llama","Found the loot llama on the island","Something colorful sometimes grazes on the island."],
 ["bird","Early Bird","Finished the Daily Drop at dawn","Some drops happen just as the sun comes up."]];
let tEl=null,tTimer,tQueue=[];
function toast(title,html,c="#ffd53d",ms=7000){if(tEl){tQueue.push([title,html,c,ms]);return}
  const d=document.createElement("div");d.className="egg-toast";d.setAttribute("role","status");d.style.setProperty("--c",c);
  d.innerHTML=`<b>${esc(title)}</b><p>${html}</p><button class="x" aria-label="Close">×</button>`;document.body.appendChild(d);tEl=d;
  const close=()=>{if(tEl!==d)return;clearTimeout(tTimer);d.classList.add("out");setTimeout(()=>d.remove(),250);tEl=null;const n=tQueue.shift();if(n)setTimeout(()=>toast(...n),260)};
  d.querySelector(".x").onclick=close;tTimer=setTimeout(close,ms)}
const medal=(on,kind)=>`<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 30 9.5v15L17 32 4 24.5v-15z" fill="${on?(kind==="secret"?"#c56bff":"#f2c200"):"#dfe7f6"}" stroke="${on?"#0d1b3d":"#9fb0d0"}" stroke-width="2"/>${on?`<path d="m17 9 2.4 5 5.4.6-4 3.7 1.1 5.3L17 21l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#fff"/>`:kind==="secret"?`<text x="17" y="22.5" text-anchor="middle" font-size="15" font-weight="700" fill="#9fb0d0">?</text>`:`<path d="M12 16v-3a5 5 0 0 1 10 0v3M11 16h12v8H11z" fill="none" stroke="#9fb0d0" stroke-width="2"/>`}</svg>`;
const ACH=makeAch({pfx:"dropin",dayRe:/^dropin3:(\d{4}-\d{2}-\d{2}):(main|e|m|h|x)$/,eggs:EGGS,medal,
  notify:(t,txt)=>{const sec=t.startsWith("Secret");toast(t,esc(txt),sec?"#c56bff":"#f2c200");setTimeout(()=>window.SND&&SND.play(sec?"secret":"achievement"),sec?700:0)},
  miles:[
   ["first","First Drop","Finish a Daily Drop",s=>[s.mains,1]],
   ["squad","Full Squad","Play all five daily sets in one day",s=>[s.fullDay,1]],
   ["vr","Victory Royale","Get a perfect Daily Drop",s=>[s.perfectMain,1]],
   ["untouch","Untouchable","Go 25/25 in one day",s=>[s.perfectDay,1]],
   ["d3","Regular","Play on 3 different days",s=>[s.days,3]],
   ["d7","Veteran","Play on 7 different days",s=>[s.days,7]],
   ["d30","Season Pass","Play on 30 different days",s=>[s.days,30]],
   ["myth","Mythic Mind","Answer 10 Impossible questions right in daily sets",s=>[s.topRight,10]],
   ["s10","Hot Streak","Reach a 10-question streak in Endless",s=>[s.best,10]],
   ["s25","Unstoppable","Reach a 25-question streak in Endless",s=>[s.best,25]],
   ["w7","Locked In","Play the Daily Drop 7 days in a row",s=>[s.streak,7]],
   ["w30","No Days Off","Play the Daily Drop 30 days in a row",s=>[s.streak,30]],
   ["hunter","Secret Hunter","Find every secret",s=>[s.secrets,EGGS.length]]]});
window.gameAch=ACH;
const secret=id=>ACH.secret(id);
const fact=()=>{const pool=Q.filter(q=>(q.t==="e"||q.t==="m")&&!q.clue&&q.q.length<130&&!/this season|these|this one/i.test(q.q)),q=pool[Math.random()*pool.length|0];return `${esc(q.q)} <strong>${esc(q.a)}</strong>. <span class="src">${srcLink(q.s)}</span>`};
const playing=()=>!!app.querySelector(".opt")||!!document.querySelector(".fn-jump");

/* 1. supply drops */
const CRATE=`<svg viewBox="0 0 84 120" aria-hidden="true"><path d="M4 38C4 14 22 2 42 2s38 12 38 36c-6-5-12-5-19 0-6-5-13-5-19 0-6-5-13-5-19 0-7-5-13-5-19 0z" fill="#fff"/><path d="M23 38c0-22 8-35 19-36 11 1 19 14 19 36-6-5-13-5-19 0-6-5-13-5-19 0z" fill="#2f8cff"/><path d="M6 38l22 44M42 38v44M78 38 56 82M24 38l12 44M60 38 48 82" stroke="#0d1b3d" stroke-width="1.4" opacity=".6"/><rect x="18" y="80" width="48" height="38" rx="3" fill="#c98a3d" stroke="#0d1b3d" stroke-width="2.5"/><path d="M18 92h48M18 106h48" stroke="#8a5a1f" stroke-width="2"/><path d="M18 80l48 38M66 80l-48 38" stroke="#8a5a1f" stroke-width="2" opacity=".5"/><rect x="36" y="94" width="12" height="10" rx="2" fill="#ffd53d" stroke="#0d1b3d" stroke-width="2"/></svg>`;
function spawnCrate(){
  if(document.querySelector(".egg-crate")||playing()||document.hidden){schedule(15000);return}
  const c=document.createElement("button");c.className="egg-crate";c.type="button";c.setAttribute("aria-label","Supply drop. Tap to open");c.innerHTML=CRATE;
  const x=8+Math.random()*(innerWidth>700?80:70);c.style.left=x+"vw";document.body.appendChild(c);window.SND&&SND.play("crateFall");
  const fall=c.animate([{transform:"translateY(0) rotate(-8deg)"},{transform:`translateY(${innerHeight*.45}px) rotate(8deg)`,offset:.5},{transform:`translateY(${innerHeight+180}px) rotate(-6deg)`}],{duration:R?20000:16000,easing:"linear"});
  fall.onfinish=()=>{c.remove();schedule()};
  c.onclick=()=>{fall.pause();c.disabled=true;window.SND&&SND.play("crate");
    if(!R){c.animate([{transform:getComputedStyle(c).transform},{transform:getComputedStyle(c).transform+" scale(1.3)",opacity:0}],{duration:300,fill:"forwards"});confetti(1500,90)}
    setTimeout(()=>{c.remove();schedule()},320);
    toast("Supply drop!","Loot fact: "+fact(),"#59a8ff",10000);secret("crate")};
}
function schedule(ms){setTimeout(spawnCrate,ms||40000+Math.random()*30000)}
schedule(9000);

// No supply drops during a game: a falling crate is cleared away when a question starts.
const _qe=question;question=function(){_qe.apply(this,arguments);hideCrate()};
const _eqe=endlessQ;endlessQ=function(){_eqe.apply(this,arguments);hideCrate()};
function hideCrate(){document.querySelectorAll(".egg-crate:not(:disabled)").forEach(c=>{c.remove();schedule()})}

/* 2. storm taps, via taps on empty background */
let stormTaps=0,stormT;
document.addEventListener("click",e=>{
  if(e.target.closest("button,a,input,select,textarea,label,.panel,.tabs,.egg-toast,h1,#date"))return;
  const st=document.querySelector(".fn-storm");if(!st)return;const r=st.getBoundingClientRect();
  if(e.clientY<r.top+20)return;
  st.classList.add("surge");setTimeout(()=>st.classList.remove("surge"),380);
  if(!R){const b=document.createElement("div");b.className="egg-bolt";document.body.appendChild(b);setTimeout(()=>b.remove(),520)}
  const d=document.createElement("div");d.className="fn-dmg";d.style.color="#e3c2ff";d.style.webkitTextStrokeColor="#3a0f7a";d.textContent="-1";d.style.left=e.clientX+"px";d.style.top=e.clientY+"px";document.body.appendChild(d);
  d.animate([{transform:"translate(-50%,-50%) scale(.5)",opacity:1},{transform:"translate(-50%,-200%) scale(1.1)",opacity:0}],{duration:R?10:800}).onfinish=()=>d.remove();
  clearTimeout(stormT);stormT=setTimeout(()=>stormTaps=0,2500);
  if(++stormTaps<3)window.SND&&SND.play("stormPoke");else{window.SND&&SND.play("stormSurge");stormTaps=0;toast("Storm surge","You poked the storm and it poked back. Don't stand in it during a real match.","#c04bff");secret("storm")}
});

/* 3. title that levels up */
const h1=document.querySelector("h1");let lvl=0,lvlT;
h1.addEventListener("click",()=>{clearTimeout(lvlT);lvlT=setTimeout(()=>{if(lvl<5){lvl=0;h1.className=""}},2500);
  if(lvl>=5)return;lvl++;window.SND&&SND.play("titleTap",lvl);h1.className=lvl<5?"lvl"+lvl:"mythic";
  if(!R)h1.animate([{transform:"skew(-6deg) scale(1)"},{transform:"skew(-6deg) scale(1.08)"},{transform:"skew(-6deg) scale(1)"}],{duration:220});
  if(lvl===5){confetti(1800,120);toast("Title upgraded","Drop-In Daily is now Mythic rarity. It stays that way until you reload.","#f2c200");secret("title")}});

/* 4. lobby party: Konami code or hold the date */
function party(){if(document.body.classList.contains("partying"))return;window.SND&&(SND.hold(6500),SND.play("party"));document.body.classList.add("partying");
  const l=document.createElement("div");l.className="egg-party";document.body.appendChild(l);
  toast("Lobby party","Everyone's dancing while the match loads. It wraps up in a few seconds.","#ff4fd8",6000);secret("party");
  setTimeout(()=>{document.body.classList.remove("partying");l.remove()},6500)}
const CODE=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let keys=[];
addEventListener("keydown",e=>{keys.push(e.key.length===1?e.key.toLowerCase():e.key);keys=keys.slice(-CODE.length);if(keys.join()===CODE.join()){keys=[];party()}});
const date=document.getElementById("date");let holdT;date.style.userSelect="none";date.style.webkitUserSelect="none";
date.style.webkitTouchCallout="none";
const holdGo=()=>{clearTimeout(holdT);holdT=setTimeout(party,1500)},holdStop=()=>clearTimeout(holdT);
date.addEventListener("touchstart",holdGo,{passive:true});["touchend","touchcancel"].forEach(ev=>date.addEventListener(ev,holdStop));
date.addEventListener("mousedown",holdGo);["mouseup","mouseleave"].forEach(ev=>date.addEventListener(ev,holdStop));
date.addEventListener("contextmenu",e=>e.preventDefault());

/* 5. thank the bus driver: tap the players-left counter */
app.addEventListener("click",e=>{const a=e.target.closest(".fn-alive");if(!a)return;window.SND&&SND.play("driver");
  const f=document.querySelector(".fn-feed");if(f){const d=document.createElement("div");d.style.setProperty("--c","#ffe14a");d.innerHTML=`<b>You</b><span>thanked the bus driver</span>`;f.appendChild(d);setTimeout(()=>d.remove(),4100)}
  secret("driver")});
/* >>> stats and new secrets */
/* ===== Your Daily stats (from this device), and how everyone did today (anonymous, from the game's server) ===== */
const YS=(()=>{
  const DAYRE=new RegExp("^dropin3:(\\d{4}-\\d{2}-\\d{2}):main$"),API=location.hostname.endsWith("discordsays.com")?"":"https://drop-in-daily-bot.towfiq-aziz11.workers.dev";
  const t=d=>Date.parse(d+"T12:00:00Z"),gap=(a,b)=>Math.round((t(b)-t(a))/864e5);
  function mine(){const days=[];
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i),m=k&&k.match(DAYRE);if(!m)continue;const v=store.get(k);if(v&&Array.isArray(v.marks)&&v.marks.length)days.push({d:m[1],s:v.marks.filter(Boolean).length,n:v.marks.length})}}catch(e){}
    days.sort((a,b)=>a.d<b.d?-1:1);
    let best=0,run=0;days.forEach((x,i)=>{run=i&&gap(days[i-1].d,x.d)===1?run+1:1;best=Math.max(best,run)});
    let cur=0;const last=days[days.length-1];
    if(last&&gap(last.d,dayKey)<=1){cur=1;for(let i=days.length-1;i>0&&gap(days[i-1].d,days[i].d)===1;i--)cur++}
    const dist=[0,0,0,0,0,0];days.forEach(x=>{if(x.n===5)dist[x.s]++});
    let full=0;try{const sets=["main","e","m","h","x"];for(const x of days)if(sets.every(k=>{const v=store.get(`dropin3:${x.d}:${k}`);return v&&v.marks&&v.marks.length&&v.marks.every(Boolean)}))full++}catch(e){}
    return {played:days.length,perfect:dist[5],full,cur,best,dist,today:(days.find(x=>x.d===dayKey)||{}).s};
  }
  const bars=(dist,hi,unit)=>{const max=Math.max(1,...dist);return `<div class="ys-dist">${[5,4,3,2,1,0].map(s=>`<div class="ys-row${s===hi?" hi":""}"><span class="ys-l">${s}/5</span><span class="ys-b"><i style="width:${Math.max(dist[s]?6:0,100*dist[s]/max)}%"></i></span><span class="ys-c">${dist[s]}${unit}</span></div>`).join("")}</div>`};
  function mineHTML(){const m=mine();if(!m.played)return `<section class="ys"><h3>Your Daily Drop stats</h3><p class="ys-note">Finish today's Daily Drop to start your stats.</p></section>`;
    return `<section class="ys"><h3>Your Daily Drop stats</h3>
     <div class="ys-grid"><div><b>${m.played}</b><span>Played</span></div><div><b>${m.perfect}</b><span>Perfect 5/5</span></div><div><b>${m.cur}</b><span>Current streak</span></div><div><b>${m.best}</b><span>Best streak</span></div></div>
     ${bars(m.dist,m.today,"")}${m.full?`<p class="ys-note">Perfect 25/25 days: <b>${m.full}</b></p>`:""}</section>`}
  // a random ID for this device, so its result counts once; nothing else about the player is sent
  const dev=()=>{let v=store.get("dropin:dev");if(typeof v!=="string"||!/^[a-z0-9]{24}$/.test(v)){v=Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>"abcdefghijklmnopqrstuvwxyz0123456789"[b%36]).join("");store.set("dropin:dev",v)}return v};
  async function everyone(post){
    try{const opt=post?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({dev:dev(),ids:S.qs.map(q=>q.id),marks:S.marks})}:{};
      const r=await fetch(API+(post?"/stats/result":"/stats/daily"),opt);return r.ok?await r.json():null}catch(e){return null}}
  function everyoneHTML(g,score){
    if(!g)return "";
    if(!g.dist)return `<section class="gs"><h3>How everyone did today</h3><p class="ys-note">Everyone's results show up once ${g.min} players have finished today's Daily Drop (${g.n} so far). Check back later!</p></section>`;
    const lower=g.dist.slice(0,score).reduce((a,b)=>a+b,0),same=Math.round(100*g.dist[score]/g.n);
    const line=score===5?`You're one of the <b>${same}%</b> who got a perfect 5/5.`:score===0?`Tough one! <b>${same}%</b> of players also got 0/5.`:`You did better than <b>${Math.round(100*lower/g.n)}%</b> of players.`;
    return `<section class="gs"><h3>How everyone did today</h3><p>${line} <span class="ys-note">${g.n} players</span></p>${bars(g.dist,score,"")}</section>`}
  async function addToResults(fresh){
    if(!S||S.mode!=="main"||!S.qs||S.marks.length<S.qs.length)return;
    const score=S.marks.filter(Boolean).length,box=document.createElement("div");box.className="ys-wrap";box.innerHTML=mineHTML()+`<div class="gs-slot"></div>`;app.appendChild(box);
    const g=await everyone(!!fresh&&!window.dropinDone);if(!box.isConnected||!g)return;
    box.querySelector(".gs-slot").innerHTML=everyoneHTML(g,score);
    if(g.q)app.querySelectorAll(".recap li").forEach((li,i)=>{const tx=li.lastElementChild||li;if(g.q[i]!=null&&!li.querySelector(".gs-pct"))tx.insertAdjacentHTML("beforeend",`<span class="gs-pct">${g.q[i]}% of players got this</span>`)})}
  const css=document.createElement("style");css.textContent=`
.ys-wrap{margin-top:18px;display:grid;gap:14px}
.ys,.gs{background:var(--ys-bg);border:var(--ys-border);border-radius:var(--ys-r);padding:14px 16px;color:var(--ys-ink)}
.ys h3,.gs h3{margin:0 0 10px;font:var(--ys-h)}
.ys p,.gs p{margin:0 0 8px}
.ys-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin-bottom:10px}
.ys-grid b{display:block;font:var(--ys-num)}.ys-grid span{font-size:12px;opacity:.75}
.ys-dist{display:grid;gap:4px}
.ys-row{display:grid;grid-template-columns:34px 1fr 30px;align-items:center;gap:8px;font-size:13px}
.ys-b{height:16px;background:var(--ys-track);border-radius:4px;overflow:hidden}.ys-b i{display:block;height:100%;background:var(--ys-bar);border-radius:4px}
.ys-row.hi .ys-b i{background:var(--ys-acc)}.ys-row.hi .ys-l{font-weight:800}
.ys-c{text-align:right;opacity:.8}.ys-note{font-size:13px;opacity:.75}
.gs-pct{display:block;font-size:12px;opacity:.7;margin-top:2px}
@media (max-width:420px){.ys-grid b{font-size:22px}}`;document.head.appendChild(css);
  return {mine,mineHTML,addToResults};
})();
window.YS=YS;
const _rys=results;results=function(fresh){_rys.apply(this,arguments);YS.addToResults(fresh);
  // Night Owl: finish the daily set between midnight and 4 am
  // (uses the sky clock, which is the real time in the game; the preview's time bar can move it for testing)
  if(fresh&&S&&S.mode==="main"){const d=new Date(),h=window.SKY?SKY.now().hour:d.getHours()+d.getMinutes()/60;
    if(h<4)setTimeout(()=>secret("owl"),1200);
    // Early Bird: finish the daily set at dawn, from an hour before sunrise to an hour after
    else if(window.SKY){const st=SKY.sunTimes(d);if(h>=st.rise-1&&h<=st.rise+1)setTimeout(()=>secret("bird"),1200)}}};
// the real moon phase (0 = new, 0.5 = full); a full moon is within about a day of 0.5
const moonPhase=()=>{const syn=29.530588853,ref=Date.UTC(2000,0,6,18,14)/864e5;return((((Date.now()/864e5-ref)%syn)+syn)%syn)/syn};
const fullMoon=()=>window.__fullMoon===true||Math.abs(moonPhase()-.5)<.034;
/* Drop-In: the island comes closer once you've dropped in, the Battle Bus flies over, a loot llama grazes on the island,
   and the full moon is worth a tap */
{const css=document.createElement("style");css.textContent=`
:root{--ys-bg:#fff;--ys-border:2px solid #cfdcf3;--ys-r:6px;--ys-ink:#0d1b3d;--ys-h:italic 400 22px/1 Anton,Impact,sans-serif;--ys-num:italic 400 28px/1 Anton,Impact,sans-serif;--ys-track:#e6eefb;--ys-bar:#7d9cd6;--ys-acc:#f2c200}
.ys h3,.gs h3{text-transform:uppercase;letter-spacing:.5px}
.fn-isle{transition:transform 1.6s cubic-bezier(.2,.8,.2,1),bottom 1.6s cubic-bezier(.2,.8,.2,1);transform-origin:72% 100%}
body.fn-landed .fn-isle{transform:scale(2.1)}
.fn-isle .llama{pointer-events:auto;cursor:pointer;opacity:0;transition:opacity .8s}
.fn-isle .llama.on{opacity:1}
.fn-bus{position:fixed;z-index:3;top:9vh;left:-200px;width:150px;height:110px;border:0;padding:0;background:none;cursor:pointer;filter:drop-shadow(0 6px 10px rgba(0,0,40,.25))}
.fn-bus svg{width:100%;height:100%;display:block}
.fn-moon.glow{animation:fnMoonGlow 2.4s ease-out}
@keyframes fnMoonGlow{0%{transform:scale(1)}20%{transform:scale(1.35);filter:drop-shadow(0 0 40px #fff6c8) drop-shadow(0 0 90px #c9a7ff)}100%{transform:scale(1)}}
.fn-confetti{position:fixed;z-index:1002;width:8px;height:8px;border-radius:2px;pointer-events:none}`;document.head.appendChild(css);
 const landed=on=>document.body.classList.toggle("fn-landed",on);
 const _qL=question,_eqL=endlessQ,_rL=results,_svL=setView,_evL=endlessView,_eeL=endlessEnd;
 question=function(){_qL.apply(this,arguments);landed(true)};endlessQ=function(){_eqL.apply(this,arguments);landed(true)};
 results=function(){_rL.apply(this,arguments);landed(false)};setView=function(){_svL.apply(this,arguments);landed(false)};
 endlessView=function(){_evL.apply(this,arguments);landed(false)};endlessEnd=function(){_eeL.apply(this,arguments);landed(false)};

 /* loot llama: sometimes grazing on the island; tap it */
 const svg=document.querySelector(".fn-isle svg");
 if(svg){const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","llama");g.setAttribute("transform","translate(1340 58) scale(1.7)");
   g.innerHTML=`<rect x="-30" y="-40" width="84" height="70" fill="transparent"/><path d="M0 0h14v-3h3v-10h4v3h2v-4h-2v-3h-4v3h-1v11H0z" fill="#b25fe6"/><rect x="1" y="0" width="3" height="5" fill="#8a3fc2"/><rect x="10" y="0" width="3" height="5" fill="#8a3fc2"/><rect x="3" y="-2" width="4" height="2" fill="#5fd0ff"/><rect x="8" y="-2" width="3" height="2" fill="#ffd34d"/><rect x="18" y="-12" width="1.5" height="1.5" fill="#1a0b2e"/>`;
   svg.appendChild(g);
   const show=()=>{if(!g.classList.contains("on")&&document.visibilityState==="visible")g.classList.add("on")};
   if(Math.random()<.5)setTimeout(show,20000+Math.random()*40000);
   // the page's content layer sits above the island, so taps are matched by position (with some room around the llama)
   document.addEventListener("click",e=>{if(!g.classList.contains("on")||e.target.closest("button,a,input,select,textarea,label,.tabs,.egg-toast"))return;
     const r=g.getBoundingClientRect(),pad=14;if(e.clientX<r.left-pad||e.clientX>r.right+pad||e.clientY<r.top-pad||e.clientY>r.bottom+pad)return;e.stopImmediatePropagation();smash()},true);
   function smash(){g.classList.remove("on");
     const r=g.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,cols=["#b25fe6","#5fd0ff","#ffd34d","#ff6fb1","#7dff9a"];
     window.SND&&SND.play("crate");
     if(!R)for(let k=0;k<26;k++){const c=document.createElement("div");c.className="fn-confetti";c.style.background=cols[k%5];c.style.left=cx+"px";c.style.top=cy+"px";document.body.appendChild(c);
       const a=Math.random()*Math.PI*2,d=60+Math.random()*120;c.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-60}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1100+Math.random()*500,easing:"cubic-bezier(.2,.8,.3,1)"}).onfinish=()=>c.remove()}
     toast("Loot llama!","You smashed the llama on the island. Loot everywhere.","#b25fe6");secret("llama");
     setTimeout(()=>{if(Math.random()<.5)show()},180000)}}
 window.__showLlama=()=>{const g=document.querySelector(".fn-isle .llama");if(g)g.classList.add("on")};

 /* the Battle Bus: now and then it flies over; tap it */
 const busSVG=`<svg viewBox="0 0 150 110" aria-hidden="true"><ellipse cx="75" cy="30" rx="34" ry="28" fill="#4fb3ff" stroke="#0b3f8f" stroke-width="3"/><path d="M48 22h54M45 34h60" stroke="#0b3f8f" stroke-width="2" opacity=".35"/>
  <path d="M55 54 48 70M95 54l7 16" stroke="#0b3f8f" stroke-width="2.5"/><rect x="22" y="68" width="106" height="30" rx="8" fill="#2f86f0" stroke="#0b3f8f" stroke-width="3"/>
  <rect x="30" y="74" width="16" height="11" rx="2" fill="#bfe6ff"/><rect x="52" y="74" width="16" height="11" rx="2" fill="#bfe6ff"/><rect x="74" y="74" width="16" height="11" rx="2" fill="#bfe6ff"/><rect x="96" y="74" width="24" height="11" rx="2" fill="#bfe6ff"/>
  <rect x="22" y="89" width="106" height="4" fill="#ffd53d"/><circle cx="42" cy="99" r="6" fill="#0d1b3d"/><circle cx="108" cy="99" r="6" fill="#0d1b3d"/></svg>`;
 let busOn=false;
 function flyBus(){if(busOn||playing()||document.visibilityState!=="visible")return;busOn=true;
   const b=document.createElement("button");b.className="fn-bus";b.setAttribute("aria-label","The Battle Bus");b.innerHTML=busSVG;document.body.appendChild(b);
   window.SND&&SND.play("busHorn");
   const fly=b.animate([{transform:"translate(0,0)"},{transform:`translate(${innerWidth*.5+100}px,-14px)`,offset:.5},{transform:`translate(${innerWidth+400}px,6px)`}],{duration:R?10:18000,easing:"linear"});
   fly.onfinish=()=>{b.remove();busOn=false};
   b.onclick=()=>{if(b.dataset.hit)return;b.dataset.hit=1;window.SND&&SND.play("driver");
     b.animate([{transform:"scale(1)"},{transform:"scale(1.15) rotate(-4deg)"},{transform:"scale(1)"}],{duration:500,composite:"add"});
     toast("Battle Bus spotted","The bus driver honks back at you.","#2f86f0");secret("bus")}}
 (function busLoop(){setTimeout(()=>{if(Math.random()<.3)flyBus();busLoop()},70000+Math.random()*70000)})();
 window.__flyBus=flyBus;

 /* full moon: tap it on the night it's full */
 document.addEventListener("click",e=>{
   if(e.target.closest("button,a,input,select,textarea,label,.tabs,.egg-toast,#app"))return;
   const m=document.querySelector(".fn-moon");if(!m||!window.SKY||!SKY.isNight())return;const r=m.getBoundingClientRect();
   if(e.clientX<r.left-12||e.clientX>r.right+12||e.clientY<r.top-12||e.clientY>r.bottom+12)return;
   e.stopImmediatePropagation();m.classList.remove("glow");void m.offsetWidth;m.classList.add("glow");
   if(fullMoon()){window.SND&&SND.play("mythic");toast("Full moon","The full moon glows back at you. See you next month.","#c9a7ff");secret("fullmoon")}
 },true);
}
/* <<< stats and new secrets */
}
