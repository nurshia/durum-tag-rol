module.exports = {
  name: "clientReady",
  once: true,
  execute(client) {
    console.log(`[BOT] ${client.user.tag} aktif!`);
    console.log(client.user.id)
  },
};
