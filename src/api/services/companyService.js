import { CompanyProfile, CompanyProfileWithBase } from '../../models/profileCompanyModel';
import mongoService from '../services/mongoService';
const mongoose = require('mongoose'); // Import module mongoose

const collectionName = 'companies';

/**
 * Create a new company
 * @param {CompanyProfile} company The company to create
 * @returns 
 */
async function createCompany(company) {
    try {
        console.log('CreateCompany(company)', company);
        const isCompanyNameExist = await isCompanyNameExist(company.companyName);
        if (isCompanyNameExist) {
            return null;
        }
        let fullCompany = new CompanyProfileWithBase(company);
        fullCompany.passwordAdmin = await hashPassword(company.passwordAdmin);
        console.log(fullCompany.passwordAdmin);

        let result = await mongoService.insertDocuments(collectionName, [fullCompany]);
        return result;
    } catch (error) {
        throw new Error('Error creating company: ' + error.message);
    }
}

/**
 * Get All Companies from the database
 * @returns All the companies
 */
async function getAllCompanies() {
    try {
        const query = { isDelete: false, isActive: true };
        const companies = await mongoService.findDocuments(collectionName, query);
        return companies;
    } catch (error) {
        throw new Error('Error getting all companies: ' + error.message);
    }

}

/**
 * Check the Company Name is exist or not
 * @param {string} companyName The name of the company to check for existence
 * @returns true if the company name exists, false otherwise
 */
async function isCompanyNameExist(companyName) {
    try {
        const query = { companyName: companyName, isDelete: false, isActive: true };
        const companies = await mongoService.findDocuments(collectionName, query);

        if (companies !== null && companies.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error('Error checking company name: ' + error.message);
    }
}

module.exports = {
    createCompany,
    getAllCompanies
};