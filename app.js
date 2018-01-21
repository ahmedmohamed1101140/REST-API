const express = require("express");
const app = express();

app.use(function(req,res,next) {
    res.status(200).json({
        message: "it works"
    });
});

module.exports = app;