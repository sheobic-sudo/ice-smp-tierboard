# IceSMP PvP Tierboard

A responsive React + Vite leaderboard starter with a dark esports UI, player profiles, tier points, gamemode filters, search, and a local admin panel.

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Admin panel

Click **Staff login** and use the demo password:

```text
iceadmin
```

The admin panel supports adding players, editing tiers, deleting players, and JSON import/export. Changes persist in this browser via `localStorage`.

**Important:** This is a front-end demo, not secure staff authentication. The password is visible in the client code and localStorage can be edited by visitors. Before using this for a public competitive leaderboard, move player data and staff authentication to a backend with server-side access controls.

## Tier points

HT1 60 · LT1 45 · HT2 30 · LT2 20 · HT3 10 · LT3 6 · HT4 4 · LT4 3 · HT5 2 · LT5 1.

Player points are automatically calculated by summing all assigned gamemode tiers.

## Notes

- Player avatars and body renders load from `mc-heads.net`; an internet connection is required for those images.
- The sample players are fictional/demo entries. Replace them with verified IceSMP player data in the admin panel or by importing JSON.
- The Crystal tab in the reference is represented as a visual navigation option only; the starter's tier modes include Sword, Axe, SMP, UHC, Mace, NethPot, DiaPot, SpearMace, DiaSMP and Vanilla. Add a Crystal mode in `MODES` if your server uses it as a separate tier category.
