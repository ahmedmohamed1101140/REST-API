const express = require("express");
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

router.get('/',function (req,res) {
    Order.find().select("product quantity _id").populate("product").exec(function (err,orders) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else {
           res.status(200).json({
               message: "All Orders",
               count: orders.length,
               Orders: orders.map(function (order) {
                   return{
                       _id: order._id,
                       product: order.product,
                       quantity: order.quantity,
                       request: {
                           type: 'GET',
                           url: 'http://localhost:3000/orders/'+ order._id
                       }
                   }
               })
           })
       }
    });
});

router.post('/',function (req,res) {
    Product.findById((req.body.productId),function (err,foundproduct) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else if(foundproduct){
           var order = {
               _id: mongoose.Types.ObjectId(),
               quantity: req.body.quantity,
               product: req.body.productId
           };
           Order.create(order,function (err,newlycreated) {
               if(err){
                   console.log(err);
                   res.status(500).json({
                       error: err
                   });
               }
               else{
                   console.log(newlycreated);
                   res.status(201).json({
                       message: "Your Order Created Successfully",
                       createdOrder: newlycreated,
                       request: {
                           type: 'GET',
                           url: 'http://localhost:3000/orders/'+ order._id
                       }
                   });
               }
           });
       }
       else{
           console.log(foundproduct);
           res.status(500).json({
               message:"Not Valid Product"
           })
       }
    });

});

router.get("/:orderId",function (req,res) {
    var id  = req.params.orderId;
    Order.findById(id).select("_id quantity product").populate("product").exec(function (err,foundOrder) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else{
           if(foundOrder){
               res.status(200).json({
                   message:"Order Found",
                   Order: foundOrder,
                   request:{
                       type: "GET",
                       url: "http://localhost:3000/orders"
                   }
               });
           }
       }
    });
});

router.delete("/:orderId",function (req,res) {
    Order.findByIdAndRemove(req.params.orderId,function (err) {
       if(err){
           console.log(err);
           res.status(500).json({
              error: err
           });
       }
       else {
           res.status(202).json({
               message: "Order Deleted ..."
           });
       }
    });
});


module.exports = router;