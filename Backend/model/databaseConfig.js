var mysql = require("mysql");

var dbConnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "sp_movie",
        });

        return conn;
    },
};
module.exports = dbConnect;
