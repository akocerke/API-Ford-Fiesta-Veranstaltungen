const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env.test.local'),
});
require('../../index');
const mysequelize = require('../../database/setup/database');
const UserModel = require('../../database/models/User');
const EventModel = require('../../database/models/Event');
const ViolationModel = require('../../database/models/Violation');
const CommentModel = require('../../database/models/Comment');
const RatingModel = require('../../database/models/Rating');
const UserTestdata = require('./UserTestdata');
const EventTestdata = require('./EventTestData');
const bcrypt = require('bcryptjs');

// Funktion zur Überprüfung, ob eine Tabelle existiert
const tableExists = async (tableName) => {
  const [results] = await mysequelize.query(`SHOW TABLES LIKE '${tableName}';`);
  return results.length > 0;
};

const initializeDatabase = async () => {
  console.log('Starte die Initialisierung der Datenbank...');

  try {
    console.log('Datenbankname:', process.env.DB_NAME);
    console.log('Datenbankbenutzer:', process.env.DB_USERNAME);

    // Drope die Tabellen in der richtigen Reihenfolge
    await mysequelize.dropSchema('violations');
    await mysequelize.dropSchema('comments');
    await mysequelize.dropSchema('ratings');
    await mysequelize.dropSchema('events');
    await mysequelize.dropSchema('users');
    console.log('Alle relevanten Schemata wurden gelöscht.');

    // Zuerst `UserModel` synchronisieren
    await UserModel.sync({ force: true });
    console.log('User-Tabelle wurde erstellt.');

    // Überprüfen, ob die User-Tabelle existiert
    const userTableExists = await tableExists('users');
    console.log('User-Tabelle existiert:', userTableExists);

    // Synchronisiere die abhängigen Tabellen
    await EventModel.sync({ force: true });
    console.log('Events-Tabelle wurde erstellt.');

    // Hier kannst du auch die anderen Tabellen synchronisieren, wenn nötig
    await ViolationModel.sync({ force: true });
    console.log('Violations-Tabelle wurde erstellt.');

    await CommentModel.sync({ force: true });
    console.log('Comments-Tabelle wurde erstellt.');

    await RatingModel.sync({ force: true });
    console.log('Ratings-Tabelle wurde erstellt.');

    console.log('Datenbankstruktur wurde erfolgreich neu erstellt.');

    // Füge die Testdaten für Benutzer hinzu (Passwörter werden gehasht)
    const hashedUsers = UserTestdata.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));
    await UserModel.bulkCreate(hashedUsers);
    console.log(
      'Testdaten für Benutzer wurden erfolgreich in die Datenbank eingefügt.'
    );

    // Füge die Testdaten für Events ein
    await EventModel.bulkCreate(EventTestdata);
    console.log(
      'Testdaten für Events wurden erfolgreich in die Datenbank eingefügt.'
    );
  } catch (error) {
    console.error(
      'Fehler bei der Initialisierung der Datenbank:',
      error.message
    );
  }
};

module.exports = initializeDatabase;
