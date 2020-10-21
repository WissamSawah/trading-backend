const db = require("../db/database.js");
const jwt = require('jsonwebtoken');
const jwtSecret = "averylongpassword";

const depots = {
        showDepot: function(res, body, token) {
            const auth_data = jwt.verify(token, jwtSecret);
            const email = auth_data.email;
            var depot_data = [];

            db.each("SELECT u.id as user_id, u.name as username, d.balance, d.id as depot_id, item_id, number_of_items, o.name as objname, o.current_price " +
            "FROM users u " +
            "LEFT JOIN depots d ON u.id = d.user_id " +
            "LEFT JOIN items_in_depot oid ON d.id = oid.depot_id " +
            "LEFT JOIN items o ON o.id = oid.item_id " +
            "WHERE u.email = ?;",
            email,
            function(err, row) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/depots/show-depot",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                depot_data.push({user_id: row.user_id, username: row.username, balance: row.balance, item_id: row.item_id,
                number_of_items: row.number_of_items, objname: row.objname, current_price: row.current_price});
            }, function() {
                // console.log(depot_contents);
                    return res.json({ data: depot_data });
            });
        },
        addFunds: function(res, body, token) {
        const auth_data = jwt.verify(token, jwtSecret);
        const email = auth_data.email;
        const funds = body.funds;

        db.get("SELECT u.id as user_id, d.balance, d.id as depot_id " +
            "FROM users u " +
            "LEFT JOIN depots d ON u.id = d.user_id " +
            "WHERE u.email = ?;",
            email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/depots/add-funds",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                // console.log(rows);
                if (rows.depot_id !== null) {
                    const new_balance = parseInt(funds) + parseInt(rows.balance);

                    db.get("UPDATE depots SET balance = ? WHERE id = ?",
                    new_balance,
                    rows.depot_id,
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    source: "/depots/add-funds",
                                    title: "Database error",
                                    detail: err.message
                                }
                            });
                        } else {
                            return res.status(201).json({
                                data: {
                                    new_balance: new_balance,
                                    message: funds + " has been added to your balance. Your new balance is " + new_balance
                                }
                            });
                        }
                    });
                } else {
                    // Depot doesnt exist, create it
                    const new_balance = parseInt(funds);

                    db.get("INSERT INTO depots (balance, user_id) VALUES (?,?)",
                    new_balance,
                    rows.user_id,
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    source: "/depots/add-funds",
                                    title: "Database error",
                                    detail: err.message
                                }
                            });
                        } else {
                            return res.status(201).json({
                                data: {
                                    new_balance: new_balance,
                                    message: funds + " has been added to your balance. Your new balance is " + new_balance
                                }
                            });
                        }
                    });
                }
            }
        );
    }
}
module.exports = depots;
