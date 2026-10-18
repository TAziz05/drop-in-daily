// Plans the daily questions for the next 200 days, starting the day after tomorrow (Eastern).
// Picks the questions that have gone longest without being served (new questions first), and keeps
// look-alike questions (same wording, e.g. "How long did this season last?") at least 5 days apart.
// Writes out/schedule.json: {"YYYY-MM-DD": {e:[ids], m:[ids], h:[ids], x:[ids], main:[ids]}}
const fs=require("fs");
const Q=JSON.parse(fs.readFileSync(__dirname+"/out/data.json","utf8")).questions;
const histFile=__dirname+"/history.json",history=fs.existsSync(histFile)?JSON.parse(fs.readFileSync(histFile,"utf8")):{};
const MIX={e:1,m:1,h:2,x:1},PER=5,DAYS=200,GAP=5,DAY=864e5;
const key=q=>q.t+"|"+q.q+"|"+q.a;
const fam=q=>q.q.toLowerCase().replace(/\d+/g,"#").replace(/[^a-z# ]/g,"").trim();
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const last={},famLast={};
const byKey=Object.fromEntries(Q.map(q=>[key(q),q]));
for(const [d,sets] of Object.entries(history).sort())for(const ks of Object.values(sets))for(const k of ks){
  last[k]=d;const q=byKey[k];famLast[q?fam(q):k.split("|")[1].toLowerCase().replace(/\d+/g,"#").replace(/[^a-z# ]/g,"").trim()]=d;}
const et=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const t0=Date.UTC(+et.slice(0,4),+et.slice(5,7)-1,+et.slice(8,10));
const pools={e:[],m:[],h:[],x:[]};for(const q of Q)if(pools[q.t])pools[q.t].push(q);
const daysBetween=(a,b)=>Math.round((Date.parse(b)-Date.parse(a))/DAY);
const sched={};
for(let t=t0+2*DAY;t<t0+(DAYS+2)*DAY;t+=DAY){
  const d=new Date(t).toISOString().slice(0,10),day={},usedFam=new Set(),usedKey=new Set();
  for(const tier of ["x","h","m","e"]){
    const need=PER+MIX[tier];
    const order=pools[tier].map(q=>({q,k:key(q),l:last[key(q)]||"0000-00-00",r:hash(key(q)+"|"+tier)}))
      .sort((a,b)=>a.l<b.l?-1:a.l>b.l?1:a.r-b.r);
    const pick=[];
    for(const strict of [true,false]){
      for(const c of order){if(pick.length>=need)break;if(usedKey.has(c.k))continue;const f=fam(c.q);
        if(usedFam.has(f))continue;
        if(strict&&famLast[f]&&daysBetween(famLast[f],d)<GAP)continue;
        pick.push(c);usedKey.add(c.k);usedFam.add(f);}
      if(pick.length>=need)break;}
    for(const c of pick){last[c.k]=d;famLast[fam(c.q)]=d}
    day[tier]=pick.slice(0,PER).map(c=>c.q.id);day["_"+tier]=pick.slice(PER).map(c=>c.q.id);
  }
  day.main=[...day._e,...day._m,...day._h,...day._x];for(const s of ["_e","_m","_h","_x"])delete day[s];
  sched[d]=day;
}
fs.writeFileSync(__dirname+"/out/schedule.json",JSON.stringify(sched));
console.log("schedule: planned",Object.keys(sched).length,"days from",Object.keys(sched)[0]);
