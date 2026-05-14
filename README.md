# Ugly Ape Squad v2 Package

This repo-ready package contains two deployable apps:

- `bot/` — Discord Web3 utility bot
- `dashboard/` — Next.js dashboard starter

## Features

### Discord bot

- `/mint-status` — mint progress tracker
- `/holder` — Solana NFT holder verification using Helius DAS
- `/gate` — token-gated role refresh
- `/floor` — marketplace stats placeholder
- `/stake`, `/unstake`, `/staking-rewards` — off-chain community staking tracker starter
- `/generate-ape` — AI image prompt generator starter
- `/trading-alerts` — educational alerts only; no auto-trading
- `/dashboard` — dashboard link
- `/xp`, `/leaderboard`, `/mutate`, `/verify`

### Dashboard

- Next.js starter homepage
- `/api/stats` starter endpoint
- `/api/generate-ape` prompt endpoint

## Bot setup

```bash
cd bot
cp .env.example .env
npm install
npm run deploy-commands
npm start
```

Required bot env vars:

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
VERIFIED_ROLE_ID=
WL_ROLE_ID=
HOLDER_ROLE_ID=
HELIUS_API_KEY=
UAS_COLLECTION_ID=
DASHBOARD_URL=
```

The bot role must sit above the roles it manages in Discord.

## Railway deploy

Deploy the bot service from the `bot/` directory with start command:

```bash
npm start
```

Run slash command registration once from your machine or Railway shell:

```bash
npm run deploy-commands
```

## Codex

Open this repo in Codex and ask it to finish marketplace integrations, dashboard polish, and deploy checks. Keep secrets in Railway variables, not GitHub files.
