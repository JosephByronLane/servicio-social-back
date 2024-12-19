const { Service } = require('../models');

//we shouldn't need to create services, but im adding it just incase...
const createService = async (req, res) => {
  try {
    const { name } = req.body;

    
    const service = await Service.create({ name });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};


const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve services', error: error.message });
  }
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
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve service', error: error.message });
    }
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
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve service', error: error.message });
    }

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
        console.error(error);
        res.status(500).json({ message: 'Failed to delete service', error: error.message });
    }
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
        console.error(error);
        res.status(500).json({ message: 'Failed to delete service', error: error.message });
    }
}

module.exports = {
  createService,
  getServices,
  getServiceById,
  getServiceByName,
  deleteServiceById,
    deleteServiceByName
};
