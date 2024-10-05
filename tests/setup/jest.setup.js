// setup/jest.setup.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env.test.local'),
});
require('../../index');
const mysequelize = require('../../database/setup/database');
const UserModel = require('../../database/models/User'); // Importiere dein User-Modell
const EventModel = require('../../database/models/Event'); // Importiere dein Event-Modell
const UserTestdata = require('./UserTestdata'); // Importiere die Testdaten für Benutzer
const EventTestdata = require('./EventTestdata'); // Importiere die Testdaten für Events
const bcrypt = require('bcryptjs'); // Bcrypt für das Hashing der Passwörter

const initializeDatabase = async () => {
  console.log('Starte die Initialisierung der Datenbank...');

  try {
    console.log(process.env.DB_NAME);

    // Drope das Schema oder die Tabelle (je nach deiner Datenbankstruktur)
    await mysequelize.dropSchema('violations');
    await mysequelize.dropSchema('comments');
    await mysequelize.dropSchema('ratings');
    await mysequelize.dropSchema('events');
    await mysequelize.dropSchema('users');
    console.log('Schema "users" und "events" wurden gelöscht.');

    // Synchronisiere die Modelle (Tabellen erstellen)
    await mysequelize.sync({ force: true });
    console.log('Datenbankstruktur wurde neu erstellt.');

    // Fülle die Datenbank mit Testdaten für Benutzer (Passwörter werden gehasht)
    const hashedUsers = UserTestdata.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10), // Passwort hashen
    }));

    await UserModel.bulkCreate(hashedUsers);
    console.log(
      'Testdaten für Benutzer wurden erfolgreich in die Datenbank eingefügt.'
    );

    // Fülle die Datenbank mit Testdaten für Events
    await EventModel.bulkCreate(EventTestdata);
    console.log(
      'Testdaten für Events wurden erfolgreich in die Datenbank eingefügt.'
    );
  } catch (error) {
    console.error('Fehler bei der Initialisierung der Datenbank:', error);
  } finally {
    // Schließe die Verbindung
    // await mysequelize.close();
  }
};

module.exports = initializeDatabase; // Exports die Funktion für Jest
