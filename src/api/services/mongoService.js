const { MongoClient } = require('mongodb');

const uri = "mongodb://adminLong:65f172da0701aebf90587b9b@mongo165.amazingtech.vn:27017/";
const dbName = "EInvoiceDB";

async function connectDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected successfully to server");
    return client.db(dbName);
}

module.exports = { connectDB };