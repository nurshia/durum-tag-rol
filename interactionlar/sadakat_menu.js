const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "sadakat_menu",
  async execute(interaction, client) {
    const selected = interaction.values[0];

    if (selected === "mod") {
      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`sadakat_mod_select_${interaction.message.id}`)
          .setPlaceholder("Sadakat modunu seçin")
          .addOptions(
            {
              label: "Kapalı",
              description: "Sadakat sistemini kapat",
              value: "kapali",
              emoji: "❌",
            },
            {
              label: "Sadece Tag",
              description: "Sadece guild tag kontrolü",
              value: "tag",
              emoji: "🏷️",
            },
            {
              label: "Sadece Durum",
              description: "Sadece custom status kontrolü",
              value: "durum",
              emoji: "📝",
            },
            {
              label: "Birleşik (Tag VE Durum)",
              description: "Hem tag hem durum gerekli",
              value: "birlesik",
              emoji: "🔗",
            },
          ),
      );

      return interaction.reply({
        content: "**Sadakat modunu seçin:**",
        components: [selectMenu],
        ephemeral: true,
      });
    }

    if (selected === "rol") {
      const modal = new ModalBuilder()
        .setCustomId(`sadakat_rol_modal_${interaction.message.id}`)
        .setTitle("Sadakat Rolü Ayarla");

      const input = new TextInputBuilder()
        .setCustomId("rol_id")
        .setLabel("Rol ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Rol ID'sini girin")
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (selected === "log") {
      const modal = new ModalBuilder()
        .setCustomId(`sadakat_log_modal_${interaction.message.id}`)
        .setTitle("Log Kanalı Ayarla");

      const input = new TextInputBuilder()
        .setCustomId("kanal_id")
        .setLabel("Kanal ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Kanal ID'sini girin")
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }
  },
};
