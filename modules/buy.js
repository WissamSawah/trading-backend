const db = require("../db/database.js");
const depots = require("./depots");

const objects = require("./objects")

const buyObjects = {
    buy: function(req, res) {

        if (!req.body.objectId || !req.body.price) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/objects/buy",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            })
        }
        db.get("SELECT oid.amount, o.price, o.name, balance FROM depots " +
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
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            // If the object already exist
            if (row) {
                let name = row.name;
                let oldAmount = row.amount;
                let buyAmount = req.body.buyAmount;
                let price = req.body.price;
                let newAmount = parseInt(oldAmount) + parseInt(buyAmount);
                // How much it will cost
                let objectPrice = buyAmount * price

                // If there is enough balance in depot
                if (row.balance >= objectPrice) {
                    req.body.balance = row.balance - objectPrice
                    req.body.amount = newAmount
                    depots.updateBalance(req, res)
                    objects.updateOid(req, res)
                    return res.status(200).json({
                        message: `You have bought ${buyAmount} ${name} stock/s for ${objectPrice} kr.`
                    })
                } else {
                    return res.json({
                    message: "Not enough balance"
                })}
            } else {
                db.get("SELECT balance, " +
                "(SELECT price FROM objects WHERE rowid = ?) AS price, " +
                "(SELECT name FROM objects WHERE rowid = ?) AS name " +
                "FROM depots WHERE user_email = ?",
                req.body.objectId,
                req.body.objectId,
                req.user.email,
                    (err, row) => {
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
                        let balance = row.balance;
                        let buyAmount = req.body.buyAmount;
                        let price = req.body.price;
                        let name = row.name;
                        // How much it will cost
                        let objectPrice = buyAmount * price;
                        // If there is enough balance
                        if (balance >= objectPrice) {
                            // Add new balance to body
                            req.body.balance = balance - objectPrice
                            // Run an update on deposit balance for user
                            depots.updateBalance(req, res)
                            // Insert the object in depot
                            objects.addOid(req, res)

                            return res.json({
                                message: `You have bought ${buyAmount} ${name} stock/s for ${objectPrice} kr.`
                            })

                        // Not enough balance
                        } else {
                            return res.json({
                                message: "Not enough balance"
                            })
                        }
                    }
                )
            }
        }
    )}

}

module.exports = buyObjects;
