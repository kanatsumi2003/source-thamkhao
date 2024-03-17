const { SessionLogin, SessionWithBase } = require('../../models/sessionModel');
const mongoose = require('mongoose');
const mongoService = require('../services/mongoService');
const { ObjectId } = require('mongodb');
const collectionName = 'sessions';

// Function to create a new session
async function createSession(sessionData) {
    // const newSession = new SessionLogin(
    //     sessionData.userId,
    //     sessionData.email,
    //     sessionData.name,
    //     sessionData.username,
    //     sessionData.jwttoken,
    //     sessionData.expireDate,
    //     sessionData.deviceId,
    //     sessionData.ipAddress
    // );
    const fullSession = new SessionWithBase(sessionData);
    await mongoService.insertDocuments(collectionName, [fullSession]);
    return fullSession;
}

// Function to update an existing session
async function updateSession(sessionId, updateData) {
    const session = await findById(sessionId);
    if (!session) {
        return null;
    }
    updateData.updateTime = new Date();
    const query = { _id: new mongoose.Types.ObjectId(sessionId) };
    const result = await mongoService.updateDocument(collectionName, query, updateData);
    return result;
}

// Function to delete a session
async function deleteSession(sessionId) {
    const query = {_id:new mongoose.Types.ObjectId(sessionId)}
    const result = await mongoService.deleteDocument(collectionName, query);;
    return result;
}

async function findById(sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        sessionId = new mongoose.Types.ObjectId(sessionId);
    }
    const query = { _id: sessionId, isDelete: false };
    const sessions = await mongoService.findDocuments(collectionName, query);
    return sessions[0];
}
async function findSessionByToken(token) {
   console.log(token); 
    const query = { jwttoken: token , isDelete: false };
   console.log(query); 
    const sessions = await mongoService.findDocuments(collectionName, query);
    return sessions[0];
}
// Add more session-specific functions as needed, such as find by token, username, etc.
async function findSessionByEmailAndIP(email, ipAddress,deviceId) {
    const query = {
        email: email.toLowerCase(), // Assuming email is stored in lowercase
        ipAddress: ipAddress,
        deviceId:deviceId,
        isDelete: { $ne: true } // Assuming you have a flag for soft deletes
    };

    const sessions = await mongoService.findDocuments(collectionName, query);
    return sessions; // This could return multiple sessions if there are multiple sessions for the same email and IP
}
module.exports = {
    createSession,
    updateSession,
    deleteSession,
    findById,
    findSessionByToken,
    findSessionByEmailAndIP
    // Add more exported functions as needed
};