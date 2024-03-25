const { CompanyService } = require('../companyService');

async function getUserOdoo(dbName, userId, companyId, lang, password, master_pwd) {
    const company = await CompanyService.getCompanyById(companyId);


}