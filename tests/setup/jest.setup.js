const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env.test.local'),
});
require('../../index');
const mysequelize = require('../../database/setup/database');
const UserModel = require('../../database/models/User'); // Importiere das User-Modell
const EventModel = require('../../database/models/Event'); // Importiere das Event-Modell
const ViolationModel = require('../../database/models/Violation'); // Importiere das Violation-Modell
const CommentModel = require('../../database/models/Comment'); // Importiere das Comment-Modell
const RatingModel = require('../../database/models/Rating'); // Importiere das Rating-Modell
const UserTestdata = require('./UserTestdata'); // Importiere Testdaten für User
const EventTestdata = require('./EventTestData'); // Importiere Testdaten für Events
const bcrypt = require('bcryptjs'); // Für Passwort-Hashing

const initializeDatabase = async () => {
  console.log('Starte die Initialisierung der Datenbank...');

  try {
    console.log('Datenbankname:', process.env.DB_NAME);

    // Drope die Tabellen in der richtigen Reihenfolge (die abhängigen Tabellen zuerst)
    await mysequelize.dropSchema('violations');
    await mysequelize.dropSchema('comments');
    await mysequelize.dropSchema('ratings');
    await mysequelize.dropSchema('events');
    await mysequelize.dropSchema('users');
    console.log('Alle relevanten Schemata wurden gelöscht.');

    // Zuerst `UserModel` synchronisieren (da andere Tabellen von `users` abhängen)
    await UserModel.sync({ force: true }); // Erstelle die `users` Tabelle
    console.log('User-Tabelle wurde erstellt.');

    // Synchronisiere die abhängigen Tabellen (z. B. Events, Violations, Comments, Ratings)
    await EventModel.sync({ force: true }); // Erstelle die `events` Tabelle
    await ViolationModel.sync({ force: true }); // Erstelle die `violations` Tabelle
    await CommentModel.sync({ force: true }); // Erstelle die `comments` Tabelle
    await RatingModel.sync({ force: true }); // Erstelle die `ratings` Tabelle
    console.log('Datenbankstruktur wurde erfolgreich neu erstellt.');

    // Füge die Testdaten für Benutzer hinzu (Passwörter werden gehasht)
    const hashedUsers = UserTestdata.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10), // Passwort hashen
    }));

    await UserModel.bulkCreate(hashedUsers); // Testdaten für Benutzer einfügen
    console.log(
      'Testdaten für Benutzer wurden erfolgreich in die Datenbank eingefügt.'
    );

    // Füge die Testdaten für Events ein
    await EventModel.bulkCreate(EventTestdata);
    console.log(
      'Testdaten für Events wurden erfolgreich in die Datenbank eingefügt.'
    );

    // Optional: Hier kannst du auch Testdaten für Violations, Comments, und Ratings hinzufügen
    // await ViolationModel.bulkCreate(ViolationTestData);
    // await CommentModel.bulkCreate(CommentTestData);
    // await RatingModel.bulkCreate(RatingTestData);
    
  } catch (error) {
    console.error('Fehler bei der Initialisierung der Datenbank:', error);
  } finally {
    // Optional: Schließe die Verbindung nach Abschluss der Initialisierung
    // await mysequelize.close();
  }
};

module.exports = initializeDatabase; // Exportiere die Funktion für Jest
