const { EmbedBuilder } = require('discord.js');

async function postVerifyAnnouncement(message) {
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
}

module.exports = {
  postVerifyAnnouncement,
};
