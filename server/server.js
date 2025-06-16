import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// configs import
import connectDB from './configs/db.js'
import connectCloudinary from './configs/cloudinary.js'

// router import
import userRouter from './routes/userRoute.js'
import sellerRouter from './routes/sellerRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import addressRouter from './routes/addressRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()
const port = process.env.PORT || 4000

// configs
await connectDB()
await connectCloudinary()

// alow multiple origins
const allowedOrigins = ['http://localhost:5173']

// midleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))

// api routes
app.get('/', (req, res) => res.send("api is working"))
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})