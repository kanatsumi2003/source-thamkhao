//userid, subcriptionid, companyid (string), amount, startdate, enddate, ismonthly, response data (), gateway(link paypal (hookup, callback)), status (enum), note, phone, username, companyName, 

const BaseModel = require("./baseModel");

//1 api orderSubcription (id, monthly )
class transaction {
    constructor(userId, subcriptionId, companyId, amount, startDate, endDate, isMonthly, response_data, gateway, status, note, phone, username, companyName)
    {
        this.userId = userId,
        this.subcriptionId = subcriptionId,
        this.companyId = companyId,
        this.amount = amount,
        this.startDate = startDate,
        this.endDate = endDate,
        this.isMonthly = isMonthly,
        this.response_data = response_data,
        this.gateway = gateway,
        this.status = status,
        this.note = note,
        this.phone = phone,
        this.username = username,
        this.companyName = companyName
    }
}
class transactionWithBase extends BaseModel{
    constructor(transaction){
        super();
        Object.assign(this, transaction);
    };
}
module.exports = {
    transaction,
    transactionWithBase,
}