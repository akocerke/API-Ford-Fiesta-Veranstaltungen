// database/models/Violation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../setup/database");
const Event = require("./Event");
const User = require("./User");

const Violation = sequelize.define(
  "Violation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      // Entspricht event_id in der Datenbank
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
      field: "event_id", // Datenbank-Spalte
    },
    reportedBy: {
      // Entspricht reported_by in der Datenbank
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "reported_by", // Datenbank-Spalte
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed", "resolved"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "violations",
  },
);

// Beziehungen definieren
Violation.belongsTo(Event, { foreignKey: "eventId", as: "event" }); // Alias 'event'
Violation.belongsTo(User, { foreignKey: "reportedBy", as: "reportedByUser" }); // Alias 'reportedByUser'

module.exports = Violation;
