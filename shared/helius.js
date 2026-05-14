import { fetchJson } from "./http.js";

const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function readHolderConfig(env = process.env) {
  return {
    heliusApiKey: env.HELIUS_API_KEY || "",
    heliusRpcUrl: env.HELIUS_RPC_URL || "https://mainnet.helius-rpc.com",
    collectionAddress:
      env.UAS_COLLECTION_ADDRESS || env.UAS_COLLECTION_ID || env.NFT_COLLECTION_ADDRESS || "",
    creatorAddress: env.UAS_CREATOR_ADDRESS || env.NFT_CREATOR_ADDRESS || ""
  };
}

export function validateSolanaAddress(address) {
  return typeof address === "string" && BASE58_ADDRESS.test(address.trim());
}

export async function verifyCollectionHolder(walletAddress, config = readHolderConfig()) {
  const wallet = String(walletAddress || "").trim();

  if (!validateSolanaAddress(wallet)) {
    return {
      ok: false,
      holder: false,
      reason: "Wallet address is not a valid Solana base58 address."
    };
  }

  if (!config.heliusApiKey) {
    return {
      ok: false,
      holder: false,
      reason: "HELIUS_API_KEY is not configured."
    };
  }

  if (!config.collectionAddress && !config.creatorAddress) {
    return {
      ok: false,
      holder: false,
      reason: "Set UAS_COLLECTION_ADDRESS or UAS_CREATOR_ADDRESS before holder verification."
    };
  }

  const matches = [];
  let totalScanned = 0;
  let page = 1;
  const limit = 1000;

  while (page <= 10) {
    const result = await fetchOwnerAssets(wallet, page, limit, config);
    const items = result?.result?.items || [];
    totalScanned += items.length;

    for (const asset of items) {
      if (assetMatchesCollection(asset, config)) {
        matches.push({
          id: asset.id,
          name: asset.content?.metadata?.name || asset.content?.json_uri || "UAS asset",
          interface: asset.interface
        });
      }
    }

    if (matches.length || items.length < limit) break;
    page += 1;
  }

  return {
    ok: true,
    holder: matches.length > 0,
    wallet,
    count: matches.length,
    totalScanned,
    matches
  };
}

async function fetchOwnerAssets(ownerAddress, page, limit, config) {
  const base = config.heliusRpcUrl.replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  const url = `${base}/${separator}api-key=${encodeURIComponent(config.heliusApiKey)}`;

  return fetchJson(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `uas-${page}`,
      method: "getAssetsByOwner",
      params: {
        ownerAddress,
        page,
        limit,
        displayOptions: {
          showCollectionMetadata: true
        }
      }
    })
  });
}

function assetMatchesCollection(asset, config) {
  const grouping = Array.isArray(asset.grouping) ? asset.grouping : [];
  const creators = Array.isArray(asset.creators) ? asset.creators : [];
  const authorities = Array.isArray(asset.authorities) ? asset.authorities : [];

  if (config.collectionAddress) {
    const collectionMatch = grouping.some(
      (group) =>
        group.group_key === "collection" &&
        String(group.group_value).toLowerCase() === config.collectionAddress.toLowerCase()
    );
    if (collectionMatch) return true;
  }

  if (config.creatorAddress) {
    return (
      creators.some(
        (creator) =>
          creator.verified &&
          String(creator.address).toLowerCase() === config.creatorAddress.toLowerCase()
      ) ||
      authorities.some(
        (authority) =>
          String(authority.address).toLowerCase() === config.creatorAddress.toLowerCase()
      )
    );
  }

  return false;
}
