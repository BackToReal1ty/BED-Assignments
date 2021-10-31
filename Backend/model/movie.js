var db = require("./databaseConfig.js");

module.exports = {
    // Endpoint 7: POST /movie
    addMovie: function(title, description, cast, genreid, time, opening_date, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err)
                return callback(err, null);
            } else {
                var sql = "insert into movie(title, description, cast, time, opening_date) values(?, ?, ?, ?, ?)";
                dbConn.query(sql, [title, description, cast, time, opening_date], (error, results) => {
                    genreid = genreid.split(",")
                    for (var i = 0 in genreid) {
                        sql = "INSERT INTO gmkey(genreid, movieid) values(?, ?)";
                        dbConn.query(sql, [parseInt(genreid[i]), results.insertId]);
                    }

                    if (error) {
                        console.log("[ADDMOVIE] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDMOVIE] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 8: GET /movie
    getMovie: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                // const sql = "SELECT * FROM movie;"; old code
                const sql = "SELECT movie.*, photo.path, COUNT(review.rating) AS reviews, AVG(review.rating) AS average FROM movie INNER JOIN photo ON (movie.movieid = photo.movieid) LEFT JOIN review ON (photo.movieid = review.movieid)  GROUP BY movieid ORDER BY average DESC";
                dbConn.query(sql, (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETMOVIE] Error!", error);
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 9: GET /movie/:id
    getMovieFromId: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "SELECT movie.*, group_concat(genre.genre) AS genres, photo.path, ( SELECT COUNT(*) FROM review WHERE movie.movieid = review.movieid) AS reviews, ( SELECT AVG(rating) FROM review WHERE movie.movieid = review.movieid) AS average FROM movie INNER JOIN gmkey ON movie.movieid = gmkey.movieid   INNER JOIN genre ON gmkey.genreid = genre.genreid INNER JOIN photo ON photo.movieid = movie.movieid  WHERE movie.movieid = ? GROUP BY movieid";
                dbConn.query(sql, [movieid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETMOVIE] Error!", error);
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 10: DELETE /movie/:id
    deleteMovie: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "DELETE FROM movie WHERE movieid = ?";
                dbConn.query(sql, [movieid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        console.log("[DELETEMOVIE] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[DELETEMOVIE] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 11: POST /movie/:id/review
    addReview: function(userid, rating, review, id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "insert into review(userid, movieid, rating, review) values(?, ?, ?, ?)";
                dbConn.query(sql, [userid, id, rating, review], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[ADDREVIEW] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDREVIEW] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 12: GET /movie/:id/reviews
    getReviews: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "SELECT review.movieid, review.userid, user.username, user.profile_pic_url, review.rating, review.review, review.created_at FROM review INNER JOIN user ON review.userid=user.userid WHERE review.movieid = ?; ";
                dbConn.query(sql, [movieid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETREVIEWS] Error!", error);
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Additional Feature (Timeslots): POST /movie/:id/timeslot
    addTimeslot: function(date, time_start, time_end, movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "insert into timeslot(movieid, date, time_start, time_end) values(?, ?, ?, ?)";
                dbConn.query(sql, [movieid, date, time_start, time_end], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[ADDTIMESLOT] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[ADDTIMESLOT] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Additional Feature (Timeslots): GET /movie/:id/timeslots
    getTimeslot: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "SELECT movie.title, timeslot.date, timeslot.time_start, timeslot.time_end FROM timeslot INNER JOIN movie ON timeslot.movieid=movie.movieid WHERE timeslot.movieid = ?; ";
                dbConn.query(sql, [movieid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log("[GETTIMESLOT] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[GETTIMESLOT] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Additional Feature (Timeslots): DELETE /movie/timeslots/:id
    deleteTimeslot: function(timeslotid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "DELETE FROM timeslot WHERE timeslotid = ?";
                dbConn.query(sql, [timeslotid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        console.log("[DELETETIMESLOT] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[DELETETIMESLOT] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },

    // Additional Feature (Image uploading/storing): POST /movie/:id/photo
    addPhoto: function(photoPath, movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "insert into photo(movieid, path) values(?, ?)";
                dbConn.query(sql, [movieid, photoPath], (error, results) => {
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

    // Additional Feature (Image uploading/storing): GET /movie/:id/photo
    getPhoto: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT path FROM photo WHERE movieid = ?";
                dbConn.query(sql, [movieid], (error, results) => {
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

    // Search movie by title and/or genre
    searchMovie: function(search, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                if (search.genre == "null" && search.title != "null") {
                    const sql = "SELECT movie.*, group_concat(genre.genre) AS genres, photo.path, ( SELECT COUNT(*) FROM review WHERE movie.movieid = review.movieid) AS reviews, ( SELECT AVG(rating) FROM review WHERE movie.movieid = review.movieid) AS average FROM movie INNER JOIN gmkey ON movie.movieid = gmkey.movieid  INNER JOIN genre ON gmkey.genreid = genre.genreid INNER JOIN photo ON photo.movieid = movie.movieid WHERE movie.title LIKE ? GROUP BY movieid";
                    dbConn.query(sql, [`%${search.title}%`], (error, results) => {
                        dbConn.end();
                        if (error) {
                            console.log("[SEARCHMOVIE] Error!", error);
                            return callback(error, null);
                        } else {
                            console.log("[SEARCHMOVIE] Success!");
                            return callback(null, results);
                        }
                    });
                } else if (search.genre != "null" && search.title == "null") {
                    const sql = "SELECT movie.*, group_concat(genre.genre) AS genres, photo.path, ( SELECT COUNT(*) FROM review WHERE movie.movieid = review.movieid) AS reviews, ( SELECT AVG(rating) FROM review WHERE movie.movieid = review.movieid) AS average FROM movie INNER JOIN gmkey ON movie.movieid = gmkey.movieid  INNER JOIN genre ON gmkey.genreid = genre.genreid INNER JOIN photo ON photo.movieid = movie.movieid WHERE genre.genre LIKE ? GROUP BY movieid";
                    dbConn.query(sql, [`%${search.genre}%`], (error, results) => {
                        dbConn.end();
                        if (error) {
                            console.log("[SEARCHMOVIE] Error!", error);
                            return callback(error, null);
                        } else {
                            console.log("[SEARCHMOVIE] Success!");
                            return callback(null, results);
                        }
                    });
                } else if (search.genre != "null" && search.title != "null") {
                    const sql = "SELECT movie.*, group_concat(genre.genre) AS genres, photo.path, ( SELECT COUNT(*) FROM review WHERE movie.movieid = review.movieid) AS reviews, ( SELECT AVG(rating) FROM review WHERE movie.movieid = review.movieid) AS average FROM movie INNER JOIN gmkey ON movie.movieid = gmkey.movieid  INNER JOIN genre ON gmkey.genreid = genre.genreid INNER JOIN photo ON photo.movieid = movie.movieid WHERE movie.title LIKE ? AND genre.genre LIKE ? GROUP BY movieid";
                    dbConn.query(sql, [`%${search.title}%`, `%${search.genre}%`], (error, results) => {
                        dbConn.end();
                        if (error) {
                            console.log("[SEARCHMOVIE] Error!", error);
                            return callback(error, null);
                        } else {
                            console.log("[SEARCHMOVIE] Success!");
                            return callback(null, results);
                        }
                    });
                } else {
                    console.log("[SEARCHMOVIE] No query found!");
                    return callback(null, null);
                }

            }
        });
    },

    // Get list of all genres
    getGenre: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql = "SELECT genre FROM genre";
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

    // delete genre
    deleteGenre: function(movieid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = "DELETE FROM genre WHERE genreid = ?";
                dbConn.query(sql, [movieid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        console.log("[DELETEMOVIE] Error!", error);
                        return callback(error, null);
                    } else {
                        console.log("[DELETEMOVIE] Success!");
                        return callback(null, results);
                    }
                });
            }
        });
    },


};