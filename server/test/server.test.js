const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server.js');
var {TodoModel} = require('./../models/todos.js');

beforeEach((done) => {
  TodoModel.remove({}).then(() =>{
    done();
  });
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

        TodoModel.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
