const odooDatabaseService = require("../api/services/odooService/odooDatabaseServices");
const dnsService = require("../api/services/dnsServices");
const companyService = require("../api/services/companyService");
const stringUtil = require("../utils/stringUtil");
const odooModuleService = require("../api/services/odooService/odooModuleService");
const { sendMail } = require("./emailUtil");
require("dotenv").config();

const CONTENT_RECORD = process.env.CONTENT_RECORD;
const ZONE_ID = process.env.ZONE_ID;
const TYPE_RECORD = process.env.TYPE_RECORD;
const ROOT_SERVER_DOMAIN_NAME = process.env.ROOT_SERVER_DOMAIN_NAME;
const LANG = "us";

async function createOdooAndDNS(msg) {
  //get company => companyid trong mongo
  try {
    console.log(msg.content.toString());
    const message = JSON.parse(msg.content);
    console.log(message);
    const userId = message.userId;
    const companyId = message.companyId;
    const company = await companyService.getCompanyByIdWithoutStatus(companyId); //check ìf co hay k
    //kiem tra exist chua
    if (company == null) throw new Error("This user has not created Company");
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
    const check = await dnsService.findDnsRecordByName(ZONE_ID, postData.name);
    //kiem tra xem có record nào trùng hay không
    if (check != 0) {
      postData.name = stringUtil.generateSubdomain(company.companyName);
    }
    const recordReturnResult = await dnsService.createDnsRecord(
      ZONE_ID,
      postData
    );
    await new Promise((resolve) => setTimeout(resolve, 10000)); //thread sleep 5s

    //neu domain exist => tao 1 domain mới => update dbname, domainname
    //nếu create dns (domain name mới != domain db cũ) success  = > update comapany dns name và dbname theo dns mới
    if (!recordReturnResult.error) {
      company.domainName = postData.name;
      company.dbName = company.domainName;
    } else throw new Error("Cannot create new record, error: ");
    //ra lỗi return về luôn
    const odooDBPassword = stringUtil.generatePassword();
    const dbData = {
      name: company.dbName,
      lang: `${LANG}`,
      password: odooDBPassword,
      login: company.emailCompany,
      phone: company.phoneNumber,
    };
    console.log("Create db");
    const dbReturnResult = await odooDatabaseService.createOdooDatabase(dbData);
    //nếu lỗi => xóa dns mới tạo
    if (dbReturnResult.error) {
      console.log(dbReturnResult.error);
      let deleteValue = recordReturnResult.id;
      await dnsService.deleteDnsRecord(ZONE_ID, deleteValue);
    } else {
      company.isActive = true;
      company.apiKey = dbReturnResult.data.data.api_key;
      await companyService.updateInactiveCompany(company._id, company);
      const mailData = {
        domainName: `https://${company.domainName}.${ROOT_SERVER_DOMAIN_NAME}`,
        companyName: company.companyName,
        login: company.emailCompany,
        password: odooDBPassword,
      };
      await sendMail(
        company.emailCompany,
        "Create company notification",
        mailData,
        "createCompanySuccessTemplate.ejs"
      );
    }
    //nếu create db odoo thành công => update company isactive = true
  } catch (error) {
    console.log(error.message);
  }
  //tạo dns
  //gắn subdomain cho odoo đê tạo db
  //cập nhật apikeycompany
}
async function activeOdooModule(msg) {
  try {
    const message = JSON.parse(msg.content);
    const { dbName, moduleId } = message;
    const company = await companyService.getCompanyByDbName(dbName);
    if (company == null) throw new Error("Company is not exist");
    const data = {
      dbName: dbName,
      moduleId: moduleId,
    };
    const result = await odooModuleService.activateModule(data);
    if (!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail(
        company.emailCompany,
        "Active module notification",
        mailData,
        "activeOdooModuleTemplate.ejs"
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
async function deactiveOdooModule(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName, moduleId} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
      moduleId: moduleId,
    };

    const result = await odooModuleService.deactivateModule(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail (
        company.emailCompany,
        "Deactive module notification",
        mailData,
        "deactiveOdooModuleTemplate.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
async function upgradeOdooModule(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName, moduleId} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
      moduleId: moduleId,
    };

    const result = await odooModuleService.upgradeModule(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail (
        company.emailCompany,
        "Upgrade module notification",
        mailData,
        "upgradeOdooModuleTemplate.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
async function duplicateOdooDatabase(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName, newDbName} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
      newDbName: newDbName,
    };

    const result = await odooDatabaseService.duplicateOdooDatabase(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
        newDbName: newDbName,
      };
      await sendMail (
        company.emailCompany,
        "Duplicate database notification",
        mailData,
        "duplicateDatabasesTemplate.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
async function stopOdooDatabase(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
    };

    const result = await odooDatabaseService.stopDatabase(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail (
        company.companyName,
        "Stop database notification",
        mailData,
        "stopDatabaseTemplate.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
async function startOdooDatabaseAgain(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
    };

    const result = await odooDatabaseService.startDatabaseAgain(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail (
        company.companyName,
        "Restore database notification",
        mailData,
        "startOdooDatabaseAgainTemplate.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
async function changeOdooDBPassword(msg) {
  try {
    const message = JSON.parse(msg.content);
    const {dbName, newPassword} = message;
    const company = await companyService.isExistCompanyByDbName(dbName);
    
    const data = {
      dbName: dbName,
      newPassword: newPassword,
    };

    const result = await odooDatabaseService.changeDBPassword(data);
    if(!result.error) {
      const mailData = {
        companyName: company.companyName,
      };
      await sendMail (
        company.companyName,
        "Restore database notification",
        mailData,
        "changeOdooDBPassword.ejs"
      )
    };
     
  } catch (error) {
    throw new Error(error.message)
  }
}
module.exports = {
  changeOdooDBPassword,
  startOdooDatabaseAgain,
  stopOdooDatabase,
  duplicateOdooDatabase,
  upgradeOdooModule,
  deactiveOdooModule,
  activeOdooModule,
  createOdooAndDNS,
};
