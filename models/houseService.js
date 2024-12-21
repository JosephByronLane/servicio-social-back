
//house-service join table since its a many to many relationship

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HouseService = sequelize.define(
    'HouseService',
    {
      houseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Houses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      serviceId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    },
    {
        paranoid: true,
    },
  );

  return HouseService;
};
