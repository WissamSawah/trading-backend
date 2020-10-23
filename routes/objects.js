const express = require('express');
const router = express.Router();

const auth = require("../modules/auths");
const objects = require("../modules/objects");
const sellObject = require("../modules/sell");
const buyObject = require("../modules/buy");





router.get("/view",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.showAll(res, req));

router.post("/viewUser",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.showUser(req, res));

router.post("/buy",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => buyObject.buy(req, res));

router.post("/sell",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => sellObject.sellObjects(req, res));

router.put("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.update(res, req));

module.exports = router;