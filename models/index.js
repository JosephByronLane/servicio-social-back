const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

//we define the sequelize instance from the config at config/config.js 
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  }
);

//we apply said configuration to e ach model to bind them to the same sequelize instasnce
//this keeps everything tidy and allows for easier associations between models, which are defined below.
const Owner = require('./owner')(sequelize);
const House = require('./house')(sequelize);
const Service = require('./service')(sequelize);
const HouseService = require('./houseService')(sequelize);
const Listing = require('./listing')(sequelize);
const Image = require('./image')(sequelize);

//owners ↔ houses: one-to-many
//since one owner can have many houses, but a house can only have a single owner
Owner.hasMany(House, { foreignKey: 'ownerId', as: 'houses' });
House.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

//houses ↔ services: many-to-many through houseServices (defined above)
//since a house can have many services, and a service can be provided to many houses
//we use a join table to represent this many-to-many relationship
House.belongsToMany(Service, {
  through: HouseService,
  foreignKey: 'houseId',
  otherKey: 'serviceId',
  as: 'services',
});
Service.belongsToMany(House, {
  through: HouseService,
  foreignKey: 'serviceId',
  otherKey: 'houseId',
  as: 'houses',
});

// houses ↔ Listings: one-to-one 
House.hasMany(Listing, { foreignKey: 'houseId', as: 'listings' });
Listing.belongsTo(House, { foreignKey: 'houseId', as: 'house' });

// Listings ↔ Images: One-to-Many
// since one listing can have many images, but an image can only belong to a single listing
Listing.hasMany(Image, { foreignKey: 'listingId', as: 'images' });
Image.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });


module.exports = {
  sequelize,
  Owner,
  House,
  Service,
  HouseService,
  Listing,
  Image,
};
