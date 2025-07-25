import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// helper function to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
// helper function to validate phone number format
// const isValidPhone = (phone) => {
//   const re = /^\+?[1-9]\d{1,14}$/;
//   return re.test(String(phone).toLowerCase());
// };
// helper function to generate token 
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const signup = async (req, res) => {
  const { name, phone, address, email, password } = req.body;

    // Validate input fields
    if (!name || !phone || !address || !email || !password) {
    return res.status(400).json({ message: "All fields are required", success: false });
    }
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format", success: false });
    }
    // Validate phone number format
    // if (!isValidPhone(phone)) {
    //   return res.status(400).json({ message: "Invalid phone number format", success: false });
    // }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      phone,
      address,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT token
    const token = generateToken(newUser);
    // for auto login after signup
    res
      .status(200)
      .json({
        token,
        user: {
          id: newUser._id,
          username: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
        },
        success: true,
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    // Create JWT token
    const token = generateToken(user);

    res.status(200).json({ token, user: { id: user._id, username: user.name, email: user.email, phone: user.phone, address: user.address }, success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const  forgotPassword = async (req, res) => {
  const { email } = req.body;   
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send email with reset link (pseudo-code)
    // await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset email sent", success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// This code handles user signup by checking if the user already exists, hashing the password, creating a new user, and returning a JWT token along with user details. It also handles errors appropriately.
