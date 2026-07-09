const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config = require("../config");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Send 7FR STORE Ticket Panel"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor(config.bot.color)
            .setTitle(config.panel.title)
            .setDescription(config.panel.description)
            .setImage(config.bot.banner)
            .setFooter({
                text: config.bot.footer
            })
            .setTimestamp();

        const menu = new StringSelectMenuBuilder()
            .setCustomId("ticket-menu")
            .setPlaceholder("اختر نوع التذكرة | Select Ticket")
            .addOptions(
                config.options.map(option => ({
                    label: option.label,
                    description: option.description,
                    value: option.id
                }))
            );

        const row = new ActionRowBuilder()
            .addComponents(menu);

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

    }

};