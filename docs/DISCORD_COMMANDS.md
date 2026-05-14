# Discord Commands

| Command | Purpose |
| --- | --- |
| `/verify wallet:<address>` | Checks Helius DAS ownership and applies the configured holder role. |
| `/refresh-role wallet:<address>` | Re-runs the holder check and refreshes the role. |
| `/floor` | Aggregates configured Magic Eden, Tensor, and OpenSea market stats. |
| `/dashboard` | Returns the production dashboard link. |
| `/ape` | Generates a deterministic UAS v2 art prompt. |
| `/mutate` | Generates a deterministic SerumX mutation concept. |
| `/stake` | Previews staking duration and XP. |
| `/xp` | Shows a Discord XP preview. |
| `/alert` | Produces an educational market watch note. |

Register commands manually with:

```bash
npm run register:commands
```
