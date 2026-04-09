const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SectionBuilder,
  ThumbnailBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "presenceUpdate",
  async execute(oldPresence, newPresence, client) {
    const config = getConfig();
    if (config.sadakatMod === "kapali") return;
    if (!newPresence || !newPresence.member || newPresence.member.user.bot) return;

    const member = newPresence.member;
    if (member.guild.id !== config.sunucuId) return;

    const rolId = config.sadakatRol;
    const logChannelId = config.sadakatLogChannelId;
    if (!rolId || !config.statusText) return;

    try {
      const customStatus = newPresence.activities.find((activity) => activity.type === 4);
      const hasDurum = customStatus && customStatus.state && customStatus.state.includes(config.statusText);

      if (config.sadakatMod === "durum") {
        await handleDurumOnly(member, hasDurum, rolId, logChannelId);
      } else if (config.sadakatMod === "birlesik") {
        await handleBirlesik(member, hasDurum, rolId, logChannelId, client);
      }
    } catch (error) {
      console.error("[HATA] presenceUpdate:", error);
    }
  },
};

function getConfig() {
  delete require.cache[require.resolve("../config.js")];
  return require("../config.js");
}

async function handleDurumOnly(member, hasDurum, rolId, logChannelId) {
  const config = getConfig();
  const logChannel = member.guild.channels.cache.get(logChannelId);

  if (hasDurum) {
    if (!member.roles.cache.has(rolId)) {
      await member.roles.add(rolId);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0x57f287)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ✅ Durum Rolü Verildi"),
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setDivider(true)
              .setSpacing(SeparatorSpacingSize.Small),
          )
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `<@${member.id}> durumuna **${config.statusText}** yazdığı için <@&${rolId}> rolü verildi.`,
                ),
              )
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  member.user.displayAvatarURL({ extension: "png", size: 128 }),
                ),
              ),
          );

        logChannel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [container],
        });
      }
    }
  } else {
    if (member.roles.cache.has(rolId)) {
      await member.roles.remove(rolId);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0xed4245)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ❌ Durum Rolü Alındı"),
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setDivider(true)
              .setSpacing(SeparatorSpacingSize.Small),
          )
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `<@${member.id}> durumundan **${config.statusText}** kaldırdığı için <@&${rolId}> rolü alındı.`,
                ),
              )
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  member.user.displayAvatarURL({ extension: "png", size: 128 }),
                ),
              ),
          );

        logChannel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [container],
        });
      }
    }
  }
}

async function handleBirlesik(member, hasDurum, rolId, logChannelId, client) {
  const config = getConfig();
  const logChannel = member.guild.channels.cache.get(logChannelId);

  try {
    const userData = await client.rest.get(`/users/${member.id}`);
    const hasTag = userData?.clan?.identity_guild_id === config.clanId || userData?.clan?.tag === config.clanTag;

    const shouldHaveRole = hasDurum && hasTag;

    if (shouldHaveRole) {
      if (!member.roles.cache.has(rolId)) {
        await member.roles.add(rolId);
        if (logChannel) {
          const container = new ContainerBuilder()
            .setAccentColor(0x5865f2)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## 🔗 Birleşik Rol Verildi"),
            )
            .addSeparatorComponents(
              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small),
            )
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    `<@${member.id}> hem tag hem durum aldığı için <@&${rolId}> rolü verildi.`,
                  ),
                )
                .setThumbnailAccessory(
                  new ThumbnailBuilder().setURL(
                    member.user.displayAvatarURL({ extension: "png", size: 128 }),
                  ),
                ),
            );

          logChannel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
          });
        }
      }
    } else {
      if (member.roles.cache.has(rolId)) {
        await member.roles.remove(rolId);
        if (logChannel) {
          const reason = !hasDurum && !hasTag ? "hem tag hem durum" : !hasDurum ? "durum" : "tag";
          const container = new ContainerBuilder()
            .setAccentColor(0xed4245)
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ❌ Birleşik Rol Alındı"),
            )
            .addSeparatorComponents(
              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small),
            )
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    `<@${member.id}> **${reason}** bıraktığı için <@&${rolId}> rolü alındı.`,
                  ),
                )
                .setThumbnailAccessory(
                  new ThumbnailBuilder().setURL(
                    member.user.displayAvatarURL({ extension: "png", size: 128 }),
                  ),
                ),
            );

          logChannel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
          });
        }
      }
    }
  } catch (error) {
    console.error("[HATA] Birleşik mod - durum kontrolü:", error);
  }
}

function getConfig() {
  delete require.cache[require.resolve("../config.js")];
  return require("../config.js");
}
