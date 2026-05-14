import { compactAddress } from "./format.js";

const labs = ["Obsidian Lab", "Neon Vault", "Chrome Jungle", "Serum Bay", "Static Grove"];
const mutations = ["plasma canines", "spectral fur", "gold visor", "circuit tattoos", "void eyes"];
const backgrounds = ["liquid glass reactor", "marketplace war room", "midnight Solana arcade", "launch gantry"];

export function createApePrompt(input = {}) {
  const seed = hashSeed(`${input.wallet || ""}:${input.mood || ""}:${input.traitBias || ""}`);
  const lab = pick(labs, seed);
  const mutation = pick(mutations, seed >> 3);
  const background = pick(backgrounds, seed >> 5);
  const mood = input.mood || "battle-ready";
  const traitBias = input.traitBias || "rare utility";

  return {
    prompt: [
      `Ultimate Ape Society v2 ape, ${mood} expression, ${mutation},`,
      `${traitBias} trait language, cinematic ${background},`,
      `${lab} lighting, high-detail collectible portrait, crisp marketplace thumbnail.`
    ].join(" "),
    seed,
    walletPreview: input.wallet ? compactAddress(input.wallet) : null
  };
}

export function createMutation(input = {}) {
  const seed = hashSeed(`${input.wallet || ""}:${input.serum || ""}:${input.intensity || ""}`);
  const intensity = input.intensity || "controlled";
  const serum = input.serum || "SerumX";

  return {
    name: `${serum} ${pick(["Ascendant", "Overclock", "Prism", "Night Shift"], seed)} Mutation`,
    effect: `${intensity} mutation pass with ${pick(mutations, seed >> 2)} and ${pick(backgrounds, seed >> 4)} energy.`,
    rarityHint: pick(["utility-biased", "visual-first", "holder-gated", "market-ready"], seed >> 6),
    seed
  };
}

function pick(values, seed) {
  return values[Math.abs(seed) % values.length];
}

function hashSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
