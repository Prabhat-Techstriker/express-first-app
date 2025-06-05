const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');
const AppError = require('../utils/AppError');
const { response } = require('express');

// register endpoint
const register = async (req, res, next) => {
    try {
        console.log('Register request body:', req.body);

        const { name, email, password, role } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new AppError('User already exists with this email', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        return ResponseHandler.success(
            res,
            { user: user.toJSON() },
            'Registration successful',
            201
        );
    } catch (error) {
        next(error);
    }
}
// login endpoint

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist with this email. Please register first.' });
        }

        // if the password is correct or not
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid credentials!!!' });
        }

        // create a token
        const token = jwt.sign({ userId: existingUser._id, email: existingUser.email, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '12h' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: existingUser,
            token
        })
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}


const changePassword = async (req, res) => {
    try {
        const userId = req.userInfoData.userId
        console.log("userId ======>", userId);

        //extract old and new password

        const { oldPassword, newPassword } = req.body

        const currentUser = await User.findById(userId)

        if (!currentUser) {
            return ResponseHandler.error(res, {
                success: false,
                message: "User not found."
            })
        }

        // check if the old password is correct 
        const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password)

        if (!isPasswordMatch) {
            return ResponseHandler.error(res, {
                statusCode: 400,
                message: "Old password does not matched."
            })
        }

        // console.log("password length ------->", newPassword.length);

        if (newPassword.length == 0) {
            return ResponseHandler.error(res, {
                statusCode: 400,
                message: "Please enter the valid password."
            })
        }
        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        currentUser.password = hashedPassword

        if (currentUser.save()) {
            return ResponseHandler.success(res, {
                message: "Password changes successfully!!!",
                data: currentUser
            })
        } else {
            return ResponseHandler.error(res, {
                message: "Failed to update password."
            })
        }

    } catch (error) {
        return ResponseHandler.error(res, {
            message: error.message
        })
    }
}

// create method for bycrypt password
/* const passwordHash = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);

    // create with pomise
    // return new Promise((resolve, reject) => {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         if (err) return reject(err);
    //         bcrypt.hash(password, salt, (err, hash) => {
    //             if (err) return reject(err);
    //             resolve(hash);
    //         });
    //     });
    // });
} */

module.exports = {
    register,
    login,
    changePassword
};