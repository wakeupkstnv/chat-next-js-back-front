import express from 'express';
import { getUserForSidebar } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUserForSidebar);

export default router;