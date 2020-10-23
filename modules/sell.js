const db = require("../db/database.js");
const depots = require("./depots");

const objects = require("./objects")

const sell = { 
    sellObjects: function(req, res) {

        if (!req.body.objectId || !req.body.price) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/objects/sell",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            })
        }

        // Check if object exist in users depot
        db.get("SELECT oid.amount, o.name, o.price, balance FROM depots " +
        "JOIN objects_in_depot AS oid ON depot_email = user_email " +
        "JOIN objects AS o ON o.rowid = oid.object_rowid " +
        "WHERE depot_email = ? AND oid.object_rowid = ?",
        req.user.email,
        req.body.objectId,
        (err, row) => {
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
                // If object exists in row
                if (row) {
                    let name = row.name;
                    let amount = row.amount;
                    let sellAmount = req.body.sellAmount;
                    let price = req.body.price;
                    let balance = row.balance;
                    // If there is enough object to sell
                    if (amount >= sellAmount) {
                        req.body.amount = amount - sellAmount;
                        // Calculate new amount
                        let sellPrice = (price * sellAmount);
                        let newBalance = balance + sellPrice;
                        req.body.balance = newBalance;
                        // Update balance in users depot
                        depots.updateBalance(req, res)
                        // Update amount of objects in users depot
                        objects.updateOid(req, res)
                        return res.json({
                            message: `Sold ${sellAmount} ${name} for ${sellPrice} kr.`
                        })
                    } else {
                        return res.json({
                            message: "Not enough objects"
                        })
                    }
                } else {
                    return res.json({
                        message: "Object doesn't exist in user depot"
                    })
                }

        })
    }

}

module.exports = sell;
