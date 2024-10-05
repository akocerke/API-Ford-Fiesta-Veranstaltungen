// database/models/Ratings.js
const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');
const Event = require('./Event');
const User = require('./User');

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_id',
      references: {
        model: 'events',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'ratings',
  }
);

// Beziehungen definieren
Rating.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Rating;
