const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
  //   console.log(`${result}`);
  // }, (err) => {
  //   console.log('unable to delete todo documents', err);
  // });

  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(`${result}`);
  // }, (err) => {
  //   console.log('unable to delete todo documents', err);
  // });

  db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    console.log(result);
  }, (err) => {
    console.log('unable to find & delete todo documents', err);
  });


  //db.close();
});
