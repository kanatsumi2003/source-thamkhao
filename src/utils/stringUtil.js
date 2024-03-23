async function stringToSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}
module.exports = {
    stringToSlug
};  