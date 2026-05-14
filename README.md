# UAS v2 Discord and Web3 Deployment

Production-ready workspace for the Ultimate Ape Society v2 Discord bot, holder verification, marketplace aggregation, and dashboard.

## Services

- `bot` - Discord slash-command worker with `/verify`, `/refresh-role`, `/floor`, `/dashboard`, `/ape`, `/mutate`, `/stake`, `/xp`, and `/alert`.
- `dashboard` - Next.js command center with mint status, marketplace health, Discord utility, and generation APIs.
- `shared` - Helius holder verification, marketplace adapters, formatting helpers, and deterministic ape/mutation generation.

## Local Setup

```bash
npm install
cp .env.example .env
npm run verify
npm run register:commands
npm run start:bot
npm run dev:dashboard
```

Fill `.env` with real Discord, Helius, collection, dashboard, mint, and marketplace values before running the bot against a live server.

## Railway

Create two Railway services from this same GitHub repo:

- Bot service: config file path `/railway/bot.toml`, health check `/healthz`
- Dashboard service: config file path `/railway/dashboard.toml`, health check `/api/stats`

Railway's monorepo config file path is absolute from the repo root, so set the service config paths exactly as shown above. See `railway/README.md` and `docs/PRODUCTION_RAILWAY.md` for the full launch checklist.

## Discord Bot Launch

1. Create or open the Discord application in the Developer Portal.
2. Enable the bot with the `applications.commands` and `bot` scopes.
3. Give the bot permission to manage roles.
4. Put the bot's managed role above the UAS holder role in Discord role order.
5. Set `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `DISCORD_HOLDER_ROLE_ID`, `HELIUS_API_KEY`, and either `UAS_COLLECTION_ADDRESS` or `UAS_CREATOR_ADDRESS` in Railway.
6. Deploy the bot service. Slash commands register on boot when `REGISTER_COMMANDS_ON_START=true`.

Secrets belong in Railway variables, not in GitHub files.
