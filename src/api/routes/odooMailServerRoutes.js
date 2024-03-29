const express = require('express');
const odooMailServerController = require('../controllers/odooMailServerController');
const router = express.Router();

router.post('/set-up-outgoing-mail', odooMailServerController.setUpOutgoingMail); //Set up outgoing mail server

module.exports = router;