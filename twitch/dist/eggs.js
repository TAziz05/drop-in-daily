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
      best:eStats().best,secrets:found.size,...(store.get("dropin:collsum")||{}),streak:(()=>{const ds=Object.keys(days).filter(d=>days[d].main).sort();let b=0,r=0;ds.forEach((d,i)=>{r=i&&Math.round((Date.parse(d)-Date.parse(ds[i-1]))/864e5)===1?r+1:1;b=Math.max(b,r)});return b})()}}
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
       return `<li class="${ok?"":"no"}">${C.medal(ok,"mile",m[0])}<div class="ach-txt"><b>${m[1]}</b><span>${m[2]}</span>${!ok&&g>1?`<div class="ach-mini"><span style="width:${100*c/g}%"></span></div><span class="ach-n">${c.toLocaleString()}/${g.toLocaleString()}</span>`:""}</div></li>`}).join("")}</ul>
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
 ["bird","Early Bird","Finished the Daily Drop at dawn","Some drops happen just as the sun comes up."],
 ["pizza","Pizza Party","Ate a whole pizza on the island, slice by slice","Someone keeps leaving food on the island. Hungry?"],
 ["banana","Peel Out","Peeled a banana on the island","Something yellow turns up on the island now and then. Peel it."],
 ["burger","Tall Order","Stacked a burger until it toppled","A lonely bun sits on the island sometimes. Build on it."],
 ["duck","Squeaky Clean","Squeaked a rubber duck five times","Very rarely, something squeaky washes up on the island's shore."],
 ["meteor","Brace for Impact","Caught three falling stars in a meteor shower","A few nights a year, the sky rains stars."],
 ["eclipse","Eclipse Chaser","Tapped the sun or moon during an eclipse","On a real eclipse day, tap whatever goes dark."],
 ["first","First Drop","Finished a Daily Drop sooner after midnight than anyone else","Be the quickest after your own midnight. It's decided the next day."]];
let tEl=null,tTimer,tQueue=[];
function toast(title,html,c="#ffd53d",ms=7000){if(tEl){tQueue.push([title,html,c,ms]);return}
  const d=document.createElement("div");d.className="egg-toast";d.setAttribute("role","status");d.style.setProperty("--c",c);
  d.innerHTML=`<b>${esc(title)}</b><p>${html}</p><button class="x" aria-label="Close">×</button>`;document.body.appendChild(d);tEl=d;
  const close=()=>{if(tEl!==d)return;clearTimeout(tTimer);d.classList.add("out");setTimeout(()=>d.remove(),250);tEl=null;const n=tQueue.shift();if(n)setTimeout(()=>toast(...n),260)};
  d.querySelector(".x").onclick=close;tTimer=setTimeout(close,ms)}
const MTYPE=id=>/^(first|squad|vr|untouch)$/.test(id)?"#3d9bff":/^d\d/.test(id)?"#4fc23a":/^w\d/.test(id)?"#f08a24":/^s\d/.test(id)?"#ff4b3e":id==="myth"||id==="allpass"?"#f2c200":id==="hunter"?"#ff4fa3":id?"#1fc3c7":"#f2c200";
const medal=(on,kind,id)=>`<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 30 9.5v15L17 32 4 24.5v-15z" fill="${on?(kind==="secret"?"#c56bff":MTYPE(id)):"#dfe7f6"}" stroke="${on?"#0d1b3d":"#9fb0d0"}" stroke-width="2"/>${on?(id==="allpass"?`<path d="M9.5 22.5h15l1.6-10.6-4.9 3.9L17 8.6l-4.2 7.2-4.9-3.9z" fill="#fff"/><path d="M9.5 24.2h15v2.2h-15z" fill="#fff"/>`:`<path d="m17 9 2.4 5 5.4.6-4 3.7 1.1 5.3L17 21l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#fff"/>`):kind==="secret"?`<text x="17" y="22.5" text-anchor="middle" font-size="15" font-weight="700" fill="#9fb0d0">?</text>`:`<path d="M12 16v-3a5 5 0 0 1 10 0v3M11 16h12v8H11z" fill="none" stroke="#9fb0d0" stroke-width="2"/>`}</svg>`;
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
   ["tier100","Tier Climber","Unlock 100 Battle Pass tiers",s=>[s.tiers||0,100]],
   ["tier500","Tier Grinder","Unlock 500 Battle Pass tiers",s=>[s.tiers||0,500]],
   ["maxpass","Max Tier","Max out a Battle Pass",s=>[s.maxed||0,1]],
   ["chapter","Chapter Complete","Max every Battle Pass in one chapter",s=>[s.chapterDone||0,1]],
   ["locker","Fully Stocked","Get all 8 Locker slots to Legendary",s=>[s.legendary||0,8]],
   ["allpass","#1 Victory Royale","Max out every Battle Pass",s=>[s.maxed||0,s.passes||44]],
   ["hunter","Secret Hunter","Find every secret",s=>[s.secrets,EGGS.length]]]});
window.gameAch=ACH;
const secret=id=>ACH.secret(id);
const fact=()=>{const pool=Q.filter(q=>(q.t==="e"||q.t==="m")&&!q.clue&&q.q.length<130&&!/this season|these|this one/i.test(q.q)),q=pool[Math.random()*pool.length|0];window.__lastFact=q;return `${esc(q.q)} <strong>${esc(q.a)}</strong>. <span class="src">${srcLink(q.s)}</span>`};
const playing=()=>!!app.querySelector(".opt")||!!document.querySelector(".fn-jump");

