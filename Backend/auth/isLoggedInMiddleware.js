const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
module.exports = {
    checkToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
            console.log("not logged in");
            res.status(401).send();
            return;
        }
        const token = authHeader.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
            if (error) {
                console.log(error);
                res.status(401).send();
                return;
            }
            req.decodedToken = decodedToken;
            next();
        });
    },

    checkAdmin: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
            console.log("Not logged in");
            res.status(401).send();
            return;
        }
        const token = authHeader.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
            req.decodedToken = decodedToken;
            if (error) {
                console.log(error);
                res.status(401).send();
                return;
            } else if (decodedToken.type != "admin") {
                console.log("Forbidden access");
                res.status(401).send();
                return;
            }
            next();
        });
    },
};