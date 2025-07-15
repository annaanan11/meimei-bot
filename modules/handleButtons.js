const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

async function handleButtonCommands(message, userInput) {
  if (userInput === '!結婚') {
    const embed = new EmbedBuilder()
      .setTitle('👰‍♀️ 結婚登記')
      .setDescription('排隊結婚')
      .setColor(0xffcccc);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('role_結婚候選人')
        .setLabel('結婚候選人')
        .setEmoji({ name: '💍' })
        .setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ content: '💍 娜娜ㄗ的結婚候選人：', embeds: [embed], components: [row] });
    return true;
  }

  if (userInput === '!討論') {
    const embed = new EmbedBuilder()
      .setTitle('座位登記')
      .setDescription('排隊入場')
      .setColor(0xffcccc);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('role_拉普拉斯的惡魔')
        .setLabel('拉普拉斯的惡魔')
        .setEmoji({ name: '😈' })
        .setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ content: '今天我喜歡哲學', embeds: [embed], components: [row] });
    return true;
  }

  return false;
}

function setupButtonInteraction(client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('role_')) {
      const roleName = interaction.customId.slice(5);
      const role = interaction.guild.roles.cache.find(r => r.name === roleName);

      if (!role) {
        return interaction.reply({ content: `❌ 找不到身分組「${roleName}」`, ephemeral: true });
      }

      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply({ content: `❌ 小蝴蝶，你不要「${roleName}」了。`, ephemeral: true });
      } else {
        await member.roles.add(role);
        await interaction.reply({ content: `✅ 小蝴蝶，你現在有「${roleName}」了。`, ephemeral: true });
      }
    }
  });
}
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

function sendRoleEmbedButtons(message, roleGroups) {
  roleGroups.forEach(async (group) => {
    const embed = new EmbedBuilder()
      .setTitle(group.title)
      .setDescription(
        group.roles.map(([label]) => `• ${label}`).join('\n')
      )
      .setColor(0xffc0cb);

    const buttons = new ActionRowBuilder();

    group.roles.forEach(([label, role]) => {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`role_${role.name}`) // ex: role_li
          .setLabel(label)
          .setStyle(ButtonStyle.Secondary)
      );
    });

    await message.channel.send({ embeds: [embed], components: [buttons] });
  });
}

module.exports = {
  sendRoleEmbedButtons,
  // 其他函式...
};


module.exports = {
  handleButtonCommands,
  setupButtonInteraction
};
