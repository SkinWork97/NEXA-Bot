import { SlashCommandBuilder } from 'discord.js';
import { getSettings } from '../lib/storage.js';
import { buildSystemPrompt } from '../lib/persona.js';
import { llm } from '../lib/llm.js';
import { searchGames } from '../lib/recommend.js';

export const data = new SlashCommandBuilder()
  .setName('findgame')
  .setDescription('Finde ein Spiel nach Stimmung')
  .addStringOption(o => o.setName('stimmung')
    .setDescription('chill | story | intense | creative | brainoff').setRequired(true))
  .addStringOption(o => o.setName('zeit')
    .setDescription('short | 1-2h | 2-4h | open').setRequired(true))
  .addStringOption(o => o.setName('plattform')
    .setDescription('pc | xbox | ps | switch | any').setRequired(true))
  .addBooleanOption(o => o.setName('coop')
    .setDescription('Mit anderen spielen?').setRequired(false));

export async function execute(inter) {
  await inter.deferReply();

  const mood = inter.options.getString('stimmung', true);
  const time = inter.options.getString('zeit', true);
  const platform = inter.options.getString('plattform', true);
  const coop = inter.options.getBoolean('coop') ?? false;

  const raw = await searchGames({ mood, time, platform, coop });
  const top = raw.slice(0, 3);

  const sys = buildSystemPrompt(getSettings(inter.user.id).persona);
  const user = `Formatiere kurz drei Empfehlungen aus diesen Daten:
${JSON.stringify(top, null, 2)}
Kontext:
- Stimmung: ${mood}
- Zeit: ${time}
- Coop: ${coop}
- Plattform: ${platform}
Format:
**Titel**
Ein Satz (warum es heute passt).
Link: <URL>`;

  const text = await llm(sys, user);
  await inter.editReply(text);
}
