import express from 'express';
import adminController from './admin.controllers.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.get('/users', verifyToken('admin'), adminController.getAllUsers);
router.put('/enableUser', verifyToken('admin'), adminController.enableUser);
router.put('/disableUser', verifyToken('admin'), adminController.disableUser);

export default router;
