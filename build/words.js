// Mark Rein's "word" for each season (posted on X before each season) and fortnite.gg weapon stats.
(function(){
const MR="Mark Rein (@MarkRein) on X";const FX="Fortnite (@Fortnite) on X";const FS="Fortnite Status (@FortniteStatus) on X profile, Oct 15, 2026";
const WORDS=[["C1S8","Bananas"],["C2S4","Superb"],["C2S5","Chaotic"],["C2S6","Wild"],["C2S7","👽"],["C2S8","Purple"],["C3S1","Sliding"],["C3S3","Chill"],["C4S1","Cycle"],["C4S2","Neon"],["C4S4","Heist"],["C4OG","Rewind"],["C5S1","#SavePeely"],["C5S2","Wings"],["C5S3","Nitro"],["C5S4","Absolute"],["C2R","Remix"],["C6S1","Beautiful"],["C6MS1","Apprentice"],["C6S2","Pickled"],["C6S3","S-Tier"],["C6S4","Orbital"],["C6MS2","Shard-a-ma-jig"],["C7S1","Dodecahedron"],["C7S2","Skyzips"],["C7S3","Exfil"],["C7S4","Hackers"]];
const DATES={C6MS2:"Oct 29, 2025",C7S1:"Nov 27, 2025",C7S2:"Mar 16, 2026",C7S3:"Jun 2, 2026",C7S4:"Aug 6, 2026"};
const EMOJI=["👽","🛸","🤖","👾"];
const words=WORDS.map(w=>w[1]).filter(w=>w!=="👽");
WORDS.forEach(([id,word],i)=>{
  if(id==="C2R")return; // the season's own name gives this one away; asked the other way round below
  const S=SEASONS.find(s=>s.id===id);if(!S)throw new Error("no season "+id);
  let wrong;
  if(word==="👽")wrong=EMOJI.slice(1);
  else{const pool=words.filter(w=>w!==word);wrong=[pool[(i*7+3)%pool.length],pool[(i*11+5)%pool.length],pool[(i*13+9)%pool.length]];
    // make sure the three are different
    wrong=[...new Set(wrong)];let k=1;while(wrong.length<3){const c=pool[(i+k*5)%pool.length];if(!wrong.includes(c))wrong.push(c);k++}}
  const src=MR+(DATES[id]?", "+DATES[id]:"");
  S.qs.push(["h",word==="👽"?"Mark Rein's \"word\" for this season wasn't a word at all. Which emoji did he post?":"Epic's Mark Rein posts one \"word\" before every season. What was his word for this season?",word,wrong,word==="👽"?"It fit a season all about the alien invasion.":"Fans ask him for his word before each new season.",src]);
});
SEASONS.push(
{id:"FNX",ch:"Events & Gameplay",name:"Fortnite on X",sub:"Most-liked posts and follower counts",url:W+"Fortnite",qs:[
 ["e","As of October 2026, @Fortnite's most-liked post on X teased a crossover with which game?","Five Nights at Freddy's",["Dragon Ball Super","Star Wars","Marvel"],"The post simply said \"IT'S ME!\" with a Freddy Fazbear video.",FX+", Sep 27, 2026"],
 ["m","@Fortnite's most-liked post, \"IT'S ME!\", said \"See you\" on which date?","October 1",["October 13","October 31","September 30"],"It tagged @fnaf_scottgames.",FX+", Sep 27, 2026"],
 ["h","Before the Five Nights at Freddy's announcement, @Fortnite's most-liked post teased which crossover?","Dragon Ball Super",["Naruto","Star Wars","Marvel"],"\"Speak. Name your wish...8.16.2022\" had about 283K likes.",FX+", Aug 11, 2022"],
 ["h","About how many likes did @Fortnite's most-liked post, \"IT'S ME!\", have in October 2026?","335K",["210K","450K","1M"],"The Dragon Ball Super teaser had about 283K.",FX+", Sep 27, 2026"],
 ["x","@Fortnite's most-liked post before the Five Nights at Freddy's one showed which dragon?","Shenron",["Porunga","Super Shenron","Haku"],"\"Speak. Name your wish\" is what you say when you summon him.",FX+", Aug 11, 2022"],
 ["x","About how many views did @Fortnite's most-liked post have by October 2026?","24 million",["5 million","12 million","50 million"],"It also had about 69K reposts.",FX+", Sep 27, 2026"],
 ["e","About how many followers did @Fortnite have on X in October 2026?","19.6 million",["4.3 million","9.8 million","35 million"],"It had 23 affiliate accounts too.",FX+" profile, Oct 15, 2026"],
 ["m","In October 2026, how did HYPEX's X following compare with Fortnite Status's?","HYPEX had about 200K more",["Fortnite Status had about 200K more","They were exactly tied","HYPEX had twice as many"],"HYPEX had about 4.3M followers and Fortnite Status about 4.1M.","HYPEX (@HYPEX) on X profile, Oct 15, 2026"],
]},
{id:"WORDS",ch:"Events & Gameplay",name:"Words of the Season",sub:"Mark Rein's one-word season teasers",url:W+"Mark_Rein",qs:[
 ["e","Which longtime Epic Games executive posts a one-word teaser before every new Fortnite season?","Mark Rein",["Tim Sweeney","Donald Mustard","Cliff Bleszinski"],"Fans reply asking for \"the word\" in the days before each launch.",W+"Mark_Rein"],
 ["m","Mark Rein's word for which season was \"Bananas\"?","Chapter 1 Season 8",["Chapter 1 Season 5","Chapter 2 Season 1","Chapter 1 Season X"],"Season 8 was the pirate and volcano season.",MR],
 ["m","Mark Rein's word for which season was \"Skyzips\", adding \"you're going to love them!\"?","Chapter 7 Season 2",["Chapter 7 Season 1","Chapter 7 Season 3","Chapter 6 Season 4"],"He posted it on March 16, 2026.",MR+", Mar 16, 2026"],
 ["m","Mark Rein's word for which season was \"Nitro\"?","Chapter 5 Season 3",["Chapter 5 Season 2","Chapter 4 Season 2","Chapter 6 Season 3"],"Chapter 5 Season 3 was Wrecked.",MR],
 ["m","Mark Rein's word for which season was \"#SavePeely\"?","Chapter 5 Season 1",["Chapter 5 Season 2","Chapter 4 Season OG","Chapter 6 Season 1"],"Peely needed saving in Chapter 5's first season.",MR],
 ["h","Mark Rein's word for which season was \"Dodecahedron\"?","Chapter 7 Season 1",["Chapter 6 Season 4","Chapter 7 Season 2","Chapter 6 Mini Season 2"],"He posted it on November 27, 2025.",MR+", Nov 27, 2025"],
 ["h","Mark Rein's word for which season was \"Pickled\"?","Chapter 6 Season 2",["Chapter 6 Season 1","Chapter 6 Season 3","Chapter 5 Season 4"],"His Chapter 6 Season 3 word was S-Tier.",MR],
 ["h","Mark Rein's word for which season was \"Exfil\"?","Chapter 7 Season 3",["Chapter 7 Season 2","Chapter 7 Season 4","Chapter 6 Season 2"],"He posted it on June 2, 2026.",MR+", Jun 2, 2026"],
 ["h","Mark Rein's word for which season was \"Rewind\"?","Chapter 4 Season OG",["Chapter 2 Remix","Chapter 4 Season 4","Chapter 5 Season 1"],"Season OG brought the Chapter 1 map back.",MR],
 ["m","Mark Rein's word for which season was simply \"Remix\"?","Chapter 2 Remix",["Chapter 4 Season OG","Chapter 6 Season 1","Chapter 5 Season 4"],"It closed out Chapter 5 in November 2024.",MR],
 ["h","Mark Rein's word for Galactic Battle was what?","Apprentice",["Padawan","Orbital","Skyzips"],"Galactic Battle was a Chapter 6 mini season.",MR],
 ["x","Which season's word did Mark Rein post on October 29, 2025: \"Shard-a-ma-jig\"?","Chapter 6 Mini Season 2",["Chapter 6 Season 4","Chapter 7 Season 1","Chapter 6 Mini Season 1"],"It was Fortnite | The Simpsons.",MR+", Oct 29, 2025"],
 ["x","Mark Rein's word for which season was \"Superb\"?","Chapter 2 Season 4",["Chapter 2 Season 3","Chapter 2 Season 5","Chapter 1 Season 8"],"Chapter 2 Season 4 was the Marvel season.",MR],
 ["x","Mark Rein's word for which season was \"Heist\"?","Chapter 4 Season 4",["Chapter 3 Season 3","Chapter 3 Season 4","Chapter 4 Season 3"],"Chapter 4 Season 4 was Last Resort, a heist season.",MR],
 ["x","Mark Rein's word for which season was \"Cycle\"?","Chapter 4 Season 1",["Chapter 4 Season 2","Chapter 3 Season 3","Chapter 3 Season 1"],"Chapter 4 Season 2's word was Neon.",MR],
]},
{id:"WSTATS",ch:"Loot & Lore",name:"Weapon Stats",sub:"Numbers from the Fortnitemares 2026 loot pool",url:"https://fortnite.gg/weapons",qs:[
 ["e","In October 2026's Battle Royale loot pool, which weapon had the highest DPS at 374.4?","Mega Buster",["Enhanced Assault Rifle","Marker Bonerattler SMG","Pumpkin Launcher"],"It's a Rare explosive with a 75-shot magazine.","https://fortnite.gg/weapons"],
 ["e","Which Trick or Treat launcher was in October 2026's loot pool at Legendary rarity?","Pumpkin Launcher",["Easy Ride Pumpkin Launcher","Candy Corn Cannon","Mega Buster"],"It deals 137 damage per shot.","https://fortnite.gg/weapons"],
 ["e","Whose Mythic pistol, Masterpiece, held just 1 shot in early October 2026, before it was vaulted?","Midas'",["Jules'","Oscar's","Kit's"],"It hits for 125 damage.","https://fortnite.gg/weapons"],
 ["m","What was the Mega Buster's magazine size after the October 2026 buff?","75",["50","60","100"],"It went from 50 to 75.","https://fortnite.gg/weapons/changes"],
 ["m","How much damage did the Rare Mega Buster deal after its October 2026 buff?","144",["120","130","160"],"It was 120 before.","https://fortnite.gg/weapons/changes"],
 ["m","How many shells did the Pump Shotgun hold in October 2026's loot pool?","5",["4","6","8"],"It hit for 95 damage at Uncommon.","https://fortnite.gg/weapons"],
 ["m","Which shotgun in October 2026's loot pool held 10 shells?","8-Bit Shotgun",["Pump Shotgun","Sweeper Shotgun","Wood Stake Shotgun"],"Its fire rate was buffed from 1.35 to 1.4.","https://fortnite.gg/weapons"],
 ["m","Which Exotic pump shotgun hit for 119 in October 2026?","Overpowered Pump Shotgun",["Overclocked 8-Bit Shotgun","High Stakes' Shotgun","Enhanced 8-Bit Shotgun"],"The regular Pump hit for 95.","https://fortnite.gg/weapons"],
 ["m","How many rounds did Rebecca's Guns hold in October 2026's loot pool?","40",["25","34","50"],"They dealt 9 damage per shot at Uncommon.","https://fortnite.gg/weapons"],
 ["m","Which SMG had the highest DPS in October 2026's loot pool, at 212?","Marker Bonerattler SMG",["Bonerattler SMG","Frantic Rebecca's Guns","Rebecca's Guns"],"It was an Exotic from Trick or Treat.","https://fortnite.gg/weapons"],
 ["h","How much damage did the Uncommon Assault Rifle deal in October 2026?","31",["27","33","38"],"The Heavy Assault Rifle dealt 38.","https://fortnite.gg/weapons"],
 ["h","How many rounds did the Heavy Assault Rifle hold in October 2026?","24",["20","25","30"],"The regular Assault Rifle held 25.","https://fortnite.gg/weapons"],
 ["h","How much damage did the Mythic Enhanced Assault Rifle deal in October 2026?","37",["33","35","40"],"It dropped from bosses.","https://fortnite.gg/weapons"],
 ["h","How long was the Sweeper Shotgun's reload in October 2026's loot pool?","6.3 seconds",["2.94 seconds","4.2 seconds","4.86 seconds"],"It held 8 shells.","https://fortnite.gg/weapons"],
 ["h","How many shells did the Wood Stake Shotgun hold in October 2026?","4",["2","5","6"],"It's a Rare shotgun that deals 92.","https://fortnite.gg/weapons"],
 ["h","How many rounds did the Bonerattler SMG hold in October 2026?","34",["25","30","40"],"Its fire rate went from 10.4 to 10.6.","https://fortnite.gg/weapons"],
 ["h","Which weapon class were the Dual Fiend Hunters in October 2026's loot pool?","Bows",["Pistols","SMGs","Explosives"],"They held 14 shots.","https://fortnite.gg/weapons"],
 ["h","What did the Sideways Rifle's headshot multiplier change to in October 2026?","1.6x",["1.5x","1.75x","2x"],"It was 1.5x before.","https://fortnite.gg/weapons/changes"],
 ["h","How many weapons were in the casual Battle Royale loot pool just before the v42.40 update in October 2026?","23",["18","27","31"],"Consumables and utility items were listed separately.","https://fortnite.gg/weapons"],
 ["x","How much damage did Frantic Rebecca's Guns deal per shot after the October 2026 change?","8",["7","9","10"],"It went up from 7, while structure damage fell from 13 to 8.","https://fortnite.gg/weapons/changes"],
 ["x","What did the Mythic Enhanced Wrecker Revolver's damage drop to in October 2026?","83",["79","86","89"],"It was 89 before the nerf.","https://fortnite.gg/weapons/changes"],
 ["x","What did the Frantic Rebecca's Guns' reload time change to in October 2026?","1.36 seconds",["1.65 seconds","1.5 seconds","1.2 seconds"],"It used to take 1.65 seconds.","https://fortnite.gg/weapons/changes"],
 ["x","What was the Tactical Pistol's DPS in October 2026's loot pool?","179.4",["142.5","170.5","180.2"],"It held 15 rounds.","https://fortnite.gg/weapons"],
 ["x","How much damage did the Uncommon Dual Fiend Hunters deal after the October 2026 buff?","37",["34","35","40"],"They went up from 34.","https://fortnite.gg/weapons/changes"],
]}
);
SEASONS.push({id:"MUSIC",ch:"Loot & Lore",name:"Lobby Music",sub:"Music packs and their songs",url:"https://fortnite.fandom.com/wiki/Meet_Me_in_the_Sticks",qs:[
 ["x","In the \"Meet Me in the Sticks\" lobby music, what time does Sticks close?","9:06",["9:00","10:15","11:59"],"It's a Fishstick-themed music pack from Chapter 4 Season 2.","https://fortnite.fandom.com/wiki/Meet_Me_in_the_Sticks"],
 ["m","Which was the first Lobby Music ever sold in the Item Shop?","Marathon",["Star Power","Afterburner","Mellow Days"],"It cost 200 V-Bucks back in Season 8.",G+"Marathon"],
 ["h","Which emote shares its music with the Marathon lobby music?","Running Man",["Best Mates","Get Funky","Daydream"],"An unused percussion-only version of Marathon is in the game files.",G+"Marathon"],
 ["h","The Afterburner lobby music is a shortened theme from which other Epic game?","Robo Recall",["Unreal Tournament","Paragon","Shadow Complex"],"Seth Weedin composed it.",G+"Afterburner"],
 ["x","Which glider plays the same music as the Afterburner lobby music?","Hot Ride",["Mako","Snowflake","Aerial Assault One"],"Afterburner was Tier 54 of the Season 9 Battle Pass.",G+"Afterburner"],
 ["m","In which season was the Afterburner lobby music introduced?","Chapter 1 Season 9",["Chapter 1 Season 7","Chapter 1 Season 8","Chapter 1 Season X"],"It was a Battle Pass reward at Tier 54.",G+"Afterburner"],
 ["x","Which Battle Pass tier unlocked the original Star Power lobby music?","Tier 92",["Tier 63","Tier 87","Tier 100"],"It came with the Chapter 1 Season 8 pass, and the Star Power emote uses the same music.",G+"Star_Power_(Lobby_Music)"],
 ["h","In which season was the Star Power Remix lobby music introduced?","Chapter 2 Season 5",["Chapter 1 Season 8","Chapter 2 Season 4","Chapter 2 Season 6"],"It was Level 67 of that season's Battle Pass.",G+"Star_Power_Remix"],
 ["h","The Re-OG lobby music remixes the OG theme with which producer?","Metro Boomin",["Marshmello","Murda Beatz","Kenny Beats"],"Young Thug provides the vocals.",G+"The_Re-OG"],
 ["m","During which season could you unlock The Re-OG lobby music just by playing?","Chapter 4 Season OG",["Chapter 5 Season 1","Chapter 1 Season X","Chapter 2 Remix"],"Its description says \"Press play and go back in time...\"",G+"The_Re-OG"],
 ["h","Which lobby music from Winterfest 2019 belongs to the Nutcracker set?","The Crackdown",["Merry Mix","Mellow Days","Star Power Remix"],"It was a free Winterfest Challenge reward in Chapter 2 Season 1.",G+"The_Crackdown"],
 ["x","How did you unlock the Merry Mix lobby music?","Eliminate 3 players in The Spy Within",["Finish the Winterfest Challenges","Reach Battle Pass Level 100","Buy it for 200 V-Bucks"],"It remixes the Conflict and Enemy themes from Disco Domination.",G+"Merry_Mix"],
 ["h","Members of which band wrote the lyrics for \"Lord of the Wasteland\"?","3TEETH",["Periphery","Slipknot","Bring Me the Horizon"],"Motifs from the song can be heard in the Refinery event.",G+"Lord_of_the_Wasteland_(Lobby_Music)"],
 ["m","Which lobby music's ocean ruler sings about mola molas, anglerfish and belugas?","Swim Free",["Coral Chorus","Ahoy!","You're All Mine"],"It's part of the Tidal King set.","https://fortnite.fandom.com/wiki/Swim_Free_(Lobby_Music)"],
 ["x","Swim Free was the first lobby music to get which rarity?","Slurp Series",["Icon Series","Gaming Legends Series","Shadow Series"],"It was changed from Rare in Update v29.30.","https://fortnite.fandom.com/wiki/Swim_Free_(Lobby_Music)"],
 ["h","Which Periphery singer features on the \"You're All Mine\" lobby music?","Spencer Sotelo",["Corey Taylor","Oli Sykes","Jacoby Shaddix"],"The song belongs to the Underworld King set.",G+"You're_All_Mine_(Lobby_Music)"],
 ["m","Which lobby music is sung by a getaway driver who never leaves a trace?","Hungry for the Chase",["Find the Fury","The Crackdown","Swim Free"],"It's part of the Clutch Delivery set.",G+"Hungry_for_the_Chase"],
 ["x","Which emote uses the same music as \"Hungry for the Chase\"?","Pitcycle",["Get Funky","Phono Follies","Running Man"],"The lobby music was on Page 4 of the Chapter 4 Season 4 Battle Pass.",G+"Hungry_for_the_Chase"],
 ["h","\"You Don't Know Me\" reflects which character's feelings toward her sister Valeria?","Hope",["Nisha","Peely","Oscar"],"The song is also used in the I'm a Mystery emote.",G+"You_Don't_Know_Me_(Lobby_Music)"],
 ["x","Which solo project by Hoshikuma Minami made \"High Stakes Club\" and \"You Don't Know Me\"?","DEATHNYANN",["YOASOBI","Pegboard Nerds","Kenny Beats"],"The project started making Fortnite music in December 2022.",G+"DEATHNYANN"],
 ["h","Which quests unlocked the Queen's Anthem lobby music?","The Cube Queen Quests",["The Foundation's Quests","Wild Dreams Quests","The Spy Within Quests"],"The song is a taunt about the player being a pawn.",G+"Queen's_Anthem"],
 ["h","In which season did the \"Butter Barn Hoedown\" lobby music come out?","Chapter 2 Season 5",["Chapter 1 Season 10","Chapter 2 Season 6","Chapter 3 Season 1"],"It cost 200 V-Bucks in the Item Shop.","https://fortnite.fandom.com/wiki/Butter_Barn_Hoedown"],
 ["h","Which lobby music could you earn for free in the Champion Siren FNCS Cup?","Find the Fury",["Lord of the Wasteland","You're All Mine","Swim Free"],"After Update v34.00 it was replaced by its Jam Track version.","https://fortnite.fandom.com/wiki/Find_the_Fury_(Lobby_Music)"],
 ["h","Which emote shares its music with the Larger Than Life lobby music?","Living Large",["Phono Follies","Slick","Running Man"],"The lobby music cost 200 V-Bucks in Chapter 2 Season 6.",G+"Larger_Than_Life"],
 ["m","The Turn Up lobby music uses the full version of which emote's song?","Phono Follies",["Living Large","Slick","Pitcycle"],"It came out in Chapter 2 Season 6.",G+"Turn_Up"],
 ["e","The \"Love Again\" lobby music is part of which artist's set?","The Kid LAROI",["Marshmello","Travis Scott","Ariana Grande"],"It was a free reward from his Wild Dreams Quests.",G+"Love_Again"],
 ["m","In which season did the \"Love Again\" lobby music come out?","Chapter 4 Season 1",["Chapter 3 Season 4","Chapter 4 Season 2","Chapter 5 Season 1"],"It's an Icon Series music pack.",G+"Love_Again"],
 ["x","Which lobby music pack is based on the Daydream emote?","Sweet Dreams",["Mellow Days","Love Again","Best Mates"],"Daydream is partly based on the Panama Dance Challenge.",G+"Daydream"],
 ["m","Which lobby music unlocked at Level 70 of the Chapter 2 Season 6 Battle Pass?","Wild",["Star Power Remix","Turn Up","Larger Than Life"],"Phill Boucher composed it with music from the Zero Crisis Finale trailer.","https://fortnite.fandom.com/wiki/Wild"],
 ["x","What happened when the Wild lobby music showed up in the Item Shop in March 2021?","It was pulled as a mistake and refunded",["It sold out within an hour","It was free for one day","It replaced the Battle Pass version"],"Orbital Overload took its place.","https://fortnite.fandom.com/wiki/Wild"],
 ["m","In which season was the Get Funky emote introduced?","Chapter 1 Season 7",["Chapter 1 Season 5","Chapter 1 Season 8","Chapter 1 Season 9"],"It was Tier 63 of that Battle Pass and shares its music with the Get Funky lobby music.",G+"Get_Funky"],
 ["h","In which season did the Red Carpet traversal emote arrive?","Chapter 7 Season 1",["Chapter 6 Season 1","Chapter 7 Season 2","Chapter 7 Season 3"],"It's part of the Leading Lady set and shares its music with Ready For It.",G+"Red_Carpet"],
]});
})();
