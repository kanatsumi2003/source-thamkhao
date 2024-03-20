const {CompanyProfile, CompanyProfileWithBase} = require('../../models/profileCompanyModel');
const companyService = require("../services/companyService");

async function createCompany(req, res) {
    try {
        console.log(res.body);
        const companyNameDomain = req.body.companyName
            .toLowerCase()
            .replace(' ', '');

        const company = new CompanyProfile(req.body.companyName
            , req.body.address
            , req.body.phoneNumber
            , req.body.userNameAdmin
            , req.body.passwordAdmin
            , req.body.subscriptionId // may be null
            , req.body.userId
            , req.body.emailCompany
            , req.body.taxCompany
            , req.body.countryCode
            , req.body.imageCompany
            , companyNameDomain // db name
            , companyNameDomain // domain name
            , req.body.startDateSubs // start date may be null
            , 0
            , 0
            , 0
        );

        const result = await companyService.createCompany(company);

        if (result === null)
            res.status(400).json({message: `Company với tên ${company.companyName} đã tồn tại`});

        const companyData = {...result};
        delete companyData.passwordAdmin;

        res.status(201).json({message: 'Company created', data: companyData});
    } catch (error) {
        res.status(500).json({message: 'Error creating company', error});
    }

}

module.exports = {
    createCompany
}