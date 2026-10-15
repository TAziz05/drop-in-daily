// The season label is shown above every season question, so a question that
// refers to its own season says "this season" instead of repeating the name.
module.exports=function(q,S,a){
  if(!/^C\d/.test(S.id))return q;                       // OG mode, Game Modes, Events: untouched
  if(/\b(Season|Chapter)\b/.test(a||""))return q;        // answer is a season: leave wording alone
  const n=S.id==="C2R"?null:S.name.replace(/^(Mini )?Season /,"");
  const mini=/^Mini/.test(S.name);
  const ch=S.ch.replace("Chapter ","");
  // Own-season name, with or without the chapter in front.
  const own=S.id==="C2R"?"Chapter 2 Remix"
    :`(?:Chapter ${ch} )?${mini?"Mini ":"(?<!Mini |Festival |Music Pass |Venture )"}Season ${n}(?![\\w'])(?! ?(?:XP|Shop))`;
  let t=q;
  // "the Season 3 meteor" / "the Season 2 Battle Pass" -> "this season's meteor"
  t=t.replace(new RegExp(`\\bthe ${own} (?=[A-Za-z])`,"g"),"this season's ");
  // "in Season 3", "during Season 3", "of Season 1", bare "Season 3"
  t=t.replace(new RegExp(own.replace("(?![\\w'])","").replace("(?! ?(?:XP|Shop))","")+"'s","g"),"this season's");
  t=t.replace(new RegExp(own,"g"),"this season");
  // "the season", "the mini season", "that season"
  t=t.replace(/\b(?:the|that) (?:mini )?season\b/gi,"this season");
  t=t.replace(/\b(added|new|introduced|debuted|returned|unvaulted|vaulted|released|came|arrived|appeared) in this season\b/g,"$1 this season");
  t=t.replace(/\bthis mini season\b/gi,"this season");
  t=t.replace(/\bEpic's this season recap\b/g,"Epic's recap of this season");
  t=t.replace(/\ba this season ([^?]+?)\?$/,"a $1 this season?");
  if(t!==q)t=t[0].toUpperCase()+t.slice(1);
  return t;
};
