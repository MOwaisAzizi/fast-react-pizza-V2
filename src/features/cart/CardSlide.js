import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart : [],
//    cart = {
//     pizzaId = '2020',
//     quantity : 30,
//     unitPrice : 20,
//     totalPrice = 10,
//    }
}


const cardSlice = createSlice({
    name : 'cart',
    initialState,
   reducers:{

     addItem(state,action){  
        state.cart.push(action.payload)
     },

     deleteItem(state,action){ 
        state.cart = state.cart.filter(state=>state.pizzaId !== action.payload.pizzaId)
     },

     incQuentity(state,action){
       const item = state.cart.find(item=>item.pizzaId === action.payload)
        item.quantity++;
        item.totalPrice  = item.quantity * item.unitPrice
     },

     decQuentity(state,action){
        const item = state.cart.find(item=>item.pizzaId === action.payload)        
        item.quantity--;
        item.totalPrice  = item.quantity * item.unitPrice
        
        if (item.quantity === 0) state.cart = state.cart.filter(state=>state.pizzaId !== action.payload)
        // a nice trick also: cardSlice.caseReducers.deleteItem(state, action);    

     },

     clearCard(state){
        state.cart = []
     },

   }
})
export default cardSlice.reducer

export const {addItem,deleteItem,incQuentity,decQuentity,clearCard} = cardSlice.actions

//functions used in useSelector to get the cart data
export function getTotalCardQuantity(state){
  return state.cart.cart.reduce((sum,item)=>sum+item.quantity,0)
}

export function getTotalCardPrcie(state){
   return state.cart.cart.reduce((sum,item)=>sum+item.totalPrice,0)
 }

 export function getCart(state){
   return state.cart.cart
 }

 export const getcurrentQuantityById = id => state => state.cart.cart.find(item=>item.pizzaId===id)?.quantity ?? 0
 