const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');
const Event = require('./Event'); 
const User = require('./User'); 

const Violation = sequelize.define('Violation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  },
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'violations'
});

// Beziehungen definieren
Violation.belongsTo(Event, { foreignKey: 'eventId' });
Violation.belongsTo(User, { foreignKey: 'reportedBy' });

module.exports = Violation;
