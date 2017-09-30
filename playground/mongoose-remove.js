const {ObjectId} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose.js');
var {TodoModel} = require('./../server/models/todos.js');

// To remove every document from collection, but you want get the deleted documents back in the result
// TodoModel.remove({}).then((result)=>{
//   console.log(result);
// });


// TodoModel.findOnendRemove
// TodoModel.findByIdAndRemove
// in both of above methods you get the data back so that you can do something with the deleted item.


TodoModel.findByIdAndRemove('59cffcf7ce78068dade37cae').then((todo) => {
  console.log(todo);
});
