const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

var {TodoModel} = require('./../../models/todos.js');
var {UserModel} = require('./../../models/users.js');

var userOneId = new ObjectId();
var userTwoId = new ObjectId();
const dummyUsers = [{
  _id: userOneId,
  email: 'abc@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'},'secretSalt').toString()
  }]
},{
  _id: userTwoId,
  email: 'def@example.com',
  password: 'userTwoPass'
}];

const populateDummyUsers = (done) => {
  UserModel.remove({}).then(() => {
    var userOne = new UserModel(dummyUsers[0]).save();
    var userTwo = new UserModel(dummyUsers[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

// Seed DummyTodos
const dummyTodos = [{
  _id: new ObjectId(),
  text: 'First dummy todo'
},{
  _id: new ObjectId(),
  text: 'Second dummy todo',
  completed: true,
  completedAt: 333
}];

const populateDummyTodos = (done) => {
  TodoModel.remove({}).then(() => {
    return TodoModel.insertMany(dummyTodos);
  }).then(() => done());
}

module.exports = {dummyTodos,populateDummyTodos, dummyUsers, populateDummyUsers};
