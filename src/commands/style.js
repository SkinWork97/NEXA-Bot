import { SlashCommandBuilder } from 'discord.js';
import { setPersona } from '../lib/storage.js';

export const data = new SlashCommandBuilder()
  .setName('style')
  .setDescription('Wähle NEXAs Persona-Stil')
  .addStringOption(o => o.setName('persona')
    .setDescription('cool | meme | warm | sage')
    .setRequired(true)
    .addChoices(
      { name: 'cool', value: 'cool' },
      { name: 'meme', value: 'meme' },
      { name: 'warm', value: 'warm' },
      { name: 'sage', value: 'sage' },
    ));

export async function execute(inter) {
  const p = inter.options.getString('persona', true);
  setPersona(inter.user.id, p);
  await inter.reply({ ephemeral: true, content: `Stil gesetzt: **${p}**.` });
}
