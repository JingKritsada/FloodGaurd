const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FloodGuard API - ระบบจัดการภัยน้ำท่วมจังหวัดสุโขทัย',
      version: '1.0.0',
      description: 'API สำหรับระบบจัดการภัยน้ำท่วม FloodGuard รองรับการแจ้งเหตุการณ์ การติดตามสถานะ และการจัดการศูนย์พักพิง',
      contact: {
        name: 'FloodGuard Team',
        email: 'support@floodguard.com'
      }
    },
    servers: [
      // {
      //   url: `http://localhost:${process.env.PORT ?? 3000}/api`,
      //   description: 'Development server',
      // },
      {
        url: `https://platform.psru.ac.th:${process.env.PORT ?? 3000}/api`,
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'การยืนยันตัวตนและจัดการผู้ใช้',
      },
      {
        name: 'Incidents',
        description: 'การจัดการเหตุการณ์น้ำท่วม',
      },
      {
        name: 'Roads',
        description: 'ข้อมูลสถานะถนน',
      },
      {
        name: 'Shelters',
        description: 'ศูนย์พักพิงผู้ประสบภัย',
      },
      {
        name: 'Example',
        description: 'ตัวอย่าง API',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'ใส่ JWT Token ที่ได้จากการ Login (ไม่ต้องใส่คำว่า "Bearer" ข้างหน้า)'
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'Basic Authentication สำหรับ Admin endpoints'
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};