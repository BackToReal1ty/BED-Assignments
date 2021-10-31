// import dependancies
const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const verifyToken = require("../auth/isLoggedInMiddleware");

// import cors
const cors = require("cors");
app.options("*", cors());
app.use(cors());

// import multer for uploading/storing of image files (Additional Feature)
const multer = require("multer");

// set storage path and filemane for images (movies)
const storageMovieImg = multer.diskStorage({
    destination: "./upload/movieimg/",
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

// set storage path and filemane for images (user)
const storageUserImg = multer.diskStorage({
    destination: "./upload/userimg/",
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

// set filter for only .png and .jpeg files
const filterImg = (req, file, callback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        callback(null, true);
    } else {
        callback(new Error("Unsupported file received"), false);
    }
};

// allow image files to be uploaded
const uploadMovieImg = multer({
    storage: storageMovieImg,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: filterImg,
});

// allow image files to be uploaded
const uploadUserImg = multer({
    storage: storageUserImg,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: filterImg,
});

const userjs = require("../model/user.js");
const genrejs = require("../model/genre.js");
const moviejs = require("../model/movie.js");

app.use("/movie/photo", express.static("upload/movieimg")); //allow image files to be served on /movie/photo
app.use("/user/photo", express.static("upload/userimg")); //allow image files to be served on /movie/photo
app.use(express.json()); //parse json input
app.use(express.urlencoded({ extended: false })); //parse application/x-www-form-urlencoded

// Endpoint 1: POST /users
app.post("/users", function(req, res) {
    var { username, email, contact, password } = req.body;
    // call addUser from users.js to query sql database
    userjs.addUser(username, email, contact, password, function(err, result) {
        if (!err) {
            // send response with status code
            // res.status(201).json({userid: `${result.insertId}`}); old code
            res.status(201).header("Content-Type", "application/json").json({
                success: true,
                duplicate: false,
                status: "You have successfully signed up!",
            });
        } else if (err.errno == 1062) {
            // send status 422 if username already exists
            // res.status(422).json({Result: "Unprocessable Entity"}); old code
            res.status(422).header("Content-Type", "application/json").json({
                success: false,
                duplicate: true,
                status: "Sign up error, username or email/contact already in use!",
            });
        } else {
            // send error with status code
            // res.status(500).json({Result: "Internal Error"}); old code
            res.status(500).header("Content-Type", "application/json").json({
                success: false,
                duplicate: false,
                status: "Internal Server Error",
            });
        }
    });
});

// Endpoint 2: GET /users
app.get("/users", function(req, res) {
    // call getUser from user.js to query sql database
    userjs.getUser(function(err, result) {
        if (!err) {
            res.status(200).json(result); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 3: GET /users/:id
app.get("/users/:id", function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call getUserById from user.js to query sql database
    userjs.getUserById(id, function(err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(500).send();
            } else {
                res.status(200).send(result); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 4: PUT /users/:id
app.put("/users/:id", function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call updateUser from user.js to query sql database
    userjs.updateUser(req.body, id, function(err, attempted_illegal_change, content_updated) {
        if (!err) {
            if (attempted_illegal_change) {
                if (content_updated) {
                    res.status(204).send("Error, userid and created_at cannot be changed! Everything else has been updated.");
                } else {
                    res.status(200).send("Error, userid and created_at cannot be changed! No content was changed.");
                }
            } else {
                res.status(204).send("Success"); // send response with status code
            }
        } else if (err.errno == 1062) {
            res.status(422).send();
        } else {
            res.status(500).send(); // send error with status code
        }
    });
});

// Endpoint 5: POST /genre
app.post("/genre", verifyToken.checkAdmin, function(req, res) {
    var { genre, description } = req.body;
    // call addGenre from genre.js to query sql database
    genrejs.addGenre(genre, description, function(err, result) {
        if (!err) {
            res.status(204).send(); // send response with status code
        } else if (err.errno == 1062) {
            // send status 422 if username already exists
            res.status(422).json({ Result: "Unprocessable Entity" });
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 6: GET /genre
app.get("/genre", function(req, res) {
    // call getGenre from genre.js to query sql database
    genrejs.getGenre(function(err, result) {
        if (!err) {
            res.status(200).send(result); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 7: POST /movie
app.post("/movie", verifyToken.checkAdmin, function(req, res) {
    var { title, description, cast, genreid, time, opening_date } = req.body;
    // call addMovie from movie.js to query sql database
    moviejs.addMovie(title, description, cast, genreid, time, opening_date, function(err, result) {
        if (!err) {
            res.status(200).header("Content-Type", "application/json").json({
                success: true,
                movieid: result.insertId,
                status: "Movie successfully created!",
            });
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 8: GET /movie
app.get("/movie", function(req, res) {
    // call getMovie from movie.js to query sql database
    moviejs.getMovie(function(err, result) {
        if (!err) {
            res.status(200).send(result); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 9: GET /movie/:id
app.get("/movie/:id", function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call getMovieFromId from movie.js to query sql database
    moviejs.getMovieFromId(id, function(err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(500).send();
            } else {
                res.status(200).send(result); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 10: DELETE /movie/:id
app.delete("/movie/:id", verifyToken.checkAdmin, function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call deleteMovie from movie.js to query sql database
    moviejs.deleteMovie(id, function(err, result) {
        if (!err) {
            if (result.affectedRows == 0) {
                res.status(500).send();
            } else {
                res.status(204).send(); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 11: POST /movie/:id/review
app.post("/movie/:id/review", verifyToken.checkToken, function(req, res) {
    // verifyToken.checkToken,
    var id = req.params.id; // get id parameter from url
    var { userid, rating, review } = req.body;
    // call addReview from movie.js to query sql database
    moviejs.addReview(userid, rating, review, id, function(err, result) {
        if (!err) {
            res.status(201).json({ reviewid: `${result.insertId}` }); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Endpoint 12: GET /movie/:id/reviews
app.get("/movie/:id/reviews", function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call getReviews from movie.js to query sql database
    moviejs.getReviews(id, function(err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(500).send();
            } else {
                res.status(200).send(result); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Additional Feature (Timeslots): POST /movie/:id/timeslot
app.post("/movie/:id/timeslot", function(req, res) {
    var id = req.params.id; // get id parameter from url
    var { date, time_start, time_end } = req.body;
    // call addTimeslot from movie.js to query sql database
    moviejs.addTimeslot(date, time_start, time_end, id, function(err, result) {
        if (!err) {
            res.status(201).json({ timeslotid: `${result.insertId}` }); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Additional Feature (Timeslots): GET /movie/:id/timeslots
app.get("/movie/:id/timeslots", function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call getTimeslot from movie.js to query sql database
    moviejs.getTimeslot(id, function(err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(500).send();
            } else {
                res.status(200).send(result); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Additional Feature (Timeslots): DELETE /movie/timeslots/:id
app.delete("/movie/timeslots/:id", function(req, res) {
    var timeslotid = req.params.id; // get id parameter from url
    // call deleteTimeslot from movie.js to query sql database
    moviejs.deleteTimeslot(timeslotid, function(err, result) {
        if (!err) {
            if (result.affectedRows == 0) {
                res.status(500).send();
            } else {
                res.status(204).send(); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Additional Feature (Image uploading/storing): POST /movie/:id/photo
app.post("/movie/:id/photo", uploadMovieImg.single("poster"), function(req, res) {
    var movieid = req.params.id; // get id parameter from url
    var photoPath = req.file.filename;
    // call addPhoto from user.js to query sql database
    moviejs.addPhoto(photoPath, movieid, function(err, result) {
        if (!err) {
            res.status(204).json({
                "Image URL": `http://localhost:8081/movie/${movieid}/photo`,
            }); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Additional Feature (Image uploading/storing): GET /movie/:id/photo
app.get("/movie/:id/photo", function(req, res) {
    var movieid = req.params.id; // get id parameter from url
    // call getPhoto from user.js to query sql database
    moviejs.getPhoto(movieid, function(err, result) {
        if (!err) {
            res.status(200).json({
                "Image URL": `http://localhost:8081/movie/photo/${result[0].path}`,
            });
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Login User POST /login
app.post("/login", (req, res) => {
    var { username, password } = req.body;

    // call verifyUser from user.js to query sql database
    userjs.verifyUser(username, password, (err, user) => {
        // ensure that username and password matches
        if (err) {
            console.log(err);
            res.status(500).send();
            return;
        } else if (user === null) {
            res.status(401).send();
            return;
        } else {
            const payload = {
                userid: user.userid,
                username: user.username,
                type: user.type,
            };
            // Sign JWT Token
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: 600 }, (err, token) => {
                if (err) {
                    res.status(401).send();
                    return;
                } else {
                    res.status(200).header("Content-Type", "application/json").json({
                        success: true,
                        token: token,
                        status: "You are successfully logged in!",
                    });
                }
            });
        }
    });
});

// Image uploading/storing for user: POST /user/:id/photo
app.put("/user/:id/photo", uploadUserImg.single("photo"), function(req, res) {
    var userid = req.params.id; // get id parameter from url
    var photoPath = req.file.filename;
    // call addPhoto from user.js to query sql database
    userjs.addPhoto(photoPath, userid, function(err, result) {
        if (!err) {
            res.status(204).json({
                "Image URL": `http://localhost:8081/movie/${userid}/photo`,
            }); // send response with status code
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Image retrival for user: GET /movie/:id/photo
app.get("/user/:id/photo", function(req, res) {
    var userid = req.params.id; // get id parameter from url
    // call getPhoto from user.js to query sql database
    userjs.getPhoto(userid, function(err, result) {
        if (!err) {
            res.status(200).json({
                "Image URL": `http://localhost:8081/user/photo/${result[0].profile_pic_url}`,
            });
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Search movie by genre and/or title POST /search/movie
app.post("/search/movie", function(req, res) {
    moviejs.searchMovie(req.body, function(err, result) {
        if (!err) {
            res.status(200).header("Content-Type", "application/json").json(result);
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// Get list of all genres GET /genre
app.get("/genre", function(req, res) {
    moviejs.getGenre(function(err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

// delete genre DELETE /genre/:id
app.delete("/genre/:id", verifyToken.checkAdmin, function(req, res) {
    var id = req.params.id; // get id parameter from url
    // call deletGenre from movie.js to query sql database
    moviejs.deleteGenre(id, function(err, result) {
        if (!err) {
            if (result.affectedRows == 0) {
                res.status(500).send();
            } else {
                res.status(204).send(); // send response with status code
            }
        } else {
            res.status(500).json({ Result: "Internal Error" }); // send error with status code
        }
    });
});

app.all("*", function(req, res) {
    res.status(404).send();
});
module.exports = app;