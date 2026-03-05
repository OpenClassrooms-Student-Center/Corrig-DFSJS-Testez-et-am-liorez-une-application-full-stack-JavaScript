import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { SessionController } from '../controllers/session.controller';
import { TeacherController } from '../controllers/teacher.controller';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/async-handler';
import { validate, validateParams } from '../middleware/validate.middleware';
import { LoginSchema, RegisterSchema, IdParamSchema } from '../dto/auth.dto';
import { CreateSessionSchema, UpdateSessionSchema, ParticipationParamSchema } from '../dto/session.dto';

const router = Router();

const authController = new AuthController();
const sessionController = new SessionController();
const teacherController = new TeacherController();
const userController = new UserController();

// Auth routes (public)
router.post('/api/auth/login', validate(LoginSchema), asyncHandler((req, res) => authController.login(req, res)));
router.post('/api/auth/register', validate(RegisterSchema), asyncHandler((req, res) => authController.register(req, res)));

// Session routes (protected)
router.get('/api/session', asyncHandler(authMiddleware), asyncHandler((req, res) => sessionController.getAll(req, res)));
router.get('/api/session/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), asyncHandler((req, res) => sessionController.getById(req, res)));
router.post('/api/session', asyncHandler(authMiddleware), validate(CreateSessionSchema), asyncHandler((req, res) => sessionController.create(req, res)));
router.put('/api/session/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), validate(UpdateSessionSchema), asyncHandler((req, res) => sessionController.update(req, res)));
router.delete('/api/session/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), asyncHandler((req, res) => sessionController.delete(req, res)));
router.post('/api/session/:id/participate/:userId', asyncHandler(authMiddleware), validateParams(ParticipationParamSchema), asyncHandler((req, res) => sessionController.participate(req, res)));
router.delete('/api/session/:id/participate/:userId', asyncHandler(authMiddleware), validateParams(ParticipationParamSchema), asyncHandler((req, res) => sessionController.unparticipate(req, res)));

// Teacher routes (protected)
router.get('/api/teacher', asyncHandler(authMiddleware), asyncHandler((req, res) => teacherController.getAll(req, res)));
router.get('/api/teacher/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), asyncHandler((req, res) => teacherController.getById(req, res)));

// User routes (protected)
router.get('/api/user/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), asyncHandler((req, res) => userController.getById(req, res)));
router.post('/api/user/promote-admin', asyncHandler(authMiddleware), asyncHandler((req, res) => userController.promoteSelfToAdmin(req, res)));
router.delete('/api/user/:id', asyncHandler(authMiddleware), validateParams(IdParamSchema), asyncHandler((req, res) => userController.delete(req, res)));

export default router;
