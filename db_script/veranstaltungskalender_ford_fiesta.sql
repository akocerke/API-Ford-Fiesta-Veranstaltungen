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
('jane_smith', 'jane@example.com', 'hashedpassword2', 'admin'),
('michael_brown', 'michael.brown@example.com', 'hashedpassword3', 'user'),
('sarah_jones', 'sarah.jones@example.com', 'hashedpassword4', 'admin'),
('david_wilson', 'david.wilson@example.com', 'hashedpassword5', 'user'),
('lisa_white', 'lisa.white@example.com', 'hashedpassword6', 'admin'),
('james_taylor', 'james.taylor@example.com', 'hashedpassword7', 'user'),
('emily_clark', 'emily.clark@example.com', 'hashedpassword8', 'user'),
('william_harris', 'william.harris@example.com', 'hashedpassword9', 'admin'),
('olivia_martin', 'olivia.martin@example.com', 'hashedpassword10', 'user'),
('benjamin_lewis', 'benjamin.lewis@example.com', 'hashedpassword11', 'user'),
('ava_rodriguez', 'ava.rodriguez@example.com', 'hashedpassword12', 'admin');

-- Dummy Daten EVENTS
INSERT INTO events (user_id, title, description, date, image) VALUES
(1, 'Fiesta MK5 Treffen', 'Ein Treffen für Besitzer und Enthusiasten des Ford Fiesta MK5. Gelegenheit zum Austausch von Tipps und Erfahrungen.', '2024-09-20 10:00:00', 'fiesta-treffen.jpg'),
(2, 'Reparatur-Workshop Ford Fiesta', 'Ein Workshop, in dem verschiedene Reparatur- und Wartungstechniken für den Ford Fiesta MK5 gezeigt werden.', '2024-10-15 11:00:00', 'reparatur-workshop.jpg'),
(3, 'Fiesta Ausfahrt', 'Eine gemeinsame Ausfahrt für Ford Fiesta MK5 Besitzer. Erlebe den Spaß am Fahren mit Gleichgesinnten.', '2024-11-05 14:00:00', 'fiesta-ausfahrt.jpg'),
(4, 'Tuning-Tag für Fiesta MK5', 'Veranstaltung zum Thema Tuning und Individualisierung des Ford Fiesta MK5. Präsentationen und Austausch von Ideen.', '2024-11-25 13:00:00', 'tuning-tag.jpg'),
(5, 'Ford Fiesta MK5 Clubabend', 'Ein geselliger Clubabend für Ford Fiesta MK5 Enthusiasten. Diskussionen über das Modell und gemeinsame Aktivitäten.', '2024-12-10 18:00:00', 'clubabend.jpg'),
(6, 'Winterpflege für den Ford Fiesta', 'Workshop zur optimalen Vorbereitung und Pflege des Ford Fiesta MK5 für den Winter.', '2024-12-15 09:00:00', 'winterpflege.jpg'),
(7, 'Fiesta MK5 Fotoshooting', 'Ein Event zum Fotoshooting für den Ford Fiesta MK5. Bringe dein Fahrzeug und lasse es professionell fotografieren.', '2024-09-30 12:00:00', 'fiesta-fotoshooting.jpg'),
(8, 'Fiesta MK5 Technik-Talk', 'Diskussion und Präsentationen zu den technischen Besonderheiten des Ford Fiesta MK5.', '2024-10-30 16:00:00', 'technik-talk.jpg'),
(9, 'Fiesta MK5 Roadtrip', 'Gemeinsamer Roadtrip mit Ford Fiesta MK5. Erlebe eine spannende Fahrt durch verschiedene Landschaften.', '2024-11-15 08:00:00', 'roadtrip.jpg'),
(10, 'Jahresabschlusstreffen Fiesta MK5', 'Feiere das Ende des Jahres mit anderen Ford Fiesta MK5 Enthusiasten. Rückblick auf das Jahr und Ausblick auf kommende Events.', '2024-12-28 17:00:00', 'jahresabschlusstreffen.jpg');


-- Dummy Daten RATINGS
INSERT INTO ratings (event_id, user_id, rating) VALUES
(1, 1, 5),
(2, 2, 4),
(3, 3, 3),
(4, 4, 5),
(5, 5, 4),
(6, 6, 5),
(7, 7, 2),
(8, 8, 4),
(9, 9, 5),
(10, 10, 3),
(1, 2, 4),
(2, 3, 5),
(3, 4, 4),
(4, 5, 5),
(5, 6, 3),
(6, 7, 4),
(7, 8, 5),
(8, 9, 2),
(9, 10, 4),
(10, 1, 5);


-- Dummy Daten COMMENTS
INSERT INTO comments (event_id, user_id, comment) VALUES
(1, 1, 'Tolles Event! Hat mir viel Spaß gemacht.'),
(2, 2, 'Sehr informativ und gut organisiert.'),
(3, 3, 'Ein wirklich großartiges Erlebnis.'),
(4, 4, 'Die Veranstaltung war ok, aber könnte besser sein.'),
(5, 5, 'Sehr interessanter Vortrag, danke dafür!'),
(6, 6, 'Leider nicht mein Geschmack, aber gut organisiert.'),
(7, 7, 'Hat alles wunderbar geklappt, gerne wieder.'),
(8, 8, 'Ein bisschen chaotisch, aber insgesamt in Ordnung.'),
(9, 9, 'Tolle Atmosphäre und freundliche Leute.'),
(10, 10, 'Ich habe viele neue Dinge gelernt, danke!');


-- Dummy Daten VIOLATIONS
INSERT INTO violations (event_id, reported_by, reason, details) VALUES
(1, 2, 'Unangemessenes Verhalten', 'Während des Events wurden laute Streitigkeiten gehört.'),
(2, 1, 'Irreführende Informationen', 'Die Eventbeschreibung stimmte nicht mit dem tatsächlichen Event überein.'),
(3, 3, 'Unzulässige Werbung', 'Es wurden unzulässige Werbematerialien verteilt.'),
(4, 4, 'Nicht eingehaltene Sicherheitsvorschriften', 'Die Sicherheitsvorschriften wurden während des Events nicht beachtet.'),
(5, 5, 'Störung der Veranstaltung', 'Es kam zu wiederholten Störungen durch einen Teilnehmer.'),
(6, 6, 'Unangemessene Sprache', 'Es wurde unangemessene Sprache verwendet, die andere Teilnehmer belästigte.'),
(7, 7, 'Fehlende Anmeldung', 'Ein Teilnehmer nahm ohne Anmeldung am Event teil.'),
(8, 8, 'Unfreundliches Verhalten', 'Ein Teilnehmer zeigte unfreundliches Verhalten gegenüber anderen Gästen.'),
(9, 9, 'Unzureichende Ausstattung', 'Die Veranstaltung war nicht wie angekündigt ausgestattet.'),
(10, 10, 'Unrechtmäßiger Zugang', 'Ein nicht autorisierter Personenkreis hatte Zugang zum Event.');




SELECT * FROM comments;
SELECT * FROM events;
SELECT * FROM ratings;
SELECT * FROM users;
SELECT * FROM violations;

UPDATE users
SET role = 'admin'
WHERE id = 1;
