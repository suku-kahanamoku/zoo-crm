import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IClient extends IItem {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  status?: "active" | "inactive" | "banned";
  role_id?: number;
  role?: { id: number; name: string; label?: string };
  last_login_at?: string | null;
  created_at?: string;
}

export interface IAnimalCategory extends IItem {
  name: string;
  syscode?: string;
  parent_id?: number | null;
  description?: string | null;
  position?: number;
}

export interface IProductData {
  ean?: string;
  brand?: string;
  weight?: number;
  unit?: string;
}

export interface IProductFile {
  id: number;
  path: string;
  name: string;
  mime_type?: string;
}

export interface IProduct extends IItem {
  name: string;
  sku?: string;
  description?: string | null;
  price: number;
  stock_quantity: number;
  published?: 0 | 1;
  kind?: string | null;
  variant?: string | null;
  data?: IProductData;
  category_ids?: number[];
  categories?: IAnimalCategory[];
  file_ids?: number[];
  files?: IProductFile[];
}

export interface IItemResponse<T> extends IResponse {
  data?: T;
}

export interface IListResponse<T> extends IResponse {
  data?: T[];
}
