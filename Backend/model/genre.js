var db = require("./databaseConfig.js");

module.exports = {
    // Endpoint 5: POST /genre
    addGenre: function(genre, description, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "insert into genre(genre, description) values(?, ?)";
                dbConn.query(sql, [genre, description], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[ADDGENRE] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDGENRE] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 6: GET /genre
    getGenre: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT * FROM genre;";
                dbConn.query(sql, (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETGENRE] Error!", error);
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    },
};