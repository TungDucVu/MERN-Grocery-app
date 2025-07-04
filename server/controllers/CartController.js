import User from "../models/User.js"

// update user card data
export const updateCart = async(req, res) => {
    try {
        const {userId, cartItems} = req.body
        await User.findByIdAndUpdate(userId, {cartItems})
        res.json({success: true, message: "Cart updated"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}