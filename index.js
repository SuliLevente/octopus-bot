const { Client, GatewayIntentBits, ActivityType, MessageFlags, EmbedBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, TextChannel, time } = require('discord.js');
const config = require('./config.json');
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

    var suggest = new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('You can suggest a new idea about the Minecraft/Discord server.')
    .addStringOption(option =>
        option.setName('suggestion')
        .setDescription('Write your suggestion here.')
        .setRequired(true)
    );

    client.application.commands.set([suggest]);

    console.log(`${client.user.username} is online!`);
});

client.on('interactionCreate', async (interaction) => {
    /*if(interaction.member.user.id != '689015719584989193') return;*/

    if(!interaction.isCommand() && !interaction.isButton()) return;
    if(interaction.member.user.bot) return;

    if(interaction.isCommand()) {
        if(interaction.commandName === 'suggest') {
            let suggestion = interaction.options.getString('suggestion');
            let suggestionChannel = interaction.guild.channels.cache.get(config.suggestionChannelId);
    
            interaction.reply({content: 'Your suggestion was successfully received! :white_check_mark:', flags: MessageFlags.Ephemeral});
            
            let suggestionEmbed = new EmbedBuilder()
            .setTitle('New suggestion! 💡')
            .setDescription('You can vote by reacting to this message with :white_check_mark: or :x:.')
            .setColor('Yellow')
            .addFields(
                {
                    name: 'Proposer:',
                    value: `${interaction.member}`
                },
                {
                    name: 'Suggestion:',
                    value: `\`${suggestion}\``
                }
            )
            .setTimestamp()
            .setFooter({
                iconURL: client.user.avatarURL(),
                text: `${client.user.username} - Suggestion system`
            });
    
            let closeButton = new ButtonBuilder()
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('close-suggestion');
    
            let actionrow = new ActionRowBuilder()
            .addComponents(closeButton);
    
            const replyMessage = await suggestionChannel.send({embeds: [suggestionEmbed], components: [actionrow]});
            if(replyMessage instanceof Message) {
                replyMessage.react('✅');
                replyMessage.react('❌');
            }
        }
        else if(interaction.commandName === 'embedsay') {
            let title = interaction.options.getString('title');
            let timestamp = interaction.options.getBoolean('timestamp');
            let color = interaction.options.getString('color');
            let description = interaction.options.getString('description');
            let image = interaction.options.getString('image');
            let thumbnail = interaction.options.getString('thumbnail');
            let footerText = interaction.options.getString('footer-text');
            let footerImage = interaction.options.getString('footer-image');
            let channel = interaction.options.getChannel('channel');

            let embed = new EmbedBuilder()
            if(title != null) {
                embed.setTitle(title);
            }
            if(timestamp == true) {
                embed.setTimestamp()
            }
            if(color != null) {
                embed.setColor(color);
            }
            if(description != null) {
                embed.setDescription(description);
            }
            if(image != null) {
                embed.setImage(image)
            }
            if(thumbnail != null) {
                embed.setThumbnail(thumbnail);
            }
            if(footerText != null) {
                if(footerImage != null) {
                    embed.setFooter({
                        text: footerText,
                        iconURL: footerImage
                    })
                }
                else {
                    embed.setFooter({
                        text: footerText,
                        iconURL: client.user.avatarURL()
                    })
                }
            }

            if(channel != null) {
                if(channel instanceof TextChannel) {
                    channel.send({embeds: [embed]});
                    interaction.reply({content: 'Your embed was successfully sent out! :white_check_mark:', flags: MessageFlags.Ephemeral});
                }
            }
            else {
                interaction.channel.send({embeds: [embed]});
                interaction.reply({content: 'Your embed was successfully sent out! :white_check_mark:', flags: MessageFlags.Ephemeral});
            }
        }
    }
    else if(interaction.isButton()) {
        if(interaction.customId == 'close-suggestion') {
            if(interaction.member.roles.cache.has('1186432663796600944') || interaction.member.roles.cache.has('1186432665805672560')) {
                
                const message = await interaction.message.fetch();

                const checkMarkReaction = message.reactions.cache.get('✅');
                const crossMarkReaction = message.reactions.cache.get('❌');

                const upvoteCount = checkMarkReaction.count - 1;
                const downvoteCount = crossMarkReaction.count - 1;

                let originalEmbed = message.embeds[0];

                let resultEmbed = new EmbedBuilder()
                .setTitle('Suggestion result 💡')
                .setDescription('This suggestion is over.')
                .addFields(
                    originalEmbed.fields[0],
                    originalEmbed.fields[1],
                    {
                        name: 'Result:',
                        value: `👍 **${upvoteCount}**  👎 **${downvoteCount}**`
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: `${client.user.username} - Suggestion results`,
                    iconURL: client.user.avatarURL()
                });

                if(upvoteCount > downvoteCount) {
                    resultEmbed.setColor('Green');
                }
                else if(upvoteCount < downvoteCount) {
                    resultEmbed.setColor('Red');
                }
                else {
                    resultEmbed.setColor('Yellow');
                }

                message.delete();

                interaction.channel.send({embeds: [resultEmbed]})
            }
            else {
                let permissionDeniedEmbed = new EmbedBuilder()
                .setTitle('You don\'t have the permission to do that! :x:')
                .setColor('Red');

                interaction.reply({embeds: [permissionDeniedEmbed], flags: MessageFlags.Ephemeral});
            }
        }
    }
});

client.on('guildMemberAdd', async (member) => {
    if(member.user.bot) return;

    let logChannel = member.guild.channels.cache.get(config.doorChannelId);
    if(logChannel instanceof TextChannel) {
        logChannel.send({content: `${member} has joined the server! :white_check_mark:`});
    }
});

client.on('guildMemberRemove', async (member) => {
    if(member.user.bot) return;

    let logChannel = member.guild.channels.cache.get(config.doorChannelId);
    if(logChannel instanceof TextChannel) {
        logChannel.send({content: `${member} has left the server! :x:`});
    }
});

client.login(process.env.TOKEN);