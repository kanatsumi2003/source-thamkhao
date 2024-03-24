// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// function uploadImage(file, directoryName) {
//     console.log(file);
//     const timefolder = Date.now();
//     const storage = multer.diskStorage({
//         destination: function(req, file, cb) {
//             // Tạo đường dẫn thư mục dựa trên tên thư mục, ID người dùng và thư mục thời gian
//             const destPath = path.join(__dirname, `uploads/${directoryName}/${req.user._id.toString()}/${timefolder}`);
    
//             // Kiểm tra sự tồn tại của thư mục
//             fs.mkdir(destPath, { recursive: true }, (err) => {
//                 if (err) {
//                     cb(err);
//                 } else {
//                     cb(null, destPath);
//                 }
//             });
//         },
//         filename: function(req, file, cb) {
//             const uniqueSuffix = Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '-' + file.originalname); // Tạo tên file duy nhất
//         }
//     });

//     const upload = multer({ storage: storage }).single('image');

//     return (req, res, next) => {
//         upload(req, res, function(err) {
//             if (err) {
//                 // Xử lý lỗi multer hoặc báo lỗi không upload được file
//                 return res.status(500).json({ error: err.message });
//             }
//             // Tiếp tục xử lý nếu không có lỗi
//             next();
//         });
//     };
// }
// module.exports = { uploadImage };