// Returns resource from key
function getResource(key) {
    switch(key.toLowerCase()) {
        case 'quotes':
            return 'Resources/xml/quotes.xml';
        case 'bagfra':
            return 'Resources/Audio/quotes/bagfra.wav';
    }
}

// Export with Resource paths
module.exports = {
    getResource: function (key) {
        return getResource(key);
    }
}