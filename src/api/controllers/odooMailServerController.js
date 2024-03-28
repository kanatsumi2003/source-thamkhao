const odooMailService = require("../services/odooService/odooMailServerService");


async function setUpOutgoingMail(req, res) {
    // #swagger.description = 'Use to request all posts'
    // #swagger.tags = ["MailServer"]
    try {
        const {dbname, email, password, name, isDefault = true} = req.body;
        const {message, isSuccess, data} = await odooMailService
            .setUpOutGoingMail(dbname, email, password, name, isDefault);
        if (isSuccess) {
            res.status(201).json({message, data});
        } else {
            res.status(400).json({message, data});
        }
    } catch (error) {
        res.status(500).json({message: "Error at set up outgoing mail", error});
    }
}

module.exports = {
    setUpOutgoingMail
}