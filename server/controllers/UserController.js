import jwt from "jsonwebtoken"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'

// Register User
export const register = async(req, res) => {
    try {
        const {name, email, password} = req.body

        // non empty and existence check
        if (!name || !email || !password)  {
            return res.json({success: false, message: "Missing Details"})
        }
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.json({success: false, message: "User already exists!"})
        }
        
        // user creation
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})

        // token and cookie
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            httpOnly: true,                                                         // prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',                          // use secure cookie in production 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,                                        // cookie expiration time
        })

        // success response
        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Login User
export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        
        // nonempty
        if (!email || !password) {
            return res.json({success: false, message: 'Email and password are required'})
        }

        // user finding
        const user = await User.findOne({email: email})
        if (!user) {
            return res.json({success: false, message: 'Invalid email or password'})
        }

        // password matching
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid email or password'})
        }

        // token and cookie: whenever a user login a token is generated
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            httpOnly: true,                                                         // prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',                          // use secure cookie in production 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,                                        // cookie expiration time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch(error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// check user authentication
export const isAuth = async(req,res) => {
    try {
        const {userId} = req.body
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Logout user
export const logout = async(req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',                           
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}