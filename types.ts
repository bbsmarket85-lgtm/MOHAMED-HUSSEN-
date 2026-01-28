
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discountBadge?: string;
  category: string;
  isOrganic: boolean;
  isTropical: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum FilterType {
  ALL = 'All',
  ORGANIC = 'Organic',
  ON_SALE = 'On Sale',
  TROPICAL = 'Tropical'
}

export enum SortOption {
  NONE = 'Default',
  PRICE_LOW_HIGH = 'Price: Low to High',
  PRICE_HIGH_LOW = 'Price: High to Low',
  NAME = 'Name'
}
