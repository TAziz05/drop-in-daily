import os
R=os.path.dirname(os.path.abspath(__file__))+'/'
import json,html
d=open(R+'out/data.json').read().replace('</','<\\/')
t=open(R+'template.html').read()
V=json.load(open(R+'versions.json'))
cur,build=V[-1][0],len(V)
log=''.join(f'<li><b>{v}</b> <span>{dt}</span> {html.escape(n)}</li>' for v,dt,n in reversed(V))
ver=f'<div class="ver"><span>{cur} · update #{build}</span></div>'
assert '/*DATA*/null' in t and '<!--VERSION-->' in t
open(R+'out/drop-in-daily.html','w').write(t.replace('/*DATA*/null',d).replace('<!--VERSION-->',ver))
