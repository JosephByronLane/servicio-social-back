
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
        allowNull: true, //initially null because its first created with a uploadSessionId
        references: {
          model: 'Listings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tempId: {
        type: DataTypes.UUID,
        allowNull: true, 
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
        paranoid: true,
    },
  );

  return Image;
};
