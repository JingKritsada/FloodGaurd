const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validation } = require('../middlewares/validationMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: รหัสผู้ใช้
 *         username:
 *           type: string
 *           description: ชื่อผู้ใช้
 *         email:
 *           type: string
 *           description: อีเมล
 *         role:
 *           type: string
 *           description: บทบาท (พลเมือง, เจ้าหน้าที่, ศูนย์บัญชาการ)
 *         is_active:
 *           type: boolean
 *           description: สถานะการใช้งาน
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: ชื่อผู้ใช้ (3-50 ตัวอักษร)
 *           example: john_doe
 *         password:
 *           type: string
 *           description: รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
 *           example: password123
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: ชื่อผู้ใช้ (3-50 ตัวอักษร, ใช้ได้เฉพาะ a-z, A-Z, 0-9, _)
 *           example: john_doe
 *         password:
 *           type: string
 *           description: รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
 *           example: password123
 *         email:
 *           type: string
 *           description: อีเมล (ไม่บังคับ)
 *           example: john@example.com
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: อีเมลใหม่
 *         role:
 *           type: string
 *           description: บทบาทใหม่
 *   responses:
 *     UnauthorizedError:
 *       description: ไม่มีสิทธิ์เข้าถึง - ต้องมี Token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API สำหรับการยืนยันตัวตนและจัดการผู้ใช้
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     description: ใช้สำหรับเข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน จะได้รับ JWT Token กลับมา
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT Token สำหรับการยืนยันตัวตน
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
 */
router.post('/login', [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
], validation, AuthController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: ลงทะเบียนผู้ใช้ใหม่
 *     description: สร้างบัญชีผู้ใช้ใหม่ในระบบ
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: ลงทะเบียนสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       409:
 *         description: ชื่อผู้ใช้หรืออีเมลซ้ำ
 */
router.post('/register', [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
], validation, AuthController.register);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: ดูข้อมูลโปรไฟล์
 *     description: ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่เข้าสู่ระบบ
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   put:
 *     summary: อัปเดตโปรไฟล์
 *     description: แก้ไขข้อมูลโปรไฟล์ของผู้ใช้ (ไม่สามารถแก้ชื่อผู้ใช้และรหัสผ่านได้)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: ตรวจสอบความถูกต้องของ Token
 *     description: ตรวจสอบว่า JWT Token ยังใช้งานได้หรือไม่
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token is valid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         username:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/verify', authenticateToken, AuthController.verifyToken);

module.exports = router;
