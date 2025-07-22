const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require('discord.js');

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
        .setCustomId('_拉普拉斯的惡魔')
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

function sendRoleEmbedButton(message, roleGroups) {
  roleGroups.forEach(async (group) => {
    const embed = new EmbedBuilder()
      .setTitle(group.title)
      .setDescription(
        group.roles.map(([label]) => `• ${label}`).join('\n')
      )
      .setColor(0xffc0cb);

    const rows = [];
    const buttons = [];

    group.roles.forEach(([label, role]) => {
      const button = new ButtonBuilder()
        .setCustomId(`role_${role.name}`)
        .setLabel(label)
        .setStyle(ButtonStyle.Secondary);

      if (role.emoji) {
        button.setEmoji(role.emoji);
      }

      buttons.push(button);
    });

    // 每 5 個按鈕一行
    for (let i = 0; i < buttons.length; i += 5) {
      const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5));
      rows.push(row);
    }

    await message.channel.send({
      embeds: [embed],
      components: rows
    });
  });
}

module.exports = {
  handleButtonCommands,
  setupButtonInteraction,
  sendRoleEmbedButton
};
