const { default: axios } = require('axios');
require('dotenv').config();

async function fetchPost(url, postData, Header) {
    const response = await axios.post(url, postData, {
        headers: Header
    });
}
module.exports = {
    fetchPost
};