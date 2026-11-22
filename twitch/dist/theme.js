if(typeof Element!=="undefined"&&Element.prototype.animate){
const R=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
/* ---- sky ---- */
const cloud=(x,y,s,o)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="14" rx="70" ry="22" fill="#cfe6ff"/><circle cx="-34" cy="0" r="26" fill="#fff"/><circle cx="2" cy="-14" r="36" fill="#fff"/><circle cx="40" cy="2" r="24" fill="#fff"/><ellipse cx="0" cy="10" rx="66" ry="18" fill="#fff"/></g>`;
const layer=(list)=>{const one=`<svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${list.map(c=>cloud(...c)).join("")}</svg>`;return one+one};
const sky=document.createElement("div");sky.className="fn-sky";sky.setAttribute("aria-hidden","true");
sky.innerHTML=`<div class="fn-clouds">${layer([[120,140,.8,.55],[520,90,.6,.5],[820,240,.9,.5],[300,420,.7,.45]])}</div>
 <div class="fn-clouds b">${layer([[80,560,1.3,.95],[460,330,1.1,.9],[760,620,1.5,.95],[960,150,.9,.85]])}</div><div class="fn-storm"></div>`;
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
}
