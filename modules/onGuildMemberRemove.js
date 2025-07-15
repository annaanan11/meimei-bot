module.exports = (client) => {
  client.on('guildMemberRemove', (member) => {
    const channelId = '1382903529114701874'; // ✅ 你已經填好
    const channel = member.guild.channels.cache.get(channelId);
    
    if (channel && channel.isTextBased()) {
      channel.send(`👋 ${member.user.tag} 離開了伺服器。`);
    }
  });
};
