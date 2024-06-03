import { Product } from './product/product.model';

interface CardMaker {
  makeCard(product: Product): void;
  makeEmptyCard(): void;
  clearAll(): void;
}

export default CardMaker;
