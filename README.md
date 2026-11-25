# RAREBYTE

Think different. Score higher. Become legendary.

A retro pixel-arcade daily trivia game. Every question has many correct answers, and the rarer your answer, the more points you earn.

## Run it

No build step. Open `index.html` in a browser, or use the VS Code "Live Server" extension.

## Files

All files live together in this one folder:

```
index.html   page layout for all screens (open this one)
style.css    arcade styling
utils.js     helpers and shared state
data.js      question banks, answer matching, rarity tiers
storage.js   player profile in localStorage
audio.js     8-bit sound effects
art.js       pixel avatars and trophies
board.js     daily, weekly and all-time leaderboards
game.js      question flow, timer, scoring
views.js     rendering of each screen
main.js      router, events, countdown
```

The scripts load in that order from `index.html` and share one `RB` object. No build step: double-click `index.html`.

## Scoring

| Share of players | Tier | Points |
|---|---|---|
| 10%+ | Very common | 10 |
| 4–10% | Common | 25 |
| 1.5–4% | Uncommon | 50 |
| 0.5–1.5% | Rare | 100 |
| under 0.5% | Extremely rare | 200 |

## Status

Prototype. Answer frequencies, the 18,420-player field and the leaderboards are simulated, and the profile is stored in `localStorage`.

## Roadmap

- Move to Next.js + Tailwind CSS
- Supabase for accounts, real answer counts and leaderboards
- Deploy on Vercel
- Friend battles, mystery rewards, achievement collection
