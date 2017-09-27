
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {TodoModel} = require('./models/todos.js');
var {UserModel} = require('./models/users.js');

var app = express();

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  var newTodo = new TodoModel({
    text: req.body.text
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) =>{
    res.status(400).send(err);
  });

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

// var newTodo = new TodoModel({
//   text: 'Cook Dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (err) =>{
//   console.log('Unabale to save todo');
// });
//
//
//
//
//
// var newUser = new UserModel({
//   email: 'a@ab.com'
// });
//
// newUser.save().then((doc) => {
//   console.log('Saved user', doc);
// }, (err) =>{
//   console.log('Unabale to save new user');
// });
