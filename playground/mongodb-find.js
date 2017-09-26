const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');


  // db.collection('Todos').find().toArray().then((docs)=>{
  //   console.log('Todos: ');
  //   console.log(docs);
  // }, (err) => {
  //   console.log('unable to fetch todo documents', err);
  // });

  // db.collection('Todos').find({completed: false}).toArray().then((docs)=>{
  //   console.log('Todos: ');
  //   console.log(docs);
  // }, (err) => {
  //   console.log('unable to fetch todo documents', err);
  // });

  // db.collection('Todos').find({
  //   _id: new ObjectID('59c9cf44d2451b8f3a4c0285')
  // }).toArray().then((docs)=>{
  //   console.log('Todos: ');
  //   console.log(docs);
  // }, (err) => {
  //   console.log('unable to fetch todo documents', err);
  // });

  // db.collection('Todos').count().then((count)=>{
  //   console.log(`Our total todos: ${count}`);
  // }, (err) => {
  //   console.log('unable to fetch todo documents', err);
  // });

// finding count of documnets with particular field value
  db.collection('Users').find({name: 'Sunny'}).count().then((count)=>{
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('unable to fetch todo documents', err);
  });


  //db.close();
});
