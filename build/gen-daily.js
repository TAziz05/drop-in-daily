// Writes github/daily/YYYY-MM.json: each day's Daily Drop exactly as the website builds it,
// for the Discord bot. Covers the previous month through 12 months ahead.
const fs=require("fs"),{JSDOM}=require("jsdom");
const html=fs.readFileSync(__dirname+"/out/drop-in-daily.html","utf8");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://example.org/",beforeParse(win){win.scrollTo=()=>{}}});
const w=dom.window;const shownLabel=w.eval("shownLabel");
const T={e:"Common · Easy",m:"Rare · Medium",h:"Legendary · Hard",x:"Mythic · Impossible"};
const day0=Date.UTC(2026,9,13),out={};
const today=new Date(),start=Date.UTC(today.getFullYear(),today.getMonth()-1,1),end=Date.UTC(today.getFullYear()+1,today.getMonth()+1,1);
for(let t=start;t<end;t+=864e5){
  const d=new Date(t),key=d.toISOString().slice(0,10),dn=Math.abs(Math.round((t-day0)/864e5));
  const qs=w.mainSet(dn).map(q=>({id:q.id,t:q.t,tier:T[q.t],tag:shownLabel(q),q:q.q,opts:q.opts,a:q.opts.indexOf(q.a),e:q.e,s:q.s}));
  (out[key.slice(0,7)]??={})[key]=qs;
}
for(const f of fs.readdirSync(__dirname+"/../daily"))fs.unlinkSync(__dirname+"/../daily/"+f);
for(const [m,v] of Object.entries(out))fs.writeFileSync(__dirname+`/../daily/${m}.json`,JSON.stringify(v));
// sanity: today's default set equals mainSet(dayNum)
const a=JSON.stringify(w.mainSet().map(q=>q.id)),b=JSON.stringify(w.mainSet(w.eval("dayNum")).map(q=>q.id));
console.log("months",Object.keys(out).length,"check",a===b);
