// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************


// test case for /add_user
describe('Testing Add User API', () => {

  it('positive : /add_user', done => { // positive test case
    it('positive : /add_user', done => {
        chai
          .request(server)
          .post('/add_user')
          .send({username: 'John Doe', password: 'password', email: 'example@colorado.edu' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equals('Success');
            done();
          });
      });
  });

  it('Negative : /add_user. Checking invalid name', done => { // negative test case
    chai
      .request(server)
      .post('/add_user')
      .send({username: 33, password: 'password', email: 'example@colorado.edu'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});


// ********************************************************************************