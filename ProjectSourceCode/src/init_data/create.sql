DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS movie CASCADE;
CREATE TABLE movie (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    director VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    avg_rating DECIMAL(3,2) NOT NULL
);

DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    review TEXT NOT NULL,
    spoiler INTEGER NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS rating CASCADE;
CREATE TABLE rating(
    rating_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS genres CASCADE;
CREATE TABLE genres(
    genre_id SERIAL PRIMARY KEY,
    genre VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS movie_genres CASCADE;
CREATE TABLE movie_genres(
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

DROP TABLE IF EXISTS friend CASCADE;
CREATE TABLE friend(
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (friend_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS favorite CASCADE;
CREATE TABLE favorite(
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id)
);

--populating the genres table
INSERT INTO genres (genre) VALUES ('Action');
INSERT INTO genres (genre) VALUES ('Adventure');
INSERT INTO genres (genre) VALUES ('Animation');
INSERT INTO genres (genre) VALUES ('Biography');
INSERT INTO genres (genre) VALUES ('Comedy');
INSERT INTO genres (genre) VALUES ('Crime');
INSERT INTO genres (genre) VALUES ('Drama');
INSERT INTO genres (genre) VALUES ('Family');
INSERT INTO genres (genre) VALUES ('Fantasy');
INSERT INTO genres (genre) VALUES ('History');
INSERT INTO genres (genre) VALUES ('Horror');
INSERT INTO genres (genre) VALUES ('Music');
INSERT INTO genres (genre) VALUES ('Musical');
INSERT INTO genres (genre) VALUES ('Mystery');
INSERT INTO genres (genre) VALUES ('Romance');
INSERT INTO genres (genre) VALUES ('Sci-Fi');
INSERT INTO genres (genre) VALUES ('Sport');
INSERT INTO genres (genre) VALUES ('Thriller');
INSERT INTO genres (genre) VALUES ('War');
INSERT INTO genres (genre) VALUES ('Western');
INSERT INTO genres (genre) VALUES ('Documentary');
INSERT INTO genres (genre) VALUES ('Film-Noir');
INSERT INTO genres (genre) VALUES ('Musical');
INSERT INTO genres (genre) VALUES ('Romantic Comedy');
INSERT INTO genres (genre) VALUES ('Satire');
INSERT INTO genres (genre) VALUES ('Superhero');
INSERT INTO genres (genre) VALUES ('Suspense');
INSERT INTO genres (genre) VALUES ('War');
INSERT INTO genres (genre) VALUES ('Spy');
INSERT INTO genres (genre) VALUES ('Noir');
INSERT INTO genres (genre) VALUES ('Biographical');
INSERT INTO genres (genre) VALUES ('Political');
INSERT INTO genres (genre) VALUES ('Mockumentary');
INSERT INTO genres (genre) VALUES ('Action Comedy');
INSERT INTO genres (genre) VALUES ('Adventure Comedy');
INSERT INTO genres (genre) VALUES ('Drama Comedy');
INSERT INTO genres (genre) VALUES ('Fantasy Comedy');
INSERT INTO genres (genre) VALUES ('Horror Comedy');
INSERT INTO genres (genre) VALUES ('Sci-Fi Comedy');
INSERT INTO genres (genre) VALUES ('Thriller Comedy');

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Shawshank Redemption', 1994, 'Frank Darabont', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://m.media-amazon.com/images/I/71715eBi1sL._AC_UF894,1000_QL80_.jpg', 9.3);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Godfather', 1972, 'Francis Ford Coppola', 'An organized crime dynasty''s aging patriarch transfers control of his clandestine empire to his reluctant son.', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 9.2);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Dark Knight', 2008, 'Christopher Nolan', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://www.movieposters.com/cdn/shop/products/d3401e97e249c56ed1c11a13dd02b47f_500x.jpg?v=1573652550', 9.0);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('Pulp Fiction', 1994, 'Quentin Tarantino', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://filmartgallery.com/cdn/shop/products/Pulp-Fiction-Vintage-Movie-Poster-Original-1-Sheet-27x41-6.jpg?v=1669266071', 8.9);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('Forrest Gump', 1994, 'Robert Zemeckis', 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.', 'https://m.media-amazon.com/images/S/pv-target-images/2d0c9e38968936e6711c7fb2bc7895b82d8bb9178b5a854e14dffa4b17b88487.jpg', 8.8);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('Inception', 2010, 'Christopher Nolan', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://i.ebayimg.com/images/g/B8oAAOSw2fdg5A-h/s-l1200.jpg', 8.8);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Matrix', 1999, 'Lana Wachowski, Lilly Wachowski', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 8.7);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('Inglourious Basterds', 2009, 'Quentin Tarantino', 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner''s vengeful plans for the same.', 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_FMjpg_UX1000_.jpg', 8.3);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Departed', 2006, 'Martin Scorsese', 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.', 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p162564_p_v8_ag.jpg', 8.5);

INSERT INTO movie (title, year, director, description, image, avg_rating)
VALUES ('The Grand Budapest Hotel', 2014, 'Wes Anderson', 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel''s glorious years under an exceptional concierge.', 'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_FMjpg_UX1000_.jpg', 8.1);


INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 1); --action
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 6); --crime
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 6); --crime
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 7); --drama
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 1); --adventure
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 6); --crime
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4, 6); --crime
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4, 7); --drama
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (5, 7); --drama
INSERT INTO movie_genres (movie_id, genre_id) VALUES (5, 15); --romance
INSERT INTO movie_genres (movie_id, genre_id) VALUES (5, 5); --comedy
INSERT INTO movie_genres (movie_id, genre_id) VALUES (6, 1); --action
INSERT INTO movie_genres (movie_id, genre_id) VALUES (6, 16); --sci-fi
INSERT INTO movie_genres (movie_id, genre_id) VALUES (6, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (7, 16); --sci-fi
INSERT INTO movie_genres (movie_id, genre_id) VALUES (7, 18); --thriller
INSERT INTO movie_genres (movie_id, genre_id) VALUES (7, 1); --adventure
INSERT INTO movie_genres (movie_id, genre_id) VALUES (8, 2); --adventure
INSERT INTO movie_genres (movie_id, genre_id) VALUES (8, 19); --war
INSERT INTO movie_genres (movie_id, genre_id) VALUES (8, 5); --comedy
INSERT INTO movie_genres (movie_id, genre_id) VALUES (9, 6); --crime
INSERT INTO movie_genres (movie_id, genre_id) VALUES (9, 7); --drama
INSERT INTO movie_genres (movie_id, genre_id) VALUES (10, 5); --comedy
INSERT INTO movie_genres (movie_id, genre_id) VALUES (10, 7); --drama



