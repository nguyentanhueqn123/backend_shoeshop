const userModel = require('../models/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { cloudinary } = require('../config/index');
class UserController {
  async register(req, res) {
    const { email, password, nameAccount, phone, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing email and/or password' });
    }

    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already taken' });
      }

      const hashedPassword = await argon2.hash(password);
      const newUser = new userModel({
        email,
        password: hashedPassword,
        nameAccount,
        phone,
        role,
      });
      await newUser.save();

      res
        .status(201)
        .json({ success: true, message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing email and/or password' });
    }

    try {
      const user = await userModel.findOne({ email });
      if (!user || !(await argon2.verify(user.password, password))) {
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect email or password' });
      }

      const accessToken = jwt.sign(
        { userId: user._id, nameAccount: user.nameAccount, type: 'access' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { userId: user._id, nameAccount: user.nameAccount, type: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      user.refreshCurrent = refreshToken;
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshCurrent;

      res.json({
        success: true,
        message: 'User logged in successfully',
        user: userResponse,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async refreshToken(req, res) {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: 'Refresh token is required' });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      if (decoded.type !== 'refresh') {
        return res
          .status(403)
          .json({ success: false, message: 'Invalid token type' });
      }

      const user = await userModel.findById(decoded.userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      // Kiểm tra xem refresh token có khớp với token trong database không
      if (user.refreshCurrent !== refreshToken) {
        return res
          .status(403)
          .json({ success: false, message: 'Invalid refresh token' });
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, nameAccount: user.nameAccount, type: 'access' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user._id, nameAccount: user.nameAccount, type: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      user.refreshCurrent = newRefreshToken;
      await user.save();

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        tokens: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (error.name === 'JsonWebTokenError') {
        return res
          .status(403)
          .json({ success: false, message: 'Invalid refresh token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res
          .status(403)
          .json({ success: false, message: 'Refresh token expired' });
      }
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async logout(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized: User ID not found' });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      user.refreshCurrent = null;
      await user.save();

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getAllUser(req, res) {
    try {
      let query = {};
      if (req.query.role) {
        query.role = { $in: req.query.role.toUpperCase().split(',') };
      }
      if (req.query.textSearch) {
        query.nameAccount = { $regex: req.query.textSearch, $options: 'i' };
      }
      const users = await userModel
        .find(query)
        .select('-password -refreshCurrent');
      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getAllCustomers(req, res) {
    try {
      const customers = await userModel
        .find({ role: 'CUSTOMER' })
        .select('-password -cart -refreshCurrent');
      res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getStaff(req, res) {
    try {
      let query = { role: { $nin: ['CUSTOMER', 'ADMIN'] } };
      if (req.query.role) {
        query.role = req.query.role.toUpperCase();
      }
      if (req.query.textSearch) {
        query.nameAccount = { $regex: req.query.textSearch, $options: 'i' };
      }
      const staff = await userModel
        .find(query)
        .select('-password -cart -refreshCurrent');
      res.status(200).json(staff);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getOneUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getUserRole(req, res) {
    try {
      const findRole = await userModel.find(req.query);
      res.json(findRole);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async changeInfo(req, res) {
    const _id = req.params.id;
    const { nameAccount, email, phone } = req.body;
    let image = req.body.image;
    try {
      if (image) {
        // Nếu image là base64 string
        if (image.startsWith('data:image')) {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: process.env.CLOUDINARY_FOLDER,
          });
          image = uploadResponse.secure_url;
        }
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        _id,
        { nameAccount, email, phone, image },
        { new: true } // Trả về đối tượng sau khi đã được cập nhật
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      res.json({
        success: true,
        message: 'User information updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.findByIdAndDelete(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: {
          id: user._id,
          nameAccount: user.nameAccount,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async addToCart(req, res) {
    try {
      const { id } = req.params;
      const { productId } = req.body;
      const user = await userModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      user.cart.push(productId);
      await user.save();
      res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { id } = req.params;
      const { productId } = req.body;
      const user = await userModel.findByIdAndUpdate(
        id,
        { $pull: { cart: productId } },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new UserController();
