// Imports
const fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

// Read xml from path and translate to js object
function getXmlFromFile(path) {
    xmlString = fs.readFileSync(path, { encoding: 'utf-8' });
    var xmlDoc;
    parser.parseString(xmlString, function (err, result) {
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