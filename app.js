const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const auth = require('./routes/auths');
const depots = require('./routes/depots');
const objects = require('./routes/objects');
const stock = require("./stock");


// Config with environment variables
require('dotenv').config();

const port = 1337;

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/auth', auth);
app.use('/depots', depots);
app.use('/objects', objects);


app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message,
                "detail": err.message
            }
        ]
    });
});

var apple = {
    name: "Apple",
    data: [],
    range: {
        min: 440,
        max: 500
    }
};

var samsung = {
    name: "Samsung",
    data: [],
    range: {
        min: 100,
        max: 200,
    }
};

var nasdaq = {
    name: "Nasdaq",
    data: [],
    range: {
        min: 300,
        max: 500,
    }
};

var stockObjects = [apple, samsung, nasdaq];


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function () {
    if (apple.data.length > 50 || samsung.data.length > 50) {
        apple.data = apple.data.slice(apple.data.length - 20, apple.data.length);
        samsung.data = samsung.data.slice(samsung.data.length - 20, samsung.data.length);
        nasdaq.data = nasdaq.data.slice(nasdaq.data.length - 20, nasdaq.data.length);
    }
    stockObjects.map((obj) => {
        obj.data = stock.getNewSeries(obj.data, new Date().getTime(), obj.range
        );
        return obj;
    });

    io.emit("stocks", stockObjects);
}, 5000);

// Start up server
const server = http.listen(port, () => console.log('Server listening on port ' + port));

module.exports = server;
