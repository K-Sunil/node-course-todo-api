
var mongoose = require('mongoose');

var UserModel = mongoose.model('users', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {UserModel};
