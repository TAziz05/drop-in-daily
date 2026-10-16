// Generates odd.js: "odd one out" questions built from the wiki's location and boss lists.
const fs=require("fs");
const G="https://fortnite.weirdgloop.org/w/";
const N=JSON.parse(fs.readFileSync(__dirname+"/ref/named.json","utf8"));
const CH={1:N["Chapter 1"],2:N["Chapter 2"],3:N["Chapter 3"],4:N["Chapter 4"],5:N["Chapter 5"],6:[...N["Chapter 6"],...N["Springfield"]],7:N["Chapter 7"]};
// Former/extra locations the island pages' "current" lists leave out. Used only to stop a
// place from being picked as the odd one out for a chapter it actually appeared in.
const EXTRA={1:["Fatal Fields","Viking Village"],2:["Sweaty Sands","Risky Reels","The Yacht","Steamy Stacks"],
 3:["Tilted Towers","Sleepy Sound","Condo Canyon","Coney Crossroads","Camp Cuddle","Logjam Lumberyard","Logjam Junction","Sanctuary","The Daily Bugle","Covert Cavern","Command Cavern","Shuffled Shrines","Butter Barn","The Joneses","Loot Lake","Lazy Lagoon","Shifty Shafts"],
 4:["Anvil Square","Breakwater Bay","The Citadel","Lonely Labs","Faulty Splits","Lonely Lodge","Shady Stilts"],
 5:["Lavish Lair","Ritzy Riviera","Snooty Steppes","Classy Courts","Fencing Fields","Hazy Hillside","Pleasant Piazza","Ruined Reels","Restored Reels","Brawler's Battleground","Sandy Strip","Lonely Labs"],
 6:["Dreamy Domain","Ranger's Rest","Harmony Hills","Bugswatter Beach","Creepy Camps","Viney Shafts","Pumpkin Pass","First Order Base","Outpost Enclave","Resistance Base","Vader Samurai's Solitude","Gourdy Gate","Freaky Fields","Mayor's Munchies"],
 7:["Treechopped Timbermill","Paws Inn","Mayor's Munchies","Freaky Fields"]};
const PAGE={1:"Athena",2:"Apollo",3:"Artemis",4:"Asteria",5:"Helios",6:"Named_Locations",7:"Named_Locations"};
const count={};for(const c in CH)for(const x of new Set(CH[c]))count[x]=(count[x]||0)+1;
const everIn=(x,c)=>CH[c].includes(x)||EXTRA[c].includes(x);
const FAMOUS=new Set(["Tilted Towers","Pleasant Park","Retail Row","Salty Springs","Lucky Landing","Dusty Depot","Paradise Palms","Lazy Links","Tomato Town","Moisty Mire","Polar Peak","Snobby Shores","Wailing Woods","Junk Junction","Haunted Hills","Shifty Shafts","Greasy Grove","Loot Lake","Lonely Lodge","Anarchy Acres","Flush Factory","Risky Reels","Lazy Lagoon","Frosty Flights","Neo Tilted","Mega Mall","Gotham City","Holly Hedges","Misty Meadows","Steamy Stacks","Dirty Docks","Craggy Cliffs","Frenzy Farm","The Agency","Weeping Woods","Lazy Lake","Catty Corner","Stark Industries","The Spire","Coral Castle","Chonker's Speedway","Rocky Reels","Brutal Bastion","MEGA City","Frenzy Fields","Mount Olympus","Grand Glacier","Nitrodrome","Castle Doom","The Underworld","Seaport City","Crime City","Supernova Academy","Wonkeeland","Sandy Strip","Green Hill Zone","Kamp Krusty","Evergreen Terrace","Springfield Nuclear Power Plant","Reality Tree","Tainted Towers","Doom's Domain","The Pyramid","Cartmanland","Latte Landing"]);
let seed=20261014;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};
const pick=(a,n)=>{const b=a.slice(),o=[];while(o.length<n&&b.length){o.push(b.splice(Math.floor(rnd()*b.length),1)[0])}return o};
const out=[],usedQ=new Set();
for(let c=1;c<=7;c++){
  const ins=[...new Set(CH[c])];
  const outsAll=[];for(let d=1;d<=7;d++)if(d!==c)for(const x of new Set(CH[d]))if(count[x]===1&&!everIn(x,c))outsAll.push([x,d]);
  for(let k=0;k<12;k++){
    const variant=k<8?"not":"was";
    let three,one,od;
    if(variant==="not"){three=pick(ins,3);[one,od]=outsAll[Math.floor(rnd()*outsAll.length)];}
    else{const o=pick(outsAll,3);three=o.map(z=>z[0]);one=pick(ins,1)[0];od=o.map(z=>z[1]);}
    const key=variant+c+one;if(usedQ.has(key)||three.includes(one))continue;usedQ.add(key);
    const all=[one,...three],fam=all.filter(x=>FAMOUS.has(x)).length;
    const far=variant==="not"?Math.abs(c-od)>=3:od.every(d=>Math.abs(c-d)>=2);
    const t=fam>=3||(fam>=2&&far)?"e":fam>=1?"m":"h";
    if(variant==="not")out.push([t,`Three of these were Chapter ${c} named locations. Which one wasn't?`,one,three,`${one} was a Chapter ${od} location.`,G+PAGE[od]]);
    else out.push([t,`Which of these was a Chapter ${c} named location?`,one,three,`The others came from other chapters' islands.`,G+PAGE[c]]);
  }
}
// Bosses by chapter, from the Bosses page. Names that were bosses in more than one chapter are left out.
const B={4:["The Ageless Champion","Cold Blooded Ace","Highcards","Wildguard Relik","Revenant Kado Thorne","Hearts Dealer","Diamonds Dealer"],
 5:["Valeria","Nisha","Oscar","Montague","Peter Griffin","Zeus","Hades","Ares","The Machinist","Ringmaster Scarr","Megalo Don","Doombot","Emma Frost","Mysterio","Doctor Doom","Krampus"],
 6:["Shogun X","The Night Rose","Fletcher Kane","Scorpion","Captain Phasma","Daigo","Kor","Mother of Thorns","Jason","Evil Homer","Witch Marge","Krusty","Moe","Scratchy"],
 7:["Beach Brutus","Human Bill","Gogo Yubari","Bigfoot","Yule Trooper","Ice King","Zadie","The Voidblade","Wolfe","Skeletor","Catwoman","Poison Ivy","Harley Quinn","Dr. Eggman"]};
for(const c of [4,5,6,7]){
  const outs=[];for(const d of [4,5,6,7])if(d!==c)for(const x of B[d])outs.push([x,d]);
  for(let k=0;k<6;k++){const three=pick(B[c],3);const [one,od]=outs[Math.floor(rnd()*outs.length)];const key="b"+c+one;if(usedQ.has(key))continue;usedQ.add(key);
    out.push([c===4?"x":"h",`Three of these were Chapter ${c} bosses. Which one wasn't?`,one,three,`${one} was a Chapter ${od} boss.`,G+"Bosses"]);}
}
const W="const W=0;";
fs.writeFileSync(__dirname+"/odd.js",'SEASONS.push({id:"ODD",ch:"Loot & Lore",name:"Odd One Out",sub:"Spot the one that doesn\'t belong",page:"Named_Locations",qs:[\n'+out.map(r=>" "+JSON.stringify(r).replace(/"https:\/\/fortnite\.weirdgloop\.org\/w\/([^"]+)"\]$/,'G+"$1"]')).join(",\n")+"\n]});\n");
console.log(out.length,out.filter(r=>r[0]==="e").length,"easy");
