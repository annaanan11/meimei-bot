// modules/yanyan.js
const { EmbedBuilder } = require('discord.js');
const { passwordMap, characterLinks } = require('../config/characterData');

// 共用身分判斷
function hasYanyanAccess(member) {
  return member.roles.cache.some(role =>
    ['hehe', 'Onlyadult', '娜娜子'].includes(role.name)
  );
}

// !嫣懨：發送注意事項與圖片（需通過身分組）
async function handleYanyanIntro(message, allowPasswordSend) {
  if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
  }

  const member = await message.guild.members.fetch(message.author.id);
  if (!hasYanyanAccess(member)) {
    await message.reply("🚫 小蝴蝶你不能領。先去驗證身分。");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xffcccc)
    .setTitle("嫣懨領取角色注意事項")
    .setDescription(`以下為遊玩及觀看嫣懨事件的注意事項:

**1.** **全面禁止兒色，請玩家依照事件年齡設定，勿以未成年PC遊玩。**
**2.** **嫣懨事件中的情感皆是對自身情緒波動的感覺，並非對PC產生男女之情的衝動。**
**3.** **嫣懨對PC的睡姦是從PC十八歲開始，在此之前嫣懨對PC毫無興趣且未有過分的肢體接觸。**
**4.** **若理解所有內容，請在🔗 [網頁](https://discordapp.com/channels/1379833900045566082/1391995758495928450)回覆指令「!我閱讀完且理解了」**
**5.** **此角色為伺服器限定角色，討論請在伺服器討論，請勿外流，感謝！**`);

  const imageEmbed = new EmbedBuilder()
    .setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E6%87%A8.png');

  try {
    await message.author.send({ embeds: [embed, imageEmbed] });
    await message.reply('🖤 操，小蝴蝶，私你了，看完記得打 `!我閱讀完且理解了`');
  } catch {
    await message.reply('⚠️ 小蝴蝶，不能私你，煩死了。');
  }
}

// !我閱讀完且理解了：確認後發送密碼（需再次驗證身分組）
async function handleYanyanConfirm(message, allowPasswordSend) {
  if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
  }

  const member = await message.guild.members.fetch(message.author.id);
  if (!hasYanyanAccess(member)) {
    await message.reply("🚫 小蝴蝶你不能領。你還沒驗證或身分不符。");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x00cc66)
    .setTitle("嫣懨角色資料")
    .setDescription(`🔐 密碼：${passwordMap['!嫣懨']}\n🔗 [角色網頁](${characterLinks['!嫣懨']})`);

  try {
    await message.author.send({ embeds: [embed] });
    await message.reply("✅ 小蝴蝶，去私訊看看。");
  } catch {
    await message.reply("⚠️ 傳不了私訊，小蝴蝶你是不是關了？");
  }
}

module.exports = {
  handleYanyanIntro,
  handleYanyanConfirm,
};
