const IncidentService = require('../services/IncidentService');

class IncidentController {
  async getAllIncidents(req, res) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const incidents = await IncidentService.getAllIncidents(parseInt(page), parseInt(limit));
      res.status(200).json(incidents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Admin / filtered endpoint secured by basic auth
  async getAllIncidentsFiltered(req, res) {
    try {
      const {
        type,
        status,
        reporterName,
        assignedTo,
        startDate,
        endDate,
        page = 1,
        limit = 100,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const filters = {};
      if (type) filters.type = type;
      if (status) filters.status = status;
      if (reporterName) filters.reporterName = { $regex: reporterName, $options: 'i' };
      if (assignedTo) filters.assignedTo = { $regex: assignedTo, $options: 'i' };
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
      }

      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      const result = await IncidentService.getIncidentsWithFilters(filters, parseInt(page), parseInt(limit), sort);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getIncidentById(req, res) {
    const { id } = req.params;
    try {
      const incident = await IncidentService.getIncidentById(id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      res.status(200).json(incident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createIncident(req, res) {
    try {
      const incident = await IncidentService.createIncident(req.body);
      res.status(201).json(incident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateIncidentStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updatedIncident = await IncidentService.updateIncidentStatus(id, status);
      if (!updatedIncident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
      res.status(200).json(updatedIncident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new IncidentController();