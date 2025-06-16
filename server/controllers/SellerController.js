import jwt from 'jsonwebtoken'

//Login seller
export const sellerLogin = async(req, res) => {
    try {
        const {email, password} = req.body

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'})
            res.cookie('sellerToken', token, {
                httpOnly: true,                                                         // prevent javascript to access cookie
                secure: process.env.NODE_ENV === 'production',                          // use secure cookie in production 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000,                                        // cookie expiration time
            })

            return res.json({success: true, message: 'Seller Logged In'})
        }
        else {
            return res.json({success: false, message: 'Invalid credentials'})
        }
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// check seller authentication
export const isSellerAuth = async(req,res) => {
    try {
        return res.json({success: true})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Logout user
export const sellerLogout = async(req, res) => {
    try {
        res.clearCookie('sellerToken', {
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