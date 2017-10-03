
require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {TodoModel} = require('./models/todos.js');
var {UserModel} = require('./models/users.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

/*
**** Todo routes *******
*/

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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
  TodoModel.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
    }, (err) =>{
      res.status(400).send(err);
  });

});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  TodoModel.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(404).send();
  });

});

/*
**** User routes *******
*/
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email','password']);
  var newUser = new UserModel(body);

  newUser.save().then(() => {
    return newUser.generateAuthToken();
  }).then((token) =>{
    res.header('x-auth',token).send(newUser);
  }).catch((e) => {
    res.status(400).send(e);
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
