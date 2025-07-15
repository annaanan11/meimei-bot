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

//補包
const roleGroups = require('./config/roleGroups');
const { handleYanyanIntro, handleYanyanConfirm } = require('./modules/yanyan');
const { postVerifyAnnouncement } = require('./modules/postVerifyAnnouncement');



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
  const { handlePassword, passwordUsageStats, userUsageLog } = require('./modules/handlePassword');
  if (passwordMap[userInput]) {
  const name = userInput.slice(1);
  return handlePassword(message, name, allowPasswordSend);
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

      // ✅ 懨
  if (userInput === '!嫣懨') {
  return handleYanyanIntro(message, allowPasswordSend);
}

if (userInput === '!我閱讀完且理解了') {
  return handleYanyanConfirm(message, allowPasswordSend);
}

   // ✅ 驗證公告
  if (userInput === '!發驗證公告') {
  return postVerifyAnnouncement(message);
}


    // ✅ 娜個
    if (userInput === '!阿梅發角色') {
  await message.channel.send({
    content: `**點選下方的按鈕來領取身分組**`
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
   // ✅ 按鈕
  const { handleButtonCommands, setupButtonInteraction } = require('./modules/handleButtons');

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

  const handled = await handleButtonCommands(message, userInput);
  if (handled) return;

  // 其他處理...
});

setupButtonInteraction(client);

  
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
