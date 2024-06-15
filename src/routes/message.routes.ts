import express from 'express';
import { Response, Request } from 'express';
import { getMessage, sendMessage } from '../controllers/message.controller';
import protectRoute from '../middleware/protectRoute';

const router = express.Router();

router.get('/:id', protectRoute, getMessage);
router.post('/send/:id', protectRoute, sendMessage);

export default router;