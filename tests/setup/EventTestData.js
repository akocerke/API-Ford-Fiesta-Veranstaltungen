// tests/setup/EventTestData.js
const EventTestdata = [
  {
    user_id: 1, // Referenziert den Benutzer mit ID 1
    title: 'Ford Fiesta Treffen',
    description: 'Ein Treffen für alle Ford Fiesta-Enthusiasten!',
    date: new Date('2024-10-15T10:00:00Z'), // Zukunftstermin
    image: 'https://example.com/fiesta-treffen.jpg',
  },
  {
    user_id: 1, // Referenziert den Benutzer mit ID 1
    title: 'Reparatur-Workshop',
    description: 'Lerne, wie man den Ford Fiesta wartet und repariert.',
    date: new Date('2024-11-20T14:00:00Z'), // Zukunftstermin
    image: 'https://example.com/fiesta-workshop.jpg',
  },
  {
    user_id: 2, // Referenziert den Benutzer mit ID 2
    title: 'Sonntagsausfahrt',
    description:
      'Eine entspannte Ausfahrt durch die Landschaft mit dem Ford Fiesta.',
    date: new Date('2024-12-05T09:00:00Z'), // Zukunftstermin
    image: 'https://example.com/fiesta-ausfahrt.jpg',
  },
];

module.exports = EventTestdata;
