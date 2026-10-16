// Update v42.40 (October 15, 2026): new Sprites, Like-for-Like upgrades, OG Rift Zones, STW heroes.
(function(){
const U=G+"Update_v42.40",add=(id,...q)=>{const S=SEASONS.find(s=>s.id===id);if(!S)throw new Error("no group "+id);S.qs.push(...q)};
add("SPRITES",
 ["e","Which Sprite won the Design A Sprite contest?","Honey Sprite",["Pond Sprite","Duck Sprite","Fishy Sprite"],"It arrived in Update v42.40.",U],
 ["m","What can the Honey Sprite spawn where your ranged shots hit?","Bees",["Honey traps","Flowers","Wasp nests"],"It came from the Design A Sprite contest.",U],
 ["m","What does the Quack Sprite do whenever it gains Sprite XP?","Gives every Sprite you carry extra Sprite XP",["Quacks to reveal enemies","Doubles your Sprite Dust","Levels up your weapons"],"It was the final Sprite Mastery reward page's prize.",U],
 ["h","What does the One Wish Willow Sprite do to enemies you eliminate?","Extracts their equipped Sprites",["Steals their weapons","Turns them into props","Freezes their Sprites"],"It also pushes nearby enemies away when you take damage.",U],
 ["x","What happens if you remove the One Wish Willow Sprite?","You're marked on the map",["You lose all your Sprite Dust","You take 50 damage","It turns into a Wildwasp"],"It arrived in Update v42.40.",U]
);
add("MECH",
 ["m","What do Like-for-Like Weapon Upgrades (v42.40) do?","Swap your weapon for a higher-rarity copy you walk over",["Upgrade weapons at Vending Machines for free","Merge two weapons into one","Raise every weapon one rarity after a win"],"It needs the Auto Pick Up Weapons setting turned on.",U]
);
add("OG",
 ["m","Which Fortnite OG location was turned into the swamp-desert Rift Zone \"Moisty Palms\"?","Paradise Palms",["Moisty Mire","Lucky Landing","Lazy Links"],"It arrived in Update v42.40.",U],
 ["h","What happens when you crouch in Fortnite OG's Moisty Palms Rift Zone?","You turn into a random prop",["You turn invisible","You sink into the swamp","You heal over time"],"Props can still take damage.",U],
 ["h","In Fortnite OG's v42.40 update, Mega Mall was rewound into what?","Retail Row",["Shifty Shafts","Tilted Towers","Neo Tilted"],"Cube Monsters spawn there from Obelisks.",U]
);
add("MSTW",
 ["m","Which Legendary Soldier hero does Save the World's Portal Combat questline unlock?","Grave Feather",["Willow","Raven","Headhunter"],"Its perk Ghoulslinger boosts Lefty and Righty's Crit Rating.",U],
 ["h","In Save the World's \"Challenge the Rift\", how much BluGlo do you deposit to summon a Mini-Boss?","4",["1","3","10"],"Nobody inside can leave until the Mini-Boss is defeated.",U],
 ["h","Which Legendary Outlander hero does Save the World's Door to Darkness questline reward?","Willow",["Grave Feather","Jess","Rio"],"Her ability damage rises as her health drops.",U]
);
})();
