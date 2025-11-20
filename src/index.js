import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import * as findgame from './commands/findgame.js';
import * as style from './commands/style.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [findgame.data, style.data];
const handlers = { findgame, style };
const GUILD_ID = 1437440983947280415

// ⚠️ Neues Event: 'clientReady' statt 'ready'
client.once('clientReady', async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  // **GUILD-Commands** → erscheinen in Sekunden im angegebenen Server
  await rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
    { body: commands.map(c => c.toJSON()) }
  );

  console.log('✅ Slash Commands für die Gilde registriert.');
});

client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const h = handlers[i.commandName];
  if (!h?.execute) return;
  try {
    await h.execute(i);
  } catch (e) {
    console.error(e);
    if (i.replied || i.deferred) {
      i.followUp({ content: 'Fehler 💥', ephemeral: true }).catch(()=>{});
    } else {
      i.reply({ content: 'Fehler 💥', ephemeral: true }).catch(()=>{});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
