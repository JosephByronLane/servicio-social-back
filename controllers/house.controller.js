const { House, Owner, Service } = require('../models');

const createHouse = async (req, res) => {
  try {
    const {
      ownerId,
      type,
      isLookingForRoommate,
      isOnlyWomen,
      price,
      street,
      postalCode,
      crossings,
      colony
    } = req.body;

    const house = await House.create({
      ownerId,
      type,
      isLookingForRoommate,
      isOnlyWomen,
      price,
      street,
      postalCode,
      crossings,
      colony,
    });

    if (serviceIds && serviceIds.length > 0) {
      await house.addServices(serviceIds);
    }

    res.status(201).json(house);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create house', error: error.message });
  }
};

const getHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      include: [
        { model: Owner, as: 'owner' },
        { model: Service, as: 'services' },
      ],
    });
    res.json(houses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve houses', error: error.message });
  }
};

// Additional CRUD operations (updateHouse, deleteHouse) can be added similarly.

module.exports = {
  createHouse,
  getHouses,
};