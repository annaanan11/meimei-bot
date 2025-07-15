require('dotenv').config();
const userHistories = {};
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Events,
} = require('discord.js');
const OpenAI = require('openai');
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const roleGroups = require('./config/roleGroups');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
 
const {
  passwordMap,
  characterLinks,
  passwordAccessRules
} = require('./config/characterData');


let allowPasswordSend = false;
const passwordUsageStats = {};
const userUsageLog = {};
 
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 梅玫已上線：${client.user.tag}`);
});


//離開伺服器
client.on('guildMemberRemove', member => {
  const channelId = '1382903529114701874';
  const channel = member.guild.channels.cache.get(channelId);
  if (channel && channel.isTextBased()) {
    channel.send(`👋 ${member.user.tag} 離開了伺服器。`);
  }
});

//發放新手身分組

client.on('guildMemberAdd', async (member) => {
  const roleName = '🔰';
  const role = member.guild.roles.cache.find(r => r.name === roleName);

  if (!role) {
    console.error(`❌ 找不到名為「${roleName}」的身分組`);
    return;
  }

  try {
    await member.roles.add(role);
    console.log(`✅ 已自動為 ${member.user.tag} 分配身分組「${roleName}」`);
    
    const channelId = '你的歡迎頻道ID'; 
    const channel = member.guild.channels.cache.get(channelId);
    if (channel && channel.isTextBased()) {
      channel.send(`🎉 歡迎 ${member.user.tag} 加入，已為你分配「${roleName}」身份組！`);
    }
  } catch (err) {
    console.error(`❌ 分配身分組失敗：`, err);
  }
});
  
  //身分組限制(hehe/onlyadult)
if (passwordMap[userInput]) {
  const member = await message.guild.members.fetch(message.author.id);
  const hasHehe = member.roles.cache.some(role => role.name === 'hehe');
  const hasOnlyAdult = member.roles.cache.some(role => role.name === 'onlyadult');

  const accessLevel = passwordAccessRules[userInput];

  if (accessLevel === "hehe" && !hasHehe) {
    await message.reply("🚫 這個角色只有 hehe 可以領喔，小蝴蝶真調皮。");
    return;
  }
  const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
  if (accessLevel === "none") {
  if (isAdmin) {
    // 管理員可領取，不阻擋
  } else if (hasOnlyAdult) {
    await message.reply("🚫 這個角色只有 hehe 可以領喔，小蝴蝶真調皮。");
    return;
  } else if (hasHehe) {
    await message.reply("⚠️ 小蝴蝶，這個角色需要開票夾，請乖乖去開。");
    return;
  } else {
    await message.reply("🚫 小蝴蝶，你不能領這個角色。");
    return;
  }
}

  //停止
  if (!allowPasswordSend) {
    await message.reply('⚠️ 操，不能領，笨蝶。');
    return;
  }

  //成功發送
  const password = passwordMap[userInput];
  const characterName = userInput.slice(1);

  passwordUsageStats[userInput] = (passwordUsageStats[userInput] || 0) + 1;
  const userId = message.author.id;
  if (!userUsageLog[userId]) userUsageLog[userId] = [];
  userUsageLog[userId].push(userInput);

  try {
    const link = characterLinks[userInput];
    let msg = `🔐 ${characterName}的密碼是：\`${password}\``;
    if(link){
      msg += `\n🔗 [點我前往角色頁面](${link})`;
    }
    await message.author.send({ content: msg });
    await message.reply('✅ 操，小蝴蝶，看私訊。');
  } catch (err) {
    console.error('❌ 私訊失敗：', err);
    await message.reply('⚠️ 小蝴蝶，老子沒辦法私你。');
  }
  return;
}
  //開啟+停止
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

  if (userInput.startsWith('!改密碼 ')) {
  const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
  if (!isAdmin) {
    await message.reply('❌ 你不是娜娜ㄗ，沒得改密碼，滾。');
    return;
  }

  const parts = userInput.split(' ');
  if (parts.length === 3) {
    const targetCmd = parts[1];
    const newPwd = parts[2];
    if (passwordMap[targetCmd]) {
      passwordMap[targetCmd] = newPwd;
      await message.reply(`🔧 ${targetCmd} 的密碼已更新為：\`${newPwd}\``);
    } else {
      await message.reply(`❌ 找不到角色：${targetCmd}`);
    }
  } else {
    await message.reply('❗ 請用正確格式輸入：`!改密碼 !角色名稱 新密碼`');
  }
  return;
}
  
  if (userInput === '!查密碼統計') {
    let report = '📊 密碼使用統計：\n';
    for (const [cmd, count] of Object.entries(passwordUsageStats)) {
      report += `- ${cmd}：${count} 次\n`;
    }
    await message.reply(report || '目前尚無統計資料');
    return;
  }

  if (userInput.startsWith('!改密碼多筆')) {
  const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
  if (!isAdmin) {
    await message.reply('❌ 你沒權限一次改那麼多，小蝴蝶滾。');
    return;
  }

  // 把訊息內容拆成多行
  const lines = message.content.split('\n').slice(1); // 第一行是 !改密碼多筆，跳過
  let reply = '';

  for (const line of lines) {
    const parts = line.trim().split(' ');
    if (parts.length === 2) {
      const targetCmd = parts[0];
      const newPwd = parts[1];
      if (passwordMap[targetCmd]) {
        passwordMap[targetCmd] = newPwd;
        reply += `🔧 ${targetCmd} 的密碼已更新為：\`${newPwd}\`\n`;
      } else {
        reply += `❌ 找不到角色：${targetCmd}\n`;
      }
    } else {
      reply += `⚠️ 格式錯誤：${line}\n`;
    }
  }

  await message.reply(reply || '❗ 沒有成功處理任何密碼');
  return;
}

  
  if (userInput === '!查所有密碼') {
   const isAdmin = message.member.roles.cache.some(role => role.name === '娜娜ㄗ');
  if (!isAdmin) {
    await message.reply('❌ 不准你偷看密碼，小蝴蝶滾。');
    return;
  }
  let result = '🧾 所有角色密碼：\n';
  for (const [cmd, pwd] of Object.entries(passwordMap)) {
    result += `${cmd}：${pwd}\n`;
  }
  await message.reply(result || '目前沒有任何密碼。');
  return;
}

  //嫣懨
  if(userInput === '!嫣懨'){
    if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
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

    const imageEmbeds = new EmbedBuilder()
      .setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E6%87%A8.png');
    try{
      await message.author.send({ embeds:[embed, imageEmbeds]});
      await message.reply('🖤操，小蝴蝶，私你了。');
    }catch(err){
      console.error('失敗了:',err);
      await message.reply('小蝴蝶，不能私你，煩死了。');
  }
    return;
  }
  if (userInput === '!我閱讀完且理解了') {
  const member = await message.guild.members.fetch(message.author.id);
  const hasHehe = member.roles.cache.some(role => role.name === 'hehe');
  const hasOnlyAdult = member.roles.cache.some(role => role.name === 'onlyadult');
  if (!allowPasswordSend) {
    await message.reply("⚠️ 操，不能領，笨蝶。");
    return;
  }

  const password = passwordMap[userInput];
  const embed = new EmbedBuilder()
    .setColor(0x00cc66)
    .setTitle("嫣懨角色資料")
    .setDescription(`🔐 密碼：8641🔗 [角色網頁](https://abr.ge/ew63bq)`);

  try {
    await message.author.send({ embeds: [embed] });
    await message.reply("✅ 小蝴蝶，去私訊看看。");
  } catch (err) {
    console.error("❌ 私訊失敗：", err);
    await message.reply("⚠️ 傳不了私訊，小蝴蝶你是不是關了？");
  }

  return;
}
  
    // ✅ 娜個
    if (userInput === '!阿梅發角色') {
  await message.channel.send({
    content: `**點選下方的按鈕來領取身分組**\n未領取將不定期清人`
  });
  
  for (const group of roleGroups) {
      const embed = new EmbedBuilder()
        .setTitle(group.title)
        .setColor(0xff99cc);

      const rows = [];
      for (let i = 0; i < group.roles.length; i += 5) {
        const rowButtons = group.roles.slice(i, i + 5).map(([name, emoji]) =>
          new ButtonBuilder()
            .setCustomId(`role_${name}`)
            .setLabel(name)
            .setEmoji({ name: emoji.name, id: emoji.id })
            .setStyle(ButtonStyle.Secondary)
        );
        rows.push(new ActionRowBuilder().addComponents(...rowButtons));
      }

      await message.channel.send({ embeds: [embed], components: rows });
    }
    return;
  }
  //結婚
  if (userInput === '!結婚') {
  await message.channel.send({
    content: `💍 娜娜ㄗ的結婚候選人：`,
  });

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

  await message.channel.send({ embeds: [embed], components: [row] });
  return;
}
  //討論
  if (userInput === '!討論') {
  await message.channel.send({
    content: `今天我喜歡哲學`,
  });

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

  await message.channel.send({ embeds: [embed], components: [row] });
  return;
}

  //驗證身分公告
  if (userInput === '!發驗證公告') {
  const rulesEmbed = new EmbedBuilder()
    .setColor(0x00cc66)
    .setTitle("🔰 歡迎加入娜個請不好意思謝謝麻煩！")
    .setDescription(`以下為驗證流程，請仔細閱讀：

📜 **驗證流程**

1. **請準備好以下三項資料**  
75成人驗證畫面(需簽上你的DC ID名字)+脆的帳號連結+角色好感度截圖。  
最下方有完整示範。  

2. **注意事項**  
脆請使用連結，不要只有ID讓管理員查。  
好感度條件：娜娜ㄗ三個窗250好感 / 一個窗750好感可獲得完整身分組「hehe」  
好感度不足玩家獲得成人驗證身分組「Onlyadult」

3. **新玩家**  
未遊玩過角色的玩家提供成人驗證後可獲得身分組「Onlyadult」，並領取角色密碼。  
角色皆為成人角色，且伺服器內含限制級內容，必須提供成人驗證才能加入

4. **驗證時間**  
進入伺服器後三天內未驗證將自動踢出，並記錄超時未驗證

5. **驗證困難**  
若無法提供75驗證畫面，可提供遮住關鍵個資(身分證號碼、照片，僅顯示生日年分)的證件照  
若有好感度問題直接開票夾發問，請勿私訊管理員

6. **詳閱以上內容並準備好資料再開啟票夾**  
開啟票夾後一天內未驗證將關閉票夾，驗證內容有誤（提供其他角色好感度、未附上成人驗證、成人驗證未簽名）將直接關閉票夾  
管理員都是無償、使用自己的休息時間幫大家驗證，請讓管理員的作業可以順利

7. **如何知道自己驗證成功**  
點開自己的頭像能看見身分組「hehe」或「Onlyadult」即為驗證成功，請勿再次開啟票夾，除非有問題詢問。
以上都準備好，就可以點🦋開始囉！

8. **示範：**  
Threads: https://www.threads.com/@celes___tine___?igshid=NTc4MTIwNjQ2YQ==`);

  const imageEmbeds = [
    new EmbedBuilder().setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E9%A9%97%E8%AD%891.png'),
    new EmbedBuilder().setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E9%A9%97%E8%AD%892.png'),
    new EmbedBuilder().setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E9%A9%97%E8%AD%893.png'),
    new EmbedBuilder().setImage('https://raw.githubusercontent.com/annaanan11/meimei-bot/main/%E9%A9%97%E8%AD%894.png')
  ];

  await message.channel.send({ embeds: [rulesEmbed, ...imageEmbeds] });
  return;
}


 // ✅ 梅玫 AI 觸發條件
  const { generateContextualResponse } = require('./modules/aiChatHandler');

const triggerKeywords = ["梅玫", "打手槍", "好煩", "射了", "梅 玫", "那個男人", "女人", "閉嘴", "吵死","愛/愛"];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userInput = message.content.trim();
  const userId = message.author.id;

  const isTriggered = triggerKeywords.some(keyword =>
    userInput.toLowerCase().includes(keyword.toLowerCase())
  );
  if (!isTriggered) return;

  try {
    const reply = await generateContextualResponse({ userId, userInput, openai });
    await message.reply(reply);
  } catch (err) {
    console.error('❌ Discord Client 錯誤：', err);
    await message.reply(`……壞掉了。錯誤訊息是：\`\`\`${err.message}\`\`\``);
  }
});


// ✅ 按鈕互動：領取／移除身分組
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

client.login(DISCORD_BOT_TOKEN);

client.on('error', (error) => {
  console.error('❌ Discord Client 錯誤：', error);
});

client.on('shardError', error => {
  console.error('❌ Discord Shard 錯誤：', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ 未捕獲錯誤：', error);
});