/* 1. supply drops */
const CRATE=`<svg viewBox="0 0 84 120" aria-hidden="true"><circle cx="42" cy="96" r="30" fill="#59b4ff" opacity=".28"/><path d="M38 50 21 79M46 50l17 29M42 52v24" stroke="#e8f2ff" stroke-width="1.6"/><circle cx="42" cy="27" r="25" fill="#ffd53d" stroke="#0d1b3d" stroke-width="2.5"/><path d="M42 2c-9 6-12 15-12 25s3 19 12 25M42 2c9 6 12 15 12 25s-3 19-12 25" fill="none" stroke="#e0a70f" stroke-width="1.6"/><ellipse cx="33" cy="16" rx="7" ry="4.5" fill="#fff" opacity=".45" transform="rotate(-30 33 16)"/><path d="M38.5 51h7l-2 4h-3z" fill="#e0a70f" stroke="#0d1b3d" stroke-width="1.5"/><rect x="17" y="80" width="50" height="37" rx="3" fill="#1f6fe0" stroke="#0d1b3d" stroke-width="2.5"/><rect x="14" y="75" width="56" height="10" rx="2.5" fill="#3d9bff" stroke="#0d1b3d" stroke-width="2.5"/><path d="M17 96h50M17 104h50" stroke="#ffd53d" stroke-width="3.2"/><path d="M28 85v32M56 85v32" stroke="#0d1b3d" stroke-width="1.6" opacity=".4"/><circle cx="42" cy="100" r="7" fill="#fff" stroke="#0d1b3d" stroke-width="2"/><path d="m42 95.6 1.4 2.9 3.2.4-2.3 2.1.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.1 3.2-.4z" fill="#2f8cff"/></svg>`;
function spawnCrate(){
  if(document.querySelector(".egg-crate")||playing()||document.hidden){schedule(15000);return}
  const c=document.createElement("button");c.className="egg-crate";c.type="button";c.setAttribute("aria-label","Supply drop. Tap to open");c.innerHTML=CRATE;
  const x=8+Math.random()*(innerWidth>700?80:70);c.style.left=x+"vw";document.body.appendChild(c);window.SND&&SND.play("crateFall");
  const fall=c.animate([{transform:"translateY(0) rotate(-8deg)"},{transform:`translateY(${innerHeight*.45}px) rotate(8deg)`,offset:.5},{transform:`translateY(${innerHeight+180}px) rotate(-6deg)`}],{duration:R?20000:16000,easing:"linear"});
  fall.onfinish=()=>{c.remove();schedule()};
  c.onclick=()=>{fall.pause();c.disabled=true;window.SND&&SND.play("crate");
    if(!R){c.animate([{transform:getComputedStyle(c).transform},{transform:getComputedStyle(c).transform+" scale(1.3)",opacity:0}],{duration:300,fill:"forwards"});confetti(1500,90)}
    setTimeout(()=>{c.remove();schedule()},320);
    toast("Supply drop!","Loot fact: "+fact(),"#59a8ff",10000);secret("crate");setTimeout(()=>window.__locker&&window.__locker.collect(window.__lastFact),1200)};
}
function schedule(ms){setTimeout(spawnCrate,ms||90000+Math.random()*60000)}
schedule(25000);

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
    try{const opt=post?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({dev:dev(),day:dayKey,mins:(d=>d.getHours()*60+d.getMinutes())(new Date()),ids:S.qs.map(q=>q.id),marks:S.marks})}:{};
      const r=await fetch(API+(post?"/stats/result":"/stats/daily?day="+dayKey),opt);return r.ok?await r.json():null}catch(e){return null}}
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
/* ===== Sky events on their real dates: eclipses, blood moons, supermoons, blue moons and meteor showers =====
   Dates and times are UTC. Eclipses: NASA's eclipse tables (a few times rounded). Supermoons: Fred Espenak's table via EarthSky.
   Everyone sees an event on its day, wherever they are; solar ones in the daytime, lunar ones at night. */
