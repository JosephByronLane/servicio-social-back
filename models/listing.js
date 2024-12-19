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
    const images = await listing.getImages();
    for (const image of images) {
      await image.destroy({ transaction: options.transaction });
    }
  });
  return Listing;
};
