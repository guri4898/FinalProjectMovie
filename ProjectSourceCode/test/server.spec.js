// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should(); 
chai.use(chaiHttp);
const {assert,expect} = chai;

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

  it('positive : /register', done => { // positive test case
    
        chai
          .request(server)
          .post('/register')
          .send({password: 'password', username: 'John Doe', email: 'example@colorado.edu' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            res.should.be.html;
            done();
          });
  });

  it('Negative : /register. Checking invalid name', done => { // negative test case
    chai
      .request(server)
      .post('/register')
      .send({ password: 'password', email: 'example@colorado.edu'})
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});

// test case for /logout
describe('Testing Logout API', () => {
  it('positive : /logout', done => { // positive test case
    chai
      .request(server)
      .get('/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});


// // ********************************************************************************

//Part C: 

//Unit test to verify that login page was rendered correctly
// describe('Login rendering', () => {

//   before((done) => { //ensures this executes before unit test
//     // Send a POST request to register a new user
//     chai.request(server)
//       .post('/register')
//       .send({
//         username: 'testuser',
//         password: 'testpassword'
//       })
//       .end((err, res) => {
//         if (err) {
//           console.error(err);
//           done(err);
//         } else {
//           done();
//         }
//       });
//   });

//   it('Positive: /login should render with html', (done) => {
//     // Send a GET request to the login page
//     chai.request(server)
//       .post('/login')
//       .send({username: 'testuser', password: 'testpassword'})
//       .end((err, res) => {
//         if (err) {
//           console.error(err);
//           done(err);
//         } else {
//           // Assert status code and content type
//           res.should.have.status(200);
//           res.should.be.html;
//           done();
//         }
//       });
//   });
// });

// test case for /logout
describe('Testing Logout API', () => {
  it('positive : /logout', done => { // positive test case
    chai
      .request(server)
      .get('/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});


describe('Login with failed credentials', () => {
  it('Negative: /login should fail with invalid credentials', done =>{
    chai
      .request(server)
      .post('/login')
      .send({username: 'Does not exist', password: 'testing'})
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  })
});

// server.js
// app.post('/search', (req, res) => {
//   const searchQuery = req.body.searchQ;

//   // MySQL LIKE query with placeholders for prevention against SQL injection
//   db.query("SELECT * FROM movies WHERE title LIKE ?", ['%' + searchQuery + '%'], (error, movies) => {
//     if (error) {
//       console.error('Error during search:', error);
//       res.status(500).render('home', { message: 'Error performing search', searchedTF: true });
//     } else if (movies.length > 0) {
//       res.render('home', { movies, searchedTF: true });
//     } else {
//       res.render('home', { noData: true, searchedTF: true });
//     }
//   });
// });


