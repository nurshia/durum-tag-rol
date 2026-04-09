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
  name: "userUpdate",
  async execute(oldUser, newUser, client) {
    const config = getConfig();
    if (config.sadakatMod === "kapali") return;

    const rolId = config.sadakatRol;
    const logChannelId = config.sadakatLogChannelId;
    if (!rolId || !config.clanId) return;

    const guild = client.guilds.cache.get(config.sunucuId);
    if (!guild) return;

    const member = guild.members.cache.get(newUser.id);
    if (!member) return;

    try {
      const userData = await client.rest.get(`/users/${member.id}`);
      const hasTag = userData?.clan?.identity_guild_id === config.clanId || userData?.clan?.tag === config.clanTag;

      if (config.sadakatMod === "tag") {
        await handleTagOnly(member, hasTag, rolId, logChannelId, userData);
      } else if (config.sadakatMod === "birlesik") {
        await handleBirlesik(member, hasTag, rolId, logChannelId, client, userData);
      }
    } catch (error) {
      console.error("[HATA] userUpdate:", error);
    }
  },
};

function getConfig() {
  delete require.cache[require.resolve("../config.js")];
  return require("../config.js");
}

async function handleTagOnly(member, hasTag, rolId, logChannelId, userData) {
  const logChannel = member.guild.channels.cache.get(logChannelId);
  const clanBadge = userData?.clan?.badge
    ? `https://cdn.discordapp.com/clan-badges/${userData.clan.identity_guild_id}/${userData.clan.badge}.png`
    : member.user.displayAvatarURL({ extension: "png", size: 128 });

  if (hasTag) {
    if (!member.roles.cache.has(rolId)) {
      await member.roles.add(rolId);
      console.log(`[TAG ROL VERİLDİ] ${member.user.tag} - Tag aldı, rol verildi!`);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0x5865f2)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## 🏷️ Tag Rolü Verildi"),
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
                  `<@${member.id}> sunucumuzun tagını (**${require("../config.js").clanTag}**) aldığı için <@&${rolId}> rolü verildi.`,
                ),
              )
              .setThumbnailAccessory(new ThumbnailBuilder().setURL(clanBadge)),
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
      console.log(`[TAG ROL ALINDI] ${member.user.tag} - Tag bıraktı, rol alındı!`);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0xed4245)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ❌ Tag Rolü Alındı"),
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
                  `<@${member.id}> sunucumuzun tagını bıraktığı için <@&${rolId}> rolü alındı.`,
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

async function handleBirlesik(member, hasTag, rolId, logChannelId, client, userData) {
  const config = require("../config.js");
  const logChannel = member.guild.channels.cache.get(logChannelId);
  const clanBadge = userData?.clan?.badge
    ? `https://cdn.discordapp.com/clan-badges/${userData.clan.identity_guild_id}/${userData.clan.badge}.png`
    : member.user.displayAvatarURL({ extension: "png", size: 128 });

  try {
    const customStatus = member.presence?.activities.find((activity) => activity.type === 4);
    const hasDurum = customStatus && customStatus.state && customStatus.state.includes(config.statusText);

    const shouldHaveRole = hasTag && hasDurum;

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
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(clanBadge)),
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
          const reason = !hasTag && !hasDurum ? "hem tag hem durum" : !hasTag ? "tag" : "durum";
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
    console.error("[HATA] Birleşik mod - tag kontrolü:", error);
  }
}

async function handleTagOnly(member, hasTag, rolId, logChannelId, userData) {
  const config = getConfig();
  const logChannel = member.guild.channels.cache.get(logChannelId);
  const clanBadge = userData?.clan?.badge
    ? `https://cdn.discordapp.com/clan-badges/${userData.clan.identity_guild_id}/${userData.clan.badge}.png`
    : member.user.displayAvatarURL({ extension: "png", size: 128 });

  if (hasTag) {
    if (!member.roles.cache.has(rolId)) {
      await member.roles.add(rolId);
      console.log(`[TAG ROL VERİLDİ] ${member.user.tag} - Tag aldı, rol verildi!`);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0x5865f2)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## 🏷️ Tag Rolü Verildi"),
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
                  `<@${member.id}> sunucumuzun tagını (**${config.clanTag}**) aldığı için <@&${rolId}> rolü verildi.`,
                ),
              )
              .setThumbnailAccessory(new ThumbnailBuilder().setURL(clanBadge)),
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
      console.log(`[TAG ROL ALINDI] ${member.user.tag} - Tag bıraktı, rol alındı!`);
      if (logChannel) {
        const container = new ContainerBuilder()
          .setAccentColor(0xed4245)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## ❌ Tag Rolü Alındı"),
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
                  `<@${member.id}> sunucumuzun tagını bıraktığı için <@&${rolId}> rolü alındı.`,
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

async function handleBirlesik(member, hasTag, rolId, logChannelId, client, userData) {
  const config = getConfig();
  const logChannel = member.guild.channels.cache.get(logChannelId);
  const clanBadge = userData?.clan?.badge
    ? `https://cdn.discordapp.com/clan-badges/${userData.clan.identity_guild_id}/${userData.clan.badge}.png`
    : member.user.displayAvatarURL({ extension: "png", size: 128 });

  try {
    const customStatus = member.presence?.activities.find((activity) => activity.type === 4);
    const hasDurum = customStatus && customStatus.state && customStatus.state.includes(config.statusText);

    const shouldHaveRole = hasTag && hasDurum;

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
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(clanBadge)),
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
          const reason = !hasTag && !hasDurum ? "hem tag hem durum" : !hasTag ? "tag" : "durum";
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
    console.error("[HATA] Birleşik mod - tag kontrolü:", error);
  }
}
