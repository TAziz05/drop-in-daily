// Update v43.00 (November 1, 2026): Treasure Hunters, the Chapter 7 Mini Season (One Piece, Crossbones Isle, new Sprites).
(function(){
const U=G+"Update_v43.00",TH=G+"Treasure_Hunters",CI=G+"Crossbones_Isle";
const i=SEASONS.findIndex(s=>s.id==="C7S4");if(i<0)throw new Error("no group C7S4");
SEASONS.splice(i+1,0,{id:"C7MS",ch:"Chapter 7",name:"Mini Season",sub:"Treasure Hunters",page:"Treasure_Hunters",qs:[
 ["e","Which anime's world inspired this season's theme?","One Piece",["Naruto","Dragon Ball","Demon Slayer"],"Luffy, Nami and Usopp arrived in the Item Shop on November 1, 2026.",TH],
 ["e","What is this season's new Battle Royale island called?","Crossbones Isle",["Driftwood Isle","Jolly Roger Reef","Plunder Island"],"It arrived on November 1, 2026.",CI],
 ["e","Which One Piece captain spawns as a character at Loguetown (as of November 2026)?","Monkey D. Luffy",["Roronoa Zoro","Sanji","Nami"],"Usopp spawns there too.",G+"Loguetown"],
 ["m","How many players are this season's Battle Royale matches built for?","80",["100","64","50"],"Crossbones Isle was built for 80-player matches.",U],
 ["m","Which in-game currency was vaulted when this season began?","Gold Bars",["Sprite Dust","XP Coins","Battle Stars"],"Vending Machines were removed too.",U],
 ["m","What were hunters from across realities racing to find inside \"the Chest\" this season?","A Sliver of the Zero Point",["A Chaos Emerald","The key to Geno's Machine","A Reboot Cube"],"Doctor Slone said the Sliver was the final missing piece.",TH],
 ["m","Which enigmatic man urges The Looper to form alliances this season?","Captain X",["Geno","Doctor Slone","Jones"],"Slone warns against alliances.",TH],
 ["m","What does a Wanted Poster turn into this season?","A Sprite Treasure Map",["A Bounty Llama","A Vault Key","A Supply Drop flare"],"The map leads to a Sprite Chest.",U],
 ["m","Which two Devil Fruits arrived as items in Update v43.00?","Gum-Gum Fruit and Flame-Flame Fruit",["Smoke-Smoke Fruit and Ice-Ice Fruit","Chop-Chop Fruit and Gum-Gum Fruit","Flame-Flame Fruit and Dark-Dark Fruit"],"Both come from One Piece.",U],
 ["m","When a chest drops a Treasure Hunt reward this season, who gets it?","Everyone in your squad",["Only you","Only the squad leader","Whoever opens it next"],"Opening and breaking chests has a small chance to drop one.",TH],
 ["h","Which musician was this season's first Boss, fighting from a battleship?","A$AP Rocky",["Lil Uzi Vert","Travis Scott","Snoop Dogg"],"Defeating him gives his Shock Rocket and the Lil' Flacko Sprite.",U],
 ["h","With Gold Bars vaulted this season, what happened to Follower services?","They became free",["They cost Sprite Dust","They were removed","They cost XP"],"Pocket-O-Matics stayed in Zero Build.",U],
 ["h","What drops onto the map on this season's \"Captain's Days\"?","New weapons and Sprites",["Golden Battle Buses","Pirate ships full of loot","Free Item Shop items"],"The first one was November 1, 2026.",U],
 ["h","What does Mastery Monday give every Monday this season?","2x Sprite XP and 2x Sprite Dust",["Double Season XP","Free Battle Pass levels","A Mythic at the start of every match"],"Sprite Chests and Wanted Posters also show up more.",U],
 ["h","Which new single-fire shotgun arrived in Update v43.00?","Gilded Dragoon Shotgun",["Corsair Pump Shotgun","Galleon Shotgun","Bundlebuss Shotgun"],"The fast-firing Bundlebuss Repeater Rifle was new too.",U],
 ["h","What record does Crossbones Isle hold among Battle Royale maps?","The smallest to date",["The largest to date","The most named locations","The first with no water"],"It's also entirely toon-shaded.",CI],
 ["h","How much Effective Health does a Golden Apple grant, as of November 2026?","40",["50","25","75"],"Any overheal spills into Shield. It changed in Update v43.00.",U],
 ["x","Crossbones Isle is the second entirely toon-shaded Battle Royale map. Which was first?","Springfield Island",["Athena","Pinecone Peninsula","Lil Oasis"],"Springfield came with Fortnite | The Simpsons.",CI],
 ["x","Where does this season sit in Chapter 7?","Its fifth and final season",["Its fourth season","Its sixth season","Its first of two mini seasons"],"Chapter 7's end event is set for December 5, 2026.",TH],
 ["x","Which two One Piece characters were featured in this season's Battle Pass?","Portgas D. Ace and Nico Robin",["Monkey D. Luffy and Nami","Roronoa Zoro and Sanji","Usopp and Tony Tony Chopper"],"Jonesy, Cuddle Team Leader and Charlotte got anime looks.",U],
 ["x","Which style did gifting this season's Battle Pass unlock for both players?","Dark Kawaii Team Leader",["Dark Cuddle Team Leader","Kawaii Jonesy","Ghost Charlotte"],"Kawaii Team Leader spawns at Fortune's Fort.",TH]
]});
const add=(id,...q)=>{const S=SEASONS.find(s=>s.id===id);if(!S)throw new Error("no group "+id);S.qs.push(...q)};
add("SPRITES",
 ["e","Which Treasure Hunters Sprite heals you over time while you're in water?","Kelper",["Barry O'Fish","Lil' Squibbly","Chester"],"It arrived in Update v43.00.",U],
 ["m","Besides extra chest loot, what does the Chester Sprite cancel?","Fall damage",["Storm damage","Explosive damage","Water damage"],"It arrived in Update v43.00.",U],
 ["m","What does the Exmarks Sprite reveal?","Treasure Maps and Wanted Posters",["Enemy Sprites","Supply Drops","Fishing spots"],"At Max level it spawns a Treasure Map.",U],
 ["m","What does the Fortune Sprite variant reveal?","Nearby Chests",["Nearby enemies","Supply Drops","Fishing spots"],"It came with Update v43.00, alongside the Cursed variant.",U],
 ["m","What does the Re-Pete Sprite do?","Speeds up reloads, with a chance to refund ammo",["Repeats your last emote","Copies an enemy's weapon","Rebuilds broken walls"],"It arrived in Update v43.00.",U],
 ["h","Which Sprite did you get for defeating A$AP Rocky's Boss?","Lil' Flacko",["Lil' Squibbly","Re-Pete","Plundarrgh"],"It knocks enemies back with a shockwave when you land.",U],
 ["h","Which Treasure Hunters Sprite marks eliminations on the map, with a range that grows as it levels?","Halfpeel'd",["Wayfinder","Plundarrgh","Exmarks"],"It arrived in Update v43.00.",U],
 ["h","What's the downside of the Cursed Sprite variant?","Water damages you",["It slows you down","It drains Sprite Dust","It reveals you on the map"],"It boosts your chance of rare variants.",U],
 ["x","What does the Sweet Dreams Sprite give you at Max level?","A Mythic item",["A Legendary weapon","Full shield","A Golden Firework"],"It gives a random item every time it levels up.",U],
 ["x","Which umbrella did mastering 40 Sprites earn in Treasure Hunters?","Navigator's Nosedive",["Jolly Roger 'Brella","Sprite 'Brella","Captain's Canopy"],"A new Sprite Mastery page unlocks every week.",U]
);
})();
