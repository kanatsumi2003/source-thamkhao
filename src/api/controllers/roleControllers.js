const { Role, RoleWithBase } = require('../../models/roleModel');
const mongoService = require('../services/mongoService');
const roleService = require('../services/roleService');

const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const collectionRoleName = 'userroles';
const collectionUserName = 'users';

async function createRole(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["Roles"]
    try {
        const { Name, Description, isAdmin, listClaim } = req.body;
        console.log(Name);
        // Chuyển đổi tên về dạng lowercase để tìm kiếm không phân biệt chữ hoa chữ thường
        const lowercaseName = Name.toLowerCase();
        
        // Tạo regular expression từ tên đã chuyển đổi
        const regexName = new RegExp(lowercaseName, 'i');
        // Kiểm tra xem vai trò với tên đã tồn tại hay chưa
        const existingRoles = roleService.findByName(Name);
        if (existingRoles!=null) {
            return res.status(400).json({ message: "Vai trò đã tồn tại" });
        }
        
        // Tạo đối tượng Role mới
        const newRole = new Role(Name, Description, isAdmin, listClaim);
        console.log(newRole);
        console.log(roleWithBase);

        // Thêm vào cơ sở dữ liệu
        const result = await roleService.createRole(newRole);

        // Gửi phản hồi
        res.status(201).json({ message: 'Vai trò được tạo thành công', data: roleWithBase });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo vai trò', error: error.message });
    }
}

module.exports = { createRole };