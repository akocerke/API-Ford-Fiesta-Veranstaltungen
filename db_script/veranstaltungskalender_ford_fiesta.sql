-- Datenbank erstellen, wenn sie noch nicht existiert
CREATE DATABASE IF NOT EXISTS event_management_db;

-- Drop DB
-- DROP DATABASE IF EXISTS event_management_db;

-- Verwende die erstellte Datenbank
USE event_management_db;

-- Tabelle für Benutzer erstellen
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabelle für Events erstellen
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabelle für Bewertungen erstellen
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabelle für Kommentare erstellen
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabelle für Verstoßmeldungen erstellen
CREATE TABLE IF NOT EXISTS violations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    reported_by INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    details TEXT,
    status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Dummy Daten USERS
INSERT INTO users (username, email, password, role) VALUES
('john_doe', 'john@example.com', 'hashedpassword1', 'user'),
('jane_smith', 'jane@example.com', 'hashedpassword2', 'admin');

-- Dummy Daten EVENTS
INSERT INTO events (user_id, title, description, date, image) VALUES
(1, 'Car Show', 'An exciting car show featuring the latest models.', '2024-09-15 10:00:00', 'carshow.jpg'),
(2, 'Auto Expo', 'An auto expo showcasing classic and luxury cars.', '2024-10-05 12:00:00', 'autoexpo.jpg');

-- Dummy Daten RATINGS
INSERT INTO ratings (event_id, user_id, rating) VALUES
(1, 1, 5),
(2, 2, 4);

-- Dummy Daten COMMENTS
INSERT INTO comments (event_id, user_id, comment) VALUES
(1, 1, 'Great event! Had a lot of fun.'),
(2, 2, 'Very informative and well-organized.');

-- Dummy Daten VIOLATIONS
INSERT INTO violations (event_id, reported_by, reason, details) VALUES
(1, 2, 'Inappropriate behavior', 'Loud arguments were heard during the event.'),
(2, 1, 'Misleading information', 'The event description did not match the actual event.');



SELECT * FROM comments;
SELECT * FROM events;
SELECT * FROM ratings;
SELECT * FROM users;
SELECT * FROM violations;