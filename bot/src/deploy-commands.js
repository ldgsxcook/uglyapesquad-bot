import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const required = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const commands = [
  new SlashCommandBuilder().setName('ape').setDescription('Welcome to Ugly Ape Squad'),
  new SlashCommandBuilder().setName('mint-status').setDescription('Show UAS mint progress'),
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Save your wallet as verified')
    .addStringOption(option => option.setName('wallet').setDescription('Solana wallet address').setRequired(true)),
  new SlashCommandBuilder()
    .setName('holder')
    .setDescription('Verify that you hold a UAS NFT')
    .addStringOption(option => option.setName('wallet').setDescription('Solana wallet address').setRequired(true)),
  new SlashCommandBuilder()
    .setName('gate')
    .setDescription('Refresh your token-gated holder role')
    .addStringOption(option => option.setName('wallet').setDescription('Solana wallet address').setRequired(true)),
  new SlashCommandBuilder().setName('floor').setDescription('Show marketplace/floor info'),
  new SlashCommandBuilder().setName('stake').setDescription('Stake your UAS NFT in the community tracker'),
  new SlashCommandBuilder().setName('unstake').setDescription('Unstake from the community tracker'),
  new SlashCommandBuilder().setName('staking-rewards').setDescription('Check your staking rewards'),
  new SlashCommandBuilder()
    .setName('generate-ape')
    .setDescription('Generate an Ugly Ape image prompt')
    .addStringOption(option => option.setName('style').setDescription('Example: cyberpunk, toxic, gold, zombie').setRequired(false)),
  new SlashCommandBuilder().setName('trading-alerts').setDescription('Show educational trading alert status'),
  new SlashCommandBuilder().setName('dashboard').setDescription('Get the UAS dashboard link'),
  new SlashCommandBuilder().setName('mutate').setDescription('Run the mutation machine'),
  new SlashCommandBuilder().setName('xp').setDescription('Check your XP'),
  new SlashCommandBuilder().setName('leaderboard').setDescription('Show the XP leaderboard')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
  { body: commands }
);

console.log(`✅ Deployed ${commands.length} slash commands to guild ${process.env.GUILD_ID}.`);
