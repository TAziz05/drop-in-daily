/* ===== Sound effects and music (added v13.10). Every sound is made live by code with the Web Audio API: no audio files.
   Off by default; the speaker button in the corner turns effects and music on, and the choice is saved on this device. ===== */
(function(){
"use strict";
const G={"pfx": "dropin", "font": "\"Barlow\",system-ui,sans-serif", "bg": "#0b3f8f", "fg": "#fff", "edge": "#062a66", "accent": "#ffd53d", "skipTap": ".egg-crate,.fn-jump", "songs": {"lobby": "fnMenu", "match": "fn", "og": "fnOGm", "endless": "fnOG"}, "musicBase": "music/", "music": {}};
const noop=()=>{};
const SND={play:noop,music:noop,on:()=>false};window.SND=SND;
const AC=typeof window!=="undefined"&&(window.AudioContext||window.webkitAudioContext);
if(!AC||typeof document==="undefined"||!document.body)return;
const KEY=G.pfx+":sound";
let st={fx:false,mu:false,vol:.8};try{Object.assign(st,JSON.parse(localStorage.getItem(KEY))||{})}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
let NIGHT=0,nightLP,nightVerb;
function setNight(n){NIGHT=n;if(!A||!nightLP)return;const t=A.currentTime;nightLP.frequency.setTargetAtTime(20000*Math.pow(2300/20000,n),t,.4);nightVerb.gain.setTargetAtTime(.5*n,t,.4)}
let A=null,master,sfxBus,musRoot,musBus,noiseBuf,dry,wet,retroOn=false,holdUntil=0;
function setRetro(on){retroOn=on;if(!A)return;const t=A.currentTime;dry.gain.setTargetAtTime(on?0:1,t,.03);wet.gain.setTargetAtTime(on?1:0,t,.03)}
function ctx(){
  if(A)return A;
  try{A=new AC({latencyHint:"playback"})}catch(e){A=new AC()}
  master=A.createGain();master.gain.value=.9*st.vol;
  const comp=A.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=4;comp.connect(A.destination);
  // retro mode: the same sounds through a crunchy 4-bit, small-speaker filter
  dry=A.createGain();wet=A.createGain();wet.gain.value=0;master.connect(dry);dry.connect(comp);
  const crush=A.createWaveShaper(),c=new Float32Array(4096);for(let i=0;i<c.length;i++){const x=i/(c.length-1)*2-1,y=Math.tanh(x*1.5);c[i]=Math.round(y*28)/28}crush.curve=c;
  const lp=A.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3800;const hp=A.createBiquadFilter();hp.type="highpass";hp.frequency.value=180;
  const pre=A.createGain();pre.gain.value=4;const post=A.createGain();post.gain.value=.3;master.connect(pre);pre.connect(crush);crush.connect(lp);lp.connect(hp);hp.connect(post);post.connect(wet);wet.connect(comp);setRetro(retroOn);
  sfxBus=A.createGain();sfxBus.gain.value=.7;sfxBus.connect(master);
  musRoot=A.createGain();musRoot.gain.value=.27;musBus=musRoot;
  // night versions of the songs: darker, softer drums, a little slower, more echo and a few twinkles, following the sky
  nightLP=A.createBiquadFilter();nightLP.type="lowpass";nightLP.Q.value=.5;nightLP.frequency.value=20000;musRoot.connect(nightLP);nightLP.connect(master);
  {const len=A.sampleRate*2.6,b=A.createBuffer(2,len,A.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5)}
   const cv=A.createConvolver();cv.buffer=b;nightVerb=A.createGain();nightVerb.gain.value=0;musRoot.connect(nightVerb);nightVerb.connect(cv);cv.connect(master)}
  noiseBuf=A.createBuffer(1,A.sampleRate,A.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return A;
}
const hz=n=>440*Math.pow(2,(n-69)/12);
function pulse(d){pulse.c=pulse.c||{};if(pulse.c[d])return pulse.c[d];const N=32,re=new Float32Array(N),im=new Float32Array(N);for(let k=1;k<N;k++){re[k]=Math.sin(2*Math.PI*k*d)/(k*Math.PI);im[k]=(1-Math.cos(2*Math.PI*k*d))/(k*Math.PI)}return pulse.c[d]=ctx().createPeriodicWave(re,im)}
function tone({t=0,n,f,type="square",dur=.12,vol=.3,slide,bus=sfxBus,detune=0,att=.005,cut}){
  const a=ctx(),s=a.currentTime+t,o=a.createOscillator(),g=a.createGain();
  if(type.startsWith("pulse"))o.setPeriodicWave(pulse(type==="pulse"?.25:.125));else o.type=type;o.frequency.setValueAtTime(f||hz(n),s);o.detune.value=detune;
  if(slide)o.frequency.exponentialRampToValueAtTime(slide,s+dur);
  g.gain.setValueAtTime(0.0001,s);g.gain.exponentialRampToValueAtTime(vol,s+att);g.gain.exponentialRampToValueAtTime(0.0001,s+dur);
  let last=o; o.connect(g);
  if(cut){const fl=a.createBiquadFilter();fl.type="lowpass";fl.frequency.value=cut;g.connect(fl);last=fl}else last=g;
  last.connect(bus);o.start(s);o.stop(s+dur+.05);
}
function noise({t=0,dur=.1,vol=.25,type="highpass",freq=6000,sweep,bus=sfxBus,q=1}){if(bus!==sfxBus&&bus!==verb.n)vol*=1-.55*NIGHT;
  const a=ctx(),s=a.currentTime+t,src=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();
  src.buffer=noiseBuf;src.loop=true;fl.type=type;fl.frequency.setValueAtTime(freq,s);fl.Q.value=q;
  if(sweep)fl.frequency.exponentialRampToValueAtTime(sweep,s+dur);
  g.gain.setValueAtTime(0.0001,s);g.gain.linearRampToValueAtTime(vol,s+.002);g.gain.exponentialRampToValueAtTime(0.0001,s+dur);
  src.connect(fl);fl.connect(g);g.connect(bus);src.start(s,Math.random()*.8);src.stop(s+dur+.05);
}
function verb(){const a=ctx();if(verb.n)return verb.n;const len=a.sampleRate*1.5,b=a.createBuffer(2,len,a.sampleRate);
  for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
  const cv=a.createConvolver();cv.buffer=b;const g=a.createGain();g.gain.value=.35;cv.connect(g);g.connect(master);
  const send=a.createGain();send.connect(sfxBus);send.connect(cv);return verb.n=send}
function brass({t=0,n,dur=.4,vol=.12,bus}){const a=ctx(),s=a.currentTime+t,out=bus||verb(),fl=a.createBiquadFilter(),g=a.createGain();
  fl.type="lowpass";fl.Q.value=2;fl.frequency.setValueAtTime(500,s);fl.frequency.linearRampToValueAtTime(3200,s+.06);fl.frequency.exponentialRampToValueAtTime(1400,s+dur);
  g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(vol,s+.04);g.gain.setValueAtTime(vol,s+dur*.8);g.gain.exponentialRampToValueAtTime(.0001,s+dur+.15);
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.5;lg.gain.setValueAtTime(0,s);lg.gain.linearRampToValueAtTime(dur>.35?12:0,s+dur);lfo.connect(lg);
  [-9,0,9].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=hz(n);o.detune.value=dt;lg.connect(o.detune);o.connect(fl);o.start(s);o.stop(s+dur+.2)});
  lfo.start(s);lfo.stop(s+dur+.2);fl.connect(g);g.connect(out)}
