// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

module.exports = app.listen(3000);



app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});



// Register
app.post('/register', async (req, res) => {

  try{
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    const email = req.body.email;
    
    if (!username || !email || !hash){
      throw new Error('Invalid input');
    }

    console.log("username", username);
    console.log("email", email);
    console.log("password", hash);

    // To-DO: Insert username and hashed password into the 'users' table
    const insertNewUserQuery = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${email}')`;
    await db.none(insertNewUserQuery);

    res.status(200).render('pages/login'); 
    
  } catch(err){
    res.status(500).json({message: 'Invalid input'});
    console.log(err);
  }
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.get('/account_settings', (req, res) => {
  res.render('pages/account_settings');
});

app.get('/home', (req, res) => {
  res.render('pages/home');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', (req, res) => {
    
  const query = "SELECT * FROM users WHERE username = $1;";

  db.one(query, [req.body.username])
  .then(async function(user){

    const match = await bcrypt.compare(req.body.password, user.password);        

    if(match){

      req.session.user = user;
      req.session.save();
      res.status(200);
      res.render('pages/account_settings'); //need to redirect to api route that displays movies
    }
    else{
      //print incorrect password to user
      res.status(501)
      .render('pages/login', {
        message: 'Incorrect Password',
        error: true
      });
    }

  })
  .catch(function(error){
    res.status(500)
    .render('pages/register', {
      error: true,
      message: 'User does not exist'
    });
  });

});

app.get('/', (req, res) => {
  res.render('pages/image');
});

app.get('/image', (req, res) => {
  res.render('pages/image');
});


// logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200);
  res.render('pages/logout');
});
