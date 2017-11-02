function getResource(key) {
    switch(key.toLowerCase()) {
        case 'quotes':
            return 'Resources/xml/quotes.xml';
    }
}

// Export with Resource paths
module.exports = {
    getResource: function (key) {
        return getResource(key);
    }
}