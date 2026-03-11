const express = require('express');
const ShelterController = require('../controllers/ShelterController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelter:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: รหัสศูนย์พักพิง
 *         name:
 *           type: string
 *           description: ชื่อศูนย์พักพิง
 *         capacity:
 *           type: number
 *           description: ความจุ (จำนวนคนที่รองรับได้)
 *         occupancy:
 *           type: number
 *           description: จำนวนผู้พักอาศัยปัจจุบัน
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: ละติจูด
 *             longitude:
 *               type: number
 *               description: ลองจิจูด
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: วันที่อัปเดตล่าสุด
 */

/**
 * @swagger
 * tags:
 *   - name: Shelters
 *     description: API สำหรับจัดการศูนย์พักพิงผู้ประสบภัย
 */

/**
 * @swagger
 * /shelters:
 *   get:
 *     summary: ดูรายการศูนย์พักพิงทั้งหมด
 *     description: ดึงข้อมูลศูนย์พักพิงทั้งหมดพร้อมข้อมูลความจุและจำนวนผู้พักอาศัย
 *     tags: [Shelters]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelter'
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/', ShelterController.getAllShelters);

module.exports = router;