function boom(t=0,vol=.5){tone({t,f:110,slide:48,type:"sine",dur:.7,vol,bus:verb()});noise({t,dur:.25,vol:.12,type:"lowpass",freq:300,bus:verb()})}
function aah({t=0,ns,dur=1,vol=.06}){const a=ctx(),s=a.currentTime+t,g=a.createGain(),out=verb();
  g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(vol,s+dur*.4);g.gain.exponentialRampToValueAtTime(.0001,s+dur);
  const f1=a.createBiquadFilter();f1.type="bandpass";f1.frequency.value=750;f1.Q.value=5;const f2=a.createBiquadFilter();f2.type="bandpass";f2.frequency.value=1150;f2.Q.value=7;f1.connect(g);f2.connect(g);
  ns.forEach((n,k)=>[-6,6].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=hz(n);o.detune.value=dt+k;o.connect(f1);o.connect(f2);o.start(s);o.stop(s+dur+.05)}));
  g.connect(out)}
function fadeBus(start,len){const a=ctx(),g=a.createGain(),s0=a.currentTime;g.gain.setValueAtTime(1,s0+start);g.gain.linearRampToValueAtTime(.0001,s0+start+len);g.connect(verb());return g}
function pluck(t,n,vol=.14,dur=.3){tone({t,n,type:"triangle",dur,vol,att:.002,cut:2200,bus:verb()});tone({t,n:n+12,type:"sine",dur:dur*.4,vol:vol*.3,att:.002,bus:verb()})}
function mallet(t,n,vol=.14){tone({t,n,type:"sine",dur:.45,vol,att:.002,bus:verb()});tone({t,f:hz(n)*4,type:"sine",dur:.06,vol:vol*.35,att:.001})}
function glock(t,n,vol=.1){tone({t,n,type:"sine",dur:1.1,vol,att:.002,bus:verb()});tone({t,f:hz(n)*2.76,type:"sine",dur:.3,vol:vol*.25,att:.001,bus:verb()})}
function flute({t=0,n,dur=.3,vol=.08}){const a=ctx(),s0=a.currentTime+t,o=a.createOscillator(),g=a.createGain(),l=a.createOscillator(),lg=a.createGain();
  o.type="sine";o.frequency.value=hz(n);l.frequency.value=5.2;lg.gain.setValueAtTime(0,s0);lg.gain.linearRampToValueAtTime(dur>.3?10:3,s0+dur);l.connect(lg);lg.connect(o.detune);
  g.gain.setValueAtTime(.0001,s0);g.gain.exponentialRampToValueAtTime(vol,s0+.05);g.gain.setValueAtTime(vol,s0+dur*.8);g.gain.exponentialRampToValueAtTime(.0001,s0+dur+.1);
  o.connect(g);g.connect(verb());o.start(s0);l.start(s0);o.stop(s0+dur+.15);l.stop(s0+dur+.15);noise({t,dur:.06,vol:vol*.4,type:"bandpass",freq:hz(n)*2,q:3,bus:verb()})}
function horn({t=0,n,dur=.4,vol=.1}){const a=ctx(),s0=a.currentTime+t,fl=a.createBiquadFilter(),g=a.createGain();
  fl.type="lowpass";fl.Q.value=.7;fl.frequency.setValueAtTime(400,s0);fl.frequency.linearRampToValueAtTime(1500,s0+.08);fl.frequency.exponentialRampToValueAtTime(900,s0+dur);
  g.gain.setValueAtTime(.0001,s0);g.gain.exponentialRampToValueAtTime(vol,s0+.07);g.gain.setValueAtTime(vol,s0+dur*.85);g.gain.exponentialRampToValueAtTime(.0001,s0+dur+.2);
  [-5,5].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=hz(n);o.detune.value=dt;o.connect(fl);o.start(s0);o.stop(s0+dur+.25)});
  const o2=a.createOscillator();o2.type="triangle";o2.frequency.value=hz(n);o2.connect(fl);o2.start(s0);o2.stop(s0+dur+.25);fl.connect(g);g.connect(verb())}
function strings({t=0,ns,dur=1,vol=.03}){ns.forEach((n,k)=>[-10,10].forEach(dt=>tone({t,n,type:"sawtooth",dur,vol,att:.25,cut:1800,detune:dt+k*2,bus:verb()})))}
function swell(t,dur,vol=.12){const a=ctx(),s0=a.currentTime+t,src=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();src.buffer=noiseBuf;src.loop=true;fl.type="highpass";fl.frequency.value=5000;
  g.gain.setValueAtTime(.0001,s0);g.gain.exponentialRampToValueAtTime(vol,s0+dur);g.gain.exponentialRampToValueAtTime(.0001,s0+dur+.8);src.connect(fl);fl.connect(g);g.connect(verb());src.start(s0);src.stop(s0+dur+.9)}
