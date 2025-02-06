// controllers/listingController.js
const { Op, Sequelize } = require('sequelize');
const { sequelize, Owner, House, Service, Listing, Image } = require('../models');
const path = require('path');
const fs = require('fs-extra');
const { verifyDeletionToken } = require('../services/token.service');
const { sendEmail } = require('../services/email.service');
const { generateDeletionToken } = require('../services/token.service');


//for UI simplicity we make a giant monolith function that adds a listing with all its associated data.

const createListing = async (req, res) => {
    
  const {
    tempId, //tempId from image upload
    owner, //object with owner data       
    house, //object with house data
    services,    //array of service names or IDs
    listing, //object with  listing data
  } = req.body;

    const tempDir = process.env.UPLOAD_TEMP_DIR || `./assets/temp/${tempId}`;
    const permanentDir = process.env.UPLOAD_PERMANENT_DIR || './assets/listings';

  //check if the temp directory exists and if there are images in it
  if (!fs.existsSync(tempDir)) {
    return res.status(400).json({ message: 'Invalid tempId or no images uploaded' });
  }
  if(fs.readdirSync(tempDir).length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }
  

  const transaction = await sequelize.transaction();
  let createdListing;
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

    const listingId = listingInstance.id;

    const images = await Image.findAll({
      where: { tempId },
      transaction,
    });

    //move the images from their temp directory to the prod one
    const movedImages = await Promise.all(
        images.map(async (image) => {
        const oldPath = path.resolve(image.imageUrl);
        const newDir = path.join(permanentDir, `${listingId}`);
        const newPath = path.join(newDir, path.basename(image.imageUrl));
        
        await fs.ensureDir(newDir);
        
        await fs.move(oldPath, newPath, { overwrite: true });

        //update image record with prod data (removing the tempid)
        image.listingId = listingId;
        image.tempId = null;
        image.imageUrl = path.relative('./', newPath).replace(/\\/g, '/'); 
        console.log("Image Listing ID: ", image.listingId);

        console.log("Image URL: ", image.imageUrl);

        await image.save({ transaction });
        return {
            id: image.id,
            imageUrl: image.imageUrl,
        };
        })
    );

    await transaction.commit();

    createdListing = await Listing.findOne({
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

    console.log("Listing created, sending email");
    
    res.status(201).json({
      message: 'Listing created successfully.',
      data: createdListing,
      images: movedImages,
    });
  } catch (error) {
    //if anything goes wrong, we rollback the transaction
    await transaction.rollback();
    console.error(`Error while creating listing: ${error}`);
    res.status(500).json({
      message: 'Internal server error.'
    });
  }

  try{
    //after  creating a listing we send an email to the owner with the listing id
    const ownerEmail = owner.email;

    const token = generateDeletionToken({
      listingId: createdListing.id,
      email: ownerEmail,
    });

    console.log("Token: ", token);

    console.log("Owner Email: ", ownerEmail);

    const deletionUrl = `${process.env.FRONTEND_URL}/listing/delete/delete?token=${token}`;

    const templatePath = path.join(__dirname, '..', 'templates', 'new.template.html');
    const logoPath = path.join(__dirname, '..', 'templates', 'logo-universidad-modelo.png');

    const subject = '¡Gracias por crear un listado!';
    const replacements = {
      ownerName: owner.firstName,
      listingTitle: createdListing.title, 
      listingId: token,
      deletionUrl,

    };


    const attachments = [
      {
        filename: 'logo-universidad-modelo.png',
        path: logoPath,
        cid: 'logo_cid', 
      },
    ];

    // Send the email
    await sendEmail(ownerEmail, subject, templatePath, replacements, attachments);

  }
  catch(error){
    console.error('Error sending email:', error);
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
      res.status(500).json({
        message: 'Internal server error.'
      });    }
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
    res.status(500).json({
      message: 'Internal server error.'
    });  }
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
        console.error('Error deleting listing by id:', error);
        res.status(500).json({
          message: 'Internal server error.'
        });    }
}

const deleteListingByEmail = async (req, res) => {
    const { token } = req.query;
    //TODO: move this into a validator
    if (!token) {
      return res.status(400).json({ message: 'Deletion token is required.' });
    }
  
    try {
      const decoded = verifyDeletionToken(token);
  
      const { listingId, email } = decoded;
      const listing = await Listing.findOne({
        where: { id: listingId },
        include: [{ model: House, as: 'house', include: [{ model: Owner, as: 'owner' }] }],
      });
  
      if (!listing) {
        res.redirect(`${process.env.FRONTEND_URL}/deletion.error.html`);
      }
      console.log("Found Listing");
      const ownerEmail = listing.house.owner.email; 
  
      if (email !== ownerEmail) {
        return res.status(403).json({ message: 'Unauthorized request.' });
      }
      console.log("Owner Email: ", ownerEmail);
      const transaction = await sequelize.transaction();
      console.log("Begin Transaction");
      try {
        //remove listing
        await listing.destroy(            
            { transaction });
        console.log("Listing Removed");
        await transaction.commit();
  
        res.redirect(`${process.env.FRONTEND_URL}/deletion.success.html`);
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Deletion token has expired.' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: 'Invalid deletion token.' });
      }
      console.error('Error deleting listing by email:', error);
      res.status(500).json({
        message: 'Internal server error.'
      });    }
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
        res.status(500).json({
          message: 'Internal server error.'
        });    }
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
          queryOptions.subQuery = false;
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
