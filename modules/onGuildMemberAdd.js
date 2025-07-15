// modules/onGuildMemberAdd.js
module.exports = (client, roleName = '🔰') => {
  client.on('guildMemberAdd', async (member) => {
    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (!role) return console.error(`❌ 找不到名為「${roleName}」的身分組`);

    try {
      await member.roles.add(role);
      console.log(`✅ 已分配 ${roleName} 給 ${member.user.tag}`);
    } catch (err) {
      console.error('❌ 分配身分組失敗：', err);
    }
  });
};
