const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');
const User = require('./User');

const Event = sequelize.define(
  'Event',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // Aktiviert automatische Timestamps
    createdAt: 'created_at', // Datenbank-Spaltenname für CreatedAt
    updatedAt: 'updated_at', // Datenbank-Spaltenname für UpdatedAt
    tableName: 'events',
  }
);

// Beziehungen definieren
Event.belongsTo(User, { foreignKey: 'userId' });

module.exports = Event;
