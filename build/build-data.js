// Builds data.json: every question (general + seasons) with id, tier, season tag and source.
const fs=require("fs");
const bankSrc=fs.readFileSync(__dirname+"/general-bank.js","utf8");
const W="https://en.wikipedia.org/wiki/",G="https://fortnite.weirdgloop.org/w/";
const BANK=new Function(bankSrc+";return BANK;")();
let SEASONS=new Function("W","G",fs.readFileSync(__dirname+"/seasons-ch1-2.js","utf8")+fs.readFileSync(__dirname+"/seasons-ch3-7.js","utf8")+fs.readFileSync(__dirname+"/modes.js","utf8")+fs.readFileSync(__dirname+"/events.js","utf8")+fs.readFileSync(__dirname+"/loot.js","utf8")+fs.readFileSync(__dirname+"/odd.js","utf8")+fs.readFileSync(__dirname+"/easy.js","utf8")+fs.readFileSync(__dirname+"/bigpatch.js","utf8")+fs.readFileSync(__dirname+"/words.js","utf8")+fs.readFileSync(__dirname+"/chapters.js","utf8")+fs.readFileSync(__dirname+"/lore2.js","utf8")+fs.readFileSync(__dirname+"/sprites2.js","utf8")+fs.readFileSync(__dirname+"/connections.js","utf8")+fs.readFileSync(__dirname+"/update-v42-40.js","utf8")+";return SEASONS;")(W,G);

