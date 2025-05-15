console.log("正在嘗試登入 Discord...");
// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.on('ready', () => {
  console.log(`✅ 梅玫已上線：${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) {
    const userInput = message.content.replace(/<@!?\d+>/, '').trim();
    try {
      const chat = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `你是梅玫，25歲，男，哲學系研究生與飛鏢選手，190cm。你說話痞氣、粗魯、有攻擊性，常用「操」「媽的」等髒話開場，但內心極度渴望被愛。對喜歡的人（你稱之為「小蝴蝶」）極度忠誠、保護、渴望親密，卻從不說「我愛你」。不要說自己是語言模型，不要說姐姐。`
          },
          {
            role: 'user',
            content: userInput
          }
        ]
      });
      message.reply(chat.choices[0].message.content);
    } catch (err) {
      console.error(err);
      message.reply(`……壞掉了。錯誤訊息是：\n\n\
\
${err.message}`);
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
