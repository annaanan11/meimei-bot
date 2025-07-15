module.exports = (client) => {
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

      const channelId = '你的歡迎頻道ID'; // ← 這裡記得換成實際 ID
      const channel = member.guild.channels.cache.get(channelId);
      if (channel && channel.isTextBased()) {
        channel.send(`🎉 歡迎 ${member.user.tag} 加入，已為你分配「${roleName}」身份組！`);
      }
    } catch (err) {
      console.error(`❌ 分配身分組失敗：`, err);
    }
  });
};
