import { Product } from './product/product.model';

interface CardMaker {
  makeCard(product: Product, isProductInTheCart: boolean): void;
  makeEmptyCard(): void;
  clearAll(): void;
}

export default CardMaker;
