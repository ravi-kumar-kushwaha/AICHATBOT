import express from 'express'
import prisma from './dbConfig/db.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors(
    {
        origin:process.env.CLIENT_URL ,
        credentials:true
    }
));
app.use(cookieParser());
//database
prisma.$connect()

// user routes
import userRoutes from './routes/user.routes.js'
app.use("/api/v1/user",userRoutes);

// chat routes
import chatRoutes from './routes/chat.routes.js'
app.use("/api/v1/chat",chatRoutes);

//message routes

import messageRoutes from './routes/message.routes.js'  
app.use("/api/v1/message",messageRoutes);

export default app