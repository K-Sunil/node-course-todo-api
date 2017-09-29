const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server.js');
var {TodoModel} = require('./../models/todos.js');

const dummyTodos = [{
  text: 'First dummy todo'
},{
  text: 'Second dummy todo'
}];

beforeEach((done) => {
  TodoModel.remove({}).then(() => {
    return TodoModel.insertMany(dummyTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new Todo', (done)=> {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        TodoModel.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a Todo with invalid body data', (done)=> {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err){
          return done(err);
        }

        TodoModel.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should list all todos', (done)=> {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.allTodos.length).toBe(2);
      })
      .end(done);
  });
});
