// Oscar's Captain's Day (November 22, 2026), Treasure Hunt Week 4 and Update v43.11 (November 24, 2026).
(function(){
const TH=G+"Treasure_Hunters";
const add=(id,...q)=>{const S=SEASONS.find(s=>s.id===id);if(!S)throw new Error("no group "+id);S.qs.push(...q)};
add("C7MS",
 ["e","Which tiger arrived on this season's Captain's Day on November 22, 2026?","Oscar",["Montague","Megalo Don","Ares"],"He came as Privateer Oscar and brought The Tiger's Eye to the island.",TH],
 ["e","What did a countdown at The Chest point to after Update v43.11 this season?","The Out of Time live event",["The Zero Hour live event","The Last Voyage live event","The Last Stand live event"],"It appeared on November 24, 2026; the season ends with Out of Time on December 5, 2026.",TH],
 ["m","Which new location did Oscar bring to the island this season?","The Tiger's Eye",["The Tiger's Den","Claw Cove","The Striped Sloop"],"It arrived on November 22, 2026.",TH],
 ["m","Which shotgun arrived with Oscar on this season's November 22 Captain's Day, along with his own version of it?","Frenzy Auto Shotgun",["Twinfire Auto Shotgun","Hammer Pump Shotgun","Sovereign Shotgun"],"Oscar's version is Oscar's Frenzy Auto Shotgun.",TH],
 ["m","Which sea shanty was a Jam Track reward in this season's fourth Treasure Hunt week?","Wellerman",["Drunken Sailor","Leave Her Johnny","Santiano"],"Week 4 (November 22 to 29, 2026) was Kasane Teto's week.",TH],
 ["h","Which landmark did The Tiger's Eye replace this season?","Boogie Boat",["Baratie","Henry","The Salty Skull"],"Oscar brought it to the island on November 22, 2026.",TH],
 ["h","Which new kind of Sprite variant arrived on this season's November 22 Captain's Day, for Sprites like Kelper and Squiplash?","Gold",["Shadow","Crystal","Chrome"],"Sir Oscar the Second and its Fortune and Cursed versions were also unvaulted.",TH],
 ["h","Which car came as a reward in this season's fourth Treasure Hunt week?","Lamborghini Urus SE",["Corvette ZR1","Cadillac CT5-V Blackwing","G-Wagon"],"The other three were rewards in earlier Treasure Hunt weeks.",TH],
 ["x","Which shotgun was vaulted when Oscar arrived this season?","Auto Shotgun",["Gilded Dragoon Shotgun","Lever Action Shotgun","Headhunter Gilded Dragoon Shotgun"],"It was replaced by the Frenzy Auto Shotgun on November 22, 2026.",TH]
);
})();
