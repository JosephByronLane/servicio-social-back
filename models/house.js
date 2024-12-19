const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const House = sequelize.define(
    'House',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Owners',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: DataTypes.ENUM('Casa', 'Departamento', 'Cuarto'), //TODO: add custom errors for enum fails in the service
        allowNull: false,
      },
      isLookingForRoommate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isOnlyWomen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      crossings: { //cruzamientos, EJ "Entre las calles X y Y"
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      colony: { //colonia, no se como se dice en ingles xd
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
        paranoid: true,
    },
  );

  House.afterDestroy(async (house, options) => {
    
    const listings = await house.getListings();
    for (const listing of listings) {
      await listing.destroy({ transaction: options.transaction });
    }
    
    await house.removeServices(await house.getServices(), { transaction: options.transaction });
  });
  return House;
};
