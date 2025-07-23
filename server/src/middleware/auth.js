import jwt from 'jsonwebtoken'
import prisma from '../dbConfig/db.js';

const verifyToken = async(req,res,next)=>{

    const token  = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ","");
    if(!token){
        return res.status(404).json({
            message:"Unautherized User",
            success:false
        })
    }
try {
    const verify = jwt.verify(token,process.env.JWT_TOKEN);

    const user = await prisma.user.findUnique({
        where:{
            id:verify.id
        }
    })
    if(!user){
        return res.status(404).json({
            message:"Un autherized user!",
            success:false
        })
    }

    req.user = user;
    next();

} catch (error) {
    return res.status(500).json({
        message:"Internal Server Error",
        success:false
    })
}
}

export default verifyToken;

