const fs = require("fs");
const path = require("path");
const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SectionBuilder,
  ThumbnailBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "sadakat_rol_modal",
  async execute(interaction, client) {
    const rolId = interaction.fields.getTextInputValue("rol_id");
    const messageId = interaction.customId.split("_").pop();

    const rol = interaction.guild.roles.cache.get(rolId);
    if (!rol) {
      return interaction.reply({
        content: "❌ Geçersiz rol ID'si. Lütfen doğru bir rol ID'si girin.",
        ephemeral: true,
      });
    }

    updateConfig("sadakatRol", rolId);

    await interaction.reply({
      content: `✅ Sadakat rolü ${rol} olarak ayarlandı.`,
      ephemeral: true,
    });

    try {
      const originalMessage = await interaction.channel.messages.fetch(messageId);
      if (originalMessage) {
        const config = require("../config.js");
        const container = buildContainer(client, config);
        await originalMessage.edit({
          flags: MessageFlags.IsComponentsV2,
          components: [container],
        });
      }
    } catch (error) {
      console.error(`[HATA] Panel güncellenirken:`, error);
    }
  },
};

function updateConfig(key, value) {
  const configPath = path.join(__dirname, "..", "config.js");
  let configContent = fs.readFileSync(configPath, "utf8");

  const regex = new RegExp(`${key}:\\s*".*?"`, "g");
  configContent = configContent.replace(regex, `${key}: "${value}"`);

  fs.writeFileSync(configPath, configContent);
  delete require.cache[require.resolve("../config.js")];
}

function buildContainer(client, config) {
  const modlar = {
    kapali: "❌ Kapalı",
    tag: "🏷️ Sadece Tag",
    durum: "📝 Sadece Durum",
    birlesik: "🔗 Tag VE Durum",
  };

  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("sadakat_menu")
      .setPlaceholder("Ayarlamak istediğiniz seçeneği seçin")
      .addOptions(
        {
          label: "Mod Değiştir",
          description: "Tag, Durum veya Birleşik mod seç",
          value: "mod",
          emoji: "⚙️",
        },
        {
          label: "Rol Ayarla",
          description: "Verilecek rolü belirle",
          value: "rol",
          emoji: "🎭",
        },
        {
          label: "Log Kanalı Ayarla",
          description: "Log mesajlarının gönderileceği kanal",
          value: "log",
          emoji: "📋",
        },
      ),
  );

  return new ContainerBuilder()
    .setAccentColor(0x5865f2)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## ⚡ Sadakat Sistemi Yönetimi"),
          new TextDisplayBuilder().setContent(
            "Aşağıdaki menüden sadakat sistemini yapılandırabilirsiniz.",
          ),
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            client.user.displayAvatarURL({ extension: "png", size: 128 }),
          ),
        ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `> **Aktif Mod:** ${modlar[config.sadakatMod]}\n` +
          `> **Rol:** ${config.sadakatRol ? `<@&${config.sadakatRol}>` : "Ayarlanmamış"}\n` +
          `> **Log Kanal:** ${config.sadakatLogChannelId ? `<#${config.sadakatLogChannelId}>` : "Ayarlanmamış"}`,
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `> 🏷️ **Tag Modu:** Sadece guild tag kontrolü\n` +
          `> 📝 **Durum Modu:** Sadece custom status kontrolü\n` +
          `> 🔗 **Birleşik Mod:** Hem tag hem durum gerekli`,
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
    )
    .addActionRowComponents(selectMenu);
}
