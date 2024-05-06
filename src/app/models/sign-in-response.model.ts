import Cart from './cart.model';
import Customer from './customer.model';

export default interface AuthenticationResponse {
  customer: Customer;
  cart: Cart;
}
