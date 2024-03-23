// const {
//   CompanyProfile, CompanyProfileWithBase, } = require("../../models/profileCompanyModel");
  const stringUltil = require("../../utils/stringUtil");
const companyService = require("../services/companyService");

async function createCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    console.log(res.body);
    const companyNameDomain = stringUltil.generateSubdomain(req.body.emailCompany);
    //add dns 

    //add odoo

    //create
    const company = new CompanyProfile(
      req.body.companyName,
      req.body.address,
      req.body.phoneNumber,
      req.body.userNameAdmin,
      req.body.passwordAdmin,
      req.body.subscriptionId, // may be null
      req.body.userId,
      req.body.emailCompany,
      req.body.taxCompany,
      req.body.countryCode,
      req.body.imageCompany,
      companyNameDomain, // db name
      companyNameDomain, // domain name
      req.body.startDateSubs, // start date may be null
      0,
      0,
      0,
      "aaa"
    );
    const fullcompany = new CompanyProfileWithBase(company);// phải tạo model with base model để create
    const result = await companyService.createCompany(fullcompany);

    if (result === null)
      res
        .status(400)
        .json({ message: `Company với tên ${company.companyName} đã tồn tại` });

    const companyData = { ...result };
    delete companyData.passwordAdmin;

    res.status(201).json({ message: "Company created", data: companyData });
  } catch (error) {
    res.status(500).json({ message: "Error creating company", error });
  }
}

async function getAllCompanies(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error getting companies", error });
  }
}

async function getCompanyById(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const company = await companyService.getCompanyById(req.id);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error getting company", error });
  }
}

async function updateCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const company = await companyService.updateCompany(req.body);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
}

async function deleteCompany(req, res) {
  // #swagger.description = 'Use to request all posts'
  // #swagger.tags = ["Companies"]
  try {
    const company = await companyService.deleteCompany(req.id);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
}

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
