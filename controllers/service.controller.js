const { Service } = require('../models');

//we shouldn't need to create services, but im adding it just incase...
const createService = async (req, res) => {
  try {
    const { name } = req.body;

    
    const service = await Service.create({ name });
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service', error);
    res.status(500).json({
      message: 'Internal server error.'
    });  }
};


const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error('Error getting all services', error);
    res.status(500).json({
      message: 'Internal server error.'
    });  }
};


const getServiceById = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (service) {
        res.json(service);
        } else {
        res.status(404).json({ message: 'Service not found by id' });
        }
    } catch (error) {
        console.error('error retrieving services by id', error);
        res.status(500).json({
          message: 'Internal server error.'
        });    }
}

const getServiceByName = async (req, res) => {
    try {
        const service = await Service.findOne({ where: { name: req.params.name } });
        if (service) {
        res.json(service);
        } else {
        res.status(404).json({ message: 'Service not found by name' });
        }
    } catch (error) {
        console.error('failed to get service by name', error);
        res.status(500).json({
          message: 'Internal server error.'
        });    }

}


const deleteServiceById = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (service) {
        await service.destroy();
        res.json(service);
        } else {
        res.status(404).json({ message: 'Service not found by id' });
        }
    } catch (error) {
        console.error('failed to delete service by id', error);
        res.status(500).json({
          message: 'Internal server error.'
        });    }
}

const deleteServiceByName = async (req, res) => {
    try {
        const service = await Service.findOne({ where: { name: req.params.name } });
        if (service) {
        await service.destroy();
        res.json(service);
        } else {
        res.status(404).json({ message: 'Service not found by name' });
        }
    } catch (error) {
        console.error('failed to delete server by name', error);
        res.status(500).json({
          message: 'Internal server error.'
        });    }
}

module.exports = {
  createService,
  getServices,
  getServiceById,
  getServiceByName,
  deleteServiceById,
  deleteServiceByName
};
