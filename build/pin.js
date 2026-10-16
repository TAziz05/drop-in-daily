// Freezes the daily questions for yesterday, today and tomorrow (Eastern) to exactly what the
// LIVE site (origin/main) serves, so publishing new questions never changes a day already in play.
// Writes out/pinned.json: {"YYYY-MM-DD": {main:[...], e:[...], m:[...], h:[...], x:[...]}}
const fs=require("fs"),{execSync}=require("child_process"),{JSDOM}=require("jsdom");
const out=__dirname+"/out/pinned.json";
let html="";
try{execSync("git fetch -q origin main",{cwd:__dirname,stdio:"ignore"})}catch(e){}
try{html=execSync("git show origin/main:index.html",{cwd:__dirname,maxBuffer:1<<28}).toString()}catch(e){}
if(!/function mainSet\(dn=dayNum\)/.test(html)){fs.writeFileSync(out,"{}");console.log("pin: live page not found, nothing pinned");process.exit(0)}
const w=new JSDOM(html,{runScripts:"dangerously",url:"https://example.org/",beforeParse(win){win.scrollTo=()=>{}}}).window;
const todays=w.eval("todays"),slotStart=w.eval("slotStart"),mainSet=w.eval("mainSet");
const et=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const t0=Date.UTC(+et.slice(0,4),+et.slice(5,7)-1,+et.slice(8,10)),day0=Date.UTC(2026,9,13),pins={};
for(const off of [-1,0,1]){
  const t=t0+off*864e5,key=new Date(t).toISOString().slice(0,10),dn=Math.round((t-day0)/864e5);
  if(dn<2)continue;
  const p={main:JSON.parse(JSON.stringify(mainSet(dn)))};
  for(const tier of ["e","m","h","x"])p[tier]=JSON.parse(JSON.stringify(todays(tier,5,undefined,slotStart(tier,dn),dn)));
  pins[key]=p;
}
fs.writeFileSync(out,JSON.stringify(pins));
console.log("pin: froze",Object.keys(pins).join(", "),"from the live site");
