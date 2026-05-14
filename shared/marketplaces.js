import { fetchJson } from "./http.js";
import { intFrom, lamportsToSolMaybe, numberFrom } from "./format.js";

const MAGIC_EDEN_BASE_URL = "https://api-mainnet.magiceden.dev/v2";
const TENSOR_BASE_URL = "https://api.tensor.so";
const OPENSEA_BASE_URL = "https://api.opensea.io/api/v2";

const cache = new Map();

export function readMarketplaceConfig(env = process.env) {
  return {
    cacheTtlMs: Math.max(15, intFrom(env.MARKETPLACE_CACHE_TTL_SECONDS, 90)) * 1000,
    magicEden: {
      symbol: env.MAGIC_EDEN_SYMBOL || "",
      apiKey: env.MAGIC_EDEN_API_KEY || ""
    },
    tensor: {
      collection: env.TENSOR_COLLECTION || "",
      chain: env.TENSOR_CHAIN || "sol",
      apiKey: env.TENSOR_API_KEY || ""
    },
    openSea: {
      slug: env.OPENSEA_SLUG || "",
      apiKey: env.OPENSEA_API_KEY || ""
    }
  };
}

export async function getMarketplaceSnapshot(config = readMarketplaceConfig(), options = {}) {
  const cacheKey = JSON.stringify({
    magicEden: config.magicEden?.symbol || "",
    tensor: `${config.tensor?.chain || "sol"}:${config.tensor?.collection || ""}`,
    openSea: config.openSea?.slug || ""
  });
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (!options.force && cached && now - cached.createdAt < config.cacheTtlMs) {
    return {
      ...cached.snapshot,
      cache: {
        hit: true,
        ageMs: now - cached.createdAt,
        ttlMs: config.cacheTtlMs
      }
    };
  }

  const providers = await Promise.all([
    loadProvider("magic-eden", "Magic Eden", Boolean(config.magicEden?.symbol), () =>
      fetchMagicEden(config.magicEden)
    ),
    loadProvider("tensor", "Tensor", Boolean(config.tensor?.collection), () =>
      fetchTensor(config.tensor)
    ),
    loadProvider("opensea", "OpenSea", Boolean(config.openSea?.slug), () =>
      fetchOpenSea(config.openSea)
    )
  ]);

  const activeProviders = providers.filter((provider) => provider.enabled);
  const successfulProviders = providers.filter((provider) => provider.ok);
  const floors = successfulProviders
    .filter((provider) => numberFrom(provider.floor?.price) !== null)
    .sort((a, b) => a.floor.price - b.floor.price);

  const snapshot = {
    generatedAt: new Date(now).toISOString(),
    configuredProviderCount: activeProviders.length,
    healthyProviderCount: successfulProviders.length,
    bestFloor: floors[0]?.floor || null,
    totalListed: sumNumbers(successfulProviders.map((provider) => provider.listedCount)),
    providers,
    warnings: buildWarnings(activeProviders, successfulProviders)
  };

  cache.set(cacheKey, { createdAt: now, snapshot });

  return {
    ...snapshot,
    cache: {
      hit: false,
      ageMs: 0,
      ttlMs: config.cacheTtlMs
    }
  };
}

async function loadProvider(id, name, enabled, loader) {
  if (!enabled) {
    return {
      id,
      name,
      enabled: false,
      ok: false,
      error: "Provider is not configured."
    };
  }

  try {
    const data = await loader();
    return {
      id,
      name,
      enabled: true,
      ok: true,
      ...data
    };
  } catch (error) {
    return {
      id,
      name,
      enabled: true,
      ok: false,
      error: error.message || "Provider request failed."
    };
  }
}

