module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return;

    let customId = interaction.customId;
    let interactionHandler = client.interactions.get(customId);

    if (!interactionHandler) {
      const baseId = customId.split("_").slice(0, -1).join("_");
      interactionHandler = client.interactions.get(baseId);
    }

    if (!interactionHandler) return;

    try {
      await interactionHandler.execute(interaction, client);
    } catch (error) {
      console.error(`[HATA] ${interaction.customId} interaction hatası:`, error);
    }
  },
};
