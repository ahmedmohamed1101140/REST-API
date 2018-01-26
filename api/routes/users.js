const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post('/signup',function (req,res) {

    User.find({email: req.body.email},function (err,founduser) {
       if(err){
           console.log(err);
           res.status(500).json({
               error: err
           });
       }
       else if(founduser.length >= 1){
           res.status(422).json({
               message: "Mail Exist Try to Login"
           });
       }
       else {
           bcrypt.hash(req.body.password,10,function (err,hash) {
               if(err){
                   return res.status(500).json({
                       error:err
                   });
               }
               else {
                   const user = new User({
                       _id: mongoose.Types.ObjectId(),
                       email: req.body.email,
                       password: hash
                   });
                   user.save(function (err,user) {
                       if(err){
                           res.status(500).json({
                               error: err
                           });
                       }
                       else {
                           console.log(user);
                           res.status(201).json({
                               message: "user Created Successfully"
                           });
                       }
                   });
               }
           });
       }
    });
});

router.post('/login',function (req,res) {
   User.find({email: req.body.email},function (err,foundUser) {
      if(err){
          res.status(401).json({
              message: "Auth Failed"
          });
      }
      else if(foundUser.length < 1){
          res.status(401).json({
              message: "Auth failed"
          });
      }
      else {
          bcrypt.compare(req.body.password,foundUser[0].password,function (err,result) {
              if(err){
                  res.status(401).json({
                      message: "Auth Failed"
                  });
              }
              else if(result){
                  const token = jwt.sign(
                      {
                          email: foundUser.email,
                          userID: foundUser._id
                      }
                      ,process.env.JWT_KEY
                      ,
                        {
                          expiresIn: "1hr"
                        }
                  );
                    res.status(200).json({
                        message: "Auth success",
                        toke: token
                    });
              }
              else{
                  res.status(401).json({
                      message: "Auth Failed"
                  });
              }
          })
      }
   });
});

router.delete('/:userID',function (req,res) {
    User.findByIdAndDelete(req.params.userID,function (err) {
        if(err){
            console.log(err);
            res.status(500).json({
                error:err
            });
        }
        else{
            res.status(200).json({
                message: "User Deleted"
            });
        }
    });
});


module.exports = router;
