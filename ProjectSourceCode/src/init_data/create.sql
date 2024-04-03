
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);



-- DROP TABLE IF EXISTS users CASCADE;

-- CREATE TABLE users(
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
-- );

-- DROP TABLE IF EXISTS movie CASCADE;
-- CREATE TABLE movie (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     year INTEGER NOT NULL,
--     genre VARCHAR(255) NOT NULL,
--     director VARCHAR(255) NOT NULL,
--     description TEXT NOT NULL,
--     image VARCHAR(255) NOT NULL,
--     avg_rating INTEGER NOT NULL
-- );

-- DROP TABLE IF EXISTS reviews CASCADE;
-- CREATE TABLE reviews (
--     id SERIAL PRIMARY KEY,
--     FOREIGN KEY movie_id REFERENCES movie (id),
--     FOREIGN KEY user_id REFERENCES users (id),
--     review TEXT NOT NULL,
-- );

-- DROP TABLE IF EXISTS rating CASCADE;
-- CREATE TABLE rating(
--     id SERIAL PRIMARY KEY,
--     FOREIGN KEY movie_id REFERENCES movie (id),
--     FOREIGN KEY user_id REFERENCES users (id),
--     rating INTEGER NOT NULL,
-- );

