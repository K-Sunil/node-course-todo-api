
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {TodoModel} = require('./models/todos.js');
var {UserModel} = require('./models/users.js');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {

  TodoModel.find().then((allTodos) => {
    res.send({allTodos});
  }, (err) =>{
    res.status(400).send(err);
  });

});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;     /******First time using params here**********/

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
  TodoModel.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
    }, (err) =>{
      res.status(400).send(err);
  });

});

app.listen(port, () => {
  console.log(`Started on port : ${port}`);
});

module.exports = {app};

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
