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
const { emitWarning } = require('process');

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

app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/img', express.static(path.join(__dirname, 'img')));

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


    // check that thet email is in the correct format
    // 1. check that email begins with one or more characters that are not whitespace or @
    // 2. followed by an @
    // 3. followed by one or more characters that are not whitespace or @
    // 4. followed by a .
    // 5. ends with one or more characters that are not whitespace or @
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(req.body.email)) {
      return res.render('pages/register', {
        message: 'Invalid email format'
      })
      // return res.status(400).json({ message: 'Invalid email format' });
    }

    // check that the password has one or more lowercase letters
    // check that the password has one or more uppercase letters
    // check that the password is at least 8 characters long
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.render('pages/register', {
        message: 'Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter'
      });
    }


    //  Insert username and hashed password into the 'users' table
    const insertNewUserQuery = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hash}', '${email}')`;
    await db.none(insertNewUserQuery);

    res.status(200).render('pages/login'); 
    
  } catch(err){
    console.log(err);
    res.status(500).json({message: 'Invalid input'});
  }
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.get('/account_settings', (req, res) => {
  res.render('pages/account_settings',{
    display: true,
    username : req.session.user.username,
    email: req.session.user.email
  });
});



app.post('/account_settings', async (req, res) => {

  try{
    const username = req.body.username;
    // if the user is trying to set its username to an empty string
    if (!username){
      return res.status(500).render('pages/account_settings', {
        display: true,
        message: 'The user cannot be empty. Try again.',
        username: req.session.user.username,
        email: req.session.user.email
      });
    }

    if (username === req.session.user.username){
      return res.status(500).render('pages/account_settings', {
        display: true,
        message: 'The new username is the same as the current one. Try again.',
        username: req.session.user.username,
        email: req.session.user.email
      });
    }

    updateQuery = `UPDATE users SET username = '${username}' WHERE user_id = ${req.session.user.user_id}`;
    await db.none(updateQuery);
    res.status(200).render('pages/account_settings', {
      display: true,
      message: 'Username updated successfully',
      username: username,
      email: req.session.user.email,
      isGreen: true
    });
  } catch(err){
    console.log(err);
    res.status(500).json({message: 'Invalid input'});
  }
});


app.get('/home', (req, res) => {
  res.render('pages/home',{
    display: true,
    searchedTF: false
  });
});

app.post('/home', (req, res) => {

  let searchedTF = false;

  const origSearchedQuery = req.body.searchQ;
  let searchedQuer = '';

  if (origSearchedQuery && origSearchedQuery.trim() !== '') { //checks if search is empty
    searchedTF = true;
    searchedQuer = origSearchedQuery.toLowerCase(); //converts to lowercase if it is
  } else {
      return res.render('pages/home', {
          noData: true
      });
  }

  const query = 'SELECT * FROM movie WHERE LOWER(title) LIKE $1';

  db.any(query, [`%${searchedQuer}%`])
      .then(movies => {
          if (movies.length === 0) {
              res.render('pages/home', {
                  noData: true,
                  searchedTF: true,
                  display: true
              });
          } else {
              res.render('pages/home', {
                  movies: movies,
                  searchedTF: true,
                  display: true
              });
          }
      })
      .catch(error => {
          res.status(500)
              .render('pages/home', {
                  error: true
              });
      });
});




app.get('/login', (req, res) => {
  res.render('pages/login',{
    display: false
  });
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
      res.render('pages/home',{
        display: true
      }); //need to redirect to api route that displays movies
    }
    else{
      //print incorrect password to user
      res.status(500);
      res.render('pages/login', {
        message: 'Incorrect Password. Try again.',
      });
    }

  })
  .catch(function(error){
    res.status(500);
    res.render('pages/login', {
      message: `That username doesn't exist. Try again or register.`,
    });
  });

});



app.get('/', (req, res) => {
  res.render('pages/image',{
    display: false
  });
});

app.get('/image', (req, res) => {
  res.render('pages/image',{
    display: false
  });
});


// logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200);
  res.render('pages/logout');
});

//display single movie

app.get('/movie/:title', (req, res) => {

  const title = req.params.title;
  const query = `SELECT * FROM movie WHERE title = $1;`;

  db.one(query, [title])
  .then(function(movie){
    console.log({movie});
    res.status(200).render('pages/singleMovie', {movie,
    display: true,
    exists: true});
  })
  .catch(function(error){
    res.status(500).render('pages/singleMovie', {error: true,
    display: true,
    exists: false});
  });

});

app.get('/addMovie', (req, res) => {
  res.render('pages/addMovie',{
    display: true
  });
});

app.post('/addMovie', async (req, res) => {

  const title = req.body.title;
  const year = req.body.year;
  const genre = req.body.genre;
  const director = req.body.director;
  const description = req.body.description;
  const defaultRating = 0;
  const query = `INSERT INTO movie (title, year, avg_rating, director, description) VALUES ($1, $2, $3, $4, $5) returning movie_id;`;
  const genreQuery = 'Select genre_id from genres where genre = $1;'
  const movieToGenresQuery = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2);'

  const movieId = await db.one(query, [title, year, defaultRating, director, description]);
  console.log(movieId);
    if(movieId){
      const genreId = await db.any(genreQuery, [genre]);
      console.log(genreId);
      db.none(movieToGenresQuery, [movieId.movie_id, genreId[0].genre_id])
      .then(()=>{
        res.status(200).render('pages/home',{
          display: true
        });

      })
      .catch(error =>{
        res.status(500).render('pages/home',{
          display: true,
          error: true
        });
      })
    }

});

app.get('/addFriend', (req, res) => {
  res.render('pages/addFriend',{
    display: true
  });
});

app.post('/addFriend', async (req, res) => {

  const query = 'SELECT user_id FROM users WHERE username = $1;';
  const usernameFriend = req.body.usernameSearch;

  db.one(query, [usernameFriend])
  .then((friendName)=>{

    const query = 'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2);';
    db.none(query, [req.session.user.user_id, friendName.user_id])
    .then(()=>{
      res.status(200).render('pages/home',{
        display: true

      });
    })   
    .catch(error =>{
      res.status(500).render('pages/home',{
        display: true,
        error: true
      });
    });

  })
  .catch(error =>{
    res.status(500).render('pages/home',{
      display: true,
      error: true
    });
  });

});


app.post('/rateMovie', async (req, res) => {
  
  try{

    const review = req.body.review;
    let rating;
    let spoiler = 0;

    if (!req.body.rate) { // if the rate is undefined then it's 0
      rating = 0;
    } else {
      rating = req.body.rate;
    }
    
    if (req.body.spoiler === 'on'){ // if the spoiler is 'on' set the spoiler to true
      spoiler = 1;
    } else {
      spoiler = 0;
    }

    
    // if a review has been written add it to the reivew table
    if (review){
      // store the information at the review table
    }
    

    console.log(review);
    console.log(rating);
    console.log(spoiler);

    res.render('pages/:title', {
      movie,
      display: true,
      exists: true
    });

  } catch(err) {

  }

});