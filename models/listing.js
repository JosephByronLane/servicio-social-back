const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Listing = sequelize.define(
    'Listing',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      houseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Houses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
        paranoid: true,
    },
  );


  Listing.afterDestroy(async (listing, options) => {
    try {
      // fetch images within the same transaction
      const images = await listing.getImages({ transaction: options.transaction });
      for (const image of images) {
        await image.destroy({ transaction: options.transaction });
      }

      // fetch and destroy the associated house within the same transaction
      const house = await listing.getHouse({ transaction: options.transaction });
      if (house) {
        await house.destroy({ transaction: options.transaction });
      }

      console.log(`afterDestroy hook: Successfully deleted images and house for listing ID ${listing.id}`);
    } catch (error) {
      console.error(`afterDestroy hook error for listing ID ${listing.id}:`, error);
      throw error;
    }
  });
  return Listing;
};
