const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define(
    'Service',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    }
  );

  return Service;
};
