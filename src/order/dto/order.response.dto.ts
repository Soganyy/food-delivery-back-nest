export class OrderResponseDto {
  items: {
    itemId: number;
    quantity: number;
  }[];
  merchant: {
    id: number;
    businessName: string;
    address: string;
    phoneNumber: string;
    location: { longitude: number; latitude: number };
  };
  user: {
    id: number;
    address: string;
    phoneNumber: string;
    firstName: string;
  };
  deliveryPrice: number;
  deliveryTime: number;
  totalPrice: number;
  merchantId: number;
}
