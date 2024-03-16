const { MongoClient } = require('mongodb');

// Cấu hình kết nối MongoDB
const uri = "mongodb://adminLong:65f172da0701aebf90587b9b@mongo165.amazingtech.vn:27017/";
const dbName = "EInvoiceDB";

// Hàm kết nối MongoDB
async function connectDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected successfully to server");
    return client.db(dbName);
}

// Hàm chèn nhiều tài liệu
async function insertDocuments(collectionName, data) {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const result = await collection.insertMany(data);
    console.log("Inserted documents into the collection");
    return result;
}

// Hàm tìm kiếm tài liệu
async function findDocuments(collectionName, query, projectionOptions = null, sortOptions = {}, page = 1, limit = 10000) {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    if (page === 0) {
        page = 1;
    }
    const skip = (page - 1) * limit;
    const projection = projectionOptions ? { projection: projectionOptions } : {};
    const docs = await collection.find(query, { ...projection }).sort(sortOptions).skip(skip).limit(limit).toArray();
    console.log("Found the following records");
    console.log(docs);
    return docs;
}

// Hàm cập nhật một tài liệu
async function updateDocument(collectionName, query, update) {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    delete update._id; // Loại bỏ _id khỏi đối tượng update nếu có
    const result = await collection.updateOne(query, { $set: update });
    console.log("Updated the document");
    return result;
}

// Hàm xóa một tài liệu
async function deleteDocument(collectionName, query) {
    const db = await connectDB();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(query);
    console.log("Deleted the document");
    return result;
}

module.exports = {
    connectDB,
    insertDocuments,
    findDocuments,
    updateDocument,
    deleteDocument
};
