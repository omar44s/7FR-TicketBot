const {
    Events,
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {

        // =========================
        // Slash Commands
        // =========================
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (err) {

                console.error("========== COMMAND ERROR ==========");
                console.error(err);

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content: "❌ حدث خطأ أثناء تنفيذ الأمر.",
                        ephemeral: true
                    }).catch(() => {});

                } else {

                    await interaction.reply({
                        content: "❌ حدث خطأ أثناء تنفيذ الأمر.",
                        ephemeral: true
                    }).catch(() => {});

                }

            }

            return;
        }

        // =========================
        // Select Menu
        // =========================
        if (interaction.isStringSelectMenu()) {

            if (interaction.customId !== "ticket-menu") return;

            try {

                const option = config.options.find(x => x.id === interaction.values[0]);

                const channel = await interaction.guild.channels.create({

                    name: `ticket-${interaction.user.username}`,

                    type: ChannelType.GuildText,

                    parent: config.ticket.categoryId || null,

                    permissionOverwrites: [

                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },

                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },

                        ...(config.ticket.supportRoleId
                            ? [{
                                id: config.ticket.supportRoleId,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory
                                ]
                            }]
                            : [])

                    ]

                });

                const embed = new EmbedBuilder()
                    .setColor(config.bot.color)
                    .setTitle("🎫 تم إنشاء التذكرة")
                    .setDescription(
                        `مرحباً ${interaction.user}

**القسم**
${option.label}

يرجى كتابة طلبك وسيتم الرد عليك بأقرب وقت.`
                    );

                const row = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("close-ticket")
                        .setLabel("🔒 Close Ticket")
                        .setStyle(ButtonStyle.Danger)

                );

                await channel.send({
                    embeds: [embed],
                    components: [row]
                });

                await interaction.reply({
                    content: `✅ تم إنشاء تذكرتك ${channel}`,
                    ephemeral: true
                });

            } catch (err) {

                console.error(err);

                await interaction.reply({
                    content: "❌ حدث خطأ أثناء إنشاء التذكرة.",
                    ephemeral: true
                }).catch(() => {});

            }

            return;
        }

        // =========================
        // Close Button
        // =========================
        if (interaction.isButton()) {

            if (interaction.customId !== "close-ticket") return;

            await interaction.reply({
                content: "🔒 سيتم حذف التذكرة بعد 5 ثوانٍ...",
                ephemeral: true
            });

            setTimeout(() => {

                interaction.channel.delete().catch(() => {});

            }, 5000);

        }

    }

};