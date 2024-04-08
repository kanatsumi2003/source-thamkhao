const {
  CompanyProfile,
  CompanyProfileWithBase,
} = require("../../models/profileCompanyModel");
const mongoService = require("../services/mongoService");
const { hashPassword } = require("../../utils/passwordUtils");

const mongoose = require("mongoose"); // Import module mongoose

const collectionName = "companies";

/**
 * Check the Company Name is exist or not
 * @param {string} companyName The name of the company to check for existence
 * @returns {Promise<boolean>} true if the company name exists, false otherwise
 * @exception Error Create connect to db fail
 */
async function isCompanyNameExist(companyName) {
  try {
    const query = { companyName: companyName, isDelete: false, isActive: true };
    const companies = await mongoService.findDocuments(collectionName, query);

    //True if the company exist
    return companies !== null && companies.length > 0;
  } catch (error) {
    throw new Error("Error checking company name: " + error.message);
  }
}

/**
 * Create a new company
 * @param {CompanyProfile} company The company to create
 * @returns {Promise<CompanyProfileWithBase> || null || undefined} The company has been created
 * or null if the company name is exist
 * or undefined
 * @exception Error if the insert to database fail or create connect to db fail
 */
async function createCompany(company) {
  try {
    console.log("CreateCompany(company)", company);

    let fullCompany = new CompanyProfileWithBase(company);
    fullCompany.passwordAdmin = await hashPassword(company.passwordAdmin);
    console.log(fullCompany.passwordAdmin);

    await mongoService.insertDocuments(collectionName, [fullCompany]);

    return fullCompany;
  } catch (error) {
    throw new Error("Error creating company: " + error.message);
  }
}

/**
 * Get All Companies from the database
 * @returns {Promise<CompanyProfile[]> || undefined} All the companies
 * @exception Error Create connect to db fail
 */
async function getAllCompanies() {
  try {
    const query = { isDelete: false, isActive: true };
    return await mongoService.findDocuments(collectionName, query);
  } catch (error) {
    throw new Error("Error getting all companies: " + error.message);
  }
}


/**
 * Get Company by Id
 * @param {string} companyId The id of the company to get
 * @returns {Promise<CompanyProfile> || null || undefined} The company with the given id
 * or null if the company does not exist
 * @exception Error Create connect to db fail
 */
async function getCompanyById(companyId) {
  try {
    const query = {
      _id: new mongoose.Types.ObjectId(companyId),
      isActive: true,
      isDelete: false,
    };
    const companies = await mongoService.findDocuments(collectionName, query);
    if (companies !== null && companies.length > 0) {
      return companies[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error getting company by id: " + error.message);
  }
}
/**
 * Get Company by Id
 * @param {string} companyId The id of the company to get
 * @returns {Promise<CompanyProfile> || null || undefined} The company with the given id
 * or null if the company does not exist
 * @exception Error Create connect to db fail
 */
async function getCompanyByIdWithoutStatus(companyId) {
  try {
    const query = {
      _id: new mongoose.Types.ObjectId(companyId),
      isDelete: false,
    };
    const companies = await mongoService.findDocuments(collectionName, query);
    if (companies !== null && companies.length > 0) {
      return companies[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error getting company by id: " + error.message);
  }
}

/**
 * 
 * @param {string} userId 
 * @returns {Promise<CompanyProfile>}
 * @exception
 */
async function getCompanyByUserId(data) {
  try {
    const {userId} = data;
    const query = {
      userId: userId,
      isDelete: false,
      isActive: true,
    };
    const companies = await mongoService.findDocuments(collectionName, query);
    if (companies !== null && companies.length > 0) {
      return companies[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error getting company by userid: " + error.message);
  }
}
/**
 * Gets a company by its ID from the database.
 * @param {string} companyId - The ID of the company to retrieve.
 * @returns {Object || null} The company object if found, or null if not.
 */
async function getCompanyInactiveByUserId(userId) {
  try {
    const query = {
      userId: userId,
      isDelete: false,
      isActive: false,
    };
    const companies = await mongoService.findDocuments(collectionName, query);
    if (companies !== null && companies.length > 0) {
      return companies[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error getting company by userid: " + error.message);
  }
}
/**
 * Gets a company by its ID from the database.
 * @param {string} companyId - The ID of the company to retrieve.
 * @returns {Object|null} The company object if found, or null if not.
 */

/**
 * Update Company by Id
 * @param {string} companyId The id of the company to update
 * @param {CompanyProfile} company The company to update
 * @returns {Promise<boolean>} true if the company has been updated, false otherwise
 * @exception Error Create connect to db fail
 */
async function updateCompany(companyId, company) {
  try {
    let oldCompany = await getCompanyById(companyId);
    if (oldCompany == null) {
      return false;
    }
    company.updateTime = new Date();
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      await mongoService.updateDocument(
        collectionName,
        { _id: new mongoose.Types.ObjectId(companyId) },
        company
      );
    } else {
      await mongoService.updateDocument(
        collectionName,
        { _id: companyId },
        company
      );
    }

    return true;
  } catch (error) {
    throw new Error("Error updating company: " + error.message);
  }
}
/**
 * Update Company by Id
 * @param {string} companyId The id of the company to update
 * @param {CompanyProfile} company The company to update
 * @returns {Promise<boolean>} true if the company has been updated, false otherwise
 * @exception Error Create connect to db fail
 */
async function updateInactiveCompany(companyId, company) {
  try {
    let oldCompany = await getCompanyByIdWithoutStatus(companyId);
    if (oldCompany == null) {
      return false;
    }
    company.updateTime = new Date();
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      await mongoService.updateDocument(
        collectionName,
        { _id: new mongoose.Types.ObjectId(companyId) },
        company
      );
    } else {
      await mongoService.updateDocument(
        collectionName,
        { _id: companyId },
        company
      );
    }

    return true;
  } catch (error) {
    throw new Error("Error updating company: " + error.message);
  }
}

/**
 * Delete Company by Id
 * @param {string} companyId The id of the company to delete
 * @returns {Promise<boolean>} true if the company has been deleted, false otherwise
 * @exception Error Create connect to db fail
 */
async function deleteCompany(companyId) {
  try {
    let company = await getCompanyById(companyId);
    if (company == null) {
      return false;
    }
    company.isDelete = true;
    company.updateTime = new Date();
    companyId = new mongoose.Types.ObjectId(companyId)
    return await updateCompany(companyId, company);
  } catch (error) {
    throw new Error("Error deleting company: " + error.message);
  }
}

/**
 * Get Company by dbName
 * @param {string} dbName The dbName of the company to get
 * @returns {Promise<*|null>}
 */
async function getCompanyByDbName(dbName) {
  try {
    const query = { dbName: dbName, isDelete: false, isActive: true };
    const company = await mongoService.findDocuments(collectionName, query);

    if (company) {
      return company[0];
    }

    return null;
  } catch (error) {
    throw new Error("Error getting company by dbName: " + error.message);
  }
}

async function isExistCompanyByDbName(dbName) {
  const company = await getCompanyByDbName(dbName);
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
}

function validateCompanyName(name) {
  const allowCharacters = /^[a-zA-Z0-9\s]+$/;
  return allowCharacters.test(name);
}
module.exports = {
  validateCompanyName,
  createCompany,
  getCompanyInactiveByUserId,
  getCompanyByIdWithoutStatus,
  getAllCompanies,
  isCompanyNameExist,
  getCompanyById,
  updateCompany,
  updateInactiveCompany,
  deleteCompany,
  getCompanyByUserId,
  getCompanyByDbName,
  isExistCompanyByDbName,
};
