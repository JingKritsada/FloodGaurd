const RoadService = require('../services/RoadService');

class RoadController {
  async getAllRoads(req, res) {
    try {
      const roads = await RoadService.getAllRoads();
      res.status(200).json(roads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RoadController();