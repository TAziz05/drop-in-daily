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
     <div class="ach-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
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
 ["driver","Good Manners","Thanked the bus driver","While dropping, someone up front deserves a thank-you."]];
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
   ["hunter","Secret Hunter","Find every secret",s=>[s.secrets,5]]]});
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
}
