const crypto = require("crypto");
async function stringToSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
require('dotenv').config();
const SECRET_ODOO_KEY = process.env.SECRET_ODOO_KEY;

/**
 * Generates a subdomain based on the user's email by hashing the domain part of the email.
 *
 * @param {string} email - The user's email address.
 * @returns {string} - The generated subdomain.
 */
function generateSubdomain(companyName) {
  // Tách tên người dùng và phần domain từ email
  const username = companyName;
  const currentTimeStamp = generateTimeStamp();

  // tạo hash digits
  // Tạo hash SHA-256 từ phần domain
  // const hash = crypto.createHash('sha256').update(domain).digest('hex');

  // Lấy 6 ký tự đầu tiên từ hash
  // const shortHash = hash.substring(0, 4);

  // Kết hợp tên người dùng và hash + digits hash để tạo subdomain
  const subdomain = `${username}-${currentTimeStamp}`;
  return subdomain;
}
// function generateRandomDigits(domainName) {
//     const digits = Math.floor(100000 + Math.random() * 900000).toString();
//     const hash = crypto.createHash('sha256').update(digits).digest('hex');
//     const shortHash = hash.substring(0, 5);
//     return `${domainName}-${shortHash}`;
// }

function generatePassword() {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha512").update(digits).digest("hex");
  const shortHash = hash.substring(0, 10);
  return shortHash;
}

function generateTimeStampHashString() {
  const currentTimeStamp = Date.now().toString();
  const hash = crypto
    .createHash("sha512")
    .update(currentTimeStamp)
    .digest("hex");
  const shortHash = hash.substring(0, 6);
  return shortHash;
}

function generateDbNameWhenInactivateDb(currentDbName) {
  const index = currentDbName.indexOf("_");
  let deActivateDbCode = generateTimeStampHashString();
  const newDbName = `${currentDbName}_${deActivateDbCode}`;
  if (index !== -1) {
    const dbName = currentDbName.substring(0, index);
    deActivateDbCode = currentDbName.substring(index + 1);
    deActivateDbCode = generateDbNameWhenInactivateDb();
    newDbName = `${dbName}_${deActivateDbCode}`;
  }
  return {
    newDbName: newDbName,
    deActivateDbCode: deActivateDbCode,
  };
}
function splitDbNameIntoOriginal(deActivatedDbName) {
  let index = deActivatedDbName.indexOf("_");
  let originalName = deActivatedDbName.substring(0, index);
  return originalName;
}

function generateTimeStamp() {
  const currentTimeStamp = Date.now();
  return Math.floor(currentTimeStamp / 1000).toString();
}

function hmacSHA512Hash(dataHash) {
  return crypto.createHmac("sha512", SECRET_ODOO_KEY).update(dataHash).digest("hex");
}
module.exports = {
  // generateRandomDigits,
  hmacSHA512Hash,
  generateTimeStamp,
  splitDbNameIntoOriginal,
  generateTimeStampHashString,
  generateDbNameWhenInactivateDb,
  generatePassword,
  stringToSlug,
  generateSubdomain,
};
