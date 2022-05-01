const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendEmail = require('../controllers/sendMail');

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_SECRET, { expiresIn: '5m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '15m' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' })
}

// ROUTE 1: Create a user using : POST "/api/auth/createuser"
router.post('/createuser', async (req, res) => {
    try {
        // Check whether the user with this email exists already
        let success = false
        const { fname, lname, email, password } = req.body
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success, error: "Please enter a unique email" });
        }

        if (password.length < 5) {
            return res.status(400).json({ success, error: "Password must be atleast 5 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        // Create a new user
        user = ({
            firstname: fname,
            lastname: lname,
            email: email,
            password: secPass
        })

        const activation_token = createActivationToken(user)
        const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`
        sendEmail(email, url)
        success = true;
        res.status(200).json({ success, msg: "Register Success! Please varify your email to start." });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// ROUTE 2: Verify email address using: POST "/api/auth/verification"
router.post('/verification', async (req, res) => {
    try {
        let success = false;
        const { activation_token } = req.body
        const user = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        const { firstname, lastname, email, password } = user
        const check = await User.findOne({ email })

        if (check) {
            return res.status(400).json({ success, msg: "Please enter unique email" })
        }

        // Create and save user
        const newUser = User.create({
            firstname, lastname, email, password
        })

        success = true

        res.json({ success, msg: "Account has been activated!" })
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

// ROUTE 3: Authenticate a user using: POST "/api/auth/login"
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let success = false;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, "error": "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, "error": "Please try to login with correct credentials" });
        }

        const refresh_token = createRefreshToken({ id: user._id })
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/auth/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        success = true;

        res.json({ success });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Get Access Token
router.post('/refresh_token', (req, res) => {
    try {
        let success = false
        const ref_token = req.cookies.refreshtoken
        if (!ref_token) {
            res.status(400).json({ success, msg: "Please login now" });
        }

        jwt.verify(ref_token, process.env.REFRESH_SECRET, (err, user) => {
            if (err) {
                res.status(400).json({ success, msg: "Please login now" });
            }
            const access_token = createAccessToken({ id: user._id })
            res.json({ access_token })
        })
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

module.exports = router;