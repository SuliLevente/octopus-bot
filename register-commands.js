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

const commands = [suggest.toJSON()];

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