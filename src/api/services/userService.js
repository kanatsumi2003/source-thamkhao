const mongoService = require('../services/mongoService');
const mongoose = require('mongoose'); // Import module mongoose
const { User, UserWithBase } = require('../../models/userModel');
const { Role } = require('../../models/roleModel');
const RoleService = require('../services/roleService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng

const collectionName = 'users'
async function createUser(user) {
    try {
        console.log("createUser(user)", user);
        const checkRole = RoleService.findById(user.role_id);
        if (checkRole == null) {
            return null;
        }

        // const _user = new User(user.email, user.username, user.password, user.phoneNumber, user.role_id);
        let fullUser = new UserWithBase(user);
        fullUser.password = await hashPassword(user.password);
        console.log(fullUser.password);
        await mongoService.insertDocuments(collectionName, [fullUser]);
        return fullUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

async function updateUser(userId, update) {
    try {
        console.log(userId);
        console.log(update);
        update.updateTime = new Date();
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            await mongoService.updateDocument(collectionName, { _id: new mongoose.Types.ObjectId(userId) }, update);

        } else {
            await mongoService.updateDocument(collectionName, { _id: userId }, update);
        }
        
        return true;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
}

async function changePasswordUser(userId, oldPassword, newPassword) {
    try {
        console.log("changePasswordUser");
        const userData = await getUserById(userId);
        if (!userData) {
            console.log("userData false");
            return false;
        }
        // Tạo một thể hiện mới của User class
        let user = new UserWithBase(userData);
        console.log("changePasswordUser userData",userData);
        console.log("changePasswordUser user",user);

        // Đảm bảo bạn đang chờ hashPassword trả về
        const isValid = await user.isCorrectPassword(oldPassword);
        console.log(isValid);

        if (!isValid) {
            return false;
        }
        console.log(oldPassword);
        console.log(newPassword);
        user.password = await hashPassword(newPassword);
        console.log(user);
        await updateUser(userId, user);
        return true;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
}
async function deleteUser(userId) {
    try {
        let user = await getUserById(userId);
        if (user == null) {
            return false;
        }
        user.isDelete = true;
        user.updateTime = new Date();
        await updateUser(userId, user);
        return true;
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
}

async function getAllUsers() {
    try {
        const query = { isDelete: false, isActive: true };
        return await mongoService.findDocuments(collectionName, query);
    } catch (error) {
        throw new Error('Error getting all users: ' + error.message);
    }
}

async function getUserById(userId) {
    try {
        const query = { _id: new mongoose.Types.ObjectId(userId), isDelete: false, isActive: true };
        const users = await mongoService.findDocuments(collectionName, query);
        if (users !== null && users.length > 0) {
            return users[0];
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Error getting user by id: ' + error.message);
    }
}
async function getUserByEmailAndUsername(email, username) {
    try {
        const query = { $or: [{ email: email }, { username: username }], isDelete: false, isActive: true };
        const users = await mongoService.findDocuments(collectionName, query);
        if (users !== null && users.length > 0) {
            return users[0];
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Error getting user by email: ' + error.message);
    }
}
async function getUserByEmail(email) {
    try {
        const query = { email: email, isDelete: false, isActive: true,emailConfirmed:true };
        const users = await mongoService.findDocuments(collectionName, query);
        if (users === null && users.length <= 0) {
            return null;
        }
        return users[0];
    } catch (error) {
        throw new Error('Error getting user by email: ' + error.message);
    }
}

async function getUserByUsername(username) {
    try {
        const query = { username: username.toLowerCase(), isDelete: false, isActive: true,emailConfirmed:true };
        const users = await mongoService.findDocuments(collectionName, query);
        return users[0];
    } catch (error) {
        throw new Error('Error getting user by username: ' + error.message);
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    getUserByEmailAndUsername,
    changePasswordUser
};