function roll(t,dur,vol=.35){for(let k=0;k*.05<dur;k++)tone({t:t+k*.05,f:98,slide:80,type:"sine",dur:.12,vol:vol*(.3+.7*k*.05/dur),att:.003})}
function harp(t,ns,gap=.035,vol=.1){ns.forEach((n,i)=>pluck(t+i*gap,n,vol,.6))}
function wub(t,n,{vol=.14,dur=.22,peak=1400,type="sawtooth",slide}={}){const a=ctx(),s0=a.currentTime+t,o=a.createOscillator(),fl=a.createBiquadFilter(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(hz(n),s0);if(slide)o.frequency.exponentialRampToValueAtTime(hz(slide),s0+dur);
  fl.type="lowpass";fl.Q.value=7;fl.frequency.setValueAtTime(180,s0);fl.frequency.linearRampToValueAtTime(peak,s0+Math.min(.07,dur*.4));fl.frequency.exponentialRampToValueAtTime(200,s0+dur);
  g.gain.setValueAtTime(.0001,s0);g.gain.linearRampToValueAtTime(vol,s0+.004);g.gain.setValueAtTime(vol,s0+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,s0+dur);o.connect(fl);fl.connect(g);g.connect(sfxBus);o.start(s0);o.stop(s0+dur+.05)}
function stab(t,ns,vol=.05,dur=.16){ns.forEach(n=>{brass({t,n,dur,vol});tone({t,n:n+12,type:"sawtooth",dur:dur*.8,vol:vol*.35,cut:3200,bus:verb()})})}
function snare(t,vol=.2){noise({t,dur:.13,vol,type:"bandpass",freq:1900,q:.9,bus:verb()});tone({t,f:220,slide:150,type:"triangle",dur:.07,vol:vol*.8})}
function riser(t,dur,vol=.12){const a=ctx(),s0=a.currentTime+t,src=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();src.buffer=noiseBuf;src.loop=true;fl.type="bandpass";fl.Q.value=3;fl.frequency.setValueAtTime(300,s0);fl.frequency.exponentialRampToValueAtTime(7000,s0+dur);
  g.gain.setValueAtTime(.0001,s0);g.gain.exponentialRampToValueAtTime(vol,s0+dur);g.gain.exponentialRampToValueAtTime(.0001,s0+dur+.05);src.connect(fl);fl.connect(g);g.connect(sfxBus);src.start(s0);src.stop(s0+dur+.1)}
const D={
  tap(){mallet(0,84,.12);noise({dur:.015,vol:.08,type:"bandpass",freq:3500,q:5})},
  correct(){glock(0,84,.11);glock(.09,91,.12);pluck(0,60,.12)},
  wrong(){pluck(0,50,.2,.4);pluck(.16,46,.2,.5);boom(0,.25);horn({t:.05,n:50,dur:.4,vol:.06})},
  achievement(){harp(0,[72,76,79,84,88],.05,.08);[88,91,96].forEach((n,i)=>glock(.25+i*.08,n,.08))},
  secret(){const a=ctx();strings({ns:[67,71,74,79],dur:1.4,vol:.022});aah({ns:[71,74,79],dur:1.3,vol:.04});[91,95,98,103,98,103].forEach((n,i)=>glock(.55+i*.07,n,.07))},
  runover(){[67,63,60,55].forEach((n,i)=>pluck(i*.13,n,.16,.35));horn({t:.5,n:43,dur:.8,vol:.07});boom(.5,.3)},
  stormPoke(){tone({f:90,slide:60,type:"sawtooth",dur:.3,vol:.08,cut:400});noise({dur:.3,vol:.15,type:"bandpass",freq:300,sweep:1200,q:2,bus:verb()});pluck(0,40,.12,.3)},
  stormSurge(){roll(0,.6,.3);strings({t:0,ns:[38,45,50,53],dur:1.4,vol:.03});noise({t:.6,dur:1.4,vol:.3,type:"lowpass",freq:1500,sweep:120,bus:verb()});boom(.6,.6);horn({t:.6,n:38,dur:1,vol:.08})},
  driver(){[0,.2].forEach(t=>[349,440].forEach(f=>tone({t,f,type:"sawtooth",dur:.14,vol:.05,cut:900})));[[.5,76],[.62,79],[.74,84]].forEach(([t,n])=>flute({t,n,dur:.12,vol:.07}));glock(.9,91,.08)},
  perfect(){riser(0,.5,.14);snare(.5,.22);boom(.5,.45);stab(.5,[67,71,74,79],.05,.5);wub(.5,31,{vol:.18,dur:.5,peak:900});
   [[.95,74,.14],[1.1,79,.14],[1.25,83,.14],[1.4,86,.9]].forEach(([t,n,d])=>{brass({t,n,dur:d,vol:.09});brass({t,n:n-12,dur:d,vol:.05})});
   snare(1.4,.2);boom(1.4,.5);stab(1.4,[67,71,74],.04,.9);[[1.4,31],[1.55,43],[1.7,31]].forEach(([t,n])=>wub(t,n,{vol:.13,dur:.16}));[91,95,98,103].forEach((n,i)=>mallet(1.45+i*.06,n,.08));swell(.9,.5,.08)},
  results(){stab(0,[67,71,74],.04,.14);stab(.2,[65,69,72],.04,.14);wub(.4,41,{vol:.13,dur:.5,peak:800});stab(.4,[62,65,69],.035,.5)},
  perfectDay(){riser(0,.7,.15);[.7,.85,1].forEach((t,i)=>{snare(t,.2);stab(t,[67,71,74].map(n=>n+i*2),.045,.12)});boom(1.15,.6);stab(1.15,[67,71,74,79],.055,.7);wub(1.15,31,{vol:.18,dur:.6,peak:900});
   [[1.6,74,.14],[1.75,79,.14],[1.9,83,.14],[2.05,86,.14],[2.2,84,.14],[2.35,86,.14],[2.5,91,1.2]].forEach(([t,n,d])=>{brass({t,n,dur:d,vol:.09});brass({t,n:n-12,dur:d,vol:.05})});
   snare(2.5,.22);boom(2.5,.6);stab(2.5,[67,71,74,79],.045,1.2);aah({t:2.5,ns:[79,83,86],dur:1.8,vol:.04});for(let i=0;i<8;i++)mallet(2.55+i*.07,[91,95,98,103][i%4],.07);swell(2,.5,.1)},
  copied(){stab(0,[79,83],.025,.06);mallet(.05,91,.1)},
  skydiveLong(){noise({dur:1.05,vol:.05,type:"bandpass",freq:300,sweep:1400,q:.8});noise({dur:1.05,vol:.22,type:"bandpass",freq:500,sweep:1600,q:.6});
   noise({t:.95,dur:.12,vol:.35,type:"bandpass",freq:900,q:1.5});tone({t:.95,f:140,slide:70,type:"sine",dur:.25,vol:.35});noise({t:1,dur:.55,vol:.08,type:"bandpass",freq:700,sweep:300,q:.8});
   noise({t:1.55,dur:.1,vol:.25,type:"lowpass",freq:500});tone({t:1.6,n:88,type:"sine",dur:.3,vol:.1,bus:verb()})},
  streak(){noise({dur:.12,vol:.12,type:"bandpass",freq:2000,sweep:6000,q:2});[79,84,88].forEach((n,i)=>tone({t:.05+i*.05,n,type:"sawtooth",dur:.2,vol:.07,cut:5000,bus:verb()}));tone({t:.2,n:96,type:"sine",dur:.5,vol:.1,bus:verb()})},
  streakBig(){noise({dur:.3,vol:.15,type:"bandpass",freq:400,sweep:8000,q:3,bus:verb()});boom(.25,.4);[[.25,72],[.35,76],[.45,79],[.55,84]].forEach(([t,n])=>brass({t,n,dur:.3,vol:.08}));tone({t:.55,n:96,type:"sine",dur:.8,vol:.1,bus:verb()})},
  xp(){for(let k=0;k<16;k++)tone({t:k*.05,n:72+k,type:"square",dur:.04,vol:.04,cut:3500});tone({t:.82,n:91,type:"sine",dur:.4,vol:.12,bus:verb()})},
  where(){noise({dur:.4,vol:.18,type:"bandpass",freq:2500,sweep:400,q:1.5});boom(.38,.25);tone({t:.4,f:1760,type:"sine",dur:.35,vol:.12,bus:verb()})},
  hint(){[79,83].forEach((n,i)=>tone({t:i*.08,n,type:"triangle",dur:.3,vol:.1,bus:verb()}))},
  tab(){noise({dur:.12,vol:.15,type:"bandpass",freq:800,sweep:2500,q:1.2});tone({t:.08,f:700,type:"sine",dur:.05,vol:.1})},
  crateFull(){const a=ctx();
   tone({f:620,slide:420,type:"sine",dur:1.1,vol:.07,bus:verb()});tone({f:625,slide:424,type:"sine",dur:1.1,vol:.05,bus:verb()});
   for(let k=0;k<6;k++)noise({t:k*.17,dur:.09,vol:.07,type:"bandpass",freq:900,q:2});
   boom(1.1,.45);noise({t:1.1,dur:.18,vol:.28,type:"lowpass",freq:800});
   noise({t:1.45,dur:.08,vol:.3,type:"bandpass",freq:2500,q:2});noise({t:1.48,dur:.5,vol:.08,type:"highpass",freq:6000,bus:verb()});
   [84,88,91,96].forEach((n,i)=>tone({t:1.5+i*.05,n,type:"sine",dur:.6,vol:.08,bus:verb()}));aah({t:1.45,ns:[72,76,79,84],dur:1.1,vol:.05})},
  mythic(){noise({dur:.5,vol:.15,type:"bandpass",freq:600,sweep:9000,q:4,bus:verb()});boom(.5,.4);[72,76,79,84].forEach(n=>brass({t:.5,n,dur:.8,vol:.05}));[96,100,103,108].forEach((n,i)=>tone({t:.5+i*.04,n,type:"sine",dur:1,vol:.07,bus:verb()}));aah({t:.5,ns:[76,79,84],dur:1.4,vol:.05})},
  party(){const L=6.2,g=fadeBus(4.9,1.3),b=.5; // 120 bpm
   noise({dur:.08,vol:.4,type:"highpass",freq:2000});tone({f:200,slide:1600,type:"sawtooth",dur:.5,vol:.05,cut:4000,bus:g});
   const chords=[[57,60,64,67],[62,66,69,72]],bass=[45,50];
   for(let beat=0;beat<12;beat++){const t=.4+beat*b,c=Math.floor(beat/2)%2;
     tone({t,f:140,slide:45,type:"sine",dur:.25,vol:.5,bus:g});
     noise({t:t+b/2,dur:.16,vol:.1,freq:7000,bus:g});noise({t,dur:.03,vol:.04,freq:9000,bus:g});
     if(beat%2===1)noise({t,dur:.15,vol:.16,type:"bandpass",freq:1500,q:.7,bus:g});
     [0,1,2,3].forEach(k=>tone({t:t+k*b/4,n:bass[c]+(k%2?12:0),type:"sawtooth",dur:.1,vol:.12,cut:1100,bus:g}));
     [.75,.25].forEach(o=>{if(beat%2===(o===.75?0:1))chords[c].forEach((n,k)=>tone({t:t+o*b,n:n+12,type:"sawtooth",dur:.18,vol:.022,cut:3200,detune:k%2?8:-8,bus:g}))});
     noise({t:t+b/4,dur:.03,vol:.06,type:"bandpass",freq:2500,q:3,bus:g});noise({t:t+3*b/4,dur:.03,vol:.06,type:"bandpass",freq:2500,q:3,bus:g});
     if(beat===4||beat===8)tone({t,f:300,slide:1200,type:"sawtooth",dur:b*1.5,vol:.035,cut:3500,bus:g})}},
  next(){noise({dur:.4,vol:.24,type:"bandpass",freq:300,sweep:3500,q:1.5});noise({t:.38,dur:.03,vol:.25,type:"bandpass",freq:2200,q:3});tone({t:.38,f:700,slide:1000,type:"sine",dur:.06,vol:.12})},
};
// Drop-In timing-matched versions
D.skydive=short=>{const k=short?.6:1;[0,.24].forEach(t=>[349,440].forEach(f=>[-8,8].forEach(dt=>tone({t:t*k,f,type:"sawtooth",dur:.17,vol:.075,cut:1500,detune:dt}))));noise({dur:1.05*k,vol:.05,type:"bandpass",freq:300,sweep:1400,q:.8});noise({t:.15*k,dur:.9*k,vol:.2,type:"bandpass",freq:500,sweep:1600,q:.6});
  noise({t:.95*k,dur:.12,vol:.35,type:"bandpass",freq:900,q:1.5});tone({t:.95*k,f:140,slide:70,type:"sine",dur:.25,vol:.35});noise({t:1*k,dur:.55*k,vol:.08,type:"bandpass",freq:700,sweep:300,q:.8});
  noise({t:1.55*k,dur:.1,vol:.25,type:"lowpass",freq:500});tone({t:1.6*k,n:88,type:"sine",dur:.3,vol:.1,bus:verb()})};
D.crateFall=()=>{tone({f:620,slide:420,type:"sine",dur:1.1,vol:.04,bus:verb()});for(let k=0;k<6;k++)noise({t:k*.17,dur:.09,vol:.04,type:"bandpass",freq:900,q:2})};
D.crate=()=>{boom(0,.45);noise({dur:.18,vol:.28,type:"lowpass",freq:800});noise({t:.3,dur:.08,vol:.3,type:"bandpass",freq:2500,q:2});noise({t:.33,dur:.5,vol:.08,type:"highpass",freq:6000,bus:verb()});
  [84,88,91,96].forEach((n,i)=>tone({t:.35+i*.05,n,type:"sine",dur:.6,vol:.08,bus:verb()}));aah({t:.3,ns:[72,76,79,84],dur:1.1,vol:.05})};
D.titleTap=lvl=>{const n=[67,71,74,79,84][Math.max(1,Math.min(5,lvl))-1];
  noise({dur:.15,vol:.12,type:"bandpass",freq:1000,sweep:5000,q:2});tone({t:.05,n,type:"sawtooth",dur:.25,vol:.08,cut:4000,bus:verb()});tone({t:.05,n:n+12,type:"sine",dur:.35,vol:.08,bus:verb()});if(lvl>=5)D.mythic()};

// sky events
D.meteor=()=>{[0,.05,.1,.15,.2].forEach((t,k)=>tone({t,n:96-k*2,type:"triangle",dur:.12,vol:.07-k*.01}));noise({dur:.35,vol:.05,type:"highpass",freq:5000})};
D.eclipse=()=>{tone({f:110,slide:82,type:"triangle",dur:2.2,vol:.16,att:.6});tone({f:165,slide:123,type:"sine",dur:2.2,vol:.1,att:.8});[0,.5,1,1.5].forEach((t,k)=>tone({t:.3+t,n:84-k*3,type:"sine",dur:.6,vol:.05}))};
// things drifting across the sky
D.chomp=()=>{noise({dur:.06,vol:.3,type:"bandpass",freq:900,q:3});noise({t:.09,dur:.05,vol:.22,type:"bandpass",freq:700,q:3})};
D.peel=(n=1)=>{noise({dur:.18,vol:.18,type:"bandpass",freq:2200+n*300,sweep:1200,q:2});tone({t:.02,f:400+n*80,slide:900+n*80,type:"triangle",dur:.12,vol:.06})};
D.slip=()=>{tone({f:900,slide:180,type:"triangle",dur:.45,vol:.14});noise({t:.42,dur:.12,vol:.25,type:"lowpass",freq:500})};
D.squeak=(n=1)=>{const f=700+n*90;tone({f,slide:f*1.6,type:"square",dur:.09,vol:.08,cut:3000});tone({t:.09,f:f*1.6,slide:f*1.1,type:"square",dur:.1,vol:.07,cut:3000})};
D.layer=(n=1)=>{noise({dur:.05,vol:.22,type:"lowpass",freq:700});tone({f:180+n*22,type:"triangle",dur:.09,vol:.14})};
D.topple=()=>{[0,.08,.16,.26,.36].forEach((t,k)=>noise({t,dur:.08,vol:.25-k*.03,type:"lowpass",freq:600-k*60}));tone({f:420,slide:90,type:"square",dur:.6,vol:.07,cut:1500})};
D.busHorn=()=>{[0,.26].forEach(t=>[349,440].forEach(f=>[-8,8].forEach(dt=>tone({t,f,type:"sawtooth",dur:.2,vol:.06,cut:1300,detune:dt,bus:verb()}))));noise({t:.1,dur:1.4,vol:.05,type:"bandpass",freq:500,sweep:900,q:.7})};

/* ---- music: a small step sequencer that plans a little ahead, and skips late notes rather than cramming them in ---- */
const SONGS={
 fnMenu:{bpm:96,steps:64,play(i,t){ // chill lobby: Fmaj7 Em7 Dm7 Cmaj7, warm keys, laid-back beat
   const bar=Math.floor(i/16),s=i%16;const ch=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]][bar],r=ch[0];
   if(s===0||s===7)ch.forEach((n,k)=>{tone({t,n:n+12,type:"sine",dur:s?.9:1.4,vol:.045,att:.01,bus:musBus});tone({t,n:n+24,type:"triangle",dur:.25,vol:.012,bus:musBus})});
   if(s===0||s===10)tone({t,n:r-12,type:"sine",dur:.5,vol:.28,bus:musBus});
   if(s===0||s===6||s===10)tone({t,f:120,slide:45,type:"sine",dur:.25,vol:.4,bus:musBus});
   if(s===4||s===12)noise({t,dur:.2,vol:.1,type:"bandpass",freq:1400,q:.7,bus:musBus});
   if(s%2===0)noise({t:t+(s%4===2?.04:0),dur:.03,vol:.035,freq:8000,bus:musBus});
   const mel={1:[[0,76],[3,79],[6,81],[10,79],[12,76]],3:[[0,74],[3,76],[6,79],[8,76],[11,72]]}[bar];
   if(mel)mel.forEach(([q,n])=>{if(q===s)tone({t,n,type:"triangle",dur:.35,vol:.06,bus:musBus})});
 }},
 fn:{bpm:128,steps:64,play(i,t){ // D minor epic lobby: Dm Bb F C, pumping pads, plucky arp, brass stabs
   const bar=Math.floor(i/16),s=i%16,a=A,at=a.currentTime+t;
   const roots=[50,46,53,48],tri=[[62,65,69],[58,62,65],[60,65,69],[60,64,67]][bar],r=roots[bar];
   if(!SONGS.pad){SONGS.pad=a.createGain();SONGS.pad.connect(musBus)}
   const pad=SONGS.pad.gain;
   if(s%4===0){tone({t,f:160,slide:42,type:"sine",dur:.26,vol:.6,bus:musBus});pad.setTargetAtTime(.3,at,.008);pad.setTargetAtTime(1,at+.03,.07)}
   if(s===4||s===12){noise({t,dur:.16,vol:.16,type:"bandpass",freq:1500,q:.7,bus:musBus});noise({t,dur:.08,vol:.08,freq:5000,bus:musBus})}
   if(s%2===1)noise({t,dur:.03,vol:.05,freq:9000,bus:musBus});
   if(s===0)tri.forEach((n,k)=>[-8,8].forEach(dt=>tone({t,n,type:"sawtooth",dur:1.8,vol:.03,cut:1600,att:.2,detune:dt+k,bus:SONGS.pad})));
   if(s%2===0)tone({t,n:r-24,type:"sine",dur:.2,vol:.3,bus:SONGS.pad});
   const arp=[0,1,2,1,2,0,1,2,0,2,1,2,0,1,2,1];tone({t,n:tri[arp[s]]+12,type:"square",dur:.09,vol:.035,cut:2600,bus:musBus});
   if(s===0||(s===10&&bar%2===1))brass({t,n:tri[2]+(s?2:0),dur:s?.18:.3,vol:.05,bus:musBus});
   const hook=[[0,74],[2,77],[4,81],[7,79],[8,77],[11,74],[12,76]];
   if(bar===3)hook.forEach(([q,n])=>{if(q===s)brass({t,n,dur:.16,vol:.04,bus:musBus})});
 }},
 fnOGm:{bpm:128,steps:64,play(i,t){ // Match OG-style: faster, driving version of the OG lobby feel (Dm Bb C A)
   const bar=Math.floor(i/16),s=i%16,M=musBus;const roots=[38,46,48,45],r=roots[bar],ch=[[62,65,69],[62,65,70],[64,67,72],[61,64,69]][bar];
   if(s%4===0||s===14)tone({t,f:150,slide:44,type:"sine",dur:.22,vol:.55,bus:M});
   if(s===4||s===12){noise({t,dur:.13,vol:.18,type:"bandpass",freq:1900,q:.9,bus:M});tone({t,f:220,slide:150,type:"triangle",dur:.07,vol:.16,bus:M})}
   noise({t,dur:.025,vol:s%2?.045:.025,freq:9000,bus:M});
   if(s%2===0||s===3||s===11){const a=A,s0=a.currentTime+t,o=a.createOscillator(),fl=a.createBiquadFilter(),g=a.createGain();o.type="sawtooth";o.frequency.value=hz(r-12+(s%4===2?12:0));
     fl.type="lowpass";fl.Q.value=6;fl.frequency.setValueAtTime(200,s0);fl.frequency.linearRampToValueAtTime(1500,s0+.05);fl.frequency.exponentialRampToValueAtTime(250,s0+.15);
     g.gain.setValueAtTime(.0001,s0);g.gain.linearRampToValueAtTime(.14,s0+.004);g.gain.exponentialRampToValueAtTime(.0001,s0+.16);o.connect(fl);fl.connect(g);g.connect(M);o.start(s0);o.stop(s0+.2)}
   if(s===0||s===10)ch.forEach(n=>brass({t,n,dur:.12,vol:.028,bus:M}));
   {const n=[...ch,ch[0]+12][s%4]+12;tone({t,n,type:"sine",dur:.12,vol:.035,att:.002,bus:M})}
   const mel=[[[0,74],[3,77],[6,81],[10,79],[12,77]],[[0,77],[3,74],[6,70],[10,74],[12,77]],[[0,79],[3,76],[6,72],[10,76],[12,79]],[[0,81],[6,85],[10,88]]][bar];
   mel.forEach(([q,n])=>{if(q===s){brass({t,n,dur:.22,vol:.04,bus:M});brass({t,n:n-12,dur:.22,vol:.022,bus:M})}});
   if(bar===3&&s>=12)noise({t,dur:.05,vol:.1,type:"bandpass",freq:1900,q:.9,bus:M});
 }},
 fnOG:{bpm:116,steps:128,play(i,t){ // OG-style lobby: bouncy drums, wobbly synth bass, orchestral stabs, mallet ostinato, horn tune (Gm Eb Bb F)
   const bar=Math.floor(i/16)%4,half=Math.floor(i/64),s=i%16,M=musBus;
   const roots=[43,39,46,41],r=roots[bar],ch=[[67,70,74],[67,70,75],[70,74,77],[69,72,77]][bar];
   if([0,7,8,10].includes(s))tone({t,f:150,slide:44,type:"sine",dur:.24,vol:.55,bus:M});
   if(s===4||s===12){noise({t,dur:.14,vol:.18,type:"bandpass",freq:1900,q:.9,bus:M});tone({t,f:210,slide:150,type:"triangle",dur:.08,vol:.18,bus:M})}
   if(s%2===0)noise({t,dur:.03,vol:.045,freq:8500,bus:M});if(s%4===2)noise({t,dur:.1,vol:.04,freq:7000,bus:M});
   if([0,3,6,8,11,14].includes(s)){const a=A,s0=a.currentTime+t,o=a.createOscillator(),fl=a.createBiquadFilter(),g=a.createGain();o.type="sawtooth";o.frequency.value=hz(r-12+(s===6||s===14?12:0));
     fl.type="lowpass";fl.Q.value=6;fl.frequency.setValueAtTime(200,s0);fl.frequency.linearRampToValueAtTime(1300,s0+.06);fl.frequency.exponentialRampToValueAtTime(250,s0+.2);
     g.gain.setValueAtTime(.0001,s0);g.gain.linearRampToValueAtTime(.16,s0+.004);g.gain.exponentialRampToValueAtTime(.0001,s0+.22);o.connect(fl);fl.connect(g);g.connect(M);o.start(s0);o.stop(s0+.26)}
   if((s===0&&bar%2===0)||(s===6&&bar%2===1)){ch.forEach(n=>brass({t,n,dur:.14,vol:.03,bus:M}));ch.forEach(n=>tone({t,n:n+12,type:"sawtooth",dur:.12,vol:.014,cut:3000,bus:M}))}
   if(s%2===0){const n=[...ch,ch[1]+12,ch[2]+12,ch[1]+12,ch[2],ch[1]][(s/2)%8]+12;tone({t,n,type:"sine",dur:.3,vol:.05,att:.002,bus:M});tone({t,f:hz(n)*4,type:"sine",dur:.05,vol:.012,att:.001,bus:M})}
   if(half===1){const mel=[[67,0,70,74,0,72,70,0],[70,0,67,63,0,67,70,72],[74,0,77,74,72,70,0,69],[72,0,0,69,0,65,0,0]][bar];
     if(s%2===0){const n=mel[s/2];if(n){const len=(mel[s/2+1]===0?2:1)*.26;brass({t,n,dur:len,vol:.045,bus:M});brass({t,n:n-12,dur:len,vol:.025,bus:M})}}}
   if(bar===3&&half===1&&s===12)noise({t,dur:.6,vol:.06,freq:5000,bus:M});
 }}
};
let want="lobby",cur=null,timer=null,step=0,nextT=0,src=null;
/* Songs play from small recorded loops of the same code-made music (smoother on slow devices). Until a file has loaded,
   or if it can't load, the song is made live by the sequencer instead. */
