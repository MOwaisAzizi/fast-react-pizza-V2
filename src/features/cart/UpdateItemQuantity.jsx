import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decQuentity, incQuentity } from "./CardSlide";

export default function UpdateItemQuantity({pizzaId,currentQuantity}){
const dispatch = useDispatch()

    return(
       <div className="flex items-center gap-1 md:gap-2">
         <Button type='round' onClick={()=>dispatch(decQuentity(pizzaId))}>-</Button>
         <span>{currentQuantity}</span>
         <Button type='round' onClick={()=>dispatch(incQuentity(pizzaId))}>+</Button>
       </div>
    )
}