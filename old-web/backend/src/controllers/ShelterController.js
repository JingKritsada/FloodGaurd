const ShelterService = require('../services/ShelterService');

class ShelterController {
  async getAllShelters(req, res) {
    try {
      const shelters = await ShelterService.getAllShelters();
      res.status(200).json(shelters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ShelterController();