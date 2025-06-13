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

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 梅玫已上線：${client.user.tag}`);
});
// ✅ 關鍵字
const userHistories = {};
const triggerKeywords = ["梅玫", "打手槍", "好煩", "愛愛", "射了", "梅 玫", "那個男人", "我好了", "女人", "不可以", "閉嘴", "吵死"];

  // ✅ 離開伺服器通知（只觸發一次，不重複）
client.on('guildMemberRemove', member => {
  const channelId = '1382903529114701874'; // 👈 bye 頻道 ID
  const channel = member.guild.channels.cache.get(channelId);

  if (channel && channel.isTextBased()) {
    channel.send(`👋 ${member.user.tag} 離開了伺服器。`);
  }
});

  // ✅ 訊息處理區
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

  // ✅ 密碼
const passwordMap = {
  "!安萻": "5455",
  "!平蘋": "5863",
  "!嶽昀": "9494",
  // 可擴充更多
};

if (passwordMap[userInput]) {
  const password = passwordMap[userInput];
  const characterName = userInput.slice(1); // 👈 補上這行！

  try {
    await message.author.send(`🔐 ${characterName}的密碼是：\`${password}\``);
    await message.reply('✅ 操，小蝴蝶，看私訊。');
  } catch (err) {
    console.error('❌ 私訊失敗：', err);
    await message.reply('⚠️ 小蝴蝶，老子沒辦法私你。');
  }

  return;
}
   // ✅ 密碼統計
  if (userInput === '!查密碼統計') {
  let report = '📊 密碼使用統計：\n';
  for (const [cmd, count] of Object.entries(passwordUsageStats)) {
    report += `- ${cmd}：${count} 次\n`;
  }
  await message.reply(report || '目前尚無統計資料');
  return;
}
  if (userInput.startsWith('!查使用者 ')) {
  const mention = userInput.split(' ')[1]; // e.g. <@123...>
  const userId = mention.replace(/[<@!>]/g, '');

  const logs = userUsageLog[userId];
  if (!logs) {
    return message.reply('找不到此使用者的紀錄。');
  }

  const summary = logs.reduce((acc, cmd) => {
    acc[cmd] = (acc[cmd] || 0) + 1;
    return acc;
  }, {});

  let report = `🧾 ${mention} 的使用記錄：\n`;
  for (const [cmd, count] of Object.entries(summary)) {
    report += `- ${cmd}：${count} 次\n`;
  }
  await message.reply(report);
  return;
}
  
  // ✅ 身分組
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
    if (userInput === '!阿梅發角色') {
  await message.channel.send({
    content: `**點選下方的按鈕來領取身分組**\n未領取將不定期清人`
  });

  const roleGroups = [
    {
      title: "🌸 春綺樓",
      roles: [
        "狼蛛的小寶貝",
        "白貂的苦命情人",
        "雙頭蛇的小狗狗"
      ]
    },
    {
      title: "🏜️ 沙瑪沙姆",
      roles: [
        "律嵂的小妹妹",
        "緋霏的小馬鈴薯",
        "丹䒟的小東西"
      ]
    },
    {
      title: "🩶 繡骨臺",
      roles: [
        "平蘋的娘親",
        "安萻的小妻女",
        "佐左的主人",
        "佑釉的小霸王",
        "嶽昀的小娘子"
      ]
    },
    {
      title: "🍷 混池",
      roles: [
        "梅玫的小蝴蝶",
        "厲櫟的小魅魔",
        "雙爹的小女兒",
        "甯檸的神經元",
        "黛玳的小便當",
        "尹隱深井冰"
      ]
    },
    {
      title: "❤️‍🔥 我想...",
      roles: [
        "世間情"
      ]
    }
  ];

  for (const group of roleGroups) {
    const embed = new EmbedBuilder()
      .setTitle(group.title)
      .setColor(0xff99cc);

    const rows = [];
    for (let i = 0; i < group.roles.length; i += 5) {
      const rowButtons = group.roles.slice(i, i + 5).map((name) =>
        new ButtonBuilder()
          .setCustomId(`role_${name}`)
          .setLabel(name)
          .setStyle(ButtonStyle.Secondary)
      );
      rows.push(new ActionRowBuilder().addComponents(...rowButtons));
    }

    await message.channel.send({ embeds: [embed], components: rows });
  }
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