// Test switch: the recorded loops are only used with ?music=files in the address; everyone else gets the live code music.
const FILEMODE=false;  // recorded loops are parked on the possible-updates branch
const FILES=FILEMODE?(G.music||{}):{},BUF={},LOADING={};
const decode=ab=>new Promise((res,rej)=>{const p=A.decodeAudioData(ab,res,rej);if(p&&p.then)p.then(res,rej)});
function load(k){if(!FILES[k]||BUF[k]||LOADING[k])return LOADING[k];
  LOADING[k]=fetch(G.musicBase+k+".mp3").then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(decode).then(b=>{BUF[k]=b;if(cur===k&&!src)startSong(k)}).catch(noop);return LOADING[k]}
function preload(){if(!A)return;const ks=[...new Set(Object.values(G.songs))];ks.sort((a,b)=>(b===G.songs[want])-(a===G.songs[want]));ks.reduce((p,k)=>p.then(()=>load(k)),Promise.resolve())}
function schedule(){const S=SONGS[cur];if(!S)return;const n=window.SKY?SKY.now().night:0;if(Math.abs(n-NIGHT)>.01)setNight(n);const dt=60/(S.bpm*(1-.1*NIGHT))/4,now=A.currentTime;
  if(nextT<now+.02){const skip=Math.ceil((now+.05-nextT)/dt);step=(step+skip)%S.steps;nextT+=skip*dt}
  while(nextT<now+.6){try{S.play(step,nextT-now);if(NIGHT>.05&&step%32===0)tone({t:nextT-now,n:[84,86,88,91,93,96][Math.random()*6|0],type:"sine",dur:1.6,vol:.03*NIGHT,att:.01,bus:musBus})}catch(e){}step=(step+1)%S.steps;nextT+=dt}}
