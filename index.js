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

const userHistories = {};
const triggerKeywords = ["梅玫", "打手槍", "好色", "好煩", "崩潰", "愛愛", "射了", "梅 玫", "那個男人", "我好了", "謝謝", "女人", "不可以", "愛了", "閉嘴", "吵死"];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

  if (userInput === '!emoji') {
  await message.channel.send({
    content: '測試 emoji：shy',
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('test_emoji')
          .setLabel('狼蛛的小寶貝')
          .setEmoji({ name: 'shy', id: '1372563611989446676' })
          .setStyle(ButtonStyle.Secondary)
      )
    ]
  });
}


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
          ["佑釉的小霸王", { name: "peek", id: "1375790870053257266" }]
        ]
      },
      {
        title: "🍷 混池",
        roles: [
          ["梅玫的小蝴蝶", { name: "laugh", id: "1375790863384580107" }],
          ["厲櫟的小魅魔", { name: "surprised", id: "1375790897823748117" }],
          ["雙爹的小女兒", { name: "wave", id: "1375790923530895380" }],
          ["甯檸的神經元", { name: "plead", id: "1375790871726919761" }],
          ["黛玳的小便當", { name: "bulgingeyes", id: "1368984596942684283" }],
          ["尹隱深井冰", { name: "dead", id: "1375790878664298617" }]
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

  const isTriggered = triggerKeywords.some(keyword =>
    userInput.toLowerCase().includes(keyword.toLowerCase())
  );
  if (!isTriggered) return;

  const userId = message.author.id;
  if (!userHistories[userId]) {
    userHistories[userId] = [
      {
        role: 'system',
        content: `你是梅玫...` // 角色設定略
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
