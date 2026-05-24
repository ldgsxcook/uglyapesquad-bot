import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing required env var: DISCORD_TOKEN');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Ugly Ape Squad Bot online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ape') {
    return interaction.reply('🐒 Welcome to Ugly Ape Squad. Mutation pending...');
  }

  if (interaction.commandName === 'mutate') {
    return interaction.reply('💉 Mutation successful. Serum accepted.');
  }

  if (interaction.commandName === 'xp') {
    return interaction.reply('🧬 XP system online.');
  }

  if (interaction.commandName === 'leaderboard') {
    return interaction.reply('🏆 Leaderboard system online.');
  }

  if (interaction.commandName === 'dashboard') {
    return interaction.reply(`🌐 Dashboard: ${process.env.DASHBOARD_URL || 'Coming soon'}`);
  }

  return interaction.reply('✅ UAS command received.');
});

client.login(process.env.DISCORD_TOKEN);
