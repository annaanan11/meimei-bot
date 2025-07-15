const { EmbedBuilder } = require('discord.js');

module.exports = async function handlePasswordCommands({
  message,
  userInput,
  passwordMap,
  characterLinks,
  passwordAccessRules,
  allowPasswordSend,
  passwordUsageStats,
  userUsageLog
}) {
  // ✅ 開啟發放
  if (userInput === '!開啟發放') {
    const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
    if (!isAdmin) {
      await message.reply('❌ 你不能決定開不開，小蝴蝶沒權限。');
      return;
    }
    allowPasswordSend = true;
    await message.reply('✅ 要密碼嗎？給你。');
    return;
  }

  // ✅ 停止發放
  if (userInput === '!停止發放') {
    const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
    if (!isAdmin) {
      await message.reply('❌ 你沒權關掉發放，小蝴蝶滾。');
      return;
    }
    allowPasswordSend = false;
    await message.reply('🚫 沒密碼給你，哼。');
    return;
  }

  // ✅ 非密碼指令跳過
  if (!userInput.startsWith('!')) return;

  if (!allowPasswordSend) {
    await message.reply('⚠️ 操，不能領，笨蝶。');
    return;
  }

  const characterName = userInput.slice(1); // 去掉 "!"
  const password = passwordMap[userInput];
  const link = characterLinks[userInput];

  if (!password) {
    await message.reply('❌ 沒有這個角色密碼。');
    return;
  }

  // ✅ 使用紀錄
  passwordUsageStats[userInput] = (passwordUsageStats[userInput] || 0) + 1;
  const userId = message.author.id;
  if (!userUsageLog[userId]) userUsageLog[userId] = [];
  userUsageLog[userId].push(userInput);

  // ✅ 傳送密碼私訊
  try {
    let msg = `🔐 ${characterName}的密碼是：\`${password}\``;
    if (link) msg += `\n🔗 [點我前往角色頁面](${link})`;

    await message.author.send({ content: msg });
    await message.reply('✅ 操，小蝴蝶，看私訊。');
  } catch (err) {
    console.error('❌ 私訊失敗：', err);
    await message.reply('⚠️ 小蝴蝶，老子沒辦法私你。');
  }
};
