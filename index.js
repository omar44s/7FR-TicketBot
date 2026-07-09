require("dotenv").config();

const fs = require("fs");

const path = require("path");

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.GuildMembers

    ]

});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);

}

const eventsPath = path.join(__dirname, "events");

const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if (event.once) {

        client.once(event.name, (...args) => event.execute(...args));

    } else {

        client.on(event.name, (...args) => event.execute(...args));

    }

}

console.log("TOKEN:", process.env.TOKEN ? process.env.TOKEN.substring(0, 20) : "NOT FOUND");

client.login(process.env.TOKEN);