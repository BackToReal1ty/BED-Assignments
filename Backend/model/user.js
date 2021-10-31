var db = require("./databaseConfig.js");

module.exports = {
    // Endpoint 1: POST /users
    addUser: function(username, email, contact, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                console.log("[ADDUSER] Connected!");
                const sql = "insert into user(username, email, contact, password) values(?, ?, ?, ?)";
                dbConn.query(sql, [username, email, contact, password], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[ADDUSER] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDUSER] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 2: GET /users
    getUser: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user;";
                dbConn.query(sql, (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETUSER] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[GETUSER] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 3: GET /users/:id
    getUserById: function(userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user WHERE userid = ?;";
                dbConn.query(sql, [userid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETUSERBYID] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[GETUSERBYID] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 4: PUT /users/:id
    updateUser: function(update, userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            var attempted_illegal_change = false;
            var content_updated = false;
            if (err) {
                return callback(err, null);
            } else {
                // convert parsed content from client into JSON object
                update = JSON.parse(JSON.stringify(update));

                // ensure that userid and created_at cannot be updated
                switch (true) {
                    case update["userid"] != undefined:
                        delete update["userid"];
                        attempted_illegal_change = true;
                        break;
                    case update["created_at"] != undefined:
                        delete update["created_at"];
                        attempted_illegal_change = true;
                        break;
                }

                if (JSON.stringify(update) != "{}") {
                    // dynamic update of row according to data parsed in
                    const sql =
                        "UPDATE user SET " +
                        Object.keys(update)
                        .map((key) => `${key} = ?`)
                        .join(", ") +
                        " WHERE userid = ?";
                    dbConn.query(sql, [...Object.values(update), userid], (error) => {
                        dbConn.end();
                        if (error) {
                            console.log("[UPDATEUSER] Error!", error);
                            return callback(error, null);
                        } else {
                            content_updated = true;
                            console.log("[UPDATEUSER] Success!");
                            return callback(null, attempted_illegal_change, content_updated);
                        }
                    });
                } else {
                    return callback(null, attempted_illegal_change, content_updated);
                }
            }
        });
    },

    // verify user
    verifyUser: function(userDetail, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const query = "SELECT userid, username, type FROM user WHERE (username=? OR email=?) AND password=?";
                dbConn.query(query, [userDetail, userDetail, password], (error, results) => {
                    if (error) {
                        return callback(error, null);
                    } else if (results.length === 0) {
                        console.log("[VERIFYUSER] Error! Username and password do not match!");
                        return callback(null, null);
                    } else {
                        const userDetailsForToken = results[0];
                        return callback(null, userDetailsForToken);
                    }
                });
            }
        });
    },

    // Image uploading/storing for user: POST /user/:id/photo
    addPhoto: function(photoPath, userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "UPDATE user SET profile_pic_url = ? WHERE userid = ?";
                dbConn.query(sql, [photoPath, userid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[ADDPHOTO] Success!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDPHOTO] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Image uploading/storing for user: GET /user/:id/photo
    getPhoto: function(userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT profile_pic_url FROM user WHERE userid = ?";
                dbConn.query(sql, [userid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETPHOTO] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[GETPHOTO] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },
};