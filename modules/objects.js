const db = require("../db/database.js");

const objects = {
    // view all objects in database
    showAll: function(res, req) {
        db.all("SELECT * from objects",
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/objects",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                return res.status(200).json(rows);
        })
    },
    // View all users objects
    showUser: function(req, res) {
        db.all("SELECT * FROM objects_in_depot " +
        "WHERE depot_email = ?",
        req.user.email,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
                return res.status(200).json(rows);
        })
    },
    // Add new object to Objects_in_depot
    addOid: function(req, res) {
        db.run("INSERT INTO " +
        "objects_in_depot(object_rowid, depot_email, amount) " +
        "VALUES (?, ?, ?)",
        req.body.objectId,
        req.user.email,
        req.body.buyAmount,
        (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            return null
        })
    },
    // Update Objects_in_depot
    updateOid: function(req, res) {
        db.run("UPDATE objects_in_depot SET amount = ?" +
        "WHERE depot_email = ? and object_rowid = ?",
        req.body.amount,
        req.user.email,
        req.body.objectId,
        (err) => {
            if (err) {
                console.log("error")
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            return null;
        })
    }
    // Add new or update object to user

}

module.exports = objects;