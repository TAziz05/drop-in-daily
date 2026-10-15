import os
R=os.path.dirname(os.path.abspath(__file__))+'/'
# Builds github/index.html: the published page plus link-preview tags for iMessage, Discord, etc.
BASE="https://taziz05.github.io/drop-in-daily/"
head=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="A new Fortnite trivia drop every day. Easy to Impossible questions on lore, seasons, modes and events, straight from the Fortnite Wiki.">
<meta name="theme-color" content="#1f6fe0">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Drop-In Daily">
<meta property="og:title" content="Drop-In Daily · Fortnite Trivia">
<meta property="og:description" content="A new Fortnite trivia drop every day. Can you go 5 for 5?">
<meta property="og:url" content="{BASE}">
<meta property="og:image" content="{BASE}preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Drop-In Daily: a new Fortnite trivia drop every day">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Drop-In Daily · Fortnite Trivia">
<meta name="twitter:description" content="A new Fortnite trivia drop every day. Can you go 5 for 5?">
<meta name="twitter:image" content="{BASE}preview.png">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
'''
body=open(R+'out/drop-in-daily.html').read()
body=body.replace('<meta charset="utf-8">\n','',1).replace('<meta name="viewport" content="width=device-width, initial-scale=1">\n','',1)
GC='<script data-goatcounter="https://taziz322.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>\n'
open(R+'../index.html','w').write(head+body+'\n'+GC+'</html>\n')
