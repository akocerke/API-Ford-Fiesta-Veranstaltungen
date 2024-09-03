const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');
const Event = require('./Event'); 
const User = require('./User'); 

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events', // Verwende den Modellnamen als String, nicht das Modell selbst
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Verwende den Modellnamen als String, nicht das Modell selbst
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'ratings'
});

// Beziehungen definieren
Rating.belongsTo(Event, { foreignKey: 'eventId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

module.exports = Rating;
