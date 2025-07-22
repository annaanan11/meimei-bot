require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const handlePasswordCommands = require('./modules/handlePassword');
const { handleYanyanIntro, handleYanyanConfirm } = require('./modules/yanyan');
const { postVerifyAnnouncement } = require('./modules/postVerifyAnnouncement');
const { generateContextualResponse, shouldTriggerAI } = require('./modules/aiChatHandler');
const {
  handleButtonCommands,
  setupButtonInteraction,
  sendRoleEmbedButtons
} = require('./modules/handleButton'); 

const roleGroupsworld = require('./config/roleGroupsworld');
const roleGroupsmix = require('./config/roleGroupsmix');
const {
  passwordMap,
  characterLinks,
  passwordAccessRules
} = require('./config/characterData');



const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const state = { allowPasswordSend: false };
const passwordUsageStats = {};
const userUsageLog = {};

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 機器人已上線：${client.user.tag}`);
});

require('./modules/onGuildMemberAdd')(client, '🔰');
require('./modules/onGuildMemberRemove')(client, '1382903529114701874');

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

  // 按鈕事件
  const handledButton = await handleButtonCommands(message, userInput);
  if (handledButton) return;

  // 嫣懨角色流程
  if (userInput === '!嫣懨') return handleYanyanIntro(message, state.allowPasswordSend);
  if (userInput === '!我閱讀完且理解了') return handleYanyanConfirm(message, state.allowPasswordSend);

  // 驗證公告
  if (userInput === '!發驗證公告') return postVerifyAnnouncement(message);

  // 身分組選單
  if (userInput === '!阿梅發角色合') {
  await sendRoleEmbedButtons(message, roleGroupsworld);
  return;
}
  if (userInput === '!阿梅發角色混') {
  await sendRoleEmbedButtons(message, roleGroupsmix);
  return;
}

  // 密碼發放控制 + 查詢
  if (passwordMap[userInput] || Object.keys(passwordMap).some( p => userInput.startsWith(p))) {
    return handlePasswordCommands({
      message,
      userInput,
      passwordMap,
      characterLinks,
      passwordAccessRules,
      passwordUsageStats,
      userUsageLog,
      state
    });
  }

  // 梅玫對話
  if (shouldTriggerAI(userInput)) {
    try {
      const reply = await generateContextualResponse({ userId: message.author.id, userInput, openai });
      await message.reply(reply);
    } catch (err) {
      console.error('❌ Discord Client 錯誤：', err);
      await message.reply(`……壞掉了。錯誤訊息是：\`\`\`${err.message}\`\`\``);
    }
  }
});

// 按鈕互動
setupButtonInteraction(client);

// 錯誤處理
client.login(DISCORD_BOT_TOKEN);
client.on('error', error => console.error('❌ Discord Client 錯誤：', error));
client.on('shardError', error => console.error('❌ Discord Shard 錯誤：', error));
client.on('warn', info => console.warn('DC警告:', info));
process.on('unhandledRejection', error => console.error('❌ 未捕獲錯誤：', error));
