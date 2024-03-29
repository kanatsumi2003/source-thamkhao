require('dotenv').config()
const cors = require('cors');
const http_api_url = 'http://' + process.env.API_URL.toString();
const https_api_url = 'https://' + process.env.API_URL.toString();
const allowedOrigins = [http_api_url, https_api_url]

const corsOptions = {
    origin: function(origin, callback) {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error("Not allowed by Cors"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE']
}
module.exports = cors(corsOptions);
