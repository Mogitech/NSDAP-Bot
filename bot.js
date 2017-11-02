// Imports
const Discord = require("discord.js");
const client = new Discord.Client();
const xmlTools = require('./Resources/js/xmlTools');
const Resources = require('./Resources/Resources');
const Utilities = require('./Resources/js/Utilities');
var logger = require('winston');
const auth = require('./Config/auth.json');
const config = require('./Config/config.json');

// Initialize logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// On ready event handler
client.on('ready', () => {
    logger.info('Bot is conneted');
    logger.info('Login user: ' + client.user)
});

// On message event handler
client.on('message', msg => {

    // Check for links
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; // http/https url search pattern
    var regex = new RegExp(expression);
    if (msg.content.match(regex) && msg.channel.id.indexOf('245625261129859074') != -1) {
        msg.delete(1000); // Delete message
        // Send embed message to msg channel
        msg.channel.send({
            embed: {
                color: 0xff0000,
                author: {
                    name: msg.author.username,
                    icon_url: client.users.get(msg.author.id).avatarURL
                },
                title: 'Removed link',
                description: `Please refer to ${client.channels.get('306516651518722048')} text channel!`,
                timestamp: new Date()
            }
        })
        return;
    }

    // Check is message contains configures prefiks
    if (msg.content.indexOf(config.prefix) === -1) {
        return;
    }

    // Splits the message into command statement and arguments
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    logger.info('New message from: ' + msg.author) + ": " + command;
    try {
        // Command switch
        switch (command.toLowerCase()) {
            case 'help':
                msg.channel.send({embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    title: "Commands:",
                    description: "These commands are supported on this server. (commands are not case sensitive)",
                    fields: [{
                        name: "!randombjørn",
                        value: "Returns a random Bjørn quote!"
                      },
                      {
                        name: "!ttsrandombjørn",
                        value: "Returns a random Bjørn quote, and then reads it up!"
                      },
                      {
                        name: "!randomgame {game} {game} ...",
                        value: "Picks a game from the arguments. Some of the arguments returns images, so please play around!"
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© NSDAP"
                    }
                  }
                });
                break;
            case 'randombjørn':
                var xmlDoc = xmlTools.getXmlFromFile(Resources.getResource('quotes')); // Reads xmlDoc from the Resources file
                
                msg.channel.send(Utilities.boxMessage(xmlDoc.quotes.quote[Utilities.randomNumber(xmlDoc['quotes']['quote'].length)])); // Returns random node
                break;
            case 'ttsrandombjørn':
                var xmlDoc = xmlTools.getXmlFromFile(Resources.getResource('quotes')); // Reads xmlDoc from the Resources file
                msg.channel.send(Utilities.boxMessage(xmlDoc.quotes.quote[Utilities.randomNumber(xmlDoc['quotes']['quote'].length)]), {tts: true}); // Return random node, with tts enabled
                break;
            case 'randomgame':
                var ranNum = Utilities.randomNumber(args.length);
                var game = args[ranNum]
                // Checks if picture of the game exists, else return string
                if (Utilities.checkIfImageExists(game) == 'None') {
                    msg.channel.send(Utilities.boxMessage("The genie wants you to play: " + game));
                } else {
                    msg.channel.send("", {
                        file: Utilities.checkIfImageExists(game)
                    });
                }
                break;
        }
    } catch (err) {
        logger.error(err.message);
    }
});

client.login(auth.token);