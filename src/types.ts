export interface Customer {
  id: string;
  name: string;
  image: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  saleNumber: string;
  saleAmount: number;
  balanceAmount: number;
  cashPaidAmount: number;
  upiPaidAmount: number;
  saleType: string;
  paymentMethod: string;
  transactionCode: string | null;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  otherNames: string[];
  description: string | null;
  image: string[];
  gst: string | null;
  assured: boolean;
  barcode: string;
  productCode: string;
  slug: string;
  createrId: string;
  unitTypes: string[];
  brandId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  phone: string;
  slug: string;
  logo: string;
  location: string;
  latitude: number;
  longitude: number;
  gst: boolean;
  attendantEmail: string[];
  adminId: string;
  createdAt: string;
  updatedAt: string;
}