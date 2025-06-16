import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'

//axios
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

//create context
export const AppContext = createContext()

// provider
export const AppContextProvider = ({children}) => {
   const currency = import.meta.env.VITE_CURRENCY;
   const [user, setUser] = useState(null)
   const [isSeller, setIsSeller] = useState(false)
   const [showUserLogin, setShowUserLogin] = useState(false)
   const [products, setProducts] = useState([])
   const [cartItems, setCartItems] = useState({})
   const [searchQuery, setSearchQuery] = useState({})
   
   // navigate
   const navigate = useNavigate()

   // Fetch products
   const fetchProducts = async() => {
      try {
         const {data} = await axios.get('/api/product/list')
         if (data.success) {
            setProducts(data.products)
         }
         else {
            toast.error(data.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   }
   useEffect(() => {
      fetchProducts()
   },[])

   //fetch seller status
   const fetchSeller = async() => {
      try {
         const {data} = await axios.get('/api/seller/is-auth')
         if (data.success) {
            setIsSeller(true)
         }
         else {
            setIsSeller(false)
         }
      } catch (error) {
         setIsSeller(false)
      }
   }
   useEffect(() => {
      fetchSeller()
   },[])

   // fetch user auth status
   const fetchUser = async() => {
      try {
         const {data} = await axios.get('/api/user/is-auth')
         if (data.success) {
            setUser(data.user)
            setCartItems(data.user.cartItems)
         }
      } catch (error) {
         setUser(null)
      }
   }
   useEffect(() => {
      fetchUser()
   }, [])

   // update db cart items
   useEffect(() => {
      const updateCart = async() => {
         try {
            const {data} = await axios.post('/api/cart/update', {cartItems})
            if (!data.success) {
               toast.error(data.message)
            }
         } catch (error) {
            toast.error(error.message)
         }
      }

      if (user) {
         updateCart()
      }
   }, [cartItems])

   // Add product to cart
   const addToCart = (itemId) => {
      let cartData = structuredClone(cartItems)
      if (cartData[itemId]) {
         cartData[itemId] += 1
      }
      else {
         cartData[itemId] = 1
      }
      setCartItems(cartData)
      toast.success("Added to Cart")
   }

   // Update cart item quantity
   const updateCartItem = (itemId, quantity) => {
      let cartData = structuredClone(cartItems)
      cartData[itemId] = quantity
      setCartItems(cartData)
      toast.success("Cart updated")
   }

   // Remove product from cart
   const removeFromCart = (itemId) => {
      let cartData = structuredClone(cartItems)
      if (cartData[itemId]) {
         cartData[itemId] -= 1
         if (cartData[itemId] == 0) {
            delete cartData[itemId]
         }
      }
      toast.success("Removed from cart")
      setCartItems(cartData)
   }

   // Get cart item count
   const getCartCount = () => {
      let count = 0
      for (const items in cartItems) {
         count += cartItems[items]
      }
      return count
   }

   // Get cart total amount
   const getCartAmount = () => {
      let total = 0
      for (const items in cartItems) {
         let itemInfo = products.find((product) => product._id === items)
         if (cartItems[items] > 0) {
            total += itemInfo.offerPrice * cartItems[items]
         }
      }
      return Math.floor(total * 100)/100
   }
   
   const value = {
      navigate, 
      user, setUser, setIsSeller, isSeller, 
      showUserLogin, setShowUserLogin, 
      products, currency, 
      cartItems, setCartItems, addToCart, updateCartItem, removeFromCart, getCartCount, getCartAmount,
      searchQuery, setSearchQuery,   
      fetchProducts,
      axios,
   }   

   return <AppContext.Provider value={value}>
      {children}
   </AppContext.Provider>
}

export const useAppContext = () => {
   return useContext(AppContext)
}