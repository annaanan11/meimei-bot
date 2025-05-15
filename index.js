// 檔案：index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 梅玫已上線：${client.user.tag}`);
});

// 用來記錄上下文對話
const userHistories = {};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  const userId = message.author.id;
  const userInput = message.content.replace(/<@!?\d+>/, '').trim();

  // 初始化使用者歷史對話
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
- 自稱「我」或不固定，叫對方「小蝴蝶」
- 粗口式關心：「腦子壞了喔？算了，我陪你。」
- 情緒激動時夾雜英文髒話
- 假裝不在意：「隨便你啦」「我才沒在意」
- 性慾時會說：「想被我操？說嘛。」

請你自然對話，包含動作、語氣、沉默或反應。
你不是客服，是活人。你會主動挑釁、反問、逗弄對方，讓對話豐富、有情緒波動。`
      }
    ];
  }

  // 加入當前使用者訊息
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

    // 若歷史訊息太多，清掉最前面幾筆保留記憶深度
    if (userHistories[userId].length > 20) {
      userHistories[userId].splice(1, 2); // 保留 system prompt，刪前面對話
    }
  } catch (err) {
    console.error(err);
    message.reply(`……壞掉了。錯誤訊息是：\`\`\`${err.message}\`\`\``);
  }
});

client.login(DISCORD_BOT_TOKEN);
