// Update v43.10 (November 12, 2026): Buggy's Captain's Day, Miku & Teto Captain's Day, Kasane Teto Music Mini-Pass, new Sprites.
(function(){
const U=G+"Update_v43.10",TH=G+"Treasure_Hunters",KT=G+"Kasane_Teto",SBB=G+"Special_Buggy_Ball";
const add=(id,...q)=>{const S=SEASONS.find(s=>s.id===id);if(!S)throw new Error("no group "+id);S.qs.push(...q)};
add("C7MS",
 ["e","Which One Piece pirate arrived as this season's Boss at Buggy's Beachhead?","Buggy",["Arlong","Crocodile","Dracule Mihawk"],"He arrived on Captain's Day, November 12, 2026, with Update v43.10.",U],
 ["e","Which two virtual singers arrived on this season's Captain's Day on November 15, 2026?","Hatsune Miku and Kasane Teto",["Hatsune Miku and Kagamine Rin","Kasane Teto and Megurine Luka","Kagamine Len and Megurine Luka"],"They brought The Leekcapper and the Flapjack Rifle into the loot pool.",U],
 ["e","Which virtual singer headlined this season's TWINDRILL DIVA Music Mini-Pass?","Kasane Teto",["Hatsune Miku","Kagamine Rin","Megurine Luka"],"Buying the pass unlocks her Outfit right away.",KT],
 ["m","At which new POI did Hatsune Miku and Kasane Teto arrive this season?","Friendship Villa",["Melody Manor","Harmony Harbor","Encore Cove"],"They arrived on Captain's Day, November 15, 2026.",U],
 ["m","Which musician arrived on this season's second Captain's Day, bringing his own SMG?","Lil Uzi Vert",["Travis Scott","Playboi Carti","Lil Yachty"],"His weapon was Lil Uzi Vert's Lil' SMG (November 8, 2026).",TH],
 ["m","Which Mythic did you get for defeating Buggy this season?","Special Buggy Ball",["Buggy's Flying Knives","Clown Cannon","Chop-Chop Blade"],"He also dropped the Lever Action Shotgun.",U],
 ["m","Which Walk the Moon song came as a Jam Track in this season's TWINDRILL DIVA Music Mini-Pass?","Shut Up and Dance",["Anna Sun","Tightrope","One Foot"],"BIRDBRAIN, Chronicles of Destiny and Sa-Sen! came with it.",U],
 ["h","Which shotgun did Buggy drop this season, alongside his Mythic?","Lever Action Shotgun",["Dragon's Breath Shotgun","Tactical Shotgun","Gilded Dragoon Shotgun"],"It first arrived in Chapter 2 Season 5 (Update v15.20).",U],
 ["h","What changed about Boss weapons in Update v43.10 (as of November 2026)?","They became a guaranteed drop",["They were moved into Chests","They started costing Sprite Dust","They only dropped in Zero Build"],"Every Boss elimination drops one.",U],
 ["h","Which pickaxe came in Kasane Teto's TWINDRILL DIVA Music Mini-Pass?","Teto's Baguette Bonker",["Teto's Drill Driver","Twin Drill Smasher","Leek Swinger"],"The pass also had the Pearto Back Bling.",U],
 ["x","Besides throwing it by hand, how else can you use the Special Buggy Ball?","Load it into a Pirate Cannon",["Plant it as a trap","Kick it like a soccer ball","Roll it like a bowling ball"],"It's the Mythic version of the Explosive Cannon Ball.",SBB],
 ["x","Which pistol was listed as new for this season's third Captain's Day?","Super Flint-Knock Pistol",["Golden Flint-Knock Pistol","Super Hand Cannon","Enhanced Revolver"],"That Captain's Day (November 12, 2026) brought Buggy.",TH],
 ["x","Kasane Teto's Fortnite description calls her \"Your favorite ____ on the mic!\" Which word?","chimera",["robot","idol","rockstar"],"Her Outfit is in the Icon Series.",KT]
);
add("SPRITES",
 ["m","What does the Mini Miku Sprite grant when you emote with other players?","A Friendship Bubble",["A Shield Bubble","A Chug Splash","A Launch Pad"],"It arrived on November 15, 2026.",U],
 ["m","What does the Squiplash Sprite activate when your health is low?","A healing smoke",["A speed boost","A Shield Bubble","A Port-a-Fort"],"It arrived on November 15, 2026.",U],
 ["h","Which secret rare Sprite can grant regenerating Zero Point Dash charges?","Zee",["Blink","Dashy","Zipp"],"It arrived on November 15, 2026, in Treasure Hunters.",U]
);
})();
