const express = require('express');
const RoadController = require('../controllers/RoadController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Road:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: รหัสถนน
 *         path:
 *           type: string
 *           description: เส้นทาง (GeoJSON หรือข้อมูลเส้นทาง)
 *         status:
 *           type: string
 *           enum: [OPEN, CLOSED, UNDER_CONSTRUCTION]
 *           description: สถานะถนน (เปิด, ปิด, อยู่ระหว่างก่อสร้าง)
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: วันที่อัปเดตล่าสุด
 */

/**
 * @swagger
 * tags:
 *   - name: Roads
 *     description: API สำหรับจัดการข้อมูลถนน
 */

/**
 * @swagger
 * /roads:
 *   get:
 *     summary: ดูรายการถนนทั้งหมด
 *     description: ดึงข้อมูลสถานะถนนทั้งหมดในระบบ
 *     tags: [Roads]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Road'
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/', RoadController.getAllRoads);

module.exports = router;