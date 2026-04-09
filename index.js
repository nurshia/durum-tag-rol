const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();
client.interactions = new Collection();

const komutKlasorleri = fs.readdirSync("./komutlar");
for (const dosyaVeyaKlasor of komutKlasorleri) {
  if (dosyaVeyaKlasor.endsWith(".js")) {
    const command = require(`./komutlar/${dosyaVeyaKlasor}`);
    client.commands.set(command.name, command);
    console.log(`[KOMUT] ${command.name} yüklendi.`);
  } else {
    const komutDosyalari = fs
      .readdirSync(`./komutlar/${dosyaVeyaKlasor}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of komutDosyalari) {
      const command = require(`./komutlar/${dosyaVeyaKlasor}/${file}`);
      client.commands.set(command.name, command);
      console.log(`[KOMUT] ${command.name} yüklendi.`);
    }
  }
}

fs.readdirSync("./interactionlar").forEach((file) => {
  if (!file.endsWith(".js")) return;
  const interaction = require(`./interactionlar/${file}`);
  client.interactions.set(interaction.name, interaction);
  console.log(`[INTERACTION] ${interaction.name} yüklendi.`);
});

fs.readdirSync("./eventler").forEach((file) => {
  if (!file.endsWith(".js")) return;
  const event = require(`./eventler/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`[EVENT] ${event.name} yüklendi.`);
});



client.login(config.token).catch((err) => {
  console.error("[HATA] Bot giriş yapamadı. Tokeni kontrol edin.");
  console.log(client.user.id)
});
