const app = require('../server'); // Import your Express app

module.exports = (req, res) => {
    app(req, res); // Pass the request and response to the Express app
};
