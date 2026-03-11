const ExampleService = require('../services/ExampleService');
const { msg } = require('../utils/helper');

class ExampleController {
  async createExample(req, res, next) {
    try {
      const { field_1, field_2, field_3 } = req.body;
      const userId = req.user?.userId;

      const example = await ExampleService.createExample(
        { field_1, field_2, field_3 },
        userId
      );

      return res.status(201).json(msg({
        data: example,
        message: "Example created successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async getExampleById(req, res, next) {
    try {
      const { id } = req.params;
      const example = await ExampleService.getExampleById(id);

      return res.status(200).json(msg({
        data: example,
        message: "Example retrieved successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async getAllExamples(req, res, next) {
    try {
      const { page = 1, limit = 10, field_1, field_2, createdBy } = req.query;
      
      const filters = {};
      if (field_1) filters.field_1 = field_1;
      if (field_2) filters.field_2 = field_2;
      if (createdBy) filters.createdBy = createdBy;

      const result = await ExampleService.getAllExamples(
        filters,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json(msg({
        data: result,
        message: "Examples retrieved successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async updateExample(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.userId;

      const example = await ExampleService.updateExample(id, updateData, userId);

      return res.status(200).json(msg({
        data: example,
        message: "Example updated successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async deleteExample(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const result = await ExampleService.deleteExample(id, userId);

      return res.status(200).json(msg({
        data: result,
        message: "Example deleted successfully"
      }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExampleController();
