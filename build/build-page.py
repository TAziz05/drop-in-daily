import os
R=os.path.dirname(os.path.abspath(__file__))+'/'
import json,html
d=open(R+'out/data.json').read().replace('</','<\\/')
t=open(R+'template.html').read()
V=json.load(open(R+'versions.json'))
cur,build=V[-1][0],len(V)
log=''.join(f'<li><b>{v}</b> <span>{dt}</span> {html.escape(n)}</li>' for v,dt,n in reversed(V))
ver=f'<details class="ver"><summary><span>{cur} · update #{build}</span></summary><ol>{log}</ol></details>'
pin=open(R+'out/pinned.json').read().replace('</','<\\/') if os.path.exists(R+'out/pinned.json') else '{}'
sch=open(R+'out/schedule.json').read() if os.path.exists(R+'out/schedule.json') else '{}'
assert '/*SCHED*/{}' in t
t=t.replace('/*SCHED*/{}',sch)
assert '/*PIN*/{}' in t
t=t.replace('/*PIN*/{}',pin)
assert '/*DATA*/null' in t and '<!--VERSION-->' in t
open(R+'out/drop-in-daily.html','w').write(t.replace('/*DATA*/null',d).replace('<!--VERSION-->',ver))
# The Twitch extension loads the questions from the website (twitch-data.json), so new questions reach it without a new Twitch review.
open(R+'out/twitch-data.json','w').write('{"data":'+d+',"pin":'+pin+',"sched":'+sch+',"ver":'+json.dumps(f'{cur} · update #{build}')+'}')
