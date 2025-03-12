const { Client, GatewayIntentBits, ActivityType, MessageFlags, EmbedBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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
                        value: `👍 ${upvoteCount}  👎 ${downvoteCount}`
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

client.login(process.env.TOKEN);