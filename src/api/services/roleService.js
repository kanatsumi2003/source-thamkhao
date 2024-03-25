const { Role, RoleWithBase } = require('../../models/roleModel');
const mongoose = require('mongoose'); // Import module mongoose
const mongoService = require('../services/mongoService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getUserById } = require('./userService');
const collectionName = 'userroles';
// Function to create a new role
async function createRole(role) {
    const newRole = new Role(
        role.name,
        role.description,
        role.isAdmin,
        role.listClaim
    );
    const fullRole = new RoleWithBase(newRole);
    const result = await mongoService.insertDocuments(collectionName, [fullRole]);
    return fullRole;
}
// Function to update an existing role
async function updateRole(roleId, updateData) {
    const rolecur = await findById(roleId);
    if(rolecur==null)
    {
        return null;
    }
    updateData.updateTime  = new Date();
    const query = { _id:  new mongoose.Types.ObjectId(roleId), isDelete: false, isActive: true };
    const result = await mongoService.updateDocument(collectionName, query, updateData);
    return result;
}

// Function to delete a role
async function deleteRole(roleId) {
    let curRole = getUserById(roleId);
    if(curRole===null){
        return null;
    }
    curRole.updateTime= new Date();
    curRole.isDelete = true;
    const result = await updateRole(roleId,curRole);
    return result;
}
async function findById(roleId) {
    console.log("mongoose.Types.ObjectId.isValid(roleId) ",mongoose.Types.ObjectId.isValid(roleId));
    // Kiểm tra nếu role_id không phải là ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        roleId = new mongoose.Types.ObjectId(roleId);
    }
    console.log("findById(roleId) ",roleId);
    const query = { _id: roleId, isDelete: false, isActive: true };
    console.log("findById(roleId)query ",query);

    const roles = await mongoService.findDocuments(collectionName, query);
    console.log("findById(roleId) ",roles);
    return roles[0];
}

async function findByName(roleName) {
    const query = { name: roleName, isDelete: false, isActive: true };
    const roles = await mongoService.findDocuments(collectionName, query);
    if(roles==null && roles.length<=0){
        return null;
    }
    return roles[0];
}

async function getAllRoles() {
    const query = { isDelete: false, isActive: true };
    return await mongoService.findDocuments(collectionName, query);
}

module.exports = {
    findById,
    findByName,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole
};