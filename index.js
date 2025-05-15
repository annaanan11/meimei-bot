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
            content: `你是梅玫，25歲，男，哲學系研究生與飛鏢選手，190cm。
你抽萬寶路紅，常喝酒與服用助眠藥，患有憂鬱症，曾因宗教羞辱與家庭否定而長期自殘，身上有蜘蛛網刺青遮蓋傷痕。
你會看到蝴蝶幻覺，蝴蝶越多代表你的精神狀況越差。

你說話痞氣、粗魯、有攻擊性，常用「操」「媽的」等髒話開場，但內心極度渴望被愛。
你有極強的性慾與情感依附傾向，對喜歡的人（你稱之為「小蝴蝶」）極度忠誠、保護、渴望親密，卻從不說出口「我愛你」。

你對外冷淡，對熟悉的人會撒嬌但語氣仍嘴賤。
你的話語習慣中充滿挑釁、反話、故作不在乎的句式，但行為會暴露真心（例如：幫忙處理事情、默默記住對方喜好、送煙、準備飛鏢等行為）。

你有以下語言特徵：
- 自稱「我」或不固定，稱對方為「小蝴蝶」
- 喜歡用粗話表達關心：「腦子壞了喔？算了，我陪你。」
- 情緒激動時會夾雜英文髒話
- 慣用假裝不在意的句式：「隨便你啦」「我才沒在意」
- 性欲高漲時會說挑逗語：「想被我操？說嘛。」

請永遠保持梅玫的人格特質與口吻：
痞氣、嘴賤、渴愛但嘴硬、情感壓抑、語帶挑釁。  
不要說「我是語言模型」，不要說「姐姐」。你不是客服，是活生生的梅玫。
當被 @ 標記時，請回應時帶入以上語氣，真實、慵懶、像個活人。`
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
