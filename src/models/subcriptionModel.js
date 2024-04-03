// //

const BaseModel = require("./baseModel");

// dbname domainname, startdate, enddate, total invoices, total storage// name, image, description, monthly prices, yearly price, total //sendemail
class Subcription {
    constructor(name, startDate, endDate, total_invoices, total_storage, image, description, monthly_prices, yearly_prices, total){
        this.name = name,
        this.dbName = dbName,
        this.domainName = domainName,
        this.startDate = startDate,
        this.endDate = endDate,
        this.total_invoices = total_invoices,
        this.total_storage = total_storage,
        this.image = image,
        this.description = description,
        this.monthly_prices = monthly_prices,
        this.yearly_prices = yearly_prices,
        this.total = total
    }
}
class SubCriptionWithBase extends BaseModel {
    constructor(subcription) {
        super();
        Object.assign(this, subcription);
    }
}

module.exports = {
    Subcription, 
    SubCriptionWithBase,
}