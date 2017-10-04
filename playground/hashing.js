// // sha 256 using crypto-js module
// // note i actual apllication we won't be using crypto-js liberary, instead we wil use jsonwebtoken library
//
// const {SHA256} = require('crypto-js');
// // var message = 'I am user number 3';
// // var hash = SHA256(message).toString();
// //
// // console.log(`Message: ${message}`);
// // console.log(`Hash: ${hash}`);
//
//
// const jwt = require('jsonwebtoken');
//
// // Two methods we will be using of jwt are:
// // jwt.sign : takes th object and sign it by creating hash usinf secret salt and finally return token value
// // jwt.verify: takes the token and secret salt and check if data was manipulated or not
//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, 'secretSalt');
// console.log(token);
//
// var decoded = jwt.verify(token,'secretSalt');
// console.log('Decoded message: ', decoded);

const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err,salt) => {
  bcrypt.hash(password, salt, (error, hashValue) => {
    console.log(hashValue);
  });
});

var hashValue = '$2a$10$NWYYdHZWIjobDN4wMBXk7eQNX3wOfUzyryZNEfnJi.ZIOVu5ViuaG';
bcrypt.compare(password, hashValue, (err, res) => {
  console.log(res);
});
