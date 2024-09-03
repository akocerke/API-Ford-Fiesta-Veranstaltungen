const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
}, {
  timestamps: true,  // Aktiviert automatische Timestamps
  createdAt: 'created_at', // Datenbank-Spaltenname für CreatedAt
  updatedAt: 'updated_at', // Datenbank-Spaltenname für UpdatedAt
  tableName: 'users'
});

module.exports = User ;
