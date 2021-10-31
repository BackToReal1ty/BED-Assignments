const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile("/views/index.html", { root: __dirname });
});

app.get("/movie/", (req, res) => {
    res.sendFile("/views/moviesingle.html", { root: __dirname });
});

app.get("/search/", (req, res) => {
    res.sendFile("/views/search.html", { root: __dirname });
});

const PORT = 3031;
app.listen(PORT, () => {
    console.log(`Client server has started listening on port ${PORT}`);
});

// 404 page
app.all("*", function(req, res) {
    res.sendFile("/views/404.html", { root: __dirname });
});