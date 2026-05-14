import { Client, Events, GatewayIntentBits } from "discord.js";
import { readBotConfig, requireDiscordToken } from "./config.js";
import { handleInteraction } from "./handlers.js";
import { startHealthServer } from "./health.js";
import { registerCommands } from "./register-commands.js";

const config = readBotConfig();
startHealthServer({ port: config.port, projectName: config.project.name });

if (config.discord.registerOnStart) {
  try {
    const result = await registerCommands(config);
    console.log(`Registered ${result.count} slash commands for ${result.scope}.`);
  } catch (error) {
    console.warn(`Slash command registration skipped: ${error.message}`);
  }
}

requireDiscordToken(config);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`UAS v2 bot logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    await handleInteraction(interaction, config);
  } catch (error) {
    console.error(error);
    const message = `Command failed: ${error.message || "Unexpected error"}`;
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message).catch(() => {});
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
    }
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing Discord client.");
  client.destroy();
  process.exit(0);
});

await client.login(config.discord.token);
