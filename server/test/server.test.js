const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('./../server.js');
var {TodoModel} = require('./../models/todos.js');
var {UserModel} = require('./../models/users.js');
const {dummyTodos,populateDummyTodos,dummyUsers, populateDummyUsers} = require('./seed/seed.js');


beforeEach(populateDummyUsers);
beforeEach(populateDummyTodos);

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

describe('GET /todos/:id', () => {
  it('should return todo doc', (done)=> {

    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo is not found', (done)=> {

    var hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids', (done)=> {

    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done)=> {

    var hexId = dummyTodos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummyTodos[1].text);
      })
      .end((err,res) =>{
        if (err) {
          return done(err);
        }

        TodoModel.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));

      });
  });

  it('should return 404 if todo is not found', (done)=> {

    var hexId = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids', (done)=> {

    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done)=> {
     var hexId = dummyTodos[0]._id.toHexString();
     var text = 'This should be new text';
     request(app)
       .patch(`/todos/${hexId}`)
       .send({
         completed: true,
         text: text
       })
       .expect(200)
       .expect((res) => {
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
    });

  it('should clear completedAt when todo is not completed', (done)=> {

    var hexId = dummyTodos[1]._id.toHexString();
    var text = 'This should be new text- second one';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
     })
     .end(done);
  });

});

describe('GET /users/me', () => {

  it('should return user if uthenticated', (done)=> {
     request(app)
       .get('/users/me')
       .set('x-auth', dummyUsers[0].tokens[0].token)
       .expect(200)
       .expect((res) => {
         expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
         expect(res.body.email).toBe(dummyUsers[0].email);
      })
      .end(done);
    });

  it('should clear completedAt when todo is not completed', (done)=> {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
     })
     .end(done);

  });

});

describe('POST /users', () => {

  it('should create a user', (done)=> {
    var email = 'example@example.com';
    var password = '1234mno';
     request(app)
       .post('/users')
       .send({email, password})
       .expect(200)
       .expect((res) => {
         expect(res.headers['x-auth']).toExist();
         expect(res.body._id).toExist();
         expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        UserModel.findOne({email}).then((user) =>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
    });

  it('should return validation error if request is invalid', (done)=> {
    var email = 'hi';
    var password = '1234mno';
     request(app)
       .post('/users')
       .send({email, password})
       .expect(400)
       .end(done);
  });

  it('should not create user if email is already in use', (done)=> {
     request(app)
       .post('/users')
       .send({
         email:dummyUsers[0].email,
         password: dummyUsers[0].password
       })
       .expect(400)
       .end(done);
  });

});
