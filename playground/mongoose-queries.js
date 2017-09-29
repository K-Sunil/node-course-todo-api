const {ObjectId} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose.js');
var {TodoModel} = require('./../server/models/todos.js');

var id = '59cec87d12510b9a1bebe17a';

// TodoModel.find({
//   _id: id // the point is mongoose convert string into ObjectId itself.
// }).then((todos) => {
//   console.log('Matched todos', todos);
// });
//
// TodoModel.findOne({   // findone just return first document which matches with the query
//   completed: false
// }).then((todo) => {
//   console.log('Matched todo in findOne', todo);
// });

if(!ObjectId.isValid(id)){
  console.log('Id is not valid');
}

TodoModel.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found in database');
  }
  console.log('Matched todo in findbyid', todo);
}).catch((e) => console.log(e)); // case if id itself is in corrupted format.
