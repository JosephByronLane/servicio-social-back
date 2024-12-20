const { get } = require('../app');
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

    if (services && services.length > 0) {
      const serviceInstances = await Service.findAll({
        where: { name: services },
        transaction,
      });

      if (serviceInstances.length !== services.length) {
        throw new Error('One or more services are invalid.');
      }

      await houseInstance.addServices(serviceInstances, { transaction });
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

const deleteHouseById = async (req, res) => {
    try {
        const house = await House.findByPk(req.params.id);
        if (house) {
        await house.destroy();
        res.json({ message: 'House deleted' });
        } else {
        res.status(404).json({ message: 'House not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete house', error: error.message });
    }
}

const getHousesByOwnerEmail = async (req, res) => {   
    try {
        const owner = await Owner.findOne({ where: { email: req.params.email } });
        if (owner) {
        const houses = await House.findAll({ where: { ownerId: owner.id } });
        res.json(houses);
        } else {
        res.status(404).json({ message: 'Owner not found by email' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve houses', error: error.message });
    }
}

const getHousesByOwnerId = async (req, res) => {   
    try {
        const ownerId = await Owner.findOne({ where: { email: req.params.id } });
        if (owner) {
        const houses = await House.findAll({ where: { ownerId: ownerId } });
        res.json(houses);
        } else {
        res.status(404).json({ message: 'Owner not found by email' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve houses', error: error.message });
    }
}

const getHouseById = async (req, res) => {
    try {
        const house = await House.findByPk(req.params.id);
        if (house) {
        res.json(house);
        } else {
        res.status(404).json({ message: 'House not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve house', error: error.message });
    }
}

module.exports = {
  createHouse,
  getHouses,
  deleteHouseById,
  getHousesByOwnerEmail,
  getHousesByOwnerId,
  getHouseById
};