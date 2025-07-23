import prisma from "../dbConfig/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User registration failed",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Compare password
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({
        message: "Invalid credentials password does not match",
        success: false,
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
      }
    );

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken
      },
    });

    if (!updatedUser) {
      return res.status(400).json({
        message: "User login failed",
        success: false,
      });
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    }
    return res.
    cookie("refreshToken", refreshToken, options).
    cookie("accessToken", accessToken, options).
    status(200).json({
      message: "User logged in successfully",
      success: true,
      accessToken,
      refreshToken,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
const allUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    if (!allUsers) {
      return res.status(400).json({
        message: "Users not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
export { registerUser,loginUser ,allUsers };
