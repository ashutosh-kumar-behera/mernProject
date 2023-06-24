const mongoose = require('mongoose');
require('./db/config');
const cors = require("cors");
const express = require('express');
const jwt = require("jsonwebtoken");
const jwtKey = 'e-comm'
const app =express();

app.use(express.json());
app.use(cors());

const User = require('./db/User');
const Product = require('./db/Products');

// User
// signUp Data
app.post("/register",async(req,res)=>{
  const data = new User(req.body);
  let newUser = await data.save();
  newUser = newUser.toObject();
  delete newUser.password;
  if (newUser) {
    jwt.sign({ newUser }, jwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        res.json({newUser: "Something went wrong, Please try after some time"});
      }
      res.json({ newUser, auth: token });
    });
  }})


// login
app.post("/login", async(req,res)=>{
  if(req.body.email && req.body.password){
    const user = await User.findOne(req.body).select("-password");
    if(user){
      jwt.sign({user}, jwtKey, {expiresIn: "2h"}, (err, token) =>{
        if(err){
          res.json({user:"Something went wrong, Please try after some time"})
        }
        res.json({user, auth:token});
      })
    }else{
      res.json({ user: "No User Found" });
    }
  }
  else{
      res.json({ user: "No User Found" });
  }
})



// Product
// Insert Product
app.post("/",verifyToken, async (req, res) => {
  const data = new Product(req.body);
  let result = await data.save();
  res.json(result);
});

// Get Product
app.get("/:id",verifyToken, async (req, res) => {
  const id = req.params.id;
  const data = await Product.find({
    userId: { $all: [id] },
  });
  res.json(data);
});


// Delete Product
app.delete("/:id",verifyToken, async (req, res) => {
  const id = req.params.id;
  const result = await Product.deleteOne({_id:id});
  res.json(result);
});

// Update Product
app.put("/:id",verifyToken, async(req, res) => {
  const result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json(result);
});

//Search Product
app.get("/search/:key", verifyToken, async (req, res) => {
  const result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  res.json(result);
});

// verify token
async function verifyToken(req, res, next){
  const token =await req.headers["authorization"];
  if (token) {
     const authToken = token.split(" ")[1];
     jwt.verify(authToken, jwtKey, (err, valid) => {
       if (err) {
         res.status(401).json({ result: "Please provide valid token" });
     } else {
       next();
     }
   });
   } else {
     res.status(403).json({ result: "Please add token with header" });
 }
  next();
}



app.listen(8080);










// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "assxasa" },
//     "aswedfrgtbvcdsewffdgthtbfgbffggfbfvdv",
//     {
//       expiresIn: "2h",
//     }
//   );
//   console.log(token);

//   const userVer = await jwt.verify(
//     token,
//     "aswedfrgtbvcdsewffdgthtbfgbffggfbfvdv"
//   );
//   console.log(userVer);
// };

// createToken();
