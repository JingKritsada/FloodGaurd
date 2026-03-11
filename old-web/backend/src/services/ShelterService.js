const Shelter = require('../models/Shelter');

class ShelterService {
  async getAllShelters() {
    return await Shelter.find();
  }
}

module.exports = new ShelterService();