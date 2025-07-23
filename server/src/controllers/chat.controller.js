import prisma from "../dbConfig/db.js";


const createChat = async (req, res) => {
    try {
        const userId = req.user.id
        if(!userId){
            return res.status(404).json({
                message:"User not found",
                success:false
            });
        }

        const {title} = req.body || {};
        if(!title){
            return res.status(400).json({
                message:"Title is required",
                success:false
            });
        }

        const chat = await prisma.chat.create({
            data:{
                title,
                userId
            }
        })
        if(!chat){
            return res.status(500).json({
                message:"Chat not created",
                success:false
            });
        }
        return res.status(200).json({
            message:"Chat created successfully",
            success:true,
            data:chat
        })
    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong",
            success:false,
            error:error.message 
        });
    }
}


const getAllChats = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({
                message:"User not found",
                success:false
            });
        }

        const chats = await prisma.chat.findMany({
            where:{
                userId
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        if(!chats){
            return res.status(500).json({
                message:"Chats not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Chats fetched successfully",
            success:true,
            data:chats
        })
    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong",
            success:false,
            error:error.message 
        });
        
    }
}

const getSingleChat = async(req,res)=>{
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({
                message:"User not found",
                success:false
            });
        }

        const chatId = req.params.id;
        if(!chatId){
            return res.status(404).json({
                message:"ChatId not found",
                success:false
            });
        }

        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId
            },
            include:{
                messages:{
                    orderBy:{
                    createdAt:"asc"
                }
            }
            }
        });

        if(!chat){
            return res.status(404).json({
                message:"Chat not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Chat fetched successfully",
            success:true,
            data:chat
        })
    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong",
            success:false,
            error:error.message 
        })
    }
}

const deleteChat = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
  
      const chatId = req.params.id;
      if (!chatId) {
        return res.status(404).json({
          message: "Chat ID not found",
          success: false,
        });
      }
  
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });
  
      if (!chat || chat.userId !== userId) {
        return res.status(404).json({
          message: "Chat not found or unauthorized",
          success: false,
        });
      }
  
      await prisma.message.deleteMany({
        where: { chatId },
      });
  
      await prisma.chat.delete({
        where: { id: chatId },
      });
  
      return res.status(200).json({
        message: "Chat and all associated messages deleted successfully",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  };
  
export {
    createChat,
    getAllChats,
    getSingleChat,
    deleteChat
}