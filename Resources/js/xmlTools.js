// Imports
const fs = require('fs');
var parseString = require('xml2js').parseString;

// Read xml from path and translate to js object
function getXmlFromFile(path) {
    xmlString = fs.readFileSync(path, { encoding: 'utf-8' });
    var xmlDoc;
    parseString(xmlString, function (err, result) {
        xmlDoc = result;
    });
    return xmlDoc;
}

// Exports the functions to use in another file
module.exports = {
    getXmlFromFile: function (path) {
        return getXmlFromFile(path);
    }
}