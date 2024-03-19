import {CompanyProfile, CompanyProfileWithBase} from '../../models/profileCompanyModel';
import mongoService from '../services/mongoService';
import {hashPassword} from "../../utils/passwordUtils";

const mongoose= require('mongoose'); // Import module mongoose

const collectionName = 'companies';

/**
 * Create a new company
 * @param {CompanyProfile} company The company to create
 * @returns {CompanyProfileWithBase || null || undefined} The company has been created
 * or null if the company name is exist
 * or undefined
 * @exception Error if the insert to database fail or create connect to db fail
 */
async function createCompany(company) {
    try {
        console.log('CreateCompany(company)', company);
        let isCompanyNameExist = await isCompanyNameExist(company.companyName);
        if (isCompanyNameExist) {
            return null;
        }
        let fullCompany = new CompanyProfileWithBase(company);
        fullCompany.passwordAdmin = await hashPassword(company.passwordAdmin);
        console.log(fullCompany.passwordAdmin);

        await mongoService.insertDocuments(collectionName, [fullCompany]);

        return fullCompany;
    } catch (error) {
        throw new Error('Error creating company: ' + error.message);
    }
}

/**
 * Get All Companies from the database
 * @returns {CompanyProfile[] || undefined} All the companies
 * @exception Error Create connect to db fail
 */
async function getAllCompanies() {
    try {
        const query = { isDelete: false, isActive: true };
        return await mongoService.findDocuments(collectionName, query);
    } catch (error) {
        throw new Error('Error getting all companies: ' + error.message);
    }

}

/**
 * Check the Company Name is exist or not
 * @param {string} companyName The name of the company to check for existence
 * @returns {boolean} true if the company name exists, false otherwise
 * @exception Error Create connect to db fail
 */
async function isCompanyNameExist(companyName) {
    try {
        const query = { companyName: companyName, isDelete: false, isActive: true };
        const companies = await mongoService.findDocuments(collectionName, query);

        //True if the company exist
        return companies !== null && companies.length > 0;

    } catch (error) {
        throw new Error('Error checking company name: ' + error.message);
    }
}

module.exports = {
    createCompany,
    getAllCompanies
};