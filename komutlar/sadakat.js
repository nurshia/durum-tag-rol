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
const config = require("../config.js");

module.exports = {
  name: "sadakat",
  description: "Sadakat sistemi yönetim panelini gösterir",
  async execute(message, args, client) {
    if (message.author.id !== config.owner) {
      return message.reply("❌ Bu komutu sadece bot sahibi kullanabilir.");
    }

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

    const container = new ContainerBuilder()
      .setAccentColor(0x5865f2)
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "## ⚡ Sadakat Sistemi Yönetimi",
            ),
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

    await message.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
};
