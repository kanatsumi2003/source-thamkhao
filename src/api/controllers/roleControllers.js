const { Role, RoleWithBase } = require('../../models/roleModel');
const mongoService = require('../services/mongoService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const collectionRoleName = 'userroles';
const collectionUserName = 'users';

async function createRole(req, res) {
    try {
        const { Name, Description, isAdmin, listClaim } = req.body;
        console.log(Name);
        // Chuyển đổi tên về dạng lowercase để tìm kiếm không phân biệt chữ hoa chữ thường
        const lowercaseName = Name.toLowerCase();
        
        // Tạo regular expression từ tên đã chuyển đổi
        const regexName = new RegExp(lowercaseName, 'i');
        // Kiểm tra xem vai trò với tên đã tồn tại hay chưa
        const existingRoles = await mongoService.findDocuments(collectionRoleName, { name: { $regex: regexName } });
        if (existingRoles.length > 0) {
            return res.status(400).json({ message: "Vai trò đã tồn tại" });
        }
        
        // Tạo đối tượng Role mới
        const newRole = new Role(Name, Description, isAdmin, listClaim);
        const roleWithBase = new RoleWithBase(newRole);
        console.log(newRole);
        console.log(roleWithBase);

        // Thêm vào cơ sở dữ liệu
        const result = await mongoService.insertDocuments(collectionRoleName, [roleWithBase]);

        // Gửi phản hồi
        res.status(201).json({ message: 'Vai trò được tạo thành công', data: roleWithBase });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo vai trò', error: error.message });
    }
}

module.exports = { createRole };