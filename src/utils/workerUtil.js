const odooDatabaseService = require("../api/services/odooService/odooDatabaseServices");
const dnsService = require("../api/services/dnsServices");
const companyService = require("../api/services/companyService");
const stringUtil = require("../utils/stringUtil");

require("dotenv").config();

const CONTENT_RECORD = process.env.CONTENT_RECORD;
const ZONE_ID = process.env.ZONE_ID;
const TYPE_RECORD = process.env.TYPE_RECORD;
const LANG = "us";


async function createOdooAndDNS(msg) {
    //get company => companyid trong mongo
    try {
        console.log(msg.content.toString());
        const message = JSON.parse(msg.content);
        console.log(message);
        const userId = message.userId;
        const companyId = message.companyId;
        const company = await companyService.getCompanyByIdWithoutStatus(
          companyId
        ); //check ìf co hay k
        //kiem tra exist chua
        if (company == null)
          throw new Error("This user has not created Company");
        //company chua duoc tao
        //tồn tại check isactive company == true thì trả về
        else if (company.isActive === true)
          throw new Error("This company is already active");
        //create
        const postData = {
          type: `${TYPE_RECORD}`,
          name: `${company.domainName}`,
          content: `${CONTENT_RECORD}`,
        };
        const check = await dnsService.findDnsRecordByName(
          ZONE_ID,
          postData.name
        );
        //kiem tra xem có record nào trùng hay không
        if (check != 0 && !check.error) {
          postData.name = stringUtil.generateRandomDigits(company.domainName);
        }
        const recordReturnResult = await dnsService.createDnsRecord(
          ZONE_ID,
          postData
        );
        //neu domain exist => tao 1 domain mới => update dbname, domainname
        //nếu create dns (domain name mới != domain db cũ) success  = > update comapany dns name và dbname theo dns mới
        if (!recordReturnResult.error) {
          company.domainName = postData.name;
          company.dbName = company.domainName;
        } else throw new Error("Cannot create new record, error: ");
        //ra lỗi return về luôn
        const dbData = {
          name: company.dbName,
          lang: `${LANG}`,
          password: message.userPassword,
          login: company.emailCompany,
          phone: company.phoneNumber,
        };
        const dbReturnResult = await odooDatabaseService.createOdooDatabase(
          dbData
        );
        //nếu lỗi => xóa dns mới tạo
        if (dbReturnResult.error) {
          let deleteValue = recordReturnResult.id;
          await dnsService.deleteDnsRecord(ZONE_ID, deleteValue);
        } else {
          company.isActive = true;
          company.apiKey = dbReturnResult.data.data.api_key;
          await companyService.updateInactiveCompany(company._id, company);
        }
        //nếu create db odoo thành công => update company isactive = true
      } catch (error) {
        console.log(error.message);
      }
      //tạo dns
      //gắn subdomain cho odoo đê tạo db
      //cập nhật apikeycompany
}
module.exports = {
    createOdooAndDNS,
}