# Railway Service Setup

Create two Railway services from `ldgsxcook/uglyapesquad-bot`.

## Bot Service

- Config file path: `/railway/bot.toml`
- Watch paths:
  - `/bot/**`
  - `/shared/**`
  - `/package.json`
  - `/railway/bot.toml`
- Healthcheck path: `/healthz`
- Start command comes from `railway/bot.toml`: `npm run start:bot`

Required variables:

```env
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
DISCORD_HOLDER_ROLE_ID=
HELIUS_API_KEY=
UAS_COLLECTION_ADDRESS=
DASHBOARD_URL=
REGISTER_COMMANDS_ON_START=true
DISCORD_COMMAND_SCOPE=guild
```

Legacy aliases still work for the starter repo variables: `CLIENT_ID`, `GUILD_ID`, `HOLDER_ROLE_ID`, `VERIFIED_ROLE_ID`, and `UAS_COLLECTION_ID`.

## Dashboard Service

- Config file path: `/railway/dashboard.toml`
- Watch paths:
  - `/dashboard/**`
  - `/shared/**`
  - `/package.json`
  - `/railway/dashboard.toml`
- Healthcheck path: `/api/stats`
- Start command comes from `railway/dashboard.toml`: `npm run start:dashboard`

Set `DASHBOARD_URL` to the public dashboard domain after the first dashboard deployment, then redeploy the bot so `/dashboard` returns the live URL.