const EV=(()=>{
  const SOLAR={"2027-02-06T16:00":"annular","2027-08-02T10:07":"total","2028-01-26T15:08":"annular","2028-07-22T02:56":"total","2029-01-14T17:13":"partial",
    "2029-06-12T04:06":"partial","2029-07-11T15:37":"partial","2029-12-05T15:03":"partial","2030-06-01T06:29":"annular","2030-11-25T06:51":"total"};
  const LUNAR={"2027-02-20T23:13":"penumbral","2027-07-18T16:03":"penumbral","2027-08-17T07:14":"penumbral","2028-01-12T04:14":"partial","2028-07-06T18:20":"partial",
    "2028-12-31T16:53":"total","2029-06-26T03:23":"total","2029-12-20T22:43":"total","2030-06-15T18:34":"partial","2030-12-09T22:28":"penumbral"};
  const SUPER=["2026-11-24","2026-12-24","2027-01-22","2027-02-20","2028-01-12","2028-02-10","2028-03-11","2029-02-28","2029-03-30","2029-04-28","2029-10-07","2030-06-15"];
  const BLUE=["2027-05-20","2028-12-31"];
  const SHOWERS=[["Quadrantids",1,3],["Lyrids",4,22],["Eta Aquariids",5,5],["Perseids",8,12],["Orionids",10,21],["Leonids",11,17],["Geminids",12,14]];
  const near=(map,now,win)=>{for(const k in map)if(Math.abs(now-Date.parse(k+":00Z"))<win)return map[k];return null};
  const nearDay=(list,now)=>list.some(d=>Math.abs(now-Date.parse(d+"T12:00:00Z"))<36*36e5);
  // window.__skyEvent lets the preview page try an event: {solar:"total"}, {lunar:"total"}, {supermoon:true}, {blue:true}, {shower:"Geminids"}
  function today(){const now=Date.now(),f=window.__skyEvent||{},d=new Date();
    let shower=f.shower||null;
    if(!f.shower&&!("shower" in f))for(const [n,m,dd] of SHOWERS){const p=new Date(d.getFullYear(),m-1,dd);if(d>=p-864e5&&d<+p+2*864e5){shower=n;break}}
    return {solar:"solar" in f?f.solar:near(SOLAR,now,14*36e5),lunar:"lunar" in f?f.lunar:near(LUNAR,now,14*36e5),
      supermoon:"supermoon" in f?f.supermoon:nearDay(SUPER,now),blue:"blue" in f?f.blue:nearDay(BLUE,now),shower}}
  let C=null,meteorT=0,caught=0;
  function init(cfg){C=cfg;
    const css=document.createElement("style");css.textContent=`
${C.moon}>.ev-shade{position:absolute;inset:0;border-radius:50%;pointer-events:none;opacity:0;transition:opacity 2s;background:radial-gradient(circle at 26% 36%,rgba(70,12,6,.9) 0 48%,rgba(70,12,6,.4) 52%,transparent 56%)}
html.ev-lunar-partial ${C.moon}>.ev-shade{opacity:1}
html.ev-lunar-total ${C.moon}>.ev-shade{opacity:.9;background:radial-gradient(circle at 42% 38%,#e06a3a,#9a2614 55%,#5e1209 72%,transparent 74%)}
html.ev-lunar-total ${C.moon}{filter:sepia(1) saturate(5) hue-rotate(-28deg) brightness(.72) drop-shadow(0 0 18px rgba(255,80,40,.6)) drop-shadow(0 0 40px rgba(255,60,30,.3))!important}
html.ev-lunar-penumbral ${C.moon}{filter:brightness(.72) sepia(.4) drop-shadow(0 0 10px rgba(255,200,170,.25))!important}
html.ev-super ${C.moon}{scale:1.3}
html.ev-blue ${C.moon}{filter:saturate(.5) hue-rotate(185deg) brightness(1.08) drop-shadow(0 0 16px rgba(140,190,255,.7)) drop-shadow(0 0 40px rgba(120,170,255,.35))!important}
${C.sun}>.ev-disc{position:absolute;left:50%;top:50%;width:${C.disc}px;height:${C.disc}px;margin:${-C.disc/2}px 0 0 ${-C.disc/2}px;border-radius:50%;background:#0b0f24;opacity:0;transition:opacity 2s,transform 2s;pointer-events:none}
html.ev-solar-total ${C.sun}>.ev-disc{opacity:1;box-shadow:0 0 0 2px rgba(255,255,240,.9),0 0 26px 8px rgba(255,250,225,.75),0 0 70px 24px rgba(220,230,255,.35)}
html.ev-solar-annular ${C.sun}>.ev-disc{opacity:1;transform:scale(.82);box-shadow:0 0 0 ${Math.round(C.disc*.09)}px #ffd56a,0 0 24px 10px rgba(255,170,60,.6)}
html.ev-solar-partial ${C.sun}>.ev-disc{opacity:.96;transform:translate(34%,-22%)}
.ev-dim{position:absolute;inset:0;pointer-events:none;background:#080a28;opacity:0;transition:opacity 3s}
html.ev-solar-total .ev-dim{opacity:.5}html.ev-solar-annular .ev-dim{opacity:.18}html.ev-solar-partial .ev-dim{opacity:.1}
.ev-aurora{position:absolute;left:-15%;right:-15%;top:-4vh;height:58vh;pointer-events:none;opacity:calc((var(--night,0) - .55)*2.2);mix-blend-mode:screen}
.ev-aurora>b{position:absolute;inset:0;filter:blur(16px);animation:evAwave 150s ease-in-out infinite}
.ev-aurora i{position:absolute;top:0;height:100%;width:var(--w);left:var(--l);border-radius:45% 45% 50% 50%/30% 30% 70% 70%;transform-origin:50% 0;
  background:linear-gradient(180deg,rgba(150,90,255,0) 0%,rgba(150,90,255,.28) 14%,rgba(70,255,170,.6) 44%,rgba(60,220,255,.28) 72%,transparent 100%);
  animation:evCurtain var(--d) ease-in-out infinite alternate;animation-delay:var(--dl)}
@keyframes evCurtain{0%{transform:skewX(-14deg) scaleY(.82) translateX(-4%);opacity:.55}50%{opacity:1}100%{transform:skewX(16deg) scaleY(1.05) translateX(6%);opacity:.7}}
@keyframes evAwave{0%,100%{opacity:.25}20%{opacity:.9}45%{opacity:.5}70%{opacity:1}}
@media (prefers-reduced-motion:reduce){.ev-aurora>b,.ev-aurora i{animation:none}}
.ev-meteors{position:absolute;left:0;right:0;top:0;overflow:hidden;pointer-events:none;-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}
.ev-meteors .ev-meteor{position:absolute}
.ev-meteor{position:fixed;z-index:-1;width:170px;height:4px;border-radius:2px;pointer-events:none;background:linear-gradient(90deg,transparent,#fff 75%,#e6f0ff);box-shadow:0 0 10px #fff,0 0 20px #9cc8ff}`;
    document.head.appendChild(css);
    const m=document.querySelector(C.moon),s=document.querySelector(C.sun),sky=document.querySelector(C.sky);
    if(m&&!m.querySelector(".ev-shade"))m.insertAdjacentHTML("beforeend",'<i class="ev-shade"></i>');
    if(s&&!s.querySelector(".ev-disc"))s.insertAdjacentHTML("beforeend",'<i class="ev-disc"></i>');
    if(sky&&!sky.querySelector(".ev-dim")){const d=document.createElement("div");d.className="ev-dim";sky.appendChild(d)}
    // the northern lights shimmer across the night sky, coming and going in slow waves
    if(sky&&C.aurora!=="none"&&!sky.querySelector(".ev-aurora")){const a=document.createElement("div");a.className="ev-aurora";
      a.innerHTML="<b>"+[[2,16,17,0],[14,22,23,-6],[30,14,19,-11],[42,24,27,-3],[60,16,21,-15],[72,22,25,-8],[86,14,18,-2]].map(([l,w,d,dl])=>`<i style="--l:${l}%;--w:${w}%;--d:${d}s;--dl:${dl}s"></i>`).join("")+"</b>";
      sky.prepend(a)}
    apply();setInterval(apply,60000);
    // tap the sun or moon during an eclipse; tap a falling star during a meteor shower
    document.addEventListener("click",e=>{
      if(e.target.closest("button,a,input,select,textarea,label"))return;
      const hit=(el,p)=>{if(!el)return false;const r=el.getBoundingClientRect();return e.clientX>=r.left-p&&e.clientX<=r.right+p&&e.clientY>=r.top-p&&e.clientY<=r.bottom+p};
      const ev=today(),night=window.SKY&&SKY.isNight();
      for(const st of document.querySelectorAll(".ev-meteor"))if(!st.dataset.got&&hit(st,44)){st.dataset.got=1;e.stopImmediatePropagation();
        window.SND&&SND.play("meteor");caught++;st.style.boxShadow="0 0 18px #fff,0 0 40px #ffe27a";
        if(caught===3){C.say(C.meteorName||"Meteor Watcher",`You caught three falling stars during the ${ev.shower||"meteor shower"}.`);C.secret("meteor")}return}
      if(e.target.closest(C.skip))return;
      const lunar=night&&ev.lunar&&hit(document.querySelector(C.moon),12),solar=!night&&ev.solar&&hit(document.querySelector(C.sun).querySelector(".ev-disc"),20);
      if(lunar||solar){e.stopImmediatePropagation();window.SND&&SND.play("eclipse");
        C.say("Eclipse Chaser",lunar?{total:"A blood moon! Earth's shadow turned the moon red tonight.",partial:"Earth's shadow is taking a bite out of the moon tonight.",penumbral:"The moon looks a little dusky tonight. Earth's faint outer shadow is passing over it."}[ev.lunar]
          :{total:"A total solar eclipse! The moon covered the sun completely.",annular:"A ring of fire! The moon is too small to cover the whole sun today.",partial:"The moon is taking a bite out of the sun today."}[ev.solar]);
        C.secret("eclipse")}
    },true);
  }
  function apply(){if(!C)return;const ev=today(),h=document.documentElement,night=!window.SKY||SKY.isNight();
    const set=(c,on)=>h.classList.toggle(c,!!on);
    ["total","partial","penumbral"].forEach(k=>set("ev-lunar-"+k,night&&ev.lunar===k));
    ["total","annular","partial"].forEach(k=>set("ev-solar-"+k,!night&&ev.solar===k));
    set("ev-super",ev.supermoon);set("ev-blue",ev.blue&&!ev.lunar);set("ev-shower",night&&ev.shower);
    window.SND&&SND.refresh&&SND.refresh();
    clearTimeout(meteorT);if(night&&ev.shower)meteorT=setTimeout(meteor,2000+Math.random()*5000)}
  function meteor(){if(document.visibilityState==="visible"&&!R){const s=document.createElement("div");s.className="ev-meteor";
      // a long run across the sky behind the page's cards, quick but catchable once it comes out from behind them
      const x=-60+Math.random()*innerWidth*.35,y=4+Math.random()*innerHeight*.28,a=14+Math.random()*16;s.style.left=x+"px";s.style.top=y+"px";const sky=C.sky&&document.querySelector(C.sky),bh=sky&&C.behind&&sky.querySelector(C.behind);
      let box=sky&&sky.querySelector(".ev-meteors");if(sky&&!box){box=document.createElement("div");box.className="ev-meteors";bh?bh.before(box):sky.appendChild(box)}
      if(box){const hz=C.horizon&&document.querySelector(C.horizon),hr=hz&&hz.getBoundingClientRect();box.style.height=(hr&&hr.height?hr.top+hr.height*.45:innerHeight*.7)+"px";box.appendChild(s)}else document.body.appendChild(s);
      const dx=Math.max(520,innerWidth*.75)+Math.random()*200,ms=innerWidth<700?5:3;/* phones keep the slower speed: less open sky to catch them in */s.animate([{transform:`translate(0,0) rotate(${a}deg)`,opacity:0},{opacity:1,offset:.06},{opacity:1,offset:.9},{transform:`translate(${dx}px,${dx*Math.tan(a*Math.PI/180)}px) rotate(${a}deg)`,opacity:0}],{duration:dx*ms,easing:"linear"}).onfinish=()=>s.remove()}
    const ev=today();if((!window.SKY||SKY.isNight())&&ev.shower)meteorT=setTimeout(meteor,3000+Math.random()*7000)}
  return {today,init,apply,meteor};
})();
window.EV=EV;
/* "First of the day": after a date is over everywhere, ask the server whether this device finished that date's Daily soonest
   after its own midnight (only the minutes after midnight are ever sent). */
