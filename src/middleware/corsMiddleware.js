require('dotenv').config()
const cors = require('cors');
const http_api_url = 'http://' + process.env.API_URL.toString();
const https_api_url = 'https://' + process.env.API_URL.toString();
const https_page_url = process.env.REACT_APP_ROOT_FE.toString();
const http_localhost_url = 'http://localhost:3000'
const https_localhost_url = 'https://localhost:3000'
const allowedOrigins = [http_api_url, https_api_url, https_page_url, http_localhost_url, https_localhost_url]

const corsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*'
};
// const corsOptions = {
//     origin: function(origin, callback) {
//         if(!origin || allowedOrigins.includes(origin)){
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by Cors"));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE']
// }
module.exports = cors(corsOptions);
