require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const handlePasswordCommands = require('./modules/handlePassword');
const { handleYanyanIntro, handleYanyanConfirm } = require('./modules/yanyan');
const { postVerifyAnnouncement } = require('./modules/postVerifyAnnouncement');
const { handleButtonCommands, setupButtonInteraction } = require('./modules/handleButtons');
const { generateContextualResponse } = require('./modules/aiChatHandler');
const roleGroups = require('./config/roleGroups');
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

let allowPasswordSend = false;
const passwordUsageStats = {};
const userUsageLog = {};

console.log('✅ 正在嘗試登入 Discord...');
client.once('ready', () => {
  console.log(`✅ 機器人已上線：${client.user.tag}`);
});

// ✅ 加入/離開伺服器自動分配身分組
require('./modules/onGuildMemberAdd')(client, '🔰');
require('./modules/onGuildMemberRemove')(client, '1382903529114701874');

// ✅ 處理訊息事件
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const userInput = message.content.trim();

  // ✅ 按鈕事件
  const handledButton = await handleButtonCommands(message, userInput);
  if (handledButton) return;

  // ✅ 嫣懨相關
  if (userInput === '!嫣懨') return handleYanyanIntro(message, allowPasswordSend);
  if (userInput === '!我閱讀完且理解了') return handleYanyanConfirm(message, allowPasswordSend);

  // ✅ 驗證公告
  if (userInput === '!發驗證公告') return postVerifyAnnouncement(message);

  // ✅ 身分組發放（!阿梅發角色）
  if (userInput === '!阿梅發角色') {
    const { sendRoleEmbedButtons } = require('./modules/roleDistributor');
    return sendRoleEmbedButtons(message, roleGroups);
  }

  // ✅ 密碼相關命令與限制
  if (passwordMap[userInput] || userInput.startsWith('!')) {
    return handlePasswordCommands({
      message,
      userInput,
      passwordMap,
      characterLinks,
      passwordAccessRules,
      allowPasswordSend,
      passwordUsageStats,
      userUsageLog
    });
  }

  // ✅ 梅玫 AI 回覆
  const triggerKeywords = ["梅玫", "打手槍", "好煩", "射了", "梅 玫", "那個男人", "女人", "閉嘴", "吵死", "愛/愛"];
  const isTriggered = triggerKeywords.some(keyword => userInput.toLowerCase().includes(keyword.toLowerCase()));
  if (isTriggered) {
    try {
      const reply = await generateContextualResponse({ userId: message.author.id, userInput, openai });
      await message.reply(reply);
    } catch (err) {
      console.error('❌ Discord Client 錯誤：', err);
      await message.reply(`……壞掉了。錯誤訊息是：\`\`\`${err.message}\`\`\``);
    }
  }
});

// ✅ 設定按鈕互動處理（InteractionCreate）
setupButtonInteraction(client);

// ✅ 錯誤處理
client.login(DISCORD_BOT_TOKEN);
client.on('error', error => console.error('❌ Discord Client 錯誤：', error));
client.on('shardError', error => console.error('❌ Discord Shard 錯誤：', error));
process.on('unhandledRejection', error => console.error('❌ 未捕獲錯誤：', error));
