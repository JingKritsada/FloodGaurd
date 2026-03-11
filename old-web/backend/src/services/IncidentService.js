const Incident = require('../models/Incident');

class IncidentService {
  async getAllIncidents(page, limit) {
    const skip = (page - 1) * limit;
    return await Incident.find().skip(skip).limit(limit);
  }

  async getIncidentsWithFilters(filters, page, limit, sort) {
    const skip = (page - 1) * limit;
    // Ensure filters is an object
    const query = filters && typeof filters === 'object' ? filters : {};
    return await Incident.find(query).sort(sort).skip(skip).limit(limit);
  }

  async getIncidentById(id) {
    return await Incident.findById(id);
  }

  async createIncident(data) {
    return await Incident.create(data);
  }

  async updateIncidentStatus(id, status) {
    return await Incident.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
  }
}

module.exports = new IncidentService();