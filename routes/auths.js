
const express = require('express');
const router = express.Router();

const auth = require("../modules/auths.js");

router.post('/login', (req, res) => auth.login(res, req.body));
router.post('/register', (req, res) => auth.register(res, req.body));

module.exports = router;