function startSong(k){
  clearInterval(timer);timer=null;if(src){const s=src;src=null;try{s.stop(A.currentTime+1.2)}catch(e){}}
  if(musBus&&musBus!==musRoot){const g=musBus;g.gain.setTargetAtTime(0,A.currentTime,.12);setTimeout(()=>{try{g.disconnect()}catch(e){}},1500)}
  musBus=musRoot;cur=k;delete SONGS.pad;if(!k)return;
  musBus=A.createGain();musBus.gain.setValueAtTime(.0001,A.currentTime);musBus.gain.setTargetAtTime(1,A.currentTime,.2);musBus.connect(musRoot);
  const f=FILES[k],b=BUF[k];
  if(f&&b){src=A.createBufferSource();src.buffer=b;src.loop=true;src.loopStart=f.pad;src.loopEnd=f.pad+f.L;const g=A.createGain();g.gain.value=f.gain;src.connect(g);g.connect(musBus);src.start(A.currentTime+.03,f.pad);return}
  load(k);step=0;nextT=A.currentTime+.12;timer=setInterval(schedule,90)}
function applyMusic(){const k=st.mu&&A&&A.state==="running"&&!document.hidden&&Date.now()>=holdUntil?(G.songs[want]||null):null;if(k!==cur)startSong(k)}
function wake(){if(!(st.fx||st.mu))return;ctx();if(st.mu)preload();if(A.state!=="running")A.resume().then(applyMusic,noop);else applyMusic()}
SND.on=()=>st.fx;
SND.state=()=>({music:cur,want,audio:A?A.state:"none",file:!!src});
SND.play=(name,...a)=>{if(!st.fx||document.hidden)return;const f=D[name];if(!f)return;ctx();if(A.state!=="running")A.resume().catch(noop);try{f(...a)}catch(e){}};
SND.music=k=>{want=k;if(A)applyMusic()};
SND.hold=ms=>{holdUntil=Date.now()+ms;if(A)applyMusic();setTimeout(()=>{if(A)applyMusic()},ms+50)};
SND.retro=on=>setRetro(!!on);
["pointerdown","touchend","keydown","click"].forEach(ev=>addEventListener(ev,wake,{capture:true,passive:true}));
document.addEventListener("visibilitychange",()=>{if(!A)return;if(document.hidden){applyMusic();A.suspend().catch(noop)}else if(st.fx||st.mu)A.resume().then(applyMusic,noop)});

