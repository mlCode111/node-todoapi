const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todo = [{
  text: "todo 1"
}, {
  text: "todo 2"
}];

beforeEach(done => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todo);
  }).then(() => done());
});

describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo';

    request(app)
      .post('/todo')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todo) => {
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todo')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      })
      Todo.find().then((todo) => {
        expect(todo.length).toBe(2);
        done();
      }).catch(e => done(e));
  });
});

describe('GET /todo', () => {
  it('should get all todo', (done) => {
    request(app)
      .get('/todo')
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.length).toBe(2);
      })
      .end(done);
  });
});
