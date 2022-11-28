export type CartItemType ={
    id: number;
    category: string;
    description: string;
    image: string;
    price: string;
    title:string;
    amount:number;
  }

export const getProducts = async (): Promise<CartItemType[]> => {
    return await (await fetch('https://fakestoreapi.com/products')).json();
}
