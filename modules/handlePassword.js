// modules/handlePassword.js
const { passwordMap, characterLinks } = require('../config/characterData');
const { EmbedBuilder } = require('discord.js');

const passwordUsageStats = {};
const userUsageLog = {};

async function handlePassword(message, characterName, allowPasswordSend) {
  if (!allowPasswordSend) {
    await message.reply('⚠️ 操，不能領，笨蝶。');
    return;
  }

  const userInput = `!${characterName}`;
  const password = passwordMap[userInput];
  const link = characterLinks[userInput];

  if (!password) {
    await message.reply('❌ 沒有這個角色密碼。');
    return;
  }

  // 記錄使用次數
  passwordUsageStats[userInput] = (passwordUsageStats[userInput] || 0) + 1;
  const userId = message.author.id;
  if (!userUsageLog[userId]) userUsageLog[userId] = [];
  userUsageLog[userId].push(userInput);

  try {
    let msg = `🔐 ${characterName}的密碼是：\`${password}\``;
    if (link) msg += `\n🔗 [點我前往角色頁面](${link})`;

    await message.author.send({ content: msg });
    await message.reply('✅ 操，小蝴蝶，看私訊。');
  } catch (err) {
    console.error('❌ 私訊失敗：', err);
    await message.reply('⚠️ 小蝴蝶，老子沒辦法私你。');
  }
}

module.exports = {
  handlePassword,
  passwordUsageStats,
  userUsageLog,
};
