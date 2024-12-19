// controllers/listingController.js
const { sequelize, Owner, House, Service, Listing, Image } = require('../models');

//for UI simplicity we make a giant monolith function that adds a listing with all its associated data.
const createListing = async (req, res) => {
    
  const {
    owner, //object with owner data       
    house, //object with house data
    services,    //array of service names or IDs
    listing, //object with  listing data
    images,  //array with image URLS
    // TODO: Implement image upload
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const [ownerInstance, created] = await Owner.findOrCreate({
      where: { email: owner.email },
      defaults: {
        firstName: owner.firstName,
        lastName: owner.lastName,
        telephone: owner.telephone,
      },
      transaction,
    });

    const houseInstance = await House.create(
      {
        ownerId: ownerInstance.id,
        type: house.type,
        isLookingForRoommate: house.isLookingForRoommate,
        isOnlyWomen: house.isOnlyWomen,
        price: house.price,
        street: house.street,
        postalCode: house.postalCode,
        crossings: house.crossings,
        colony: house.colony,
      },
      { transaction }
    );

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

    const listingInstance = await Listing.create(
      {
        houseId: houseInstance.id,
        title: listing.title,
        description: listing.description,
      },
      { transaction }
    );

    if (images && images.length > 0) {
      const imageRecords = images.map((url) => ({
        listingId: listingInstance.id,
        imageUrl: url,
      }));

      await Image.bulkCreate(imageRecords, { transaction });
    }

    await transaction.commit();

    const createdListing = await Listing.findOne({
      where: { id: listingInstance.id },
      include: [
        {
          model: House,
          as: 'house',
          include: [
            { model: Owner, as: 'owner' },
            { model: Service, as: 'services', through: { attributes: [] } },
          ],
        },
        { model: Image, as: 'images' },
      ],
    });

    res.status(201).json({
      message: 'Listing created successfully.',
      data: createdListing,
    });
  } catch (error) {
    //if anything goes wrong, we rollback the transaction
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the listing.',
      error: error.message,
    });
  }
};

const getListingById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const listing = await Listing.findByPk(id, {
        include: [
          {
            model: House,
            as: 'house',
            include: [
              {
                model: Owner,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName', 'email', 'telephone'],
              },
              {
                model: Service,
                as: 'services',
                through: { attributes: [] },
              },
            ],
          },
          {
            model: Image,
            as: 'images',
          },
        ],
      });
  
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      res.json(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports = {
  createListing,
};