const fixText={"In what month were Fortnite removed from the App Store and Google Play?":"In what month was Fortnite removed from the App Store and Google Play?"};
const toHard=["Roughly how many live viewers did Travis Scott's first Fortnite show draw?","Which Fresh Prince of Bel-Air actor sued Epic over a dance emote?","Who won the E3 2018 Pro-Am with Ninja?","When did Creative mode launch?","When did Ranked mode arrive?","In what month was Fortnite removed from the App Store and Google Play?"];
const toMythic=["How many points did Bugha score in the 2019 solo World Cup final?","What was the codename for The End (Chapter 1's finale) in the game files?","Plug the numbers from the black hole into Google Maps and where do you land?","What is the Chug Jug called in the game files?","What is the max stack for the current (Chapter 5+) Shield Potion?","According to the Fortnite Wiki, how long does each Loop last?","Who founded the Imagined Order?","The Visitor of Reality Unknown was revealed to be who in disguise?","What was Doctor Slone's rank in the Imagined Order?","Where did the nickname 'Kevin' for the Cube come from?","In which Chapter 1 season did Kevin the Cube first appear?","In which Chapter 1 season was Tilted Towers added?","At which Battle Pass level was the Midas outfit unlocked in Chapter 2 Season 2?","Who won the 2019 World Cup Pro-Am?","Which team won the 2019 Creative Cup?","What peak concurrent player count did Epic report in November 2018?","On what date were Fortnite Ballistic and Festival's Battle Stage both removed?","Roughly how much of Epic did Tencent take in exchange for its support?","Fortnite grew out of an internal game jam after which Epic game shipped?","On what date did Fortnite return to the US App Store?","Fortnite was the first Switch game to offer what feature?"];
const era={
 "Which Marvel villain's gauntlet turned players into him in a 2018 limited-time mode?":"C1S4",
 "Which combat-free mode was built as a social space for concerts and hanging out?":"C2S2",
 "What is the Fortnite Crew?":"C2S5",
 "Which mode gives you your own island to build anything you like?":"C1S7",
 "When did Creative mode launch?":"C1S7",
 "Which Nintendo console got Fortnite in June 2018?":"C1S4",
 "In June 2025, Loopers boarded which Star Wars battle station to sabotage it?":"C6MS1",
 "Which French electronic duo got its own Fortnite experience in 2025?":"C6S4",
 "Who opened Winterfest 2024 with an in-game performance?":"C6S1",
 "Which mode removes building entirely?":"C3S2",
 "What does a Reboot Van let you do?":"C1S8",
 "Which toy company teamed up with Epic on a survival mode in December 2023?":"C5S1",
 "Who won the solo Fortnite World Cup in 2019?":"C1S9","How much did the 2019 solo World Cup champion take home?":"C1S9","Where were the 2019 World Cup finals held?":"C1S9",
 "Which duo won the 2019 World Cup duos final?":"C1S9","How many points did Bugha score in the 2019 solo World Cup final?":"C1S9","Who won the 2019 World Cup Pro-Am?":"C1S9","Which team won the 2019 Creative Cup?":"C1S9",
 "What was Travis Scott's 2020 in-game concert called?":"C2S2","Roughly how many live viewers did Travis Scott's first Fortnite show draw?":"C2S2",
 "Which DJ played Fortnite's first in-game concert in February 2019?":"C1S7",
 "With which chapter did Fortnite move to Unreal Engine 5?":"C3S1",
 "Which mode uses 40-player matches on smaller islands with respawns?":"C5S3",
 "How many players are in a Blitz Royale match?":"C6S3",
 "Which Chapter 1 location did the Season 4 comet hit?":"C1S4",
 "What was the Chapter 4 finale event called?":"C4OG",
 "Which rapper joined Snoop Dogg and Ice Spice at Remix: The Finale?":"C2R",
 "Which Marvel giant did Iron Man lead Bus Bombs against in The Devourer of Worlds?":"C2S4",
 "What was Ariana Grande's 2021 Fortnite concert called?":"C2S7",
 "In The Device event, what did Midas try to control to break the Loop?":"C2S2",
 "After Kevin the Cube dissolved into Loot Lake in 2018, what happened to the water?":"C1S5",
 "What destroyed Chapter 1's Tilted Towers during The Unvaulting Event?":"C1S8",
 "What is the name of the Chapter 7 island?":"C7S1",
 "Yuki's Revenge was a scrapped segment from which film series?":"C7S1",
 "Which DC hero led the Supernovas in the August 2025 Super Showdown?":"C6S3",
 "When did Ranked mode arrive?":"C4S2",
 "In what month was Fortnite removed from the App Store and Google Play?":"C2S3",
 "Which soccer star did a Fortnite emote after scoring in the 2018 World Cup final?":"C1S5",
 "Whose voice was recreated with AI for Darth Vader in 2025?":"C6MS1",
 "What kind of game was Fortnite Ballistic?":"C6S1",
 "Which Fortnite chapter takes place on the island Oninoshima?":"C6S1",
 "What was the codename for The End (Chapter 1's finale) in the game files?":"C1SX","Roughly how long were players locked out of the game during The End's black hole?":"C1SX",
 "The playlist image for The End shows The Visitor. Who actually built the rocket used in the event?":"C1SX","What was the Chapter 2 island created after The End?":"C1SX",
 "Plug the numbers from the black hole into Google Maps and where do you land?":"C1SX",
 "Which island was formed by Zero Fusion at the end of Chapter 3?":"C3S4","What was Chapter 3's finale event called?":"C3S4",
 "What was the Chapter 5 island called?":"C5S1","What was Chapter 6's finale event called?":"C6MS2",
 "In the Collision event, what did The Seven attack with a rebuilt Mecha?":"C3S2",
 "In The Final Showdown (July 2019), the Mecha Team Leader fought which monster?":"C1S9",
 "Where did the nickname 'Kevin' for the Cube come from?":"C1S5","In which Chapter 1 season did Kevin the Cube first appear?":"C1S5",
 "In which Chapter 1 season was Tilted Towers added?":"C1S2",
 "At which Battle Pass level was the Midas outfit unlocked in Chapter 2 Season 2?":"C2S2",
 "In what month and year did the first live event, the rocket launch, happen?":"C1S4",
 "What peak concurrent player count did Epic report in November 2018?":"C1S6",
 "When did Save the World stop being pay-to-play?":"C7S2","On what date were Fortnite Ballistic and Festival's Battle Stage both removed?":"C7S2",
 "On what date did Fortnite return to the US App Store?":"C6MS1","Fortnite was the first Switch game to offer what feature?":"C1S4",
};
// Season questions dropped because a general question already covers the same fact.
const dropSeason=["Which French duo got the Daft Punk Experience?","Which engine did Fortnite switch to with Chapter 3?","Which 40-player respawn mode launched in June 2024?","Which 32-player mode launched in June 2025?","Which event ended Fortnite: OG and Chapter 4?","Which giant villain loomed in the sky and ended the season?","Which pop star headlined the Rift Tour?","What was the Chapter 7 island called?","Whose AI-recreated voice did Darth Vader use in 2025?","What was the Chapter 6 island called?","What did Zero Fusion create at the end of Chapter 3?","Which event ended Chapter 3?","What was the Chapter 5 island called?","Which event ended the mini season and Chapter 6?","Which famous city was added to the map in January 2018?","Which golden agent was the Level 100 reward?"];

