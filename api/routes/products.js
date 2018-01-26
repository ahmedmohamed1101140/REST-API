const express = require("express");
const router = express.Router({mergeParams: true});
const Product = require("../models/product");
const mongoose = require("mongoose");


//get all products
router.get('/' ,function (req,res) {
    Product.find().select('name price _id').exec(function (err,Products) {
        if(err){
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
        else {
            console.log(Products);
            res.status(200).json({
                message: "all system Products",
                count: Products.length,
                Products: Products.map(function (Product) {
                    return{
                        _id: Product._id,
                        name: Product.name,
                        price: Product.price,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+ Product._id
                        }
                    }
                })
            });
        }
    });
});

//create new product
router.post('/',function (req,res) {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    Product.create(product,function (err,newlycreated) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else{
           console.log(newlycreated);
           res.status(201).json({
               message: "new Product Created",
               createdProduct: product,
               request: {
                   type: 'GET',
                   url: 'http://localhost:3000/products/'+ product._id
               }
           });
       }
    });
});

//get spescific product
router.get("/:productId",function (req,res) {
    const id = req.params.productId;
    Product.findById(id).select("name price _id").exec(function (err,foundProduct) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else {
           if(foundProduct){
               console.log(foundProduct);
               res.status(202).json({
                   message: "Here Is Your Product",
                   product: foundProduct
               });
           }
           else {
               res.status(404).json({
                   message: "no valid entry found for the provided ID"
               });
           }

       }
    });
});

//update product
router.patch("/:productId",function (req,res) {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });
    Product.findByIdAndUpdate(req.params.productId,product,function (err,updatedProduct) {
       if(err){
           res.status(500).json({
               error: err
           });
       }
       else{
         res.status(202).json({
             message: "Your Product Had Been Updated",
             product: updatedProduct
         });
       }
    });
});

//delete product
router.delete("/:productId",function (req,res) {
   Product.findByIdAndRemove(req.params.productId,function (err) {
       if(err){
           console.log(err);
           res.status(404).json({
               error:err
           });
       }
       else {
           res.status(202).json({
               message: "Product Deleted Successfully"
           });
       }
   });
});

module.exports = router;