import express from 'express'
import { createChat, deleteChat, getAllChats, getSingleChat } from '../controllers/chat.controller.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router()
 
router.post("/create-chat",verifyToken,createChat);
router.get("/all-chats",verifyToken,getAllChats);
router.get("/single-chat/:id",verifyToken,getSingleChat);
router.delete("/delete-chat/:id",verifyToken,deleteChat);
export default router;