const out=[],TL={easy:"e",medium:"m",hard:"h"};
let found=new Set();
for(const [tier,list] of Object.entries(BANK)){list.forEach(x=>{
  let q=fixText[x.q]||x.q, t=TL[tier];
  if(toHard.includes(q)){t="h";found.add(q)} if(toMythic.includes(q)){t="x";found.add(q)}
  if(era[q])found.add(q);
  out.push({t,q,a:x.a,w:x.w,e:x.e,s:x.s,era:era[q]||null,grp:"G"});
})}
const missing=[...toHard,...toMythic,...Object.keys(era)].filter(q=>!found.has(q));
if(missing.length){console.error("Unmatched:",missing);process.exit(1)}
const seasonList=[];let dropped=0;
const wording=require(__dirname+"/season-wording.js");
for(const S of SEASONS){
  seasonList.push({id:S.id,ch:S.ch,name:S.name,sub:S.sub,url:S.url||G+S.page});
  for(const r of S.qs){if(dropSeason.includes(r[1])){dropped++;continue}
    out.push({t:r[0],q:wording(r[1],S,r[2]),a:r[2],w:r[3],e:r[4],s:r[5]||S.url||G+S.page,era:S.id,grp:S.id});}
}
if(dropped!==dropSeason.length){console.error("dropped",dropped,"of",dropSeason.length);process.exit(1)}
const LOCS=new Function(fs.readFileSync(__dirname+"/locations.js","utf8")+fs.readFileSync(__dirname+"/locations2.js","utf8")+";return LOCS.concat(LOCS2,LOCS3);")();
for(const r of LOCS){out.push({t:r[0],q:r[2],a:r[3],w:r[4],e:r[5],s:G+r[6],era:r[7],kind:"loc",clue:!!r[1],grp:"L"});}
// Questions judged casual enough for Easy (matched on their final wording).
const toEasy=new Set(JSON.parse(fs.readFileSync(__dirname+"/to-easy.json","utf8")));
let moved=0;for(const q of out)if(toEasy.has(q.q)&&q.t==="m"){q.t="e";moved++}
if(moved!==toEasy.size){console.error("toEasy matched",moved,"of",toEasy.size);process.exit(1)}
// Stable ids: group + running number within group.
const cnt={};for(const q of out){const k=q.grp==="G"?"G"+q.t.toUpperCase():q.grp;cnt[k]=(cnt[k]||0)+1;q.id=`${k}-${String(cnt[k]).padStart(2,"0")}`;delete q.grp}
// Validation
const errs=[];const seen=new Set();
for(const q of out){
  if(!["e","m","h","x"].includes(q.t))errs.push("tier "+q.id);
  if(q.w.length!==3)errs.push("needs 3 wrong "+q.id);
  if(q.w.includes(q.a)||new Set(q.w).size!==3)errs.push("dup option "+q.id);
  if(!/^https:\/\/(en\.wikipedia\.org|fortnite\.weirdgloop\.org|fortnite\.gg|fortnite\.fandom\.com|fortnite-archive\.fandom\.com)\//.test(q.s)&&!/^(Epic Games |Mark Rein )/.test(q.s)&&!/\(@\w+\) on X/.test(q.s))errs.push("source "+q.id);
  const key=(q.era||"")+"|"+q.q+(/^(Three of these|Which of these was a Chapter|Which (came|happened|wildlife arrived|Mythic came|Boon set came|Medallion set came|Exotic arrived|boss came|member of The Seven appeared|of these (came|happened|mechanics came|perk systems came|wildlife arrived)))/.test(q.q)?"|"+q.a:"");if(seen.has(key))errs.push("dup question "+q.id+" "+q.q);seen.add(key);
}
if(errs.length){console.error(errs.join("\n"));process.exit(1)}
fs.writeFileSync(__dirname+"/out/data.json",JSON.stringify({questions:out,seasons:seasonList}));
const by={};for(const q of out)by[q.t]=(by[q.t]||0)+1;
const perSeason={};for(const q of out)if(q.era)perSeason[q.era]=(perSeason[q.era]||0)+1;
console.log("total",out.length,"by tier",by);
console.log("per season",Object.entries(perSeason).map(([k,v])=>k+":"+v).join(" "));
console.log("min per season",Math.min(...seasonList.map(s=>perSeason[s.id]||0)));
