const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  addressLine: user.addressLine || "",
  city: user.city || "",
  postalCode: user.postalCode || "",
  country: user.country || "India",
});

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone = "",
      addressLine = "",
      city = "",
      postalCode = "",
      country = "India",
    } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      addressLine,
      city,
      postalCode,
      country,
    });

    res.status(201).json({
      success: true,
      user: toUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      success: true,
      user: toUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: toUserResponse(req.user),
    });
  } catch (error) {
    next(error);
  }
};

const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, email, phone, addressLine, city, postalCode, country } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(409);
        throw new Error("Email is already in use");
      }
    }

    if (name !== undefined) req.user.name = name;
    if (email !== undefined) req.user.email = email;
    if (phone !== undefined) req.user.phone = phone;
    if (addressLine !== undefined) req.user.addressLine = addressLine;
    if (city !== undefined) req.user.city = city;
    if (postalCode !== undefined) req.user.postalCode = postalCode;
    if (country !== undefined) req.user.country = country;

    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      user: toUserResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
};
