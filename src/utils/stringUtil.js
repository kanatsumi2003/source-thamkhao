const crypto = require('crypto');
async function stringToSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}


/**
 * Generates a subdomain based on the user's email by hashing the domain part of the email.
 * 
 * @param {string} email - The user's email address.
 * @returns {string} - The generated subdomain.
*/
function generateSubdomain(email) {
    // Tách tên người dùng và phần domain từ email
    const [username, domain] = email.split('@');

    // Tạo hash SHA-256 từ phần domain
    const hash = crypto.createHash('sha256').update(domain).digest('hex');

    // Lấy 6 ký tự đầu tiên từ hash
    const shortHash = hash.substring(0, 4);

    // Kết hợp tên người dùng và hash để tạo subdomain
    const subdomain = `${username}-${shortHash}`;
    return subdomain;
}
module.exports = {
    stringToSlug,generateSubdomain
};  