/* ---- taps on buttons, tabs and links ---- */
document.addEventListener("click",e=>{
  const el=e.target.closest&&e.target.closest("button,summary,a,[role=tab]");if(!el||el.closest("#snd"))return;
  if(el.matches(".opt")||el.closest(G.skipTap))return;
  if(el.matches(".tab")){SND.music("lobby");return SND.play("tab")}
  if(/copy/i.test(el.id||""))return SND.play("copied");
  if(el.matches("summary")&&el.closest("#ach-root"))return SND.play("hint");
  SND.play("tap");
},true);

/* ---- the speaker button and its two switches ---- */
const SPK='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>';
const ICON_ON=SPK+'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const ICON_OFF=SPK+'<path d="m16 9 6 6m0-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const css=document.createElement("style");css.textContent=`
#snd{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom));right:14px;z-index:1003;font:600 14px/1.3 ${G.font}}
#snd-btn{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;cursor:pointer;border:2px solid ${G.edge};background:${G.bg};color:${G.fg};box-shadow:0 3px 0 ${G.edge}}
#snd-btn:focus-visible{outline:3px solid ${G.accent};outline-offset:2px}
#snd-pop{position:absolute;right:0;bottom:52px;min-width:210px;padding:12px 14px;border-radius:12px;background:${G.bg};color:${G.fg};border:2px solid ${G.edge};box-shadow:0 8px 24px rgba(0,0,0,.35)}
#snd-pop[hidden]{display:none}
#snd-pop label{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:6px 0;cursor:pointer}
#snd-pop input{width:20px;height:20px;accent-color:${G.accent};cursor:pointer}
#snd-pop .vol input{width:110px;height:auto}
body.tw-panel #snd{bottom:8px;right:8px}body.tw-panel #snd-btn{width:34px;height:34px}`;
document.head.appendChild(css);
const box=document.createElement("div");box.id="snd";
box.innerHTML=`<button id="snd-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Sound settings"></button>
<div id="snd-pop" hidden><label>Sound effects <input type="checkbox" id="snd-fx"></label><label>Music <input type="checkbox" id="snd-mu"></label><label class="vol">Volume <input type="range" id="snd-vol" min="0" max="1" step="0.05" aria-label="Volume"></label></div>`;
document.body.appendChild(box);
const btn=box.querySelector("#snd-btn"),pop=box.querySelector("#snd-pop"),fx=box.querySelector("#snd-fx"),mu=box.querySelector("#snd-mu"),vol=box.querySelector("#snd-vol");vol.value=st.vol;
vol.oninput=()=>{st.vol=+vol.value;if(master)master.gain.setTargetAtTime(.9*st.vol,A.currentTime,.03)};vol.onchange=()=>{save();SND.play("tap")};
const paint=()=>{fx.checked=st.fx;mu.checked=st.mu;btn.innerHTML=st.fx||st.mu?ICON_ON:ICON_OFF;btn.setAttribute("aria-label","Sound settings: "+(st.fx||st.mu?"on":"off"))};paint();
btn.onclick=()=>{pop.hidden=!pop.hidden;btn.setAttribute("aria-expanded",String(!pop.hidden))};
document.addEventListener("click",e=>{if(!pop.hidden&&!box.contains(e.target)){pop.hidden=true;btn.setAttribute("aria-expanded","false")}});
fx.onchange=()=>{st.fx=fx.checked;save();paint();wake();if(st.fx)SND.play("tap")};
mu.onchange=()=>{st.mu=mu.checked;save();paint();wake();if(A)applyMusic()};

