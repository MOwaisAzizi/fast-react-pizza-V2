import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCard, getTotalCardPrcie ,getCart} from '../cart/CardSlide';
import EmptyCart from '../cart/EmptyCart'
import Store from '../../utils/Store';
import { formatCurrency } from '../../utils/helpers';
// import Cart from '../cart/Cart';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
const {username,position,status:addressStatus,address,error:errorAdress} = useSelector(store=>store.user)
const isLoadingAdress = addressStatus === 'loading'

  const dispatch = useDispatch()
  const formErrors = useActionData();

  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);

  const totalCardPrice = useSelector(getTotalCardPrcie)
  const priority = withPriority ? totalCardPrice * 0.2 : 0
  const totalPrice = priority + totalCardPrice

  if(!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              defaultValue={address}
              disabled = {isLoadingAdress}
              required
            />
          </div>
          {addressStatus === 'error' && (<p className='bg-red-100 text-red-700 text-sm mt-2 pt-2 rounded-md'>{errorAdress}</p>) }

       { !position.latitude && !position.longitude &&  <span  className='absolute right-0 top-1.5 z-50'>
          <Button type ='small' disabled = {isLoadingAdress} onClick={(e)=>{
            e.preventDefault()
              dispatch(fetchAddress())}} >get position</Button>
          </span>}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ?
         `${position.latitude},${position.longitude}`:''} />

          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? 'Placing order....' : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//whin we sunmit the form this functin will called whit a request props
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect,send cart item as a part of data

  //the api give it a random id
  const newOrder = await createOrder(order);
  
  Store.dispatch(clearCard())

  return redirect(`/order/${newOrder.id}`);

}

export default CreateOrder;
