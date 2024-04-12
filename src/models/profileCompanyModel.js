const BaseModel = require("./baseModel");

class CompanyProfile {
  constructor(
    companyName,
    address,
    phoneNumber,
    userNameAdmin,
    passwordAdmin,
    subscriptionId,
    userId,
    emailCompany,
    taxCompany,
    countryCode,
    imageCompany,
    dbName,
    domainName,
    startDateSubs,
    totalInvoices,
    totalProducts,
    totalStorageUse,
    invoiceUsage,
    endDateSubs
  ) {
    this.companyName = companyName; // Storing the company name
    this.address = address; // Storing the address
    this.phoneNumber = phoneNumber; // Storing the phone number
    this.userNameAdmin = userNameAdmin; // Storing the admin's username
    this.passwordAdmin = passwordAdmin; // Storing the admin's password
    this.subscriptionId = subscriptionId; // Storing the subscription ID
    this.userId = userId; // Storing the user ID associated with the company
    this.emailCompany = emailCompany.toLowerCase(); // Storing the company email in lowercase
    this.taxCompany = taxCompany; // Storing the company's tax information
    this.countryCode = countryCode; // Storing the country code
    this.imageCompany = imageCompany; // Storing the company's image
    this.dbName = dbName; // Storing the database name// not exited
    this.domainName = domainName; // Storing the domain name
    this.startDateSubs = startDateSubs; // Storing the start date of the subscription
    this.endDateSubs = endDateSubs;
    this.totalInvoices = totalInvoices; // Storing the total number of invoices
    this.totalProducts = totalProducts; // Storing the total number of products
    this.totalStorageUse = totalStorageUse; // Storing the total storage used
    this.invoiceUsage = invoiceUsage;
    this.apiKey = null; // API Key for third-party services (odoo)
  }
}

class CompanyProfileWithBase extends BaseModel {
  constructor(profile) {
    super();
    Object.assign(this, profile);
  }
}

module.exports = { CompanyProfile, CompanyProfileWithBase };
