//App Packages
const express = require("express");
const app = express();
const morgan = require("morgan");
const parser = require("body-parser");
const mongoose = require("mongoose");


//App Routes
const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');
const userRoute = require('./api/routes/users');

// set up the mongodb
var url = "mongodb://localhost/shop_app";
// var url ="mongodb://ahmed11011:ahmed3684723@node-rest-shop-shard-00-00-ykqwx.mongodb.net:27017,node-rest-shop-shard-00-01-ykqwx.mongodb.net:27017,node-rest-shop-shard-00-02-ykqwx.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin"
mongoose.connect(url,{useMongoClient:true});
//solving DeprecationWarning: Mongoose: mpromise
mongoose.Promise = global.Promise;


//Server Setup
app.use(morgan('dev'));
app.use("/uploads",express.static('uploads'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());


//CORS Headers For security issues
app.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use("/products",productRoute);
app.use("/orders",orderRoute);
app.use("/user",userRoute);

//normal errors handling
app.use(function (req,res,next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//custom app error handling
app.use(function (error,req,res,next) {
   res.status(error.status || 500);
   res.json({
       error:{
           message: error.message
       }
   });
});

module.exports = app;