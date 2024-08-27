const { DataTypes, Model } = require('sequelize');
const sequelize = require('../setup/database');

class Admin extends Model {
  static async findAllAdmins() {
    return await Admin.findAll({ where: { role: 'admin' } });
  }
}

Admin.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'admin'
  },
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'users', // Verweist auf die gleiche Tabelle wie User
  timestamps: true,  // Aktiviert automatische Timestamps
  createdAt: 'created_at', // Datenbank-Spaltenname für CreatedAt
  updatedAt: 'updated_at'  // Datenbank-Spaltenname für UpdatedAt
});

module.exports = Admin;
