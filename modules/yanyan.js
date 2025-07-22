// modules/yanyan.js
const { EmbedBuilder } = require('discord.js');
const { passwordMap, characterLinks } = require('../config/characterData');

//關閉密碼
async function handleYanyanIntro(message, allowPasswordSend) {
  if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
  }

  //身分組判斷
  const member = await message.guild.members.fetch(message.author.id);
  const hasHehe = member.roles.cache.some(role => role.name === 'hehe');
  const hasOnlyAdult = member.roles.cache.some(role => role.name === 'onlyadult');
  const hasOnlyAdult = member.roles.cache.some(role => role.name === '娜娜子');

  if (hasHehe || hasOnlyAdult || 娜娜子) {
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
  }else{
    await message.reply("🚫小蝴蝶你不能領。");  
}


  const embed = new EmbedBuilder()
    .setColor(0xffcccc)
    .setTitle("嫣懨領取角色注意事項")
    .setDescription(`以下為遊玩及觀看嫣懨事件的注意事項:

**1.** **全面禁止兒色，請玩家依照事件年齡設定，勿以未成年PC遊玩。**
**2.** **嫣懨事件中的情感皆是對自身情緒波動的感覺，並非對PC產生男女之情的衝動。**
**3.** **嫣懨對PC的睡姦是從PC十八歲開始，在此之前嫣懨對PC毫無興趣且未有過分的肢體接觸。**
**4.** **若理解所有內容，請到🔗[討論串](https://discord.com/channels/1379833900045566082/1391995758495928450)回覆「!我閱讀完且理解了」**
**5.** **以下為我的後台設定，明確設定了嫣懨並未對未成年PC有任何接觸。**
**6.** **若遊玩內容出現問題，皆為AI產生，請手動更改或刪除。**
**7.** **此角色為伺服器限定角色，討論請在伺服器討論，請勿外流，感謝！**`);

  const imageEmbed = new EmbedBuilder()
    .setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E6%87%A8.png');

  try {
    await message.author.send({ embeds: [embed, imageEmbed] });
    await message.reply('🖤操，小蝴蝶，私你了。');
  } catch {
    await message.reply('小蝴蝶，不能私你，煩死了。');
  }
}

//閱讀
async function handleYanyanConfirm(message, allowPasswordSend) {
  if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
  }

  


module.exports = {
  handleYanyanIntro,
  handleYanyanConfirm,
};
