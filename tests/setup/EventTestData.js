// tests/setup/EventTestData.js
const EventTestdata = [
  {
    userId: 1, // Referenziert den Benutzer mit ID 1
    title: 'Ford Fiesta Treffen',
    description: 'Ein Treffen für alle Ford Fiesta-Enthusiasten!',
    date: new Date('2024-10-15T10:00:00Z'), // Zukunftstermin
    image: 'fiesta-treffen.jpg',
  },
  {
    userId: 1, // Referenziert den Benutzer mit ID 1
    title: 'Reparatur-Workshop',
    description: 'Lerne, wie man den Ford Fiesta wartet und repariert.',
    date: new Date('2024-11-20T14:00:00Z'), // Zukunftstermin
    image: 'fiesta-workshop.jpg',
  },
  {
    userId: 2, // Referenziert den Benutzer mit ID 2
    title: 'Sonntagsausfahrt',
    description:
      'Eine entspannte Ausfahrt durch die Landschaft mit dem Ford Fiesta.',
    date: new Date('2024-12-05T09:00:00Z'), // Zukunftstermin
    image: 'fiesta-ausfahrt.jpg',
  },
];

module.exports = EventTestdata;
