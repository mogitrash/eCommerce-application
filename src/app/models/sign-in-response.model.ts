import Cart from './cart.model';
import Customer from './customer.model';

export default interface SignInResponse {
  customer: Customer;
  cart: Cart;
}
