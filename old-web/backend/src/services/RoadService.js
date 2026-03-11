const Road = require('../models/Road');

class RoadService {
  async getAllRoads() {
    return await Road.find();
  }
}

module.exports = new RoadService();