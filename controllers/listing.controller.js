// controllers/listingController.js
const { Op, Sequelize } = require('sequelize');
const { sequelize, Owner, House, Service, Listing, Image } = require('../models');
const { search } = require('../app');

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

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
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

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteListingById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const listing = await Listing.findByPk(id);
    
        if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
        }
    
        await listing.destroy();
    
        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteListingByEmail = async (req, res) => {
    const { email } = req.params;
    
    try {
        const listings = await Listing.findAll({ where: { email } });
    
        if (!listings) {
            console.log("No listing found");
            return res.status(404).json({ message: 'Listing not found' });
        }
        console.log("Found listings")
        listings.forEach(async listing => {
            console.log("Deleting listing");
            await listing.destroy();
        });
    
        res.json({ message: 'Listings deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const searchListingByTitle = async (req, res) => {
    const { name } = req.params;

    try {
        const listings = await Listing.findAll({
            where: {
                title: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        res.json(listings);
    } catch (error) {
        console.error('Error searching listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const searchListings = async (req, res) => {
    try {
        //query params
        let  {
          services,               // array of service names or IDs
          type,                   // 'casa', 'departamento', 'cuarto'
          isLookingForRoommate,  // 'true' or 'false'
          isOnlyWomen,            // 'true' or 'false'
          minPrice,               // minimum price (decimal)
          maxPrice,               // maximum price (decimal)
          title,                  // title keyword
          sort,                   // 'newest', 'oldest', 'alphabetical', 'price_asc', 'price_desc'
          paging,                 // 'true' or 'false'
          page = 1,               // page number (default: 1)
          pageSize = 10           // number of items per page (default: 10)
        } = req.query;

        // we make sure that services is an array because else it throws an error when parsing them.
        // we also normalize the services to an array of strings
        if (services) {
            
            if (typeof services === 'string') {
              services = services.split(',').map(service => service.trim());
            }
             else if (!Array.isArray(services)) {
              services = [services];
            }
          
        }
      

        //query options
        const queryOptions = {
          where: {},
          include: [
            {
              model: House,
              as: 'house',
              where: {}, 
              include: [
                {
                  model: Service,
                  as: 'services',
                  attributes: ['id', 'name'],
                  through: { attributes: [] }, 
                },
              ],
            },
            {
              model: Image,
              as: 'images',
              attributes: ['id', 'imageUrl'],
            },
          ],
          distinct: true,
        };
    
        // titles
        if (title) {
          queryOptions.where.title = {
            [Op.like]: `%${title}%`,
          };
        }
        
        // house filters
        if (type) {
          queryOptions.include[0].where.type = type;
        }
    
        if (isLookingForRoommate !== undefined) {
          queryOptions.include[0].where.isLookingForRoommate = isLookingForRoommate === 'true';
        }
    
        if (isOnlyWomen !== undefined) {
          queryOptions.include[0].where.isOnlyWomen = isOnlyWomen === 'true';
        }
    
        if (minPrice || maxPrice) {
          queryOptions.include[0].where.price = {};
          if (minPrice) {
            queryOptions.include[0].where.price[Op.gte] = parseFloat(minPrice);
          }
          if (maxPrice) {
            queryOptions.include[0].where.price[Op.lte] = parseFloat(maxPrice);
          }
        }
    
    // services
    if (services && services.length > 0) {
        queryOptions.include[0].include[0].where = {
          name: {
            [Op.in]: services,
          },
        };
  
        // Group by Listing.id and ensure that the number of matched services equals the number of services queried
        queryOptions.group = ['Listing.id'];
        queryOptions.having = Sequelize.where(
          Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('house.services.id'))),
          {
            [Op.eq]: services.length,
          }
        );
      }
    
        // sorting results
        switch (sort) {
          case 'newest':
            queryOptions.order = [['createdAt', 'DESC']];
            break;
          case 'oldest':
            queryOptions.order = [['createdAt', 'ASC']];
            break;
          case 'alphabetical':
            queryOptions.order = [['title', 'ASC']];
            break;
          case 'price_asc':
            queryOptions.order = [[{ model: House, as: 'house' }, 'price', 'ASC']];
            break;
          case 'price_desc':
            queryOptions.order = [[{ model: House, as: 'house' }, 'price', 'DESC']];
            break;
          default:
            queryOptions.order = [['createdAt', 'DESC']];
        }
    
        // page
        let paginationOptions = {};
        if (paging === 'true') {
          const limit = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
          const offset = (parseInt(page, 10) - 1) * limit;
          paginationOptions = { limit, offset };
        }
    
        // merge
        Object.assign(queryOptions, paginationOptions);
    
        
        const listings = await Listing.findAll(queryOptions);
    
        // metadata
        let total = null;
        if (paging === 'true') {
          const countOptions = {
            where: queryOptions.where,
            include: queryOptions.include,
            distinct: true,
          };
    
          if (queryOptions.group) {
            
            const countResult = await Listing.findAll({
              attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Listing.id')), 'count'],
              ],
              ...countOptions,
              group: ['Listing.id'],
              having: queryOptions.having,
            });
            total = countResult.length;
          } else {
            total = await Listing.count(countOptions);
          }
        }
    
    
        res.status(200).json({
          data: listings,
          ...(paging === 'true' && {
            pagination: {
              total,
              page: parseInt(page, 10),
              pageSize: parseInt(pageSize, 10),
              totalPages: Math.ceil(total / parseInt(pageSize, 10)),
            },
          }),
        });
      } catch (error) {
        console.error('Error in searchListings:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  };

module.exports = {
    createListing,
    getListingById,
    getListings,
    deleteListingById,
    deleteListingByEmail,
    searchListingByTitle,
    searchListings,
};
