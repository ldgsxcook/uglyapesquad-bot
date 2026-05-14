# Production Railway Deploy

## 1. Discord Bot

Create a Discord application and bot, then set these variables on the Railway bot service:

```bash
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
DISCORD_HOLDER_ROLE_ID=
REGISTER_COMMANDS_ON_START=true
DISCORD_COMMAND_SCOPE=guild
PORT=3000
```

Use `DISCORD_COMMAND_SCOPE=global` only after guild commands are tested. Global command propagation can take longer.

## 2. Holder Verification

Set at least one collection matcher:

```bash
HELIUS_API_KEY=
HELIUS_RPC_URL=https://mainnet.helius-rpc.com
UAS_COLLECTION_ADDRESS=
UAS_CREATOR_ADDRESS=
```

`/verify` and `/refresh-role` call Helius DAS `getAssetsByOwner`, scan up to 10,000 assets, and apply `DISCORD_HOLDER_ROLE_ID` when a collection or verified creator match is found.

## 3. Marketplace Integrations

Configure any combination of providers:

```bash
MARKETPLACE_CACHE_TTL_SECONDS=90
MAGIC_EDEN_SYMBOL=
MAGIC_EDEN_API_KEY=
TENSOR_COLLECTION=
TENSOR_CHAIN=sol
TENSOR_API_KEY=
OPENSEA_SLUG=
OPENSEA_API_KEY=
```

Marketplace failures are isolated per provider, so one bad API key should not break `/floor` or dashboard health checks.

## 4. Dashboard

Set shared public launch values on the dashboard service:

```bash
PROJECT_NAME=Ultimate Ape Society
PROJECT_TAGLINE=Holder command center for UAS v2.
DASHBOARD_URL=https://your-dashboard.up.railway.app
DISCORD_INVITE_URL=https://discord.gg/your-server
PUBLIC_MINT_URL=https://your-mint-url.example
MINT_SUPPLY=5000
MINTED_COUNT=0
MINT_PRICE_SOL=1.25
PORT=3000
```

The dashboard exposes:

- `GET /api/stats` for Railway health and project stats.
- `POST /api/generate-ape` for deterministic ape prompts.
- `POST /api/mutate` for deterministic SerumX mutation concepts.

## 5. Deploy Order

1. Deploy the dashboard service with `railway/dashboard.toml`.
2. Copy its public domain into `DASHBOARD_URL`.
3. Deploy the bot service with `railway/bot.toml`.
4. Run `/floor` and `/dashboard` in Discord.
5. Test `/verify` with a known holder wallet before announcing role gating.

## Safety Notes

- `/stake`, `/xp`, and `/alert` are previews. Connect staking to the audited on-chain program before representing rewards as final.
- `/alert` is educational only and should not be presented as financial advice.
- The bot needs permission to manage roles, and its managed role must sit above the holder role in Discord role order.
