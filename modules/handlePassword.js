const { EmbedBuilder } = require('discord.js');
//access rule判斷
function resolveAccessRule(ruleString){
  if (ruleString === 'all') return () => true;
  if (ruleString === 'none') return () => false;
  if (ruleString === 'hehe'){
    return (member) => member.roles.cache.some(r => ['娜娜ㄗ', 'hehe'].includes(r.name));
  }
  return () => false;
}

module.exports = async function handlePasswordCommands({
  message,
  userInput,
  passwordMap,
  characterLinks,
  passwordAccessRules,
  passwordUsageStats,
  userUsageLog,
  state
}) {
  const isAdmin = message.member?.roles?.cache?.has('1379835554140520550');

  //開密碼
  if (userInput === '!開啟發放') {
    if (!isAdmin) {
      await message.reply('❌ 你不能決定開不開，小蝴蝶沒權限。');
      return;
    }
    state.allowPasswordSend = true;
    await message.reply('✅ 要密碼嗎？給你。');
    return;
  }

  //關密碼
  if (userInput === '!停止發放') {
    if (!isAdmin) {
      await message.reply('❌ 小蝴蝶，跟你沒關係。');
      return;
    }
    state.allowPasswordSend = false;
    await message.reply('🚫 沒密碼給你，哼。');
    return;
  }

  //非密碼指令pass
  if (!passwordMap[userInput]) return;

  //發放狀態確認
  if (!state.allowPasswordSend) {
    await message.reply('⚠️ 操，不能領，笨蝶。');
    return;
  }

  //權限驗證身分判斷nohehe
  const ruleRaw = passwordAccessRules[userInput];
  const accessRule = resolveAccessRule(ruleRaw);
  if (!accessRule(message.member)) {
  await message.reply('🚫 只有hehe可以領，小蝴蝶乖乖去旁邊。');
  return;
}
  //發密碼
  const password = passwordMap[userInput];
  const link = characterLinks[userInput];
  const characterName = userInput.replace(/^!/, '');

  // 統計記錄
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
};
