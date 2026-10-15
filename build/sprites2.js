// More Sprites: one effect question per Sprite, plus Sprite variants.
(function(){
const S=SEASONS.find(s=>s.id==="SPRITES");
const P=n=>G+n.replace(/ /g,"_").replace(/'/g,"%27");
S.qs.push(
 ["e","What does the Chapter 6 Water Sprite do when you throw it?","Heals with a burst and then a healing rain",["Floods the area","Puts out fires","Lets you swim on land"],"30 effective health right away, then 2 per tick for 10 seconds.",P("Water Sprite")],
 ["e","What does the Chapter 6 Air Sprite do when you throw it?","Makes an air field that boosts you up with Glider Redeploy",["Blows enemies away","Clears the storm","Gives you a jetpack"],"It lasts 10 seconds and has 3 uses.",P("Air Sprite")],
 ["e","What does the Batman Sprite do?","Launches you up and deploys the Bat Cape",["Throws Batarangs","Turns off the lights","Calls the Batmobile"],"It arrived in v41.20.",P("Batman Sprite")],
 ["e","What does the Duck Sprite do while you're emoting or jamming?","Refills your shield",["Makes you invisible","Quacks loudly","Gives you speed"],"2 to 8 shield per tick, scaling with level.",P("Duck Sprite")],
 ["e","What does the Ghost Sprite do while you reload?","Cloaks you",["Speeds up the reload","Heals you","Marks enemies"],"The cloak lasts 3 to 5 seconds depending on level.",P("Ghost Sprite")],
 ["e","What does the Fishy Sprite boost the most?","Swim speed",["Fishing luck","Jump height","Reload speed"],"Up to 200% faster swimming.",P("Fishy Sprite")],
 ["e","What does the Spooky Dash Sprite give you over time?","Up to three Spooky Dashes",["Candy","A pumpkin launcher","Cloak at night"],"It arrived in v42.30.",P("Spooky Dash Sprite")],
 ["m","What does the King Sprite do?","Makes your pickaxe deal 30 to 120 damage to players",["Crowns you after a win","Doubles your Bars","Summons guards"],"It arrived in v41.00.",P("King Sprite")],
 ["m","What does the Fire Sprite do after an opponent takes enough damage?","Spawns fire under them",["Sets your weapon on fire","Heals you","Burns their shield away"],"The damage needed drops from 150 to 50 as it levels.",P("Fire Sprite")],
 ["m","What does the Zero Point Sprite do while you heal?","Spawns a Shield Bubble Jr.",["Teleports you","Freezes time","Doubles the healing"],"It's a Mythic Sprite.",P("Zero Point Sprite")],
 ["m","What does the Boss Sprite do each level?","Raises max Health and Shield by 5",["Spawns a boss","Adds a Medallion","Raises damage by 5%"],"It tops out at +25.",P("Boss Sprite")],
 ["m","What does the Grim Sprite do to players who attack you?","Scans them",["Reflects damage","Slows them","Steals their ammo"],"For 3 to 5 seconds.",P("Grim Sprite")],
 ["m","What does the Seven Sprite reveal to your squad?","Enemy foot trails",["Chest locations","The next storm circle","Boss locations"],"It's a Legendary Sprite.",P("Seven Sprite")],
 ["m","What does the Striker Sprite give you when you mantle, hurdle or wall scramble?","Overdrive",["Shield","Ammo","Cloak"],"For 6 to 10 seconds.",P("Striker Sprite")],
 ["m","What does the Aura Sprite give you after dealing enough damage?","A Shock Rock charge",["A free reload","A Boon","Overshield"],"The damage needed drops as it levels.",P("Aura Sprite")],
 ["m","What does the Pollo Sprite do after you get an elimination?","Refills shield for you and nearby squadmates",["Spawns a chicken","Drops a chug jug","Marks the next enemy"],"It's a Mythic Sprite from v41.20.",P("Pollo Sprite")],
 ["m","What does the Ironmouse Sprite do when you're low on health?","Regenerates health with Cloak and low gravity",["Calls a teammate","Drops a Med Kit","Makes you invincible"],"60 to 100 effective health.",P("Ironmouse Sprite")],
 ["m","What does the Vini Jr. Sprite give you after sliding?","Overdrive",["A football","Shield","A speed boost for your squad"],"Sliding after a sprint also hits structures hard.",P("Vini Jr. Sprite")],
 ["m","What does the John Wick Sprite do to opponents you knock or eliminate?","Scans them, revealing nearby enemies",["Takes their weapons","Marks them for your squad forever","Drops gold coins"],"For 3 to 5 seconds.",P("John Wick Sprite")],
 ["m","What does the Crown Sprite need to become Mastered?","A Victory Royale",["10 eliminations","Opening 50 chests","Five days in a row"],"Mastering it unlocks its variants.",P("Crown Sprite")],
 ["h","What does the Dream Sprite do at Level 5?","Drops Legendary loot and auto-extracts",["Grants a Victory Crown","Turns into a Mythic","Resets your Sprites"],"At Levels 1 to 4 it drops random loot.",P("Dream Sprite")],
 ["h","What can the Punk Sprite give you at Level 5?","A chance at infinite ammo",["Infinite shield","A guitar weapon","A free reboot"],"Until then it does nothing.",P("Punk Sprite")],
 ["h","What does the Burnt Peanut do on each elimination?","Gives extra loot",["Explodes","Heals your squad","Marks the next enemy"],"20% to 60% extra, with a 10% Mythic chance at Level 5.",P("Burnt Peanut")],
 ["h","What does the Lootin' Llama Sprite sometimes give after you open an Ammo Box?","A free Rarity Upgrade",["A Supply Llama","500 Bars","A Mythic weapon"],"5% to 20% chance depending on level.",P("Lootin' Llama Sprite")],
 ["h","What does the Peeky Peely Sprite mark for your team?","Nearby rare Sprite variants",["Bananas","Chests","Supply Drops"],"It also reveals your location to others nearby.",P("Peeky Peely Sprite")],
 ["h","What does the Klombo Sprite give you at each level?","Random items",["More health","A bigger backpack","A Klomberry"],"It levels up only when you eat or drink items.",P("Klombo Sprite")],
 ["h","How many uses does a Chapter 6 Water Sprite have?","3",["1","2","5"],"Then it turns into a Sprite Ghost.",P("Water Sprite")],
 ["x","What rarity is the Burnt Peanut?","Mythic",["Legendary","Epic","Rare"],"It costs 6,750 Sprite Dust.",P("Burnt Peanut")],
 ["x","What happens to a Sprite's summon cost once it's Mastered at Level 5?","It's cut in half",["It becomes free","It doubles","It stays the same"],"Sprites go from Level 1 to Level 5.",G+"Sprites"],
 ["x","What does the Jonesy Sprite do after you take damage?","Recovers Health or Shield after a short delay",["Calls in Agent Jones","Gives you a shotgun","Marks your attacker"],"It costs just 100 Sprite Dust.",G+"Sprites"]
);
SEASONS.push(
{id:"SPRITEV",ch:"Loot & Lore",name:"Sprite Variants",sub:"Gold, Gummy, Galaxy and the rest",page:"Sprites",qs:[
 ["e","What does a Gold Sprite variant add?","Bonus XP from eliminations",["Double damage","Gold Bars","A golden glider"],"Almost every Sprite has a Gold variant.",P("Fire Sprite")],
 ["e","What does a Trick or Treat Sprite variant do?","Gives a chance to find candy in containers",["Turns enemies into pumpkins","Gives you a Halloween costume","Spawns zombies"],"It was added on October 8, 2026.",P("Spooky Dash Sprite")],
 ["m","What does a Gummy Sprite variant add?","20% more Sprite Dust when extracting",["Bouncy jumps","Extra healing","Candy drops"],"Gummy variants cost more to summon.",P("Fire Sprite")],
 ["m","What does a Galaxy Sprite variant add?","30% more ammo from world pickups",["Low gravity","Star-shaped shields","A Rift"],"It shows up on Sprites like Fire, Ghost and King.",P("Fire Sprite")],
 ["m","What does a Gem Sprite variant add?","30% less fall damage",["Shinier gliders","More Bars","Extra Sprite XP"],"Some Gem variants were never released.",P("Demon Sprite")],
 ["m","What does a Cube Sprite variant give you while you're in the storm?","Overdrive",["Healing","Cloak","Speed"],"Cube variants exist for Sprites like Fire and Dream.",P("Fire Sprite")],
 ["m","What does a Cheat Master Sprite variant do?","Makes every input correct when entering cheat codes",["Gives infinite ammo","Unlocks every POI","Reveals all chests"],"Crown, Klombo and Spooky Dash Sprites have one.",P("Klombo Sprite")],
 ["h","What does a Holofoil Sprite variant add?","A 5% chance for your squad to find rare Sprite variants in chests",["Holographic decoys","Extra shield","A shiny glider trail"],"Not every Holofoil variant was released.",P("Fire Sprite")],
 ["h","What does a Quack Sprite variant do?","Gives 50% of its Sprite XP to your other Sprites",["Quacks to scare enemies","Lets you swim faster","Spawns ducks"],"Fire and Zero Point Sprites have Quack variants.",P("Fire Sprite")],
 ["h","What does a Bounty Hunter Sprite variant do?","Gives a chance to find Sprites when eliminating opponents",["Marks the top player","Doubles gold from eliminations","Spawns a bounty board"],"The Spooky Dash Sprite has one.",P("Spooky Dash Sprite")],
 ["h","What does a Loot Hacker Sprite variant do?","Raises the chance of items spawning from Loot Hacks",["Opens locked vaults","Upgrades chests to Legendary","Steals enemy loot"],"It came with Chapter 7 Season 4's hacking theme.",P("Spooky Dash Sprite")],
 ["x","How much more does a Special variant of the Demon Sprite cost than the base?","1,300 Sprite Dust",["500 Sprite Dust","2,000 Sprite Dust","It costs the same"],"The base is 2,700 and the variants are 4,000.",P("Demon Sprite")],
 ["x","Which Sprite has no variants at all?","Burnt Peanut",["Fire Sprite","Duck Sprite","Zero Point Sprite"],"Pollo, Vini Jr., Ironmouse and John Wick Sprites have none either.",P("Burnt Peanut")],
 ["x","What rarity are Sprite variants like Gold and Gummy listed as?","Special",["Mythic","Exotic","Legendary"],"Base Sprites range from Rare to Mythic.",P("Duck Sprite")],
]}
);
})();
