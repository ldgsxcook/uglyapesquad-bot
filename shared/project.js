import { clamp, intFrom, numberFrom } from "./format.js";

export function readProjectConfig(env = process.env) {
  const supply = Math.max(1, intFrom(env.MINT_SUPPLY, 5000));
  const minted = clamp(intFrom(env.MINTED_COUNT, 0), 0, supply);

  return {
    name: env.PROJECT_NAME || "Ultimate Ape Society",
    tagline: env.PROJECT_TAGLINE || "Holder command center for UAS v2.",
    dashboardUrl: env.DASHBOARD_URL || "",
    discordInviteUrl: env.DISCORD_INVITE_URL || "",
    publicMintUrl: env.PUBLIC_MINT_URL || "",
    mint: {
      supply,
      minted,
      remaining: supply - minted,
      progress: Math.round((minted / supply) * 1000) / 10,
      priceSol: numberFrom(env.MINT_PRICE_SOL) ?? null
    },
    collection: {
      address: env.UAS_COLLECTION_ADDRESS || env.UAS_COLLECTION_ID || env.NFT_COLLECTION_ADDRESS || "",
      creatorAddress: env.UAS_CREATOR_ADDRESS || env.NFT_CREATOR_ADDRESS || ""
    }
  };
}
