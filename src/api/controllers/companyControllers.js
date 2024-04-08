const companyModel = require("../../models/profileCompanyModel");
const stringUltil = require("../../utils/stringUtil");
const companyService = require("../services/companyService");
const path = require("path");
const fs = require("fs");
const worker = require("../../utils/worker");
const queue = require("../../utils/sendQueue");



async function createCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    console.log("hello");
    console.log(req.body.emailCompany);
    // const companyNameDomain = stringUltil.generateSubdomain(req.body.emailCompany);
    
    const isUserOwnedComapny = await companyService.getCompanyByUserId(req.user.userId)
    const isUserOwnedInactiveComapny = await companyService.getCompanyInactiveByUserId(req.user.userId);
    if(isUserOwnedComapny || isUserOwnedInactiveComapny)
      throw new Error("This user has owned a company!");

    const check = companyService.validateCompanyName(req.body.companyName); //check company names ko được chứa ký tự đặc biệt
    if (!check)
      throw new Error("Company name must not contain special characters");
    //xóa tất cả khoảng trắng
    const companyName = req.body.companyName.replace(/\s/g, ""); 
    console.log(companyName);
    //tạo domain
    const companyNameDomain = stringUltil.generateSubdomain(
      companyName,
    );

    //add dns

    //add odoo

    //create
    const company = new companyModel.CompanyProfile(
      req.body.companyName,
      req.body.address,
      req.body.phoneNumber,
      req.body.userNameAdmin,
      req.body.passwordAdmin,
      null, // may be null
      req.user.userId,
      req.body.emailCompany,
      req.body.taxCompany,
      req.body.countryCode,
      null,
      companyNameDomain, // db name
      companyNameDomain, // domain name
      null, // start date may be null
      0,
      0,
      0,
      "aaa" // lấy apikey của odoo bỏ vô đây
    );
    console.log(company);

    let fullcompany = new companyModel.CompanyProfileWithBase(company); // phải tạo model with base model để create

    fullcompany.isActive = false;

    console.log(fullcompany);
    
    const result = await companyService.createCompany(fullcompany);

    
    if (result === null)
    res
    .status(400)
    .json({ message: `Company ${company.companyName} existed` });
    
    const companyData = { ...result };
    delete companyData.passwordAdmin;
    delete companyData.dbName;
    delete companyData.apiKey;
    
    const message = {
      userPassword: req.body.passwordAdmin,
      userId: req.user.userId,
      companyId: result._id,
    };
    const messageString = JSON.stringify(message)
    await queue.sendToQueue("createOdooAndDNS", Buffer.from(messageString));
    res.status(201).json({ message: "Company created", data: companyData });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
}

async function getAllCompanies(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const status = req.status;
    const companies = await companyService.getAllCompanies(status);

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error getting companies", error });
  }
}

async function getCompanyById(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const status = req.status
    const company = await companyService.getCompanyById(req.params.id, status);
    const companyData = { ...company };
    delete companyData.passwordAdmin;
    delete companyData.dbName;
    delete companyData.apiKey;
    res.status(200).json(companyData);
  } catch (error) {
    res.status(500).json({ message: "Error getting company", error });
  }
}

async function getCompanyByUserId(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const data = {
      userId: req.user.userId,
    };
    const company = await companyService.getCompanyByUserId(data);
    const companyData = { ...company };
    delete companyData.passwordAdmin;
    delete companyData.dbName;
    delete companyData.apiKey;
    res.status(200).json(companyData);
  } catch (error) {
    res.status(500).json({ message: "Error getting company", error });
  }
}
async function updateCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    // const { companyId } = req.myCompany; // Giả sử bạn lấy ID công ty từ tham số đường dẫn
    const data = {
      userId: req.user.userId,
    }
    const result = await companyService.getCompanyByUserId(data)
    let companyId = result._id
    const {
      companyName,
      address,
      phoneNumber,
      subscriptionId,
      emailCompany,
      taxCompany,
      countryCode,
    } = req.body;
    const status = true;
    let updateCompany = await companyService.getCompanyById(companyId, status);
    if (!updateCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (updateCompany.userId != req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }
    // Kiểm tra và xác thực dữ liệu đầu vào tại đây, ví dụ: định dạng email, số điện thoại, v.v.
    // Cập nhật các thuộc tính của công ty dựa trên dữ liệu nhập
    updateCompany.companyName = companyName || updateCompany.companyName;
    updateCompany.address = address || updateCompany.address;
    updateCompany.phoneNumber = phoneNumber || updateCompany.phoneNumber;
    updateCompany.subscriptionId =
      subscriptionId || updateCompany.subscriptionId;
    updateCompany.emailCompany = emailCompany || updateCompany.emailCompany;
    updateCompany.taxCompany = taxCompany || updateCompany.taxCompany;
    updateCompany.countryCode = countryCode || updateCompany.countryCode;
    updateCompany = await companyService.updateCompany(
      updateCompany._id,
      updateCompany
    );
    res.status(200).json(updateCompany);
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
}

async function deleteCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const company = await companyService.deleteCompany(req.params.id);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
}
async function uploadImageCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  console.log(req.user);
  // Kiểm tra xem có file được upload không
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  // Lấy thông tin file
  const file = req.file;
  const timeFolder = Date.now();
  const dirPath = "/public/uploads/" + req.user.userId + "/companyAvatar/";
  console.log("dirPath ", "../../../" + dirPath);
  const baseDir = path.join(__dirname, "../../../" + dirPath);
  console.log(baseDir);
  try {
    fs.mkdirSync(baseDir, { recursive: true });
  } catch (err) {
    console.error(err);
    // Thêm logic xử lý lỗi tại đây, ví dụ: trả về phản hồi lỗi cho client
  }

  // Tạo tên file mới với ID người dùng và timestamp để đảm bảo tên file là duy nhất
  const newFileName =
    req.user.userId + "-" + timeFolder + path.extname(file.originalname);
  const targetPath = path.join(baseDir, newFileName);
  console.log("targetPath", targetPath);

  // Di chuyển file từ thư mục tạm thời vào thư mục đích
  fs.copyFile(file.path, targetPath, async (err) => {
    if (err) {
      fs.unlink(file.path, () => {});
      return res.status(500).send({ message: "Could not process the file." });
    }

    const userId = req.user.userId;
    let company = await companyService.getCompanyByUserId(userId);

    if (!company) {
      return res.status(404).send({ message: "company not found." });
    }

    // Lưu đường dẫn của file mới vào cơ sở dữ liệu, lưu ý rằng bạn nên lưu đường dẫn tương đối thay vì đường dẫn tuyệt đối
    const imagePath = `${dirPath}${newFileName}`;
    // await userService.updateUserProfileImage(user._id, imagePath);
    company.imageCompany = imagePath;
    await companyService.updateCompany(company._id, company);
    res.status(200).json({
      message: "Image Company uploaded successfully.",
      imagePath: imagePath,
    });
  });
}
module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getCompanyByUserId,
  updateCompany,
  deleteCompany,
  uploadImageCompany,
};
