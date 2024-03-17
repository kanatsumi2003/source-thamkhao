const { User, UserWithBase } = require('../../models/userModel');
const mongoService = require('../services/mongoService');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils'); // Đảm bảo đường dẫn đúng
const { encodejwt, decodejwt } = require('../../utils/jwtutils'); // Đảm bảo đường dẫn đúng
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');