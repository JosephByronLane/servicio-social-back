const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Owner = sequelize.define(
    'Owner',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      telephone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },{
        paranoid: true,
    }
  );
  Owner.afterDestroy(async (owner, options) => {
    const houses = await owner.getHouses();
    for (const house of houses) {
      await house.destroy({ transaction: options.transaction });
    }
  });
  return Owner;
};
