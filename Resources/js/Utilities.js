// Discord box
function boxMessage(message) {
    return "```" + message + "```";
}

// Discord block
function makeBlock(message) {
    return "`" + message + "`";
}

// Discord bold
function makeBold(message) {
    return "**" + message + "**";
}

// Discord italic
function makeItalic(message) {
    return "*" + message + "*";
}

// Discord bold italic
function makeBoldItalic(message) {
    return "***" + message + "***";
}

// Discord underline
function makeUnderline(message) {
    return "__" + message + "__";
}

// Returns a random integer from 0 to max excluding this
function randomNumber(max) {
    return Math.floor(Math.random() * (max));
}

// Checks if Image of game exists. Remember: path is relative, so it starts by the executing file i.e bot.js in root folder
function checkIfImageExists(value) {
    switch (value.toLowerCase()) {
        case 'csgo':
            return 'Resources/Images/Games/CSGO/CSGO.png'
        case 'rs6':
            return 'Resources/Images/Games/SIEGE/RS6.png'
        case 'siege':
            return 'Resources/Images/Games/SIEGE/RS6.png'
        case 'pubg':
            return 'Resources/Images/Games/PUBG/PUBG.png'
        case 'rl':
            return 'Resources/Images/Games/RL/RL.png'
        case 'rocketleague':
            return 'Resources/Images/Games/RL/RL.png'
        default:
            return "None"
    }
}

// Exports the functions to use in another file
module.exports = {
    boxMessage: function (message) {
        return boxMessage(message);
    },
    makeBlock: function (message) {
        return makeBlock(message);
    },
    makeBold: function (message){
        return makeBold(message);
    },
    makeItalic: function (message) {
        return makeItalic(message);
    },
    makeBoldItalic: function (message) {
        return makeBoldItalic(message);
    },
    makeUnderline: function (message) {
        return makeUnderline(makeUnderline);
    },
    randomNumber: function (max) {
        return randomNumber(max);
    },
    checkIfImageExists: function (value) {
        return checkIfImageExists(value);
    }
}