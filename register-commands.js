const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

var suggest = new SlashCommandBuilder()
.setName('suggest')
.setDescription('You can suggest a new idea about the Minecraft/Discord server.')
.addStringOption(option =>
    option.setName('suggestion')
    .setDescription('Write your suggestion here.')
    .setRequired(true)
);

var embedsay = new SlashCommandBuilder()
.setName('embedsay')
.setDescription('You can send messages in embeds.')
.addStringOption(option =>
	option.setName('title')
	.setDescription('Write the embed\'s title here.')
	.setRequired(true)
) // title
.addBooleanOption(option =>
	option.setName('timestamp')
	.setDescription('Choose if you want a timestamp.')
	.setRequired(true)
) // timestamp
.addStringOption(option =>
	option.setName('color')
	.setDescription('Add a color to the embed here. (Exact example: ,,Red\'\')')
	.setRequired(false)
) // color
.addStringOption(option =>
	option.setName('description')
	.setDescription('Write the embed\'s description here.')
	.setRequired(false)
) // description
.addStringOption(option =>
	option.setName('thumbnail')
	.setDescription('Add a link to the thumbnail of the embed here.')
	.setRequired(false)
) // thumbnail
.addStringOption(option =>
	option.setName('image')
	.setDescription('Add a link to the image of the embed here.')
	.setRequired(false)
) // image
.addStringOption(option =>
	option.setName('footer-text')
	.setDescription('Add text to the embed\'s footer here.')
	.setRequired(false)
) // footer-text
.addStringOption(option =>
	option.setName('footer-image')
	.setDescription('Add an icon to the embed\'s footer here.')
) // footer-image
.addChannelOption(option =>
	option.setName('channel')
	.setDescription('You can use this option to choose the channel where you want to send the embed.')
	.setRequired(false)
); // channel

const commands = [embedsay.toJSON()];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();