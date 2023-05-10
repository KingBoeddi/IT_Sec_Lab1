CREATE DATABASE IF NOT EXISTS webapp_notes;

USE webapp_notes;

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Note;

CREATE TABLE Note(
    note_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (note_id),
    PRIMARY KEY (note_id)
);

CREATE TABLE User(
    user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id),
    UNIQUE (username)
);

-- Insert new users
INSERT INTO User (username, password)
VALUES ('admin', 'tops3cret'),
    ('jane_doe', 'jane123'),
    ('john_smith', 'john456'),
    ('alice_brown', 'alice789');

-- Insert notes for each user
INSERT INTO Note (user_id, title, content)
VALUES (
        1,
        'Grocery List',
        'Milk, eggs, bread, apples, bananas, orange juice'
    ),
    (
        1,
        'Books to Read',
        'The Catcher in the Rye, To Kill a Mockingbird, 1984, Brave New World, The Great Gatsby'
    ),
    (
        2,
        'Workout Routine',
        'Monday: Chest and Triceps, Wednesday: Back and Biceps, Friday: Legs and Shoulders'
    ),
    (
        2,
        'Upcoming Meetings',
        'Project meeting on Monday at 10am, Client call on Wednesday at 3pm, Team lunch on Friday at 12pm'
    ),
    (
        3,
        'Birthday Gift Ideas',
        'Smart speaker, Wireless headphones, Books, Gift cards, Subscription box'
    ),
    (
        3,
        'Weekend Plans',
        'Friday: Dinner with friends, Saturday: Visit museum, Sunday: Relax at home'
    );