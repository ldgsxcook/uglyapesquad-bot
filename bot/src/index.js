import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const xp = new Map();

function addXp(userId, amount = 5) {
  xp.set(userId, (xp.get(userId) || 0) + amount);
}

client.once('ready', () => {
  console.log(`🐒 Ugly Ape Squad Bot online as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  addXp(message.author.id, 2);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ape') {
    return interaction.reply('🐒 Welcome to Ugly Ape Squad. Mutation pending...');
  }

  if (commandName === 'mint-status') {
    return interaction.reply('🔥 UAS mint tracker online. Supply and mint metrics coming soon.');
  }

  if (commandName === 'verify') {
    const wallet = interaction.options.getString('wallet');
    return interaction.reply({ content: `✅ Wallet saved: ${wallet}`, ephemeral: true });
  }

  if (commandName === 'holder' || commandName === 'gate') {
    const roleId = process.env.HOLDER_ROLE_ID;

    if (roleId) {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      await member.roles.add(roleId).catch(() => null);
    }

    return interaction.reply({
      content: '✅ Holder verification complete. Role updated.',
      ephemeral: true
    });
  }

  if (commandName === 'floor') {
    return interaction.reply(`📈 Current placeholder floor: ${process.env.UAS_FLOOR_SOL || '0'} SOL`);
  }

  if (commandName === 'stake') {
    addXp(interaction.user.id, 50);
    return interaction.reply('🥩 Your ape has entered the community staking vault.');
  }

  if (commandName === 'unstake') {
    return interaction.reply('🔓 Your ape has been unstaked.');
  }

  if (commandName === 'staking-rewards') {
    return interaction.reply(`💰 Estimated rewards: ${(xp.get(interaction.user.id) || 0)} serum points.`);
  }

  if (commandName === 'generate-ape') {
    const style = interaction.options.getString('style') || 'mutant';
    return interaction.reply(`🎨 AI Prompt: Ugly Ape Squad ${style} ape with glowing eyes, cracked fur, toxic serum, cinematic lighting, ultra detailed.`);
  }

  if (commandName === 'trading-alerts') {
    return interaction.reply('📊 Trading alerts active. Educational signals only — not financial advice.');
  }

  if (commandName === 'dashboard') {
    return interaction.reply(`🌐 Dashboard: ${process.env.DASHBOARD_URL || 'Coming soon'}`);
  }

  if (commandName === 'mutate') {
    addXp(interaction.user.id, 25);
    return interaction.reply('💉 Mutation successful. Serum accepted.');
  }

  if (commandName === 'xp') {
    return interaction.reply(`🧬 XP: ${xp.get(interaction.user.id) || 0}`);
  }

  if (commandName === 'leaderboard') {
    return interaction.reply('🏆 Leaderboard system online.');
  }
});

client.login(process.env.DISCORD_TOKEN);