/* ---- hooks into the game ---- */
const allX=qs=>!!qs&&qs.length>0&&qs.every(q=>q&&q.t==="x");
const matchSong=()=>S&&(allX(S.qs)||allX(S.pool))?"og":"match";
const _q=question;question=function(){_q.apply(this,arguments);if(!S||!S.qs)return;SND.music(matchSong());const q=S.qs[S.i];if(S.i>0)SND.play(q&&q.clue?"where":"next");else if(q&&q.clue)setTimeout(()=>SND.play("where"),300)};
const _eq=endlessQ;endlessQ=function(){_eq.apply(this,arguments);if(!S)return;SND.music(matchSong());SND.play(S.cur&&S.cur.clue?"where":"next")};
const _a=answer;answer=function(btn){const q=S&&S.qs&&S.qs[S.i],ok=!!q&&btn.dataset.o===q.a;_a.apply(this,arguments);SND.play(ok?"correct":"wrong")};
const _ea=endlessAnswer;endlessAnswer=function(btn){const ok=!!(S&&S.cur)&&btn.dataset.o===S.cur.a,prev=S?S.streak:0;_ea.apply(this,arguments);
  if(ok){SND.play("correct");const s=S.streak;if(s>0&&s%5===0)setTimeout(()=>SND.play(s===10||s%25===0?"streakBig":"streak"),260)}
  else SND.play(prev>=3?"runover":"wrong")};
const _r=results;results=function(fresh){_r.apply(this,arguments);SND.music("lobby");if(!fresh||!S||!S.qs)return;
  const n=S.marks.filter(Boolean).length,t=S.qs.length,dailyish=S.mode==="main"||S.mode==="daily";
  if(n===t&&t>0){let day=false;try{day=dailyish&&typeof allPerfectToday==="function"&&allPerfectToday()}catch(e){}SND.play(day?"perfectDay":"perfect")}
  else{SND.play("results");setTimeout(()=>SND.play("xp"),700)}};
const _sv=setView;setView=function(){_sv.apply(this,arguments);SND.music("lobby")};
const _ev=endlessView;endlessView=function(){_ev.apply(this,arguments);SND.music("lobby")};
const _ee=endlessEnd;endlessEnd=function(){_ee.apply(this,arguments);SND.music("endless")};

})();
