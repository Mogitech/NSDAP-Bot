const Discord = require("discord.js");
const fs = require('fs');
const client = new Discord.Client();

var parseString = require('xml2js').parseString;

var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const auth = require('./Config/auth.json');
const config = require('./Config/config.json');

client.on('ready', () => {
    logger.info('Bot is conneted');
    logger.info('Login user: ' + client.user)
});

client.on('message', msg => {

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (msg.content.match(regex) && msg.channel.id.indexOf('245625261129859074') != -1) {
        msg.delete(1000);
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

    if (msg.content.indexOf(config.prefix) === -1) {
        return;
    }
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    logger.info('New message from: ' + msg.author) + ": " + command;
    try {
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
                xmlString = fs.readFileSync('./Resources/quotes.xml', { encoding: 'utf-8' });
                var xmlDoc;
                parseString(xmlString, function (err, result) {
                    xmlDoc = result;
                });
                var ranNum = randomNumber(xmlDoc['quotes']['quote'].length);
                msg.channel.send(boxMessage(xmlDoc['quotes']['quote'][ranNum]));
                break;
            case 'ttsrandombjørn':
                xmlString = fs.readFileSync('./Resources/quotes.xml', { encoding: 'utf-8' });
                var xmlDoc;
                parseString(xmlString, function (err, result) {
                    xmlDoc = result;
                });
                var ranNum = randomNumber(xmlDoc['quotes']['quote'].length);
                var message = xmlDoc['quotes']['quote'][ranNum];
                msg.channel.send(boxMessage(message), {tts: true});
                break;
            case 'randomgame':
                var ranNum = randomNumber(args.length);
                var game = args[ranNum]
                if (checkIfImageExists(game) == 'None') {
                    msg.channel.send(boxMessage("The genie wants you to play: " + game));
                } else {
                    msg.channel.send("", {
                        file: checkIfImageExists(game)
                    });
                }
                break;
        }
    } catch (err) {
        logger.error(err.message);
    }
});

function boxMessage(message) {
    return "```" + message + "```";
}

function makeBlock(message) {
    return "`" + message + "`";
}

function makeBold(message) {
    return "**" + message + "**";
}

function makeItalic(message) {
    return "*" + message + "*";
}

function makeBoldItalic(message) {
    return "***" + message + "***";
}

function makeUnderline(message) {
    return "__" + message + "__";
}

function checkIfImageExists(value) {
    switch (value.toLowerCase()) {
        case 'csgo':
            return './Images/Games/CSGO/CSGO.png'
        case 'rs6':
            return './Images/Games/SIEGE/RS6.png'
        case 'siege':
            return './Images/Games/SIEGE/RS6.png'
        case 'pubg':
            return './Images/Games/PUBG/PUBG.png'
        case 'rl':
            return './Images/Games/RL/RL.png'
        case 'rocketleague':
            return './Images/Games/RL/RL.png'
        default:
            return "None"
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * (max));
}

client.login(auth.token);