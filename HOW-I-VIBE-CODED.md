# How I Vibe-Coded Drop-In Daily

*By Towfiq Aziz · last updated November 23, 2026*

## What it is

Drop-In Daily is a daily Fortnite trivia game I built with Claude without writing the code myself. It grew from 42 questions on October 13, 2026 to **2,528 questions** (349 Easy, 731 Medium, 909 Hard and 539 Mythic) six weeks later. You can play it at [taziz05.github.io/drop-in-daily](https://taziz05.github.io/drop-in-daily), inside Discord, and on Twitch.

- **Daily Drop:** the same 5 questions for everyone each day (1 Easy, 1 Medium, 2 Hard, 1 Mythic), new at midnight.
- **Modes:** By Difficulty, Chapters & Seasons, Where Am I? (location clues), Endless with streaks, and a searchable Question Bank where every answer links its source.
- **Extras:** an Achievements tab with hidden secrets, confetti and a Victory Royale screen for perfect sets, sound effects and music, and device sync.

## How it grew

The game has had 56 versions so far. Each one came from my feedback on the last.

| Version | Milestone |
|---|---|
| 1 | 42 questions in three difficulties |
| 3 | Mythic tier, Chapters & Seasons, Question Bank |
| 4 | Where Am I? mode |
| 5–7 | Game Modes, Events, Cosmetics |
| 8 | Daily Drop tab |
| 11 | Endless mode |
| 12 | A huge patch (wildlife, fishing, Exotics, storylines and more), then the Discord bot and Activity |
| 12.32 | Daily questions already in play stay frozen when new questions are published |
| 12.33 | Confetti for perfect sets and a Victory Royale for 25/25 |
| 12.35 | Sync devices with a copy/paste code |
| 12.39 | Lobby Music questions |
| 13.00 | A whole new look, an Achievements tab with 5 secrets, and question fixes |
| 13.01 | Discord: /achievements, and progress saved to your Discord account |
| 13.10 | Sound effects and music |

## How I worked with Claude

I acted as the product owner and fact-checker. Claude wrote the code and drafted the questions.

- **Strict sourcing rules.** Lore comes only from the [Fortnite Wiki](https://fortnite.weirdgloop.org/), real-world facts from Wikipedia, and current weapon stats from fortnite.gg. Every answer links its source.
- **I sent exact links.** When Claude couldn't load a wiki page, sending the URL myself fixed it, and it kept Claude from guessing.
- **I checked by hand.** I played through the Question Bank and flagged anything that didn't match the wiki, like the healing amounts for Small Fry and Shield Fish.
- **Feedback in plain language.** Most changes started as a message like "could we add a confetti celebration for 5/5?" and Claude built, tested and shipped it.
- **Try it before it ships.** For big changes, Claude first made a preview page I could play with. The new look, the secrets and the sound effects all went through rounds of "try it, tell Claude what's off, try again" before touching the real game.
- **A/B/C comparisons.** For the sound effects, Claude made three styles of every sound (electronic, orchestral, and an OG Chapter 1 lobby style), and I picked my favorite version of each one.
- **Claude connected to my accounts.** Once linked to GitHub and Cloudflare, Claude pushed updates and fixed things directly instead of sending me files to upload.

## The new look, secrets and achievements (November 2026)

I felt the first design looked like every other AI-made site, so we gave it a real Fortnite feel:

- **Lobby sky** with drifting clouds and light rays, Fortnite-style fonts, and rarity colors for each difficulty.
- **A skydive intro** when you drop into a set, an elimination feed as you answer, and a placement screen at the end.
- **Five hidden secrets** to find, including a supply drop that floats down, a storm you can poke, a title you can upgrade to Mythic, and a lobby party.
- **An Achievements tab** that keeps secrets hidden until you find them, with hints if you're stuck, and counters for how many times you've done each one.
- **Mobile fixes**, including cleaner tabs and the top of the screen matching the sky on phones.

## Sound effects and music

The game has sound effects for almost everything (answers, the skydive, Victory Royale, every secret) plus music for menus, questions, Mythic-only sets and the Endless summary. It all starts off until a player turns it on with the speaker button.

I didn't want AI-generated music, so every sound and song is **written as code**: each note is an instruction the browser plays. Claude made a sound test page so I could hear and compare everything before it went into the game. We also tried playing the music from recorded files, but it didn't sound better on my computer, so the game kept the code version. The songs are saved in my [coded-music](https://github.com/TAziz05/coded-music) repo, along with versions for my YouTube videos.

## Discord, Twitch and stats

- **Discord:** a bot (/daily, /play, /leaderboard, /stats, /achievements, /setchannel) and a Discord Activity that opens the full game inside Discord. Achievements and progress are saved to each player's Discord account.
- **Twitch:** two extensions. **Drop-In Daily** is a panel where every viewer plays the full game, including on mobile. **Drop-In Daily Live** puts one question at a time on the stream: I start a question from Stream Manager, chat answers before the timer ends, and then everyone sees the answer and how chat did.
- **Stats:** GoatCounter counts visits to the website, Discord use and Twitch use, each on its own page, so I can see where players come from.

## The tech

The game is a static site, so it's free to host, with a small Cloudflare backend for Discord and Twitch.

- **Website:** a single page plus question files, hosted on GitHub Pages from the TAziz05/drop-in-daily repo.
- **Backend:** one Cloudflare Worker with a D1 database runs the Discord bot and Activity, and the Twitch live play-along. It verifies Twitch's login tokens and sends live updates to viewers.

Updates go live on a fixed schedule so a day's questions never change mid-day:

1. Claude pushes new work to a staging branch, `not-live-till-night`.
2. A GitHub Action merges it into `main` at midnight.
3. GitHub Pages republishes the site, and the bot picks up the new questions.
4. Days already in play are pinned, so even a late merge can't swap someone's Daily Drop.

Ideas that aren't ready yet wait on a separate `possible-updates` branch, so they can be brought in later without touching anything else.

Daily sets now save after every answer, so leaving partway and coming back picks up at the next question instead of letting you restart.

## What went wrong and what I learned

AI-written trivia needs a human fact-checker, and the bugs worth fixing were found by playing the game.

- **Fact errors I caught:** Imagined Order and Zero Point lore, an Omega/Carbide question tagged with the wrong season, a Spire question at the start of Chapter 2 Season 7, the Battle Bus route, and healing amounts for fish. Claude corrected each against the wiki.
- **Giveaway questions:** some answers could be guessed from the season tag on the card, so we reworded them.
- **Sneaking a do-over:** a player could leave a set halfway and restart it. Now progress saves after every answer.
- **Discord debugging:** a corrupted bot file, secrets saved in the wrong place in Cloudflare, and Activities not switched on in Discord. Claude found and fixed these through my connected accounts.
- **Twitch learning curve:** my first Twitch extension was far too small on stream, so we split it into a full panel and a separate live-question box.
- **Ticking music:** music made live in code can tick on a slow computer. Recorded files didn't fix it for me, so we kept the code version and saved the recordings for later.

What I'd tell someone else: set your source rules on day one, check the output yourself, preview big changes before they go live, and give feedback one clear change at a time.

## Credits

Coded with Claude (Opus 5.5) by Anthropic. Ideas, sourcing rules, design direction and fact-checking by Towfiq Aziz (TAziz322). Drop-In Daily is an unofficial fan game, not affiliated with or endorsed by Epic Games. Support-A-Creator code: TAziz (#EpicPartner).
