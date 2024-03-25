const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = process.env.CONNECTION_STRING
const dbName = "EInvoiceDB";

async function connectDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected successfully to server");
    return client.db(dbName);
}

module.exports = { connectDB };