async function fetchMagicEden(config = {}) {
  const symbol = encodeURIComponent(config.symbol);
  const url = `${MAGIC_EDEN_BASE_URL}/collections/${symbol}/stats`;
  const headers = {};
  if (config.apiKey) headers.authorization = `Bearer ${config.apiKey}`;

  const data = await fetchJson(url, { headers });
  const floorPrice = lamportsToSolMaybe(pickNumber(data, ["floorPrice", "floor_price"]));
  const volume24h = lamportsToSolMaybe(pickNumber(data, ["volume24hr", "volume24h", "volume1d"]));
  const totalVolume = lamportsToSolMaybe(
    pickNumber(data, ["volumeAll", "volume_all", "totalVolume", "allVolume"])
  );

  return {
    floor: floorPrice === null ? null : providerFloor("Magic Eden", floorPrice, "SOL"),
    listedCount: pickNumber(data, ["listedCount", "listed_count", "listed", "listedSupply"]),
    volume24h,
    totalVolume,
    marketplaceUrl: `https://magiceden.io/marketplace/${config.symbol}`,
    rawUpdatedAt: data.updatedAt || data.updated_at || null
  };
}

async function fetchTensor(config = {}) {
  const chain = encodeURIComponent(config.chain || "sol");
  const collection = encodeURIComponent(config.collection);
  const url = `${TENSOR_BASE_URL}/${chain}/collections/${collection}/floor`;
  const headers = {};
  if (config.apiKey) {
    headers["x-tensor-api-key"] = config.apiKey;
    headers.authorization = `Bearer ${config.apiKey}`;
  }

  const data = await fetchJson(url, { headers });
  const payload = data.floor || data.data || data;
  const floorPrice = lamportsToSolMaybe(
    pickNumber(payload, ["price", "floor", "floorPrice", "smartFloorPrice", "value"])
  );

  return {
    floor: floorPrice === null ? null : providerFloor("Tensor", floorPrice, "SOL"),
    listedCount: pickNumber(payload, ["listedCount", "numListed", "listings", "listed"]),
    volume24h: lamportsToSolMaybe(pickNumber(payload, ["volume24h", "volume1d"])),
    totalVolume: lamportsToSolMaybe(pickNumber(payload, ["totalVolume", "volumeAll"])),
    marketplaceUrl: `https://www.tensor.trade/trade/${config.collection}`,
    rawUpdatedAt: payload.updatedAt || payload.updated_at || null
  };
}

async function fetchOpenSea(config = {}) {
  const slug = encodeURIComponent(config.slug);
  const url = `${OPENSEA_BASE_URL}/collections/${slug}/stats`;
  const headers = {};
  if (config.apiKey) headers["x-api-key"] = config.apiKey;

  const data = await fetchJson(url, { headers });
  const total = data.total || data.stats || data;
  const floorPrice = numberFrom(total.floor_price ?? total.floorPrice);
  const currency = total.floor_price_symbol || total.floorPriceSymbol || "ETH";

  return {
    floor: floorPrice === null ? null : providerFloor("OpenSea", floorPrice, currency),
    listedCount: pickNumber(total, ["num_listed", "numListed", "listedCount"]),
    volume24h: pickIntervalValue(data.intervals, ["one_day", "1d"], "volume"),
    totalVolume: pickNumber(total, ["volume", "total_volume", "totalVolume"]),
    marketplaceUrl: `https://opensea.io/collection/${config.slug}`,
    rawUpdatedAt: data.updated_at || data.updatedAt || null
  };
}

function providerFloor(provider, price, currency) {
  return {
    provider,
    price,
    currency
  };
}

function pickNumber(source, keys) {
  if (!source || typeof source !== "object") return null;
  for (const key of keys) {
    const value = numberFrom(source[key]);
    if (value !== null) return value;
  }
  return null;
}

function pickIntervalValue(intervals, intervalKeys, metric) {
  if (!Array.isArray(intervals)) return null;
  const match = intervals.find((item) => intervalKeys.includes(item.interval));
  return numberFrom(match?.[metric]);
}

function sumNumbers(values) {
  const numeric = values.filter((value) => numberFrom(value) !== null).map(Number);
  return numeric.length ? numeric.reduce((sum, value) => sum + value, 0) : null;
}

function buildWarnings(activeProviders, successfulProviders) {
  const warnings = [];
  if (!activeProviders.length) {
    warnings.push("No marketplace providers are configured.");
  }
  if (activeProviders.length && !successfulProviders.length) {
    warnings.push("All configured marketplace providers failed.");
  }
  return warnings;
}
