const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const IncidentController = require('../controllers/IncidentController');
const { validation } = require('../middlewares/validationMiddleware');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Incident:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: รหัสเหตุการณ์
 *         type:
 *           type: string
 *           enum: [MEDICAL, SUPPLIES, ROAD_BLOCKED, EVACUATION, RISK_AREA, LEVEE_BREACH]
 *           description: ประเภทเหตุการณ์ (ฉุกเฉินทางการแพทย์, ขาดแคลนเสบียง, ถนนปิด, อพยพ, พื้นที่เสี่ยง, คันกั้นน้ำแตก)
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *           description: สถานะ (เปิด, กำลังดำเนินการ, เสร็จสิ้น)
 *         description:
 *           type: string
 *           description: รายละเอียดเหตุการณ์
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: ละติจูด
 *             longitude:
 *               type: number
 *               description: ลองจิจูด
 *         reporterName:
 *           type: string
 *           description: ชื่อผู้รายงาน
 *           default: พลเมืองดี
 *         assignedTo:
 *           type: string
 *           description: มอบหมายให้
 *         path:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *           description: เส้นทางการเคลื่อนที่
 *         image:
 *           type: string
 *           description: URL ของภาพประกอบ
 *         victimCount:
 *           type: number
 *           description: จำนวนผู้ประสบภัย
 *           default: 1
 *         hasBedridden:
 *           type: boolean
 *           description: มีผู้ป่วยติดเตียงหรือไม่
 *           default: false
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์ติดต่อ
 *         address:
 *           type: string
 *           description: ที่อยู่
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: วันที่สร้าง
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: วันที่อัปเดตล่าสุด
 *     CreateIncidentRequest:
 *       type: object
 *       required:
 *         - type
 *         - status
 *         - description
 *         - location
 *       properties:
 *         type:
 *           type: string
 *           enum: [MEDICAL, SUPPLIES, ROAD_BLOCKED, EVACUATION, RISK_AREA, LEVEE_BREACH]
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           required:
 *             - latitude
 *             - longitude
 *           properties:
 *             latitude:
 *               type: number
 *               example: 17.0061
 *             longitude:
 *               type: number
 *               example: 99.8325
 *         reporterName:
 *           type: string
 *           example: สมชาย ใจดี
 *         phone:
 *           type: string
 *           example: "0812345678"
 *         victimCount:
 *           type: number
 *           example: 3
 *         hasBedridden:
 *           type: boolean
 *           example: false
 *         address:
 *           type: string
 *           example: "123 หมู่ 1 ต.ปากแคว อ.เมือง จ.สุโขทัย"
 *     UpdateStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *           description: สถานะใหม่
 */

/**
 * @swagger
 * tags:
 *   - name: Incidents
 *     description: API สำหรับจัดการเหตุการณ์น้ำท่วม
 */

/**
 * @swagger
 * /incidents:
 *   get:
 *     summary: ดูรายการเหตุการณ์ทั้งหมด
 *     description: ดึงข้อมูลเหตุการณ์ทั้งหมดแบบแบ่งหน้า (Public endpoint)
 *     tags: [Incidents]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หมายเลขหน้า
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: จำนวนรายการต่อหน้า
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Incident'
 *                 total:
 *                   type: integer
 *                   description: จำนวนทั้งหมด
 *                 page:
 *                   type: integer
 *                   description: หน้าปัจจุบัน
 *                 totalPages:
 *                   type: integer
 *                   description: จำนวนหน้าทั้งหมด
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
// Define routes
// Public endpoints
router.get('/', IncidentController.getAllIncidents);

/**
 * @swagger
 * /incidents/filter:
 *   get:
 *     summary: ค้นหาเหตุการณ์แบบกรองตัวกรอง (สำหรับผู้ดูแลระบบ)
 *     description: ค้นหาเหตุการณ์ด้วยตัวกรองต่างๆ ต้องใช้ Basic Authentication
 *     tags: [Incidents]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MEDICAL, SUPPLIES, ROAD_BLOCKED, EVACUATION, RISK_AREA, LEVEE_BREACH]
 *         description: กรองตามประเภท
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *         description: กรองตามสถานะ
 *       - in: query
 *         name: reporterName
 *         schema:
 *           type: string
 *         description: กรองตามชื่อผู้รายงาน (รองรับการค้นหาบางส่วน)
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: กรองตามผู้รับผิดชอบ (รองรับการค้นหาบางส่วน)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่เริ่มต้น (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: วันที่สิ้นสุด (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หมายเลขหน้า
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: จำนวนรายการต่อหน้า
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: เรียงลำดับตามฟิลด์
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: ลำดับการเรียง
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Incident'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: ไม่ได้ยืนยันตัวตน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
// Filtered/administrative endpoint (protected by basic auth)
// Use query params for filtering: type, status, reporterName, assignedTo, startDate, endDate, page, limit, sortBy, sortOrder
const basicAuth = require('../middlewares/basicAuthMiddleware');
router.get('/filter', basicAuth, IncidentController.getAllIncidentsFiltered);

/**
 * @swagger
 * /incidents/{id}:
 *   get:
 *     summary: ดูรายละเอียดเหตุการณ์
 *     description: ดึงข้อมูลเหตุการณ์ตาม ID
 *     tags: [Incidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสเหตุการณ์
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       404:
 *         description: ไม่พบเหตุการณ์
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/:id', IncidentController.getIncidentById);

/**
 * @swagger
 * /incidents:
 *   post:
 *     summary: สร้างเหตุการณ์ใหม่
 *     description: บันทึกเหตุการณ์น้ำท่วมใหม่เข้าระบบ
 *     tags: [Incidents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIncidentRequest'
 *     responses:
 *       201:
 *         description: สร้างเหตุการณ์สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
// Protected endpoints
router.post('/', [
    body('type')
        .isIn(['MEDICAL', 'SUPPLIES', 'ROAD_BLOCKED', 'EVACUATION', 'RISK_AREA', 'LEVEE_BREACH'])
        .withMessage('Invalid incident type'),
    body('status')
        .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
        .withMessage('Invalid status'),
    body('description')
        .isLength({ min: 1 })
        .withMessage('Description is required'),
    body('location.latitude')
        .isNumeric()
        .withMessage('Latitude must be a number'),
    body('location.longitude')
        .isNumeric()
        .withMessage('Longitude must be a number'),
], validation, IncidentController.createIncident);

/**
 * @swagger
 * /incidents/{id}/status:
 *   patch:
 *     summary: อัปเดตสถานะเหตุการณ์
 *     description: เปลี่ยนสถานะของเหตุการณ์ (เฉพาะเจ้าหน้าที่และศูนย์บัญชาการ)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสเหตุการณ์
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: อัปเดตสถานะสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: ไม่มีสิทธิ์ (ต้องเป็นเจ้าหน้าที่หรือศูนย์บัญชาการ)
 *       404:
 *         description: ไม่พบเหตุการณ์
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.patch('/:id/status', [
    body('status')
        .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
        .withMessage('Invalid status'),
], validation, authenticateToken, requireRole(['เจ้าหน้าที่', 'ศูนย์บัยชาการ']), IncidentController.updateIncidentStatus);

module.exports = router;