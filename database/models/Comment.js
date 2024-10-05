// database/models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../setup/database');

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Deaktiviert die automatische Verwaltung von `createdAt` und `updatedAt`
    tableName: 'comments',
  }
);

// Definiere die Beziehungen, falls erforderlich
Comment.associate = (models) => {
  Comment.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
  Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Comment;
