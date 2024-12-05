import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import cartRaducer from '../features/cart/CardSlide'


 const Store = configureStore({
    reducer : {
        user : userReducer,
        cart : cartRaducer
    }
})
  
export default Store