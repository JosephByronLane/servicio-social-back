const { House, Owner, Service, sequelize } = require('../models');

const createHouse = async (req, res) => {
    const transaction = await sequelize.transaction();

  try {
    const {
      owner, //owner object,
      type,
      isLookingForRoommate,
      isOnlyWomen,
      price,
      street,
      postalCode,
      crossings,
      colony,
      services, //array of service names
    } = req.body;

    console.log("Creating house...");

    //since we might be trying to use a deleted user, we need to use paranoid: false
    const [ownerInstance, created] = await Owner.findOrCreate({
        where: { email: owner.email },
        defaults: {
          firstName: owner.firstName,
          lastName: owner.lastName,
          telephone: owner.telephone,
        },
        transaction,
        paranoid: false
      });
      
      //if the owner wasn't created (alreadi exists) and it has a deletedAt value, we restore it
      if (!created && ownerInstance.deletedAt) {
        await ownerInstance.restore({ transaction });
      }

    const houseInstance = await House.create({
      ownerId: ownerInstance.id,
      type,
      isLookingForRoommate,
      isOnlyWomen,
      price,
      street,
      postalCode,
      crossings,
      colony,
    },
    { transaction }
    );
    console.log("House created...");
    if (services && services.length > 0) {
      const serviceInstances = await Service.findAll({
        where: { name: services },
        transaction,
      });
      console.log("Adding services to house...");
      if (serviceInstances.length !== services.length) {
        throw new Error('One or more services are invalid.');
      }

      await houseInstance.addServices(serviceInstances, { transaction });
      console.log("Services added to house...");
    }

    await transaction.commit();

    res.status(201).json(houseInstance);
  } catch (error) {

    console.error(error);
    await transaction.rollback();
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