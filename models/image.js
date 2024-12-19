
//model for storing the images
//we save the image locally, and the URL inserted is its local URL. ("../uploads/imagename.jpg")
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Image = sequelize.define(
    'Image',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      listingId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Listings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
    },
    {
        paranoid: true,
    },
  );

  return Image;
};
