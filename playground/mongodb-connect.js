const MongoClient = require('mongodb').MongoClient;
// you can write same line above as
//const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('unable to insert in Todo collection', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'Sunny',
    age: 29,
    location: 'Seattle'
  }, (err, result) => {
    if(err){
      return console.log('unable to insert in Todo collection', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();
});
