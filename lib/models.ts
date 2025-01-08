export interface ProductModel {
  title: string;
  description: string;
  originalPrice: number;
  price: number;
  hide: boolean;
  isVeg: boolean;
  servingType: string;
  quantity: string;
  categories: string[];
  imageUrl: string;
  largeImageUrl:string; 
  productId: number ;
}
