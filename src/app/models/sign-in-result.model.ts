import { Cart } from './cart/cart.model';
import Customer from './customer.model';

export default interface SignInResult {
  customer: Customer;
  cart: Cart;
  accessToken?: string; // NOTE: custom field added to handle auth token according to SCRUM-42
}
