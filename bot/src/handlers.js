import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { createApePrompt, createMutation } from "../../shared/ape.js";
import { compactAddress, formatNumber, formatPrice } from "../../shared/format.js";
import { verifyCollectionHolder } from "../../shared/helius.js";
import { getMarketplaceSnapshot } from "../../shared/marketplaces.js";

export async function handleInteraction(interaction, config) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "verify" || interaction.commandName === "refresh-role") {
    await handleVerify(interaction, config);
    return;
  }

  if (interaction.commandName === "floor") {
    await handleFloor(interaction, config);
    return;
  }

  if (interaction.commandName === "dashboard") {
    await handleDashboard(interaction, config);
    return;
  }

  if (interaction.commandName === "ape") {
    await handleApe(interaction);
    return;
  }

  if (interaction.commandName === "mutate") {
    await handleMutate(interaction);
    return;
  }

  if (interaction.commandName === "stake") {
    await handleStake(interaction);
    return;
  }

  if (interaction.commandName === "xp") {
    await handleXp(interaction);
    return;
  }

  if (interaction.commandName === "alert") {
    await handleAlert(interaction, config);
  }
}

async function handleVerify(interaction, config) {
  const wallet = interaction.options.getString("wallet", true);
  await interaction.deferReply({ ephemeral: true });

  const result = await verifyCollectionHolder(wallet, config.holder);
  if (!result.ok) {
    await interaction.editReply(`Verification could not run: ${result.reason}`);
    return;
  }

  if (!result.holder) {
    await interaction.editReply(
      `No ${config.project.name} asset was found for ${compactAddress(result.wallet)} after scanning ${result.totalScanned} assets.`
    );
    return;
  }

  const roleMessage = await applyHolderRole(interaction, config.discord.holderRoleId);
  const assetList = result.matches
    .slice(0, 3)
    .map((asset) => `- ${asset.name} (${compactAddress(asset.id)})`)
    .join("\n");

  await interaction.editReply(
    [
      `Verified ${result.count} ${config.project.name} asset${result.count === 1 ? "" : "s"} for ${compactAddress(result.wallet)}.`,
      roleMessage,
      assetList ? `\n${assetList}` : ""
    ].join("\n")
  );
}

async function applyHolderRole(interaction, holderRoleId) {
  if (!holderRoleId) {
    return "Holder role was not applied because DISCORD_HOLDER_ROLE_ID is not configured.";
  }

  if (!interaction.guild) {
    return "Holder role can only be applied inside the configured Discord server.";
  }

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    await member.roles.add(holderRoleId, "UAS holder verification");
    return "Holder role refreshed.";
  } catch (error) {
    return `Holder verified, but the role could not be applied: ${error.message}`;
  }
}

async function handleFloor(interaction, config) {
  await interaction.deferReply();
  const snapshot = await getMarketplaceSnapshot(config.marketplace);
  const providerLines = snapshot.providers.map(formatProviderLine).join("\n");
  const bestFloor = snapshot.bestFloor
    ? formatPrice(snapshot.bestFloor.price, snapshot.bestFloor.currency)
    : "n/a";
  const listed = snapshot.totalListed === null ? "n/a" : formatNumber(snapshot.totalListed);
  const warnings = snapshot.warnings.length ? `\n${snapshot.warnings.join("\n")}` : "";

  await interaction.editReply(
    [
      `**${config.project.name} marketplace snapshot**`,
      `Best floor: ${bestFloor}`,
      `Listed: ${listed}`,
      `Providers: ${snapshot.healthyProviderCount}/${snapshot.configuredProviderCount} healthy`,
      providerLines,
      warnings
    ]
      .filter(Boolean)
      .join("\n")
  );
}

function formatProviderLine(provider) {
  if (!provider.enabled) return `- ${provider.name}: not configured`;
  if (!provider.ok) return `- ${provider.name}: ${provider.error}`;
  const floor = provider.floor ? formatPrice(provider.floor.price, provider.floor.currency) : "n/a";
  const listed = provider.listedCount === null ? "n/a" : formatNumber(provider.listedCount);
  return `- ${provider.name}: floor ${floor}, listed ${listed}`;
}

async function handleDashboard(interaction, config) {
  const url = config.project.dashboardUrl || config.project.publicMintUrl || "";
  const content = url
    ? `${config.project.name} dashboard: ${url}`
    : "DASHBOARD_URL is not configured yet.";
  const components = url
    ? [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel("Open dashboard").setStyle(ButtonStyle.Link).setURL(url)
        )
      ]
    : [];

  await interaction.reply({ content, components, ephemeral: true });
}

async function handleApe(interaction) {
  const prompt = createApePrompt({
    mood: interaction.options.getString("mood") || "",
    traitBias: interaction.options.getString("trait_bias") || "",
    wallet: interaction.options.getString("wallet") || ""
  });

  await interaction.reply({
    content: [`**UAS v2 prompt**`, prompt.prompt, `Seed: ${prompt.seed}`].join("\n"),
    ephemeral: true
  });
}

async function handleMutate(interaction) {
  const mutation = createMutation({
    serum: interaction.options.getString("serum") || "",
    intensity: interaction.options.getString("intensity") || "",
    wallet: interaction.options.getString("wallet") || ""
  });

  await interaction.reply({
    content: [
      `**${mutation.name}**`,
      mutation.effect,
      `Rarity hint: ${mutation.rarityHint}`,
      `Seed: ${mutation.seed}`
    ].join("\n"),
    ephemeral: true
  });
}

async function handleStake(interaction) {
  const apeId = interaction.options.getString("ape_id", true);
  const days = interaction.options.getInteger("days") || 30;
  const xp = Math.max(25, Math.round(days * 8.5));

  await interaction.reply({
    content: [
      `Stake preview created for ${apeId}.`,
      `Duration: ${days} day${days === 1 ? "" : "s"}`,
      `Projected XP: ${formatNumber(xp)}`,
      "This is a non-custodial preview; production staking should be connected to the verified on-chain program before rewards are treated as final."
    ].join("\n"),
    ephemeral: true
  });
}

async function handleXp(interaction) {
  const base = Number(BigInt(interaction.user.id) % 900n) + 100;
  const holderBonus = interaction.member?.roles?.cache?.size ? 125 : 0;
  const xp = base + holderBonus;

  await interaction.reply({
    content: [
      `UAS v2 XP preview for ${interaction.user.username}: ${formatNumber(xp)}`,
      `Rank band: ${xp > 850 ? "Apex" : xp > 550 ? "Lab Proven" : "Rising"}`
    ].join("\n"),
    ephemeral: true
  });
}

async function handleAlert(interaction, config) {
  const scenario = interaction.options.getString("scenario", true);
  const maxSol = interaction.options.getInteger("max_sol");
  const snapshot = await getMarketplaceSnapshot(config.marketplace);
  const bestFloor = snapshot.bestFloor
    ? formatPrice(snapshot.bestFloor.price, snapshot.bestFloor.currency)
    : "n/a";

  await interaction.reply({
    content: [
      `Educational watch note: ${scenario}`,
      `Current best configured floor: ${bestFloor}`,
      maxSol ? `Watch ceiling: ${formatNumber(maxSol)} SOL` : "",
      "Not financial advice. Confirm liquidity, royalties, listing quality, and wallet safety before taking action."
    ]
      .filter(Boolean)
      .join("\n"),
    ephemeral: true
  });
}
