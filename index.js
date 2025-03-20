const { Client, GatewayIntentBits, ActivityType, MessageFlags, EmbedBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, TextChannel, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const config = require('./config.json');
const mysql = require('mysql');
const discordTranscripts = require('discord-html-transcripts');
const db = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7768364',
    password: 'UJdxUmeuxW',
    database: 'sql7768364'
});
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

    db.connect();

    var help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Default help command for the bot.');

    client.application.commands.set([help]);

    console.log(`${client.user.username} is online!`);
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return;
    if(interaction.member.user.bot) return;

    if(interaction.isCommand()) {
        if(interaction.commandName === 'suggest') {
            let suggestion = interaction.options.getString('ötlet');
            let suggestionChannel = interaction.guild.channels.cache.get(config.suggestionChannelId);
    
            interaction.reply({content: 'Your suggestion was successfully received! :white_check_mark:', flags: MessageFlags.Ephemeral});
            
            let suggestionEmbed = new EmbedBuilder()
            .setTitle('Új ötlet! 💡')
            .setDescription('Az ötletre szavazhatsz a :white_check_mark: vagy az :x: reakciók megnyomásával.')
            .setColor('Yellow')
            .setThumbnail('https://media.discordapp.net/attachments/1103077030439944245/1210174317749477396/pixel-art-speech-bubble-with-light-bulb-icon-icon-for-8bit-game-on-white-background-vector.png?ex=67dd4229&is=67dbf0a9&hm=6018ea51ad90ade51d7c150fb8b33e664d38f26eef340f25102a3f0b06fe83b2&=&format=webp&quality=lossless&width=1125&height=960')
            .addFields(
                {
                    name: 'Javasló:',
                    value: `${interaction.member}`
                },
                {
                    name: 'Javaslat:',
                    value: `\`${suggestion}\``
                }
            )
            .setTimestamp()
            .setFooter({
                iconURL: client.user.avatarURL(),
                text: `${client.user.username} - Ötlet rendszer`
            });
    
            let closeButton = new ButtonBuilder()
            .setLabel('Lezárás')
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
        else if(interaction.commandName === 'test') {
            if(interaction.member.user.id != '689015719584989193') return;

            // let ticketEmbed = new EmbedBuilder()
            // .setTitle('Ticket nyitás 💡')
            // .setDescription('Egy ticket nyitásának folyamatát az alábbi kategóriák közüli választással kezdheted meg!')
            // .setColor('Green')
            // .setThumbnail('https://media.discordapp.net/attachments/1103077030439944245/1222284902943424664/ticket.png?ex=67ddcf85&is=67dc7e05&hm=3e27b6253a5663f2cded31da7de58eadbcb9b5be1c74d9386bea1d575166da13&=&format=webp&quality=lossless')

            // let ticketCategorySelector = new StringSelectMenuBuilder()
            // .setCustomId('ticket-category-selector')
            // .setPlaceholder('Válassz kategóriát!')
            // .addOptions(
			// 	new StringSelectMenuOptionBuilder()
			// 		.setLabel('Discord')
			// 		.setDescription('Gondom akadt, illetve kérdezni/jelezni szeretnék valamit Discorddal kapcsolatban.')
			// 		.setValue('discord')
            //         .setEmoji('🤖'),
			// 	new StringSelectMenuOptionBuilder()
			// 		.setLabel('Szerver')
			// 		.setDescription('Kérdésem vagy észrevételem van a szerverrel kapcsolatban.')
			// 		.setValue('server')
            //         .setEmoji('💻'),
			// 	new StringSelectMenuOptionBuilder()
			// 		.setLabel('Tagfelvétel')
			// 		.setDescription('Szeretnék jelentkezni a csapatba.')
			// 		.setValue('tgf')
            //         .setEmoji('🛠️'),
            //     new StringSelectMenuOptionBuilder()
            //         .setLabel('Felhasználói fiók')
            //         .setDescription('Gondom akadt a felhasználói fiókommal.')
            //         .setValue('account')
            //         .setEmoji('🚹')
			// );

            // let row = new ActionRowBuilder()
            // .addComponents(ticketCategorySelector)

            // interaction.channel.send({embeds: [ticketEmbed], components: [row]});
            // interaction.reply({content: 'Message successfully sent! :white_check_mark:', flags: MessageFlags.Ephemeral});

            /*let user = interaction.options.getMember('user');
            if(user instanceof GuildMember) {
                connection.query(`SELECT * FROM users WHERE username='${user.user.username}' AND userid='${user.id}'`, function (err,results) {
                    if(err) throw err;
                    console.log(results[0])
                    if(results[0] != undefined) {
                        interaction.reply({content: `${user} has already been added to the database! :x:`, flags: MessageFlags.Ephemeral})
                    }
                    else {
                        connection.query(`INSERT INTO users (username,userid) VALUES ('${user.user.username}','${user.id}')`, function (err2) {if(err2) throw err2;});
                        interaction.reply({content: `${user} was successfully added to the database! :white_check_mark:`, flags: MessageFlags.Ephemeral});
                    }
                })
            }*/
        
            let bannedTicketEmbed = new EmbedBuilder()
            .setTitle('<:felhivas_3:1206266590354743316> Ki lettél tiltva a szerverről!')
            .setDescription('Az alábbiakban meg tudod nézni kitiltásod okát, és amennyiben jogtalannak érzed, nyithatsz egy fellebbező ticketet is.')
            .setColor('Yellow');

            let banReasonButton = new ButtonBuilder()
            .setLabel('Kitiltás oka')
            .setCustomId('ban-reason-button')
            .setEmoji('❔')
            .setStyle(ButtonStyle.Secondary);

            let unbanTicketOpenButton = new ButtonBuilder()
            .setLabel('Fellebbezés')
            .setCustomId('unban-ticket-button')
            .setEmoji('✌️')
            .setStyle(ButtonStyle.Secondary);

            let row = new ActionRowBuilder().addComponents(banReasonButton, unbanTicketOpenButton);

            interaction.channel.send({embeds: [bannedTicketEmbed], components: [row]});

            interaction.reply({content: 'siker', flags: MessageFlags.Ephemeral});
        }
        else if(interaction.commandName === 'kitiltás') {
            let selectedUser = interaction.options.getMember("felhasználó")
            let banReason = interaction.options.getString("ok");
            if(selectedUser.roles.cache.has('1186432694406611014') || selectedUser.roles.cache.has('1186432688446509158') || selectedUser.roles.cache.has('1186432687150473307') || selectedUser.roles.cache.has('1186432685825065082') || selectedUser.roles.cache.has('1186432684692611193') || selectedUser.roles.cache.has('1186432667168800870') || selectedUser.roles.cache.has('1294416803824668783') || selectedUser.roles.cache.has('1186432665805672560') || selectedUser.roles.cache.has('1186432663796600944')) {
                let cancelEmbed = new EmbedBuilder()
                .setTitle('Nincs jogosultságod ennek az embernek a kitiltásához!')
                .setColor('Red');
                interaction.reply({embeds: [cancelEmbed], flags: MessageFlags.Ephemeral});
            }
            else {
                db.query(`SELECT * FROM bans WHERE userid='${selectedUser.id}'`, function (err,results) {
                    if(err) throw err;
                    console.log(results[0])
                    if(results[0] != undefined) {
                        let cancelEmbed = new EmbedBuilder()
                        .setTitle('Ez az ember már ki van tiltva!')
                        .setColor('Red');
                        
                        interaction.reply({embeds: [cancelEmbed], flags: MessageFlags.Ephemeral});
                    }
                    else {
                        db.query(`INSERT INTO bans (userid,banreason,staffid) VALUES ('${selectedUser.id}','${banReason}','${interaction.member.user.id}')`, function (err) {if(err) throw err;});
                        if(selectedUser.roles.cache.has('1207744874267283517')) {
                            let boosterRole = interaction.guild.roles.cache.get('1207744874267283517');
                            let bannedRole = interaction.guild.roles.cache.get(config.bannedUserRoleId);
                            selectedUser.roles.set([boosterRole, bannedRole]);
                            let confirmEmbed = new EmbedBuilder()
                            .setTitle(`Sikeresen kitiltottad \`${selectedUser.displayName}\` felhasználót!`)
                            .setColor('Green');
                            interaction.reply({embeds: [confirmEmbed], flags: MessageFlags.Ephemeral});
                        }
                        else {
                            let bannedRole = interaction.guild.roles.cache.get(config.bannedUserRoleId);
                            selectedUser.roles.set([bannedRole]);
                            let confirmEmbed = new EmbedBuilder()
                            .setTitle(`Sikeresen kitiltottad \`${selectedUser.displayName}\` felhasználót!`)
                            .setColor('Green');
                            interaction.reply({embeds: [confirmEmbed], flags: MessageFlags.Ephemeral});
                        }
                    }
                })
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
                .setTitle('Ötlet végeredmény 💡')
                .setDescription('Ez a szavazás véget ért.')
                .setThumbnail('https://media.discordapp.net/attachments/1103077030439944245/1210174317749477396/pixel-art-speech-bubble-with-light-bulb-icon-icon-for-8bit-game-on-white-background-vector.png?ex=67dd4229&is=67dbf0a9&hm=6018ea51ad90ade51d7c150fb8b33e664d38f26eef340f25102a3f0b06fe83b2&=&format=webp&quality=lossless&width=1125&height=960')
                .addFields(
                    originalEmbed.fields[0],
                    originalEmbed.fields[1],
                    {
                        name: 'Eredmény:',
                        value: `👍 **${upvoteCount}**  👎 **${downvoteCount}**`
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: `${client.user.username} - Ötlet eredmények`,
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
                .setTitle('Ehhez nincs jogosultságod!')
                .setColor('Red');

                interaction.reply({embeds: [permissionDeniedEmbed], flags: MessageFlags.Ephemeral});
            }
        }
        else if(interaction.customId == 'open-ticket-button') {
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1221915880171241532',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                            .setTitle('Welcome to this ticket!')
                            .setColor('Green');
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed] }).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `Your ticket has been created: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'close-ticket-button') {
            if(interaction.member.roles.cache.has('1186432694406611014') || interaction.member.roles.cache.has('1186432688446509158') || interaction.member.roles.cache.has('1186432687150473307') || interaction.member.roles.cache.has('1186432685825065082') || interaction.member.roles.cache.has('1186432684692611193') || interaction.member.roles.cache.has('1186432667168800870') || interaction.member.roles.cache.has('1294416803824668783') || interaction.member.roles.cache.has('1186432665805672560') || interaction.member.roles.cache.has('1186432663796600944') || interaction.member.roles.cache.has('1352377995976904888'))  {
                let makeSureEmbed = new EmbedBuilder()
                .setTitle('Biztosan be akarod zárni a ticketet? Ezzel törlöd a csatornát is!')
                .setDescription('Ha nem, akkor nyomj az **Üzenet elvetése** feliratra!')
                .setColor('Red');
    
                let yesButton = new ButtonBuilder()
                .setCustomId('confirm-close-ticket-button')
                .setLabel('Igen, megerősítem')
                .setStyle(ButtonStyle.Danger);
    
                let row = new ActionRowBuilder().addComponents(yesButton);
    
                interaction.reply({embeds: [makeSureEmbed], components: [row], flags: MessageFlags.Ephemeral});
            }
            else {
                let replyEmbed = new EmbedBuilder()
                .setTitle('Nincs jogod bezárni ezt a ticketet!')
                .setColor('Red');
                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
            }
        }
        else if(interaction.customId == 'confirm-close-ticket-button') {
            db.query(`SELECT * FROM tickets WHERE ticketid='${interaction.channel.id}'`, async function (err, results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];

                    let transcriptEmbed = new EmbedBuilder()
                    .setTitle('⚠️ Új transcript!')
                    .setDescription('A transcripteket elsősorban gépen tudod megnyitni, mivel HTML formátumban tárolódnak!')
                    .setColor('Yellow')
                    .addFields({
                        name: 'Felhasználó:',
                        value: `\`${interaction.guild.members.cache.get(result["ticketuserid"]).user.displayName}\` AKA \`${interaction.guild.members.cache.get(result["ticketuserid"]).user.username}\``
                    })
                    .setTimestamp()
                    .setFooter({
                        text: `${client.user.username} - Ticket rendszer`,
                        iconURL: client.user.avatarURL()
                    });

                    if(result["ticketstaffuserid"] != null) {
                        transcriptEmbed.addFields({
                            name: 'Staff:',
                            value: `\`${interaction.guild.members.cache.get(result["ticketstaffuserid"]).user.displayName}\` AKA \`${interaction.guild.members.cache.get(result["ticketstaffuserid"]).user.username}\``
                        })
                    }

                    let transcriptChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);
                    const attachment = await discordTranscripts.createTranscript(interaction.channel);
                    transcriptChannel.send({files: [attachment], embeds: [transcriptEmbed]});
                    await interaction.channel.delete();
                }
            })
        }
        else if(interaction.customId == 'claim-ticket-button') {
            db.query(`SELECT * FROM tickets WHERE ticketid='${interaction.channel.id}'`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    if(result["ticketclaimed"] == 0) {
                        if(interaction.member.roles.cache.has('1186432694406611014') || interaction.member.roles.cache.has('1186432688446509158') || interaction.member.roles.cache.has('1186432687150473307') || interaction.member.roles.cache.has('1186432685825065082') || interaction.member.roles.cache.has('1186432684692611193') || interaction.member.roles.cache.has('1186432667168800870') || interaction.member.roles.cache.has('1294416803824668783') || interaction.member.roles.cache.has('1186432665805672560') || interaction.member.roles.cache.has('1186432663796600944') || interaction.member.roles.cache.has('1352377995976904888')) {
                            db.query(`UPDATE tickets SET ticketclaimed=1, ticketstaffusername='${interaction.member.user.username}', ticketstaffuserid='${interaction.member.user.id}' WHERE ticketid='${interaction.channel.id}'`, function (err) {if(err) throw err;});

                            interaction.channel.permissionOverwrites.edit(interaction.member.user.id, {
                                SendMessages: true
                            });

                            let replyEmbed = new EmbedBuilder()
                            .setTitle('Sikeresen felvetted a ticketet!')
                            .setColor('Green');
                            interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
    
                            let channelEmbed = new EmbedBuilder()
                            .setTitle('Ticket felvéve!')
                            .setDescription(`A ticketet felvette ${interaction.member.user.displayName}!`)
                            .setColor('Yellow');
                            interaction.channel.send({embeds: [channelEmbed]});
    
                            let message = interaction.channel.messages.cache.get(`${result["ticketmessageid"]}`);
    
                            let reClaimTicketButton = new ButtonBuilder()
                            .setLabel('Átvétel')
                            .setEmoji('🫳')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('claim-ticket-button');
    
                            let closeTicketButton = new ButtonBuilder()
                            .setLabel('Bezárás')
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId('close-ticket-button');
    
                            let row = new ActionRowBuilder().addComponents(closeTicketButton, reClaimTicketButton);
    
                            message.edit({components: [row]});
                        }
                        else {
                            let replyEmbed = new EmbedBuilder()
                            .setTitle('Nincs jogod felvenni ezt a ticketet!')
                            .setColor('Red');
                            interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
                        }
                    }
                    else if(result["ticketclaimed"] == 1) {
                        if(interaction.member.roles.cache.has('1186432694406611014') || interaction.member.roles.cache.has('1186432688446509158') || interaction.member.roles.cache.has('1186432687150473307') || interaction.member.roles.cache.has('1186432685825065082') || interaction.member.roles.cache.has('1186432684692611193') || interaction.member.roles.cache.has('1186432667168800870') || interaction.member.roles.cache.has('1294416803824668783') || interaction.member.roles.cache.has('1186432665805672560') || interaction.member.roles.cache.has('1186432663796600944') || interaction.member.roles.cache.has('1352377995976904888')) {
                            if(interaction.member.user.id == result["ticketstaffuserid"]) {
                                let replyEmbed = new EmbedBuilder()
                                .setTitle('Már felvetted ezt a ticketet!')
                                .setColor('Red');
                                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
                            }
                            else {
                                interaction.channel.permissionOverwrites.edit(result["ticketstaffuserid"], {
                                    SendMessages: false
                                });

                                db.query(`UPDATE tickets SET ticketstaffuserid='${interaction.member.user.id}', ticketstaffusername='${interaction.member.user.id}' WHERE ticketid='${interaction.channel.id}'`, function (err) {if(err) throw err;});

                                interaction.channel.permissionOverwrites.edit(interaction.member.user.id, {
                                    SendMessages: true
                                });

                                let replyEmbed = new EmbedBuilder()
                                .setTitle('Sikeresen átvetted a ticketet!')
                                .setColor('Green');
                                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
        
                                let channelEmbed = new EmbedBuilder()
                                .setTitle('Ticket átvéve!')
                                .setDescription(`A ticketet átvette ${interaction.member.user.displayName}!`)
                                .setColor('Yellow');
                                interaction.channel.send({embeds: [channelEmbed]});
                            }
                        }
                        else {
                            if(interaction.member.user.id == result["ticketuserid"]) {
                                let replyEmbed = new EmbedBuilder()
                                .setTitle('Te nyitottad a ticketet, nincs jogod felvenni!')
                                .setColor('Red');
                                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
                            }
                            else if(interaction.member.user.id == result["ticketstaffuserid"]) {
                                let replyEmbed = new EmbedBuilder()
                                .setTitle('Már felvetted ezt a ticketet!')
                                .setColor('Red');
                                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
                            }
                            else {
                                let replyEmbed = new EmbedBuilder()
                                .setTitle('A ticket már fel van véve valaki más által!')
                                .setColor('Red');
                                interaction.reply({embeds: [replyEmbed], flags: MessageFlags.Ephemeral});
                            }
                        }
                    }
                };
            });
        }
        else if(interaction.customId == 'unban-ticket-button') {
            let discordBanModal = new ModalBuilder()
            .setCustomId('discord-ban-modal')
            .setTitle('Adj meg indoklást!');

            let textInput = new TextInputBuilder()
            .setCustomId('discord-ban-paragraph')
            .setLabel('Kérlek indokold meg fellebbezésed!')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(500);

            let firstRow = new ActionRowBuilder().addComponents(textInput);

            discordBanModal.addComponents(firstRow);

            await interaction.showModal(discordBanModal);
        }
        else if(interaction.customId == 'ban-reason-button') {
            db.query(`SELECT * FROM bans WHERE userid='${interaction.member.user.id}'`, function (err ,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];

                    let banReasonEmbed = new EmbedBuilder()
                    .setTitle('❔ Kitiltás oka')
                    .setDescription('Ha jogtalannak érzed a kitiltást vagy szerinted véletlen volt, indíts fellebbezést!')
                    .addFields(
                        {
                            name: 'Staff:',
                            value: `\`${interaction.guild.members.cache.get(result["staffid"]).user.displayName}\` AKA \`${interaction.guild.members.cache.get(result["staffid"]).user.username}\``
                        },
                        {
                            name: 'Kitiltás oka:',
                            value: `\`${result["banreason"]}\``
                        }
                    )
                    .setColor('Red')
                    .setFooter({
                        text: `${client.user.username} - Kitiltás rendszer`,
                        iconURL: client.user.avatarURL()
                    })
                    .setTimestamp();

                    interaction.reply({embeds: [banReasonEmbed], flags: MessageFlags.Ephemeral});
                }
                else {
                    let cancelEmbed = new EmbedBuilder()
                    .setTitle('Te nem vagy kitiltva!')
                    .setDescription('*Ha ez szerinted egy hibás üzenet, indíts fellebbezést!*')
                    .setColor('Red');

                    interaction.reply({embeds: [cancelEmbed], flags: MessageFlags.Ephemeral});
                }
            })
        }
    }
    else if(interaction.isStringSelectMenu()) {
        if(interaction.customId == 'ticket-category-selector') {
            let value = interaction.values[0];
            if(value == 'discord') {
                let ticketDiscordCategorySelector = new StringSelectMenuBuilder()
                .setCustomId('ticket-discord-category-selector')
                .setPlaceholder('Válassz alkategóriát!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Hitelesítési probléma')
                        .setDescription('Gondom akadt Discord fiókom hitelesítésével.')
                        .setValue('auth'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Rang probléma')
                        .setDescription('Gondom akadt a Discord rangjaimmal')
                        .setValue('roles'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Kitiltás vagy felfüggesztés')
                        .setDescription('Fellebbezni szeretnék kitiltással/felfüggesztéssel kapcsolatban.')
                        .setValue('ban'),
                );
                let row = new ActionRowBuilder()
                .addComponents(ticketDiscordCategorySelector)
                interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
                interaction.values[0] = 0;
            }
            else if(value == 'server') {
                let ticketServerCategorySelector = new StringSelectMenuBuilder()
                .setCustomId('ticket-server-category-selector')
                .setPlaceholder('Válassz alkategóriát!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Bug jelentése')
                        .setDescription('Egy szerverrel kapcsolatos bugot szeretnék jelenteni.')
                        .setValue('bug'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Szerver probléma')
                        .setDescription('Problémám akadt a szerverrel.')
                        .setValue('server'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Fórum probléma')
                        .setDescription('Problémám akadt a fórummal.')
                        .setValue('forum'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Szankció fellebbezés')
                        .setDescription('Szeretnék fellebbezni egy szankció ellen (kitiltás/némítás).')
                        .setValue('sanction'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Felhasználó jelentése')
                        .setDescription('Szeretném jelenteni az egyik felhasználót szabálytalanságért.')
                        .setValue('user'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Staff jelentése')
                        .setDescription('Szeretném jelenteni az egyik staffot szabálytalanságért.')
                        .setValue('staff')
                );
    
                let row = new ActionRowBuilder()
                .addComponents(ticketServerCategorySelector)
                interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
                interaction.values[0] = 0;
            }
            else if(value == 'tgf') {
                let ticketTGFCategorySelector = new StringSelectMenuBuilder()
                .setCustomId('ticket-tgf-category-selector')
                .setPlaceholder('Válassz alkategóriát!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Builder jelentkezés')
                        .setDescription('Szeretnék buildernek jelentkezni.')
                        .setValue('builder'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Staff jelentkezés')
                        .setDescription('Szeretnék staffnak jelentkezni.')
                        .setValue('staff'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Média jelentkezés')
                        .setDescription('Szeretnék médiásnak jelentkezni.')
                        .setValue('media'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Partner jelentkezés')
                        .setDescription('Szeretnék partnernek jelentkezni.')
                        .setValue('partner'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Tulajdonos jelentkezés')
                        .setDescription('Szeretnék tulajdonosnak jelentkezni.')
                        .setValue('owner')
                );
    
                let row = new ActionRowBuilder()
                .addComponents(ticketTGFCategorySelector)
                interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
                interaction.values[0] = 0;
            }
            else if(value == 'account') {
                let ticketAccountCategorySelector = new StringSelectMenuBuilder()
                .setCustomId('ticket-account-category-selector')
                .setPlaceholder('Válassz alkategóriát!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Karakter hiba')
                        .setDescription('Hiba történt a karakteremmel.')
                        .setValue('error'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Karakter feltörés')
                        .setDescription('Feltörték a karakteremet.')
                        .setValue('hack'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Belépési probléma')
                        .setDescription('Problémám akadt a fiókomba való belépéssel.')
                        .setValue('login'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Fiók ellopása')
                        .setDescription('Ellopták a fiókomat.')
                        .setValue('theft')
                );
    
                let row = new ActionRowBuilder()
                .addComponents(ticketAccountCategorySelector)
                interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
                interaction.values[0] = 0;
            }

            let ticketAccountCategorySelector = new StringSelectMenuBuilder()
            .setCustomId('ticket-category-selector')
            .setPlaceholder('Válassz kategóriát!')
            .addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Discord')
					.setDescription('Gondom akadt, illetve kérdezni/jelezni szeretnék valamit Discorddal kapcsolatban.')
					.setValue('discord')
                    .setEmoji('🤖'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Szerver')
					.setDescription('Kérdésem vagy észrevételem van a szerverrel kapcsolatban.')
					.setValue('server')
                    .setEmoji('💻'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Tagfelvétel')
					.setDescription('Szeretnék jelentkezni a csapatba.')
					.setValue('tgf')
                    .setEmoji('🛠️'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Felhasználói fiók')
                    .setDescription('Gondom akadt a felhasználói fiókommal.')
                    .setValue('account')
                    .setEmoji('🚹')
			);

            let row = new ActionRowBuilder()
            .addComponents(ticketAccountCategorySelector)

            await interaction.message.edit({components: [row]});
        }
        else if(interaction.customId == 'ticket-discord-category-selector') {
            let value = interaction.values[0];
            if(value == 'auth') {
                let discordAuthModal = new ModalBuilder()
                .setCustomId('discord-auth-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('discord-auth-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                discordAuthModal.addComponents(firstRow);

                await interaction.showModal(discordAuthModal);
            }
            else if(value == 'roles') {
                let discordRolesModal = new ModalBuilder()
                .setCustomId('discord-roles-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('discord-roles-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                discordRolesModal.addComponents(firstRow);

                await interaction.showModal(discordRolesModal);
            }
            else if(value == 'ban') {
                let discordBanModal = new ModalBuilder()
                .setCustomId('discord-ban-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('discord-ban-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                discordBanModal.addComponents(firstRow);

                await interaction.showModal(discordBanModal);
            }
        }
        else if(interaction.customId == 'ticket-server-category-selector') {
            let value = interaction.values[0];
            if(value == 'bug') {
                let serverFBugModal = new ModalBuilder()
                .setCustomId('server-bug-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-bug-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverBugModal.addComponents(firstRow);

                await interaction.showModal(serverBugModal);
            }
            else if(value == 'server') {
                let serverServerModal = new ModalBuilder()
                .setCustomId('server-server-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-server-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverServerModal.addComponents(firstRow);

                await interaction.showModal(serverServerModal);
            }
            else if(value == 'forum') {
                let serverForumModal = new ModalBuilder()
                .setCustomId('server-forum-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-forum-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverForumModal.addComponents(firstRow);

                await interaction.showModal(serverForumModal);
            }
            else if(value == 'sanction') {
                let serverSanctionModal = new ModalBuilder()
                .setCustomId('server-sanction-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-sanction-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverSanctionModal.addComponents(firstRow);

                await interaction.showModal(serverSanctionModal);
            }
            else if(value == 'user') {
                let serverUserModal = new ModalBuilder()
                .setCustomId('server-user-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-user-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverUserModal.addComponents(firstRow);

                await interaction.showModal(serverUserModal);
            }
            else if(value == 'staff') {
                let serverStaffModal = new ModalBuilder()
                .setCustomId('server-staff-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('server-staff-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                serverStaffModal.addComponents(firstRow);

                await interaction.showModal(serverStaffModal);
            }
        }
        else if(interaction.customId == 'ticket-tgf-category-selector') {
            let value = interaction.values[0];
            if(value == 'builder') {
                let tgfBuilderModal = new ModalBuilder()
                .setCustomId('tgf-builder-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('tgf-builder-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                tgfBuilderModal.addComponents(firstRow);

                await interaction.showModal(tgfBuilderModal);
            }
            else if(value == 'staff') {
                let tgfStaffModal = new ModalBuilder()
                .setCustomId('tgf-staff-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('tgf-staff-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                tgfStaffModal.addComponents(firstRow);

                await interaction.showModal(tgfStaffModal);
            }
            else if(value == 'media') {
                let tgfMediaModal = new ModalBuilder()
                .setCustomId('tgf-media-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('tgf-media-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                tgfMediaModal.addComponents(firstRow);

                await interaction.showModal(tgfMediaModal);
            }
            else if(value == 'partner') {
                let tgfPartnerModal = new ModalBuilder()
                .setCustomId('tgf-partner-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('tgf-partner-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                tgfPartnerModal.addComponents(firstRow);

                await interaction.showModal(tgfPartnerModal);
            }
            else if(value == 'owner') {
                let tgfOwnerModal = new ModalBuilder()
                .setCustomId('tgf-owner-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('tgf-owner-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                tgfOwnerModal.addComponents(firstRow);

                await interaction.showModal(tgfOwnerModal);
            }
        }
        else if(interaction.customId == 'ticket-account-category-selector') {
            let value = interaction.values[0];
            if(value == 'error') {
                let accountErrorModal = new ModalBuilder()
                .setCustomId('account-error-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('account-error-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                accountErrorModal.addComponents(firstRow);

                await interaction.showModal(accountErrorModal);
            }
            else if(value == 'hack') {
                let accountHackModal = new ModalBuilder()
                .setCustomId('account-hack-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('account-hack-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                accountHackModal.addComponents(firstRow);

                await interaction.showModal(accountHackModal);
            }
            else if(value == 'login') {
                let accountLoginModal = new ModalBuilder()
                .setCustomId('account-login-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('account-login-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                accountLoginModal.addComponents(firstRow);

                await interaction.showModal(accountLoginModal);
            }
            else if(value == 'theft') {
                let accountTheftModal = new ModalBuilder()
                .setCustomId('account-theft-modal')
                .setTitle('Pontosítsd a problémát!');

                let textInput = new TextInputBuilder()
                .setCustomId('account-theft-paragraph')
                .setLabel('Kérlek pontosíts, miért keresel minket!')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(500);

                let firstRow = new ActionRowBuilder().addComponents(textInput);

                accountTheftModal.addComponents(firstRow);

                await interaction.showModal(accountTheftModal);
            }
        }
    }
    else if(interaction.isModalSubmit()) {
        if(interaction.customId == 'discord-auth-modal') {
            let reason = interaction.fields.getTextInputValue('discord-auth-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222164933219975178',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Discord hitelesítési probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Discord hitelesítési probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'discord-roles-modal') {
            let reason = interaction.fields.getTextInputValue('discord-roles-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222164933219975178',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Discord rang probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');
                        
                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Discord rang probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'discord-ban-modal') {
            let reason = interaction.fields.getTextInputValue('discord-ban-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222164933219975178',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Discord kitiltás/felfüggesztés probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Discord kitiltás/felfüggesztés probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-bug-modal') {
            let reason = interaction.fields.getTextInputValue('server-bug-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Szerver bug jelentése`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Szerver bug jelentése','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-server-modal') {
            let reason = interaction.fields.getTextInputValue('server-server-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Szerver probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Szerver probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-forum-modal') {
            let reason = interaction.fields.getTextInputValue('server-forum-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Fórum probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Fórum probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-sanction-modal') {
            let reason = interaction.fields.getTextInputValue('server-sanction-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Szankció fellebbezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Szankció fellebbezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-user-modal') {
            let reason = interaction.fields.getTextInputValue('server-user-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Felhasználó jelentése`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Felhasználó jelentése','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'server-staff-modal') {
            let reason = interaction.fields.getTextInputValue('server-staff-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159502359396454',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Staff jelentése`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Staff jelentése','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'tgf-builder-modal') {
            let reason = interaction.fields.getTextInputValue('tgf-builder-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159359656591390',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Builder jelentkezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Builder jelentkezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'tgf-staff-modal') {
            let reason = interaction.fields.getTextInputValue('tgf-staff-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159359656591390',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Staff jelentkezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Staff jelentkezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'tgf-media-modal') {
            let reason = interaction.fields.getTextInputValue('tgf-media-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159359656591390',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Média jelentkezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Média jelentkezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'tgf-partner-modal') {
            let reason = interaction.fields.getTextInputValue('tgf-partner-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159359656591390',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Partner jelentkezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Partner jelentkezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'tgf-owner-modal') {
            let reason = interaction.fields.getTextInputValue('tgf-owner-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159359656591390',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Tulajdonos jelentkezés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Tulajdonos jelentkezés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'account-error-modal') {
            let reason = interaction.fields.getTextInputValue('account-error-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159254593736764',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Karakter hiba`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Karakter hiba','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'account-hack-modal') {
            let reason = interaction.fields.getTextInputValue('account-hack-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159254593736764',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Karakter feltörés`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Karakter feltörés','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'account-login-modal') {
            let reason = interaction.fields.getTextInputValue('account-login-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159254593736764',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Belépési probléma`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Belépési probléma','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
        }
        else if(interaction.customId == 'account-theft-modal') {
            let reason = interaction.fields.getTextInputValue('account-theft-paragraph')
            db.query(`SELECT * FROM tickets WHERE ticketuserid=${interaction.member.user.id}`, function (err,results) {
                if(err) throw err;
                if(results[0] != undefined) {
                    let result = results[0];
                    interaction.reply({content: `Neked már van egy nyitott ticketed: <#${result["ticketid"]}>`, flags: MessageFlags.Ephemeral});
                }
                else {
                    interaction.guild.channels.create({
                        name: `ticket-${interaction.member.user.username.substring(0,5)}`,
                        type: ChannelType.GuildText,
                        parent: '1222159254593736764',
                        reason: 'Ticket created for user',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreateEvents, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageWebhooks]
                            },
                            {
                                id: interaction.member.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432694406611014',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432688446509158',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432687150473307',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432685825065082',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432684692611193',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432667168800870',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1294416803824668783',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432665805672560',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: '1186432663796600944',
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                            }
                        ],
                    }).then(channel => {
                        let welcomeEmbed = new EmbedBuilder()
                        .setTitle(`💡 Ticket - ${interaction.member.user.username}`)
                        .setDescription('A ticketek során az általános szabályok vonatkoznak a beszélgetésre! Ne ossz meg semmilyen személyes adatot, csak ha biztos vagy benne, hogy szükséges a megoldáshoz!')
                        .addFields(
                            {
                                name: 'Kategória:',
                                value: '`Fiók ellopása`'
                            },
                            {
                                name: 'Pontos ok:',
                                value: `\`${reason}\``
                            }
                        )
                        .setFooter({
                            text: `${client.user.username} - Ticket rendszer`
                        })
                        .setThumbnail('https://media.discordapp.net/attachments/699628486905692220/1351640352871813191/5728506.png?ex=67db1cac&is=67d9cb2c&hm=58e163d3745ece8f2ce3a20cdb2fa95c5eeb3c99cbd248756f9d8edf1b3c6529&=&format=webp&quality=lossless')
                        .setTimestamp()
                        .setColor('Green');

                        let closeButton = new ButtonBuilder()
                        .setCustomId('close-ticket-button')
                        .setLabel('Bezárás')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒');

                        let claimButton = new ButtonBuilder()
                        .setCustomId('claim-ticket-button')
                        .setLabel('Felvétel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🙋‍♂️');

                        let row = new ActionRowBuilder().addComponents(closeButton, claimButton);
                    
                        channel.send({ content: `${interaction.member}`, embeds: [welcomeEmbed], components: [row]}).then(message => {
                            db.query(`INSERT INTO tickets (ticketid,ticketusername,ticketuserid,ticketmessageid,ticketcategory,ticketreason) VALUES ('${channel.id}','${interaction.member.user.username}','${interaction.member.user.id}','${message.id}','Fiók ellopása','${reason}')`, function (err) {
                                if (err) throw err;
                            });
                        
                            interaction.reply({ content: `A ticketed készen áll: <#${channel.id}>`, flags: MessageFlags.Ephemeral });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            })
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

client.on('channelDelete', async (channel) => {
    db.query(`SELECT * FROM tickets WHERE ticketid='${channel.id}'`, function (err,results) {
        if(err) throw err;
        if(results[0] != undefined) {
            db.query(`DELETE FROM tickets WHERE ticketid='${channel.id}'`, function (err) {if(err) throw err;});
        }
    })
})

client.login(process.env.TOKEN);