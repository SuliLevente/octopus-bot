const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
require('dotenv').config();

client.on('ready', async () => {
    client.user.setActivity({name: 'Online! 🟢', type: ActivityType.Playing});
    console.log(`${client.user.username} is online!`);
});

client.login(process.env.TOKEN);