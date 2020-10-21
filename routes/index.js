var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    const data = {
        data: [
            {
                msg: "Welcome to cars world"
            }
        ]
    };

    res.json(data);
});

module.exports = router;
