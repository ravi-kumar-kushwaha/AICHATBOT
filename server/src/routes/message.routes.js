import express from 'express'
import verifyToken from '../middleware/auth.js';
import { getMessage, sendMessage, stopGeneration } from '../controllers/message.controller.js';
const router = express.Router();
router.get("/get-message/:id",verifyToken,getMessage);

router.post("/send-message/:id",verifyToken,sendMessage);
router.post("/stop-generation/:id/stop",verifyToken,stopGeneration);
export default router;
