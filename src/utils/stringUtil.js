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
function generateSubdomain(companyName, email) {
    // Tách tên người dùng và phần domain từ email
    const username = companyName;
    const domain = email;
    // tạo hash digits
    const digits = Math.floor(100000 + Math.random() * 900000).toString();
    const digitsHash = crypto.createHash('sha256').update(digits).digest('hex');
    const digitsShortHash = digitsHash.substring(0, 2);
    // Tạo hash SHA-256 từ phần domain
    const hash = crypto.createHash('sha256').update(domain).digest('hex');

    // Lấy 6 ký tự đầu tiên từ hash
    const shortHash = hash.substring(0, 4);

    // Kết hợp tên người dùng và hash + digits hash để tạo subdomain
    const subdomain = `${username}-${shortHash}-${digitsShortHash}`;
    return subdomain;
}
// function generateRandomDigits(domainName) {
//     const digits = Math.floor(100000 + Math.random() * 900000).toString();
//     const hash = crypto.createHash('sha256').update(digits).digest('hex');
//     const shortHash = hash.substring(0, 5);
//     return `${domainName}-${shortHash}`;
// }
module.exports = {
    // generateRandomDigits,
    stringToSlug,generateSubdomain
};  