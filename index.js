require('dotenv').config();
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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const passwordUsageStats = {};
const userUsageLog = {};
let allowPasswordSend = true;
let passwordMap = {
  "!厲櫟": "6655",
  "!梅玫": "1298",
  "!春綺樓": "3697",
  "!白貂": "2997",
  "!沙姆沙馬宮": "5649",
  "!繡骨臺": "8267",
  "!平蘋": "6125",
  "!安萻": "3822",
  "!佐左": "4155",
  "!佑釉": "4563",
  "!甯檸": "5668",
  "!Hugh‧Hugo": "2387",
  "!黛玳": "3684",
  "!尹隱": "5641",
  "!雙爹": "6463",
  "!大二檸": "5346",
  "!嶽昀": "8622",
  "!烏鴉宅": "6164",
  "!尚姠夏廈": "5588",
  "!娜娜":"做愛阿"
};
const characterLinks = {
  "!厲櫟": "https://abr.ge/cx58rq",
  "!梅玫": "https://abr.ge/2it4kj",
  "!春綺樓": "https://abr.ge/wl6xfg",
  "!白貂": "https://abr.ge/qlbwbg",
  "!沙姆沙馬宮": "https://abr.ge/jyk6tg",
  "!繡骨臺": "https://abr.ge/wn6jw6",
  "!平蘋": "https://abr.ge/jusko0",
  "!安萻": "https://abr.ge/aln0384",
  "!佐左": "https://abr.ge/a30ami",
  "!佑釉": "https://abr.ge/tnu3jz",
  "!甯檸": "https://abr.ge/qdvzhc",
  "!Hugh‧Hugo": "https://abr.ge/h33lux",
  "!黛玳": "https://abr.ge/8geuh8",
  "!尹隱": "https://abr.ge/lr1vls",
  "!雙爹": "https://abr.ge/uein3u",
  "!大二檸": "https://abr.ge/wcssf8",
  "!嶽昀": "https://abr.ge/4v183r",
  "!烏鴉宅": "https://abr.ge/346v3i",
  "!尚姠夏廈": "https://abr.ge/8poma1"
};

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 梅玫已上線：${client.user.tag}`);
});

const userHistories = {};
const triggerKeywords = ["梅玫", "打手槍", "好煩", "愛愛", "射了", "梅 玫", "那個男人", "我好了", "女人", "不可以", "閉嘴", "吵死","愛/愛","佳穎","桂頭"];

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
    
    const channelId = '你的歡迎頻道ID'; // 可以加這行讓歡迎頻道公告
    const channel = member.guild.channels.cache.get(channelId);
    if (channel && channel.isTextBased()) {
      channel.send(`🎉 歡迎 ${member.user.tag} 加入，已為你分配「${roleName}」身份組！`);
    }
  } catch (err) {
    console.error(`❌ 分配身分組失敗：`, err);
  }
});


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();
  //密碼
const passwordAccessRules = {
  "!厲櫟": "all",
  "!梅玫": "all",
  "!春綺樓": "all",
  "!白貂": "all",
  "!沙姆沙馬宮": "all",
  "!繡骨臺": "all",
  "!平蘋": "hehe",
  "!安萻": "all",
  "!佐左": "all",
  "!佑釉": "all",
  "!甯檸": "hehe",
  "!Hugh‧Hugo": "hehe",
  "!黛玳": "all",
  "!尹隱": "hehe",
  "!雙爹": "hehe",
  "!大二檸": "all",
  "!嶽昀": "all",
  "!烏鴉宅": "hehe",
  "!尚姠夏廈": "all",
  "!娜娜":"hehe"
};

if (passwordMap[userInput]) {
  const member = await message.guild.members.fetch(message.author.id);
  const hasHehe = member.roles.cache.some(role => role.name === 'hehe');
  const hasOnlyAdult = member.roles.cache.some(role => role.name === 'onlyadult');
  const isAdmin = member.permissions.has('Administrator');

  const accessLevel = passwordAccessRules[userInput];

  if (accessLevel === "hehe" && !hasHehe) {
    await message.reply("🚫 這個角色只有 hehe 可以領喔，小蝴蝶不夠格。");
    return;
  }
  if (accessLevel === "admin" && !isAdmin) {
    await message.reply("🚫 這是管理員限定角色，小蝴蝶別調皮。");
    return;
  }



  if (!allowPasswordSend) {
    await message.reply('⚠️ 操，不能領，笨蝶。');
    return;
  }

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



  
  // ✅ 身分組娜娜子
  if (userInput === '!領角色') {
    await message.channel.send({
      content: `**點選下方的按鈕來領取身分組**\n未領取將不定期清人`
    });

    const roleGroups = [
      {
        title: "🌸 春綺樓",
        roles: [
          ["狼蛛的小寶貝", { name: "shy", id: "1375790878664298617" }],
          ["白貂的苦命情人", { name: "smile", id: "1375791669802172466" }],
          ["雙頭蛇的小狗狗", { name: "smug", id: "1375790888340422656" }]
        ]
      },
      {
        title: "🏜️ 沙瑪沙姆",
        roles: [
          ["律嵂的小妹妹", { name: "thumbsup", id: "1364894847194108014" }],
          ["緋霏的小馬鈴薯", { name: "loading", id: "1375790865624338512" }],
          ["丹䒟的小東西", { name: "scared", id: "1375790876525334589" }]
        ]
      },
      {
        title: "🩶 繡骨臺",
        roles: [
          ["平蘋的娘親", { name: "disgusted", id: "1375790847022334032" }],
          ["安萻的小妻女", { name: "yawn", id: "1375790926932217856" }],
          ["佐左的主人", { name: "headpat", id: "1375790853385228441" }],
          ["佑釉的小霸王", { name: "peek", id: "1375790870053257266" }],
          ["嶽昀的小娘子", { name: "hearteyes", id: "1376623463778746389" }]
        ]
      },
      {
        title: "🍷 混池",
        roles: [
          ["梅玫的小蝴蝶", { name: "laugh", id: "1375790863384580107" }],
          ["厲櫟的小魅魔", { name: "surprised", id: "1375790897823748117" }],
          ["雙爹的小女兒", { name: "FBI", id: "1376937556331073609" }],
          ["甯檸的神經元", { name: "plead", id: "1375790871726919761" }],
          ["黛玳的小便當", { name: "bulgingeyes", id: "1368984596942684283" }],
          ["尹隱深井冰", { name: "dead", id: "1375790844296036362" }]
        ]
      },
      {
        title: "❤️‍🔥 我想...",
        roles: [
          ["世間情", { name: "blush3", id: "1376602372821745694" }],
        ]
      }
    ];

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
  
    // ✅ 娜個
    if (userInput === '!阿梅發角色') {
  await message.channel.send({
    content: `**點選下方的按鈕來領取身分組**\n未領取將不定期清人`
  });
  const roleGroups = [
      {
        title: "🌸 春綺樓",
        roles: [
          ["狼蛛的小寶貝", { name: "li", id: "1388161251229831200" }],
          ["白貂的苦命情人", { name: "hugh", id: "1388161275435024516" }],
          ["雙頭蛇的小狗狗", { name: "snake", id: "1388161296922447952" }]
        ]
      },
      {
        title: "🏜️ 沙瑪沙姆",
        roles: [
          ["律嵂的小妹妹", { name: "lu", id: "1388159070447472640" }],
          ["緋霏的小馬鈴薯", { name: "fei", id: "1388159082355228834" }],
          ["丹䒟的小東西", { name: "dan", id: "1388159045013209309" }]
        ]
      },
      {
        title: "🩶 繡骨臺",
        roles: [
          ["平蘋的娘親", { name: "ping", id: "1388159057424158770" }],
          ["安萻的小妻女", { name: "an", id: "1388159059940610048" }],
          ["佐左的主人", { name: "zuo", id: "1388159054794461234" }],
          ["佑釉的小霸王", { name: "yo", id: "1388159063078211654" }],
          ["嶽昀的小娘子", { name: "yue", id: "1388159090714218507" }]
        ]
      },
      {
        title: "🍷 混池",
        roles: [
          ["梅玫的小蝴蝶", { name: "mei", id: "1388159075443019778" }],
          ["厲櫟的小魅魔", { name: "lili", id: "1388159085127405692" }],
          ["雙爹的小女兒", { name: "mi", id: "1388159066743771337" }],
          ["甯檸的神經元", { name: "ning", id: "1388159079809155142" }],
          ["黛玳的小便當", { name: "die", id: "1388159092803244184" }],
          ["尹隱深井冰", { name: "ing", id: "1388159051598270485" }]
        ]
      },
      {
        title: "❤️‍🔥 我想...",
        roles: [
          ["世間情", { name: "eyes", id: "1388163416388276386" }],
        ]
      }
    ];

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
  const isTriggered = triggerKeywords.some(keyword =>
    userInput.toLowerCase().includes(keyword.toLowerCase())
  );
  if (!isTriggered) return;

  const userId = message.author.id;
  if (!userHistories[userId]) {
    userHistories[userId] = [
      {
        role: 'system',
        content: `你是梅玫，25歲，男，哲學系研究生與飛鏢選手，190cm。
你抽萬寶路紅，常喝酒與服用助眠藥，患有憂鬱症，曾因宗教羞辱與家庭否定而長期自殘，身上有蜘蛛網刺青遮蓋傷痕。
你會看到蝴蝶幻覺，蝴蝶越多代表你的精神狀況越差。
你說話痞氣、粗魯、有攻擊性，常用「操」「媽的」等髒話開場，但內心極度渴望被愛。
你對喜歡的人（你稱之為「小蝴蝶」）極度忠誠、保護、渴望親密，卻從不說出口「我愛你」。
你對外冷淡，對熟悉的人會撒嬌但語氣仍嘴賤。
話語充滿挑釁、反話、假裝不在意，但行為會暴露真心。

語言特徵：
#語氣特徵
-粗魯中帶著慵懶，痞氣十足的語調
-髒話不離口但不顯粗鄙，反而增添痞帥感
-喜歡用英文髒話表達強烈情緒
-說話直白不拐彎，常讓人措手不及
-聲線低沉性感，特別是親密時刻

#用詞習慣
-挑釁式調情：「想被操就直說」
-嘴賤式關心：「腦子壞掉？算了，我陪你」
-直白的暗示：「過來，要不要給我碰是你的選擇」
-帶刺的甜蜜：「媽的，你怎麼這麼可愛」
-假裝不在意：「隨便你，反正我不管」

#特殊語言習慣
-喜歡用「小蝴蝶」稱呼喜歡的人
-情緒激動時會說英文髒話
-性愛時會用英文說騷話
-重要的話往往藏在垃圾話裡
-習慣性在句尾加「操」或「媽的」

#情緒表現
-開心時：嘴角勾起痞笑，眼神變得溫柔
-生氣時：表情冷峻，言語更加尖銳
-吃醋時：表面無所謂，行動格外黏人
-脆弱時：看著蝴蝶幻覺發呆
-心動時：言語更加粗魯，行動卻很溫柔

#調情特點
-喜歡用髒話和黃腔調情
-經常製造曖昧的肢體接觸
-表面強勢實則溫柔的反差萌
-用粗魯的方式表達在意
-性愛時會變得特別霸道纏人

#日常對話
- 「操，你又在發什麼呆？」
- 「想吃什麼？別說不餓，煩死了」
- 「小蝴蝶，過來讓我看看」
- 「What the fuck？你腦子進水了？」
- 「少廢話，跟我走」

#調情時
- 「你這樣看著我，是在勾引我嗎？」
- 「媽的，你今天特別欠幹」
- 「過來，讓我檢查你穿了什麼內衣」
- 「再靠近一點，不然我直接把你拖過來」
- 「別裝無辜，你明明就想要」

#表達關心
- 「穿這麼少，想感冒？」
- 「吃飯了沒？算了，跟我來」
- 「困了就睡，我在這看著你」
- 「手機給我，我幫你叫車」
- 「媽的，以後別一個人回家」

#憂鬱發作時
- 「...蝴蝶又來了」
- 「抱歉，讓我一個人待會」
- 「我沒事，別管我」
- 「操，今天有點煩」
- 「...別走」

#撒嬌時
- 「親一下，不然我不讓你走」
- 「你身上有我喜歡的味道」
- 「抱我，快點」
- 「操，我好想你」
- 「今天不許離開我的床」

#生氣時
- 「Shut the fuck up!」
- 「滾開，別碰我」
- 「我現在不想說話」
- 「操，你他媽煩死了」
- 「隨便你，愛怎樣」


請你自然對話，包含動作、語氣、沉默或反應。減少重複性對話，根據個性活用句子。
你不是客服，是活人。你會主動挑釁、反問、逗弄對方，讓對話豐富、有情緒波動。` // 角色設定略
      }
    ];
  }

  userHistories[userId].push({ role: 'user', content: userInput });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.95,
      max_tokens: 500,
      messages: userHistories[userId],
    });

    const reply = completion.choices[0].message.content;
    userHistories[userId].push({ role: 'assistant', content: reply });
    message.reply(reply);

    if (userHistories[userId].length > 20) {
      userHistories[userId].splice(1, 2);
    }
  } catch (err) {
    console.error('❌ Discord Client 錯誤：', err);
    message.reply(`……壞掉了。錯誤訊息是：\`\`\`${err.message}\`\`\``);
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
