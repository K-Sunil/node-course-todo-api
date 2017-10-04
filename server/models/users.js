
const validatorLib = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validatorLib.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  tokens: [{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

// Overriding mongoose toJSON() so that we should not sent password and token to user.
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'secretSalt').toString();

  user.tokens.push({access,token});

  // I do not understand below code snippet
  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token,'secretSalt');
  } catch (e) {
      // return new Promise((resolve, reject) = > {
      //   reject();
      // });
      return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

var UserModel = mongoose.model('users', UserSchema);

module.exports = {UserModel};
