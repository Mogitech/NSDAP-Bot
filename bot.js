// Imports
const Discord = require("discord.js");
const client = new Discord.Client();
const xmlTools = require('./Resources/js/xmlTools');
const Resources = require('./Resources/Resources');
const Utilities = require('./Resources/js/Utilities');
var logger = require('winston');
const auth = require('./Config/auth.json');
const config = require('./Config/config.json');
var isReady = true;

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
    if (msg.content.indexOf(config.prefix) === -1 || !isReady) {
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
                      },
                      {
                          name: "!randomrealbjørn",
                          value: "Plays a random audio recording of a random Bjørn quote"
                      },
                      {
                          name: "!bagfra",
                          value: "Try it and you shall see!"
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
                msg.channel.send(Utilities.boxMessage(xmlDoc.quotes.quote[Utilities.randomNumber(xmlDoc['quotes']['quote'].length - 1)])); // Returns random node
                break;
            case 'ttsrandombjørn':
                var xmlDoc = xmlTools.getXmlFromFile(Resources.getResource('quotes')); // Reads xmlDoc from the Resources file
                msg.channel.send(Utilities.boxMessage(xmlDoc.quotes.quote[Utilities.randomNumber(xmlDoc['quotes']['quote'].length - 1)]), {tts: true}); // Return random node, with tts enabled
                break;
            case 'randomrealbjørn':
                isReady = false;
                var voiceChannel = msg.member.voiceChannel;
                var bjornXml = xmlTools.getXmlFromFile(Resources.getResource('quotes'));
                //var audioQuotePath = xmlDoc.quotes.quote[Utilities.randomNumber(xmlDoc['quotes']['quote'].length)].$.audiokey;
                var audioQuotePath = bjornXml.quotes.quote[1].$.audiokey;

                voiceChannel.join().then(connection =>
                {
                    const dispatcher = connection.playFile(audioQuotePath);
                    dispatcher.on('end', end => {
                        voiceChannel.leave();
                    });
                }).catch(err => console.log(err));
                isReady = true;
                break;
            case 'bagfra':
                isReady = false;
                var voiceChannel = msg.member.voiceChannel;
                voiceChannel.join().then(connection =>
                {
                    const dispatcher = connection.playFile(Resources.getResource('bagfra'));
                    dispatcher.on('end', end => {
                        voiceChannel.leave();
                    });
                }).catch(err => console.log(err));
                isReady = true;
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
        isReady = true;
    }
});

client.login(auth.token);