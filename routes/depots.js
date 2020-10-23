const express = require('express');
const router = express.Router();

const auth = require("../modules/auths");
const depots = require("../modules/depots");

router.get("/view",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.view(res, req));

router.put("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.update(res, req));

module.exports = router;