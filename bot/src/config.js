import { readHolderConfig } from "../../shared/helius.js";
import { intFrom, parseBool } from "../../shared/format.js";
import { readMarketplaceConfig } from "../../shared/marketplaces.js";
import { readProjectConfig } from "../../shared/project.js";

export function readBotConfig(env = process.env) {
  return {
    port: intFrom(env.PORT, 3000),
    project: readProjectConfig(env),
    holder: readHolderConfig(env),
    marketplace: readMarketplaceConfig(env),
    discord: {
      token: env.DISCORD_TOKEN || "",
      clientId: env.DISCORD_CLIENT_ID || env.CLIENT_ID || "",
      guildId: env.DISCORD_GUILD_ID || env.GUILD_ID || "",
      holderRoleId:
        env.DISCORD_HOLDER_ROLE_ID || env.HOLDER_ROLE_ID || env.VERIFIED_ROLE_ID || "",
      registerOnStart: parseBool(env.REGISTER_COMMANDS_ON_START, true),
      commandScope: env.DISCORD_COMMAND_SCOPE || "guild"
    }
  };
}

export function requireDiscordToken(config) {
  if (!config.discord.token) {
    throw new Error("DISCORD_TOKEN is required to start the bot.");
  }
}

export function requireCommandRegistrationConfig(config) {
  const missing = [];
  if (!config.discord.token) missing.push("DISCORD_TOKEN");
  if (!config.discord.clientId) missing.push("DISCORD_CLIENT_ID");
  if (config.discord.commandScope !== "global" && !config.discord.guildId) {
    missing.push("DISCORD_GUILD_ID");
  }

  if (missing.length) {
    throw new Error(`Missing Discord command registration env vars: ${missing.join(", ")}`);
  }
}
