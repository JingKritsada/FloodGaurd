const Example = require('../models/Example');

class ExampleService {
  async createExample(exampleData, userId = null) {
    const example = await Example.create(exampleData, userId);
    return example;
  }

  async getExampleById(exampleId) {
    const example = await Example.findById(exampleId);
    
    if (!example) {
      const error = new Error('Example not found');
      error.statusCode = 404;
      throw error;
    }
    
    return example;
  }

  async getAllExamples(filters = {}, page = 1, limit = 10) {
    const result = await Example.findAll(filters, page, limit);
    return result;
  }

  async updateExample(exampleId, updateData, userId = null) {
    const example = await Example.update(exampleId, updateData, userId);
    return example;
  }

  async deleteExample(exampleId, userId = null) {
    const result = await Example.delete(exampleId, userId);
    return result;
  }

  async initializeTables() {
    await Example.createTable();
  }
}

module.exports = new ExampleService();
