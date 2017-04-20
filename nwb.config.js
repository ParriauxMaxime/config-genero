const path = require('path');

module.exports = {
    type: 'react-app',
    webpack: {
        extra: {
            node: {
                process: false
            }
        },
        html: {
            template: 'app/index.html'
        }
    }
};