YS.checkFirst=async function(onWin){
  if(window.dropinDone||!navigator.onLine)return;const key="dropin:firstchk",done=store.get(key)||[];
  const add=(d,n)=>new Date(Date.parse(d+"T12:00:00Z")+n*864e5).toISOString().slice(0,10);
  for(const d of [add(dayKey,-1),add(dayKey,-2),add(dayKey,-3)]){
    if(done.includes(d)||!store.get(`dropin3:${d}:main`))continue;
    try{const API=location.hostname.endsWith("discordsays.com")?"":"https://drop-in-daily-bot.towfiq-aziz11.workers.dev",dev=store.get("dropin:dev");if(!dev)return;
      const r=await fetch(`${API}/stats/first?day=${d}&dev=${dev}`);if(!r.ok)continue;const j=await r.json();if(j.pending)continue;
      done.push(d);store.set(key,done.slice(-10));if(j.first)onWin(d)}catch(e){}}
};
/* Drop-In: sky events, the first-of-the-day award, and food that turns up on the island now and then (a pizza, a banana, a burger,
   a rubber duck washed ashore). They're plain everyday objects, not any game's characters, and each one reacts to taps in its own way. */
{EV.init({moon:".fn-moon",sun:".fn-sun",sky:".fn-sky",behind:".fn-clouds",horizon:".fn-isle",meteorName:"Brace for Impact",disc:70,skip:"button,a,input,select,textarea,label,.tabs,.egg-toast,#app",
  say:(t,m)=>toast(t,m,"#c9a7ff"),secret:id=>secret(id)});
 const prettyDay=d=>new Date(d+"T12:00:00").toLocaleDateString(undefined,{month:"long",day:"numeric"});
 setTimeout(()=>YS.checkFirst(d=>{toast("First Drop",`You finished the ${prettyDay(d)} Daily Drop sooner after your midnight than anyone else did after theirs.`,"#f2c200");secret("first")}),4000);
 window.__checkFirst=()=>YS.checkFirst(d=>{toast("First Drop",`You finished the ${prettyDay(d)} Daily Drop sooner after your midnight than anyone else did after theirs.`,"#f2c200");secret("first")});

 /* food that sometimes turns up on the island, each with its own rarity (only one at a time, like the llama) */
 const css=document.createElement("style");css.textContent=`
.fn-isle .food{opacity:0;transition:opacity 1s}.fn-isle .food.on{opacity:1}
.fn-isle .food .bob{animation:fnDuckBob 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes fnDuckBob{50%{transform:translateY(-1.5px) rotate(-4deg)}}`;document.head.appendChild(css);
 const isvg=document.querySelector(".fn-isle svg"),NS="http://www.w3.org/2000/svg";
 // [kind, weight]  (higher weight = more common; the duck is the rarest)
 const FOODS=[["pizza",40],["burger",30],["banana",20],["duck",10]];
 // food turns up toward the sides of the island, away from the text in the middle of the page (the duck sits at the shore)
 const SPOTS={wide:[250,330,410,1420,1470],phone:[700,735,1465,1500],duck:{wide:1528,phone:1540}};
 let ground=null;const groundY=x=>{if(!ground){ground=[];const p=isvg.querySelector(".far"),L=p.getTotalLength();for(let d=0;d<L;d+=2){const q=p.getPointAtLength(d);if(q.y<119.5)ground.push(q)}}
   let best=120;for(const q of ground)if(Math.abs(q.x-x)<3)best=Math.min(best,q.y);return best};
 const pizzaG=()=>{let s='<g transform="scale(1 .55)">';for(let k=0;k<8;k++){const a0=k*Math.PI/4,a1=a0+Math.PI/4,p=(r,a)=>`${(r*Math.cos(a)).toFixed(1)} ${(r*Math.sin(a)).toFixed(1)}`,m=a0+Math.PI/8;
   s+=`<g class="sl"><path d="M0 0L${p(15,a0)}A15 15 0 0 1 ${p(15,a1)}Z" fill="#e3a043"/><path d="M0 0L${p(12.5,a0)}A12.5 12.5 0 0 1 ${p(12.5,a1)}Z" fill="#ffd45c"/><circle cx="${(8*Math.cos(m)).toFixed(1)}" cy="${(8*Math.sin(m)).toFixed(1)}" r="1.8" fill="#d0402f"/></g>`}return s+"</g>"};
 const ART={pizza:()=>`<g transform="translate(0 -5)">${pizzaG()}</g>`,
   banana:()=>`<g transform="translate(-14 -14) scale(.24)"><path class="fruit" d="M14 46Q62 96 116 28Q66 68 14 46Z" fill="#fff4c2"/><path class="skin" d="M10 44Q62 100 120 26Q118 22 114 24Q66 66 14 40Z" fill="#ffd93b" stroke="#c99a12" stroke-width="3"/>
     <path d="M116 26l6-6 3 3-5 5z" fill="#6b4a1e"/><path class="f1" d="M114 26Q126 40 122 58Q114 44 108 32Z" fill="#ffd93b" stroke="#c99a12" stroke-width="3" opacity="0"/>
     <path class="f2" d="M112 24Q132 22 140 36Q124 32 110 30Z" fill="#ffd93b" stroke="#c99a12" stroke-width="3" opacity="0"/><path class="f3" d="M110 24Q112 6 124 0Q118 14 114 28Z" fill="#ffd93b" stroke="#c99a12" stroke-width="3" opacity="0"/></g>`,
   burger:()=>`<g class="stack"><rect x="-11" y="-5" width="22" height="5" rx="2" fill="#e0a052"/></g>`,
   duck:()=>`<g class="bob"><ellipse cx="0" cy="-5" rx="9" ry="5.5" fill="#ffd93b"/><circle cx="4" cy="-12" r="4.5" fill="#ffd93b"/><path d="M8 -12.5q4 .5 4.5 2-2 1.4-5 1z" fill="#ff8a1e"/><circle cx="5" cy="-13.5" r=".9" fill="#1a1a2e"/></g>`};
 let food=null,foodT=0;
 function showFood(kind){if(!isvg||food||document.querySelector(".fn-isle .llama.on"))return;const f=FOODS.find(x=>x[0]===kind)||FOODS[0],ph=innerWidth<600?"phone":"wide",xs=SPOTS[ph],x=f[0]==="duck"?SPOTS.duck[ph]:xs[Math.random()*xs.length|0];
   const g=document.createElementNS(NS,"g");g.setAttribute("class","food "+f[0]);g.setAttribute("transform",`translate(${x} ${groundY(x)+(f[0]==="duck"?1:.5)}) scale(1.4)`);
   g.innerHTML=`<rect x="-26" y="-60" width="52" height="66" fill="transparent"/>`+ART[f[0]]();isvg.appendChild(g);food={g,kind:f[0],n:0};
   requestAnimationFrame(()=>g.classList.add("on"));clearTimeout(foodT);foodT=setTimeout(()=>hideFood(),180000)}
 function hideFood(after=0){const f=food;if(!f)return;food=null;clearTimeout(foodT);setTimeout(()=>{f.g.classList.remove("on");setTimeout(()=>f.g.remove(),1100)},after)}
 const pick=()=>{const tot=FOODS.reduce((a,f)=>a+f[1],0);let r=Math.random()*tot;for(const f of FOODS){if((r-=f[1])<0)return f[0]}return "pizza"};
 (function loop(first){setTimeout(()=>{if(!food&&document.visibilityState==="visible"&&Math.random()<.45)showFood(pick());loop()},first?15000+Math.random()*25000:60000+Math.random()*60000)})(true);
 window.__food=k=>{if(food){food.g.remove();food=null}showFood(k||pick())};
 function tapFood(){const f=food;if(!f||f.done)return;const g=f.g;f.n++;const n=f.n;
   if(f.kind==="pizza"){const sl=g.querySelectorAll(".sl:not(.gone)");const s=sl[Math.random()*sl.length|0];if(!s)return;s.classList.add("gone");s.style.transition="opacity .2s";s.style.opacity="0";window.SND&&SND.play("chomp");
     if(sl.length===1){f.done=1;toast("Pizza Party","Someone left a pizza on the island. Every last slice is gone now.","#ff8a3d");secret("pizza");hideFood(1500)}}
   else if(f.kind==="banana"){window.SND&&SND.play("peel",n);if(n<=3){g.querySelector(".f"+n).setAttribute("opacity","1");g.querySelector(".skin").setAttribute("opacity",String(1-n*.28))}
     if(n===3){f.done=1;setTimeout(()=>{window.SND&&SND.play("chomp");g.querySelector(".fruit").setAttribute("opacity","0");g.querySelector(".skin").setAttribute("opacity","0");
       window.SND&&SND.play("slip");toast("Peel Out","You ate the banana on the island and left the peel. Watch your step down there.","#ffd93b");secret("banana");hideFood(20000)},350)}}
   else if(f.kind==="duck"){window.SND&&SND.play("squeak",n);
     if(n===5){f.done=1;const d=g.querySelector(".bob");d.style.animation="none";d.animate([{transform:"rotate(0)"},{transform:"rotate(360deg)"}],{duration:600});
       toast("Squeaky Clean","Five squeaks for the rubber duck washed up on the island.","#ffd93b");secret("duck");hideFood(4000)}}
   else if(f.kind==="burger"){const st=g.querySelector(".stack"),L=[["#6b3a1e",3.5],["#ffcf3a",1.6],["#5cc244",2],["#e8473a",2]];
     if(n<10){const top=n===9,[c,h]=top?["#e0a052",6]:L[(n-1)%4],y=-5-[...st.children].slice(1).reduce((a,r)=>a+(+r.getAttribute("height")),0)-h;
       st.insertAdjacentHTML("beforeend",`<rect x="${top?-11:-12}" y="${y}" width="${top?22:24}" height="${h}" rx="${top?3:1}" fill="${c}"/>`);window.SND&&SND.play("layer",n)}
     else{f.done=1;window.SND&&SND.play("topple");[...st.children].forEach((r,k)=>{r.style.transformBox="fill-box";r.style.transformOrigin="50% 50%";
         r.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${(k%2?1:-1)*(8+k*3)}px,${10+k}px) rotate(${(k%2?1:-1)*(80+k*25)}deg)`,opacity:0}],{duration:900+k*50,fill:"forwards",easing:"ease-in"})});
       toast("Tall Order","Ten layers was one too many. The burger on the island toppled over.","#e0a052");secret("burger");hideFood(1500)}}}
 // the page's content sits above the island, so taps are matched by position
 document.addEventListener("click",e=>{if(!food||food.done||e.target.closest("button,a,input,select,textarea,label,.tabs,.egg-toast"))return;
   const r=food.g.getBoundingClientRect(),pad=16;if(e.clientX<r.left-pad||e.clientX>r.right+pad||e.clientY<r.top-pad||e.clientY>r.bottom+pad)return;e.stopImmediatePropagation();tapFood()},true);
}
/* ===== Locker: Battle Pass archive and Locker slots =====
   Every question you answer right unlocks Battle Pass tiers for the season it's about (one tier per question, two if it was in a
   Daily set, which also earns a Battle Star). Fill a season's pass to reach MAX TIER.
   Topic questions (weapons, bosses, Sprites, fishing and so on) fill 8 Locker slots that upgrade in rarity as you go. */
{const LKEY="dropin:locker",SEAS=DATA.seasons||[];
 const CHAPTERS=[...new Set(SEAS.map(g=>g.ch).filter(c=>/^Chapter \d+$/.test(c)))].sort((a,b)=>parseInt(a.slice(8))-parseInt(b.slice(8))).concat(SEAS.some(g=>g.ch==="Fortnite OG")?["Fortnite OG"]:[]);
 const PASS=SEAS.filter(g=>CHAPTERS.includes(g.ch));
 const PREFIX=id=>id.replace(/-[^-]*$/,"");
 const QN={};Q.forEach(q=>{if(q.era)QN[q.era]=(QN[q.era]||0)+1});
 // [id, name, groups, icon]
 const SLOTS=[
  ["weap","Weapons",["LOOTW","WSTATS","MYTHEX"],'<circle cx="12" cy="12" r="7.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="#fff"/>'],
  ["item","Items & Vehicles",["LOOTI","LOOTV","POWERS"],'<rect x="7.4" y="1.6" width="9.2" height="3.4" rx="1" fill="#fff" opacity=".8"/><rect x="6.4" y="4.6" width="11.2" height="2.6" rx="1.1" fill="#fff"/><path d="M7.6 7.2h8.8c3.6 1.5 5.6 4.3 5.6 7.6 0 4.6-4 7.6-10 7.6S2 19.4 2 14.8c0-3.3 2-6.1 5.6-7.6z" fill="#fff"/><path d="M12 10.6l3.6 1.4v2.9c0 2.2-1.6 3.6-3.6 4.3-2-.7-3.6-2.1-3.6-4.3V12z" fill="rgba(0,0,0,.28)"/><path d="M4.6 12.6c.6-1.6 1.6-2.6 2.8-3.2" stroke="rgba(0,0,0,.18)" stroke-width="1.1" fill="none" stroke-linecap="round"/>'],
  ["boss","Bosses & Characters",["BOSS","CHARS","RECRUIT","CONNECT","OUTFITS"],'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="#fff"/><path d="M5 19h14v2H5z" fill="#fff"/>'],
  ["sprite","Sprites",["SPRITES","SPRITEV"],'<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" fill="#fff"/><circle cx="10.5" cy="14" r="1" fill="rgba(0,0,0,.35)"/><circle cx="13.5" cy="14" r="1" fill="rgba(0,0,0,.35)"/>'],
  ["wild","Wildlife & Fishing",["WILD","FISH"],'<path d="M2 12c3-4 8-6 13-4l5-3-1 7 1 7-5-3c-5 2-10 0-13-4z" fill="#fff"/><circle cx="7" cy="11" r="1.2" fill="rgba(0,0,0,.4)"/>'],
  ["music","Music & Emotes",["MUSIC","EMOTES","WORDS"],'<path d="M9 4l11-2v12.5A2.5 2.5 0 1 1 18 12V6l-7 1.3V17a2.5 2.5 0 1 1-2-2.4z" fill="#fff"/>'],
  ["collab","Collabs & Cosmetics",["COLLABS","COSLOCK","COSSHOP","SETS"],'<g transform="rotate(38 12 12)"><rect x="10.8" y="6" width="2.6" height="16.5" rx="1.1" fill="#fff"/><path d="M1.6 10.6C4.6 5 9 3.6 12 3.6s7.4 1.4 10.4 7c-3-2.4-6.6-3.4-10.4-3.4S4.6 8.2 1.6 10.6z" fill="#fff"/><rect x="9.6" y="3.4" width="5" height="5" rx="1" fill="#fff"/><path d="M10.4 16h3.4M10.4 18.6h3.4" stroke="rgba(0,0,0,.25)" stroke-width="1"/></g>'],
  ["lore","Lore & Story",["LORE","STORY","SNAPLORE","ORIGINS"],'<path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" fill="#fff"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z" fill="#fff" opacity=".75"/>']];
 const SLOTOF={};SLOTS.forEach((s,i)=>s[2].forEach(g=>SLOTOF[g]=i));
 // Fortnite-style rarities a slot climbs through; each needs a share of that slot's questions (in points)
 const RAR=[["Common",0,"#7d8590","#5c636c"],["Uncommon",.1,"#69bb2d","#3f8a1c"],["Rare",.25,"#3ba7f2","#1c6ec2"],["Epic",.45,"#b25be2","#7b2fb0"],["Legendary",.7,"#e9893c","#b85618"]];
 const SLOTN=SLOTS.map(()=>0);Q.forEach(q=>{const i=SLOTOF[PREFIX(q.id)];if(i!=null)SLOTN[i]++});
 const need=(i,r)=>Math.max(r?3:0,Math.ceil(RAR[r][1]*SLOTN[i]));
 const rarOf=(p,i)=>{let r=0;RAR.forEach((x,k)=>{if(p>=need(i,k))r=k});return r};
 let lk=store.get(LKEY)||{};  // question id -> 1 seen, 2 caught, 3 caught in a Daily (Battle Star)
 const save=()=>{store.set(LKEY,lk);store.set("dropin:collsum",summary());window.gameAch&&gameAch.check()};
 const val=c=>c===3?2:c===2?1:0;
 const tier=era=>{let s=0;for(const id in lk){const q=QBYID[id];if(q&&q.era===era)s+=val(lk[id])}return Math.min(s,QN[era]||0)};
 const stars=era=>{let s=0;for(const id in lk){const q=QBYID[id];if(q&&q.era===era&&lk[id]===3)s++}return s};
 const slotPts=i=>{let s=0;for(const id in lk)if(SLOTOF[PREFIX(id)]===i)s+=val(lk[id]);return s};
 const passName=g=>`${g.ch==="Fortnite OG"?"OG":g.ch.replace("Chapter ","C")} · ${g.name.replace("Season ","S").replace("Mini Season","Mini").replace("Chapter 2 Remix","Remix").replace("OG mode","OG")}`;
 function record(q,ok,daily){if(!q||!q.id)return null;const full=QBYID[q.id]||q,old=lk[q.id]||0,nv=ok?(daily?3:2):1;
   const era=full.era,slot=SLOTOF[PREFIX(q.id)];
   const t0=era&&QN[era]?tier(era):0,r0=slot!=null?rarOf(slotPts(slot),slot):0;
   if(nv>old)lk[q.id]=nv;
   const out={};
   if(era&&QN[era]&&PASS.some(g=>g.id===era)){const t1=tier(era);if(t1>t0)out.tier={era,t:t1,n:QN[era],max:t1>=QN[era]}}
   if(slot!=null){const r1=rarOf(slotPts(slot),slot);if(r1>r0)out.slot={i:slot,r:r1}}
   return out}
 function summary(){const ps=PASS.filter(g=>QN[g.id]);const maxed=ps.filter(g=>tier(g.id)>=QN[g.id]);
   const chapterDone=CHAPTERS.filter(c=>{const x=ps.filter(g=>g.ch===c);return x.length&&x.every(g=>tier(g.id)>=QN[g.id])}).length;
   return {tiers:ps.reduce((a,g)=>a+tier(g.id),0),maxed:maxed.length,passes:ps.length,chapterDone,legendary:SLOTS.filter((_,i)=>rarOf(slotPts(i),i)===4).length}}
 let tEl=null,tT=0;
 function note(r){if(!r)return;
   if(r.slot){const s=SLOTS[r.slot.i],x=RAR[r.slot.r];window.SND&&SND.play("rarityUp",r.slot.r);toast(`${x[0]} unlocked!`,`Your ${s[1]} slot in the Locker is now ${x[0]}.`,x[2])}
   if(r.tier){const g=SEAS.find(x=>x.id===r.tier.era);
     if(r.tier.max){window.SND&&SND.play("maxTier");toast("MAX TIER!",`<svg class="lk-chest" viewBox="0 0 48 40" aria-hidden="true"><path d="M11 21 4 1h40l-7 20z" fill="#ffe27a" opacity=".75"/><path d="M17 21 14 6h20l-3 15z" fill="#fff8c8"/><rect x="6" y="21" width="36" height="16" rx="2" fill="#d99a3a" stroke="#0d1b3d" stroke-width="2"/><path d="M6 27h36" stroke="#8a5a1f" stroke-width="2"/><path d="M5 21 9 11h30l4 10z" fill="#f2b84b" stroke="#0d1b3d" stroke-width="2" stroke-linejoin="round"/><rect x="20" y="24" width="8" height="8" rx="1.5" fill="#ffd53d" stroke="#0d1b3d" stroke-width="2"/></svg>You maxed out the ${g.ch} ${g.name} Battle Pass: ${esc(g.sub)}.`,"#f2c200");return}
     window.SND&&SND.play("tierUp");if(tEl)tEl.remove();clearTimeout(tT);tEl=document.createElement("div");tEl.className="lk-note";
     tEl.innerHTML=`<b>Tier up!</b> ${esc(passName(g))} ${esc(g.sub)} <span>Tier ${r.tier.t}/${r.tier.n}</span>`;document.body.appendChild(tEl);
     requestAnimationFrame(()=>tEl.classList.add("on"));tT=setTimeout(()=>{const t=tEl;if(t){t.classList.remove("on");setTimeout(()=>t.remove(),400)}},3000)}}
 const _a=answer;answer=function(btn){const q=S&&S.qs&&S.qs[S.i],daily=S&&(S.mode==="main"||S.mode==="daily");_a(btn);if(q){const r=record(q,btn.dataset.o===q.a,daily);save();note(r)}};
 const _ea=endlessAnswer;endlessAnswer=function(btn){const q=S&&S.cur;_ea(btn);if(q){const r=record(q,btn.dataset.o===q.a,false);save();note(r)}};
 // first time: everything from past Daily sets counts
 if(!store.get("dropin:lockerfill2")){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);
     if(!/^dropin3:\d{4}-\d{2}-\d{2}:[a-z]+$/.test(k||""))continue;const v=JSON.parse(localStorage.getItem(k));
     if(v&&Array.isArray(v.ids))v.ids.forEach((id,j)=>{if(QBYID[id])record(QBYID[id],!!(v.marks&&v.marks[j]),true)})}}catch(e){}
   store.set("dropin:lockerfill2",1);save()}
 store.set("dropin:collsum",summary());

 const css=document.createElement("style");css.textContent=`
.lk-chest{float:left;width:58px;height:48px;margin:0 10px 2px 0;animation:lkChest .7s cubic-bezier(.2,1.7,.4,1) both}@keyframes lkChest{0%{transform:scale(.3) translateY(10px);opacity:0}100%{transform:none;opacity:1}}
.lk-note{position:fixed;left:50%;bottom:18px;z-index:1200;transform:translate(-50%,30px);opacity:0;transition:transform .3s,opacity .3s;max-width:92vw;
  background:#0b1f4d;color:#fff;border:2px solid #ffd53d;border-radius:8px;padding:9px 14px;font:600 16px/1.3 var(--cond,system-ui);letter-spacing:.3px;box-shadow:0 8px 20px rgba(0,0,40,.4)}
.lk-note.on{transform:translate(-50%,0);opacity:1}.lk-note b{color:#ffd53d;font-family:var(--display);font-weight:400;letter-spacing:.5px;text-transform:uppercase;margin-right:4px}.lk-note span{opacity:.8;margin-left:6px}
.lk-h{font-family:var(--display);font-size:30px;text-transform:uppercase;margin:0;letter-spacing:.5px}
.lk-sub{font-family:var(--cond);font-weight:600;color:#5a6a85;letter-spacing:.3px}
.lk-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 20px}
.lk-slot{position:relative;border-radius:8px;padding:10px 8px 8px;text-align:center;color:#fff;overflow:hidden;background:radial-gradient(circle at 50% 30%,var(--r1),var(--r2) 75%);box-shadow:inset 0 -26px 0 rgba(0,0,0,.25),0 3px 0 rgba(0,0,0,.18)}
.lk-slot svg{width:44px;height:44px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}
.lk-slot b{display:block;font-family:var(--cond);font-weight:700;font-size:14px;line-height:1.1;margin-top:4px;text-transform:uppercase;letter-spacing:.4px}
.lk-slot small{display:block;font-family:var(--cond);font-weight:600;font-size:12px;opacity:.92;margin-top:8px}
.lk-slot.legend{box-shadow:inset 0 -26px 0 rgba(0,0,0,.25),0 0 0 2px #ffd98a,0 0 16px rgba(255,170,60,.6)}
.lk-chs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 12px}
.lk-chs button{font-family:var(--cond);font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:.4px;border:0;border-radius:6px;padding:6px 10px;cursor:pointer;background:#e3e9f5;color:#0b2a66;transform:skewX(-6deg)}
.lk-chs button[aria-pressed=true]{background:#0b3f8f;color:#fff}.lk-chs small{opacity:.75;margin-left:4px}
.lk-passes{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.lk-pass{position:relative;text-align:left;border:0;border-radius:8px;padding:10px 11px 11px;color:#fff;cursor:pointer;font:inherit;overflow:hidden;
  background:linear-gradient(160deg,var(--r1),var(--r2));box-shadow:0 3px 0 rgba(0,0,0,.2)}
.lk-pass.none{background:linear-gradient(160deg,#9aa4b4,#6b7486)}.lk-pass .id{font-family:var(--cond);font-weight:700;font-size:13px;letter-spacing:.6px;opacity:.9;text-transform:uppercase}
.lk-pass .nm{font-family:var(--display);font-size:22px;line-height:1.05;text-transform:uppercase;margin:3px 0 8px;letter-spacing:.3px;min-height:46px;display:flex;align-items:flex-end}
.lk-pass .bar{height:9px;border-radius:5px;background:rgba(0,0,0,.28);overflow:hidden}.lk-pass .bar span{display:block;height:100%;background:#ffd53d}
.lk-pass .tr{display:flex;justify-content:space-between;font-family:var(--cond);font-weight:700;font-size:13px;margin-top:5px;letter-spacing:.3px}
.lk-pass .max{position:absolute;top:8px;right:-24px;transform:rotate(35deg);background:#ffd53d;color:#3b2a00;font-family:var(--display);font-size:12px;padding:2px 26px;letter-spacing:.5px}
@media (max-width:480px){.lk-slots{grid-template-columns:repeat(2,1fr)}.lk-passes{grid-template-columns:repeat(2,1fr)}.lk-pass .nm{font-size:18px;min-height:38px}}
.lk-pop{position:fixed;inset:0;z-index:1300;background:rgba(5,15,45,.6);display:grid;place-items:center;padding:16px}
.lk-card{background:#fff;border-radius:10px;max-width:340px;width:100%;overflow:hidden;text-align:center;color:#13244a}
.lk-card .top{padding:16px;color:#fff;background:linear-gradient(160deg,var(--r1),var(--r2))}.lk-card h3{margin:4px 0 0;font-family:var(--display);font-size:28px;text-transform:uppercase;font-weight:400}
.lk-card p{margin:8px 16px;font-family:var(--cond);font-weight:600;font-size:16px}
/* tabs: play modes, then the other three, then the Locker and achievements */
#tab-seasons,#tab-where,#tab-bank{grid-column:span 4}#tab-locker,#tab-ach{grid-column:span 6;font-size:16px;letter-spacing:.4px}#tab-locker{order:7}#tab-ach{order:8}
@media (max-width:600px){#tab-locker{grid-column:span 1!important}#tab-ach{grid-column:span 1!important}#tab-bank{grid-column:1/-1!important}}`;document.head.appendChild(css);

 const passCol=(t,n)=>{if(!t)return null;const f=t/n;return f>=1?["#ffd53d","#e9893c"]:f>=.75?RAR[4].slice(2):f>=.5?RAR[3].slice(2):f>=.25?RAR[2].slice(2):RAR[1].slice(2)};
 let ch=0;
 function render(){
   const passes=PASS.filter(g=>QN[g.id]),maxed=passes.filter(g=>tier(g.id)>=QN[g.id]).length,tiers=passes.reduce((a,g)=>a+tier(g.id),0),all=passes.reduce((a,g)=>a+QN[g.id],0);
   const chs=CHAPTERS.map(c=>{const ps=passes.filter(g=>g.ch===c);return [c,ps.filter(g=>tier(g.id)>=QN[g.id]).length,ps.length]}).filter(x=>x[2]);
   if(ch>=chs.length)ch=0;const cur=chs[ch][0];
   app.innerHTML=`<div class="panel" id="lk-root">
    <h2 class="lk-h">Locker</h2>
    <div class="lk-sub">${tiers.toLocaleString()} of ${all.toLocaleString()} Battle Pass tiers · ${maxed}/${passes.length} passes at MAX TIER</div>
    <p style="margin:8px 0 4px">Every question you get right unlocks a tier in the Battle Pass for its season. Daily Drop and By Difficulty hits unlock two tiers and earn a <b style="color:#c99700">★ Battle Star</b>.</p>
    <h3 class="ach-h">Locker slots</h3>
    <div class="lk-slots">${SLOTS.map((s,i)=>{const p=slotPts(i),r=rarOf(p,i),x=RAR[r],nx=RAR[r+1];
      return `<div class="lk-slot ${r===4?"legend":""}" style="--r1:${x[2]};--r2:${x[3]}"><svg viewBox="0 0 24 24">${s[3]}</svg><b>${esc(s[1])}</b><small>${x[0]}${nx?` · ${p}/${need(i,r+1)}`:" · MAXED"}</small></div>`}).join("")}</div>
    <h3 class="ach-h">Battle Passes</h3>
    <div class="lk-chs">${chs.map((c,i)=>`<button data-c="${i}" aria-pressed="${i===ch}">${esc(c[0].replace("Chapter ","Ch "))}<small>${c[1]}/${c[2]}</small></button>`).join("")}</div>
    <div class="lk-passes">${passes.filter(g=>g.ch===cur).map(g=>{const n=QN[g.id],t=tier(g.id),col=passCol(t,n),st=stars(g.id);
      return `<button class="lk-pass ${col?"":"none"}" data-id="${g.id}" style="${col?`--r1:${col[0]};--r2:${col[1]}`:""}">${t>=n?'<span class="max">MAX</span>':""}
       <div class="id">${esc(g.ch==="Fortnite OG"?"Fortnite OG":g.ch+" · "+g.name)}</div><div class="nm">${esc(g.sub)}</div>
       <div class="bar"><span style="width:${100*t/n}%"></span></div><div class="tr"><span>Tier ${t}/${n}</span><span>${st?`★ ${st}`:""}</span></div></button>`}).join("")}</div></div>`;
   app.querySelectorAll(".lk-chs button").forEach(b=>b.onclick=()=>{ch=+b.dataset.c;render()});
   app.querySelectorAll(".lk-pass").forEach(b=>b.onclick=()=>card(b.dataset.id));
 }
 function card(id){const g=SEAS.find(x=>x.id===id),n=QN[id],t=tier(id),col=passCol(t,n)||["#9aa4b4","#6b7486"];let c=0,s=0;
   for(const k in lk){const q=QBYID[k];if(q&&q.era===id){if(lk[k]>=2)c++;else s++}}
   const o=document.createElement("div");o.className="lk-pop";
   o.innerHTML=`<div class="lk-card" role="dialog" aria-label="${esc(g.sub)}"><div class="top" style="--r1:${col[0]};--r2:${col[1]}"><div style="font-family:var(--cond);font-weight:700;letter-spacing:.6px;text-transform:uppercase">${esc(g.ch)} · ${esc(g.name)}</div><h3>${esc(g.sub)}</h3></div>
    <p style="font-size:20px;margin-top:14px">${t>=n?"MAX TIER":`Tier ${t} of ${n}`}</p><p>${c} hit${c===1?"":"s"} · ${s} miss${s===1?"":"es"} so far · ★ ${stars(id)} Battle Star${stars(id)===1?"":"s"}</p>
    <p style="font-weight:500;color:#5a6a85">Questions about this season turn up in the Daily Drop, Endless and Chapters &amp; Seasons.</p>
    <button class="btn" type="button" style="margin:6px 0 16px">Close</button></div>`;
   document.body.appendChild(o);const close=()=>o.remove();o.onclick=ev=>{if(ev.target===o)close()};o.querySelector(".btn").onclick=close}
 const tab=document.createElement("button");tab.className="tab";tab.setAttribute("role","tab");tab.id="tab-locker";tab.dataset.v="locker";tab.textContent="Locker";
 const achT=document.getElementById("tab-ach");achT?achT.before(tab):document.querySelector(".tabs").appendChild(tab);
 tab.onclick=()=>{S=null;document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b===tab)));render();scrollTo({top:0})};
 window.__locker={record,lk:()=>lk,render,collect(q){if(!q)return;const r=record(q,true,false);save();note(r)}};
}
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
   const show=()=>{if(!g.classList.contains("on")&&document.visibilityState==="visible"&&!document.querySelector(".fn-isle .food"))g.classList.add("on")};
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
