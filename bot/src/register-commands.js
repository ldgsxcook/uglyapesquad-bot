import { pathToFileURL } from "node:url";
import { REST, Routes } from "discord.js";
import { commandDefinitions } from "./commands.js";
import { readBotConfig, requireCommandRegistrationConfig } from "./config.js";

export async function registerCommands(config = readBotConfig()) {
  requireCommandRegistrationConfig(config);

  const rest = new REST({ version: "10" }).setToken(config.discord.token);
  const route =
    config.discord.commandScope === "global"
      ? Routes.applicationCommands(config.discord.clientId)
      : Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId);

  await rest.put(route, { body: commandDefinitions });
  return {
    count: commandDefinitions.length,
    scope: config.discord.commandScope === "global" ? "global" : config.discord.guildId
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  registerCommands()
    .then((result) => {
      console.log(`Registered ${result.count} UAS v2 commands for ${result.scope}.`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
