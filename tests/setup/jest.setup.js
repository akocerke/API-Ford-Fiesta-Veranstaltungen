// setup/jest.setup.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env.test.local'),
});
require('../../index');
const mysequelize = require('../../database/setup/database');
const UserModel = require('../../database/models/User'); // Importiere dein User-Modell
const UserTestdata = require('./UserTestdata'); // Importiere die Testdaten
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
    console.log('Schema "users" wurde gelöscht.');

    // Synchronisiere die Modelle (Tabellen erstellen)
    await mysequelize.sync({ force: true });
    console.log('Datenbankstruktur wurde neu erstellt.');

    // Fülle die Datenbank mit Testdaten (Passwörter werden gehasht)
    const hashedUsers = UserTestdata.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10), // Passwort hashen
    }));

    await UserModel.bulkCreate(hashedUsers);
    console.log(
      'Testdaten für Benutzer wurden erfolgreich in die Datenbank eingefügt.'
    );
  } catch (error) {
    console.error('Fehler bei der Initialisierung der Datenbank:', error);
  } finally {
    // Schließe die Verbindung
    // await mysequelize.close();
  }
};

module.exports = initializeDatabase; // Exports die Funktion für Jest
