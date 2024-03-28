import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  message?: string;
  success: boolean;
  data?: Array<any>;
};

export const getProducts = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("products"), { data });
};

export const getProductList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("menu/products/list"), {
    data
  });
};

export const addProduct = (data: object) => {
  return http.request<Result>("post", baseUrlApi("menu/products/new"), {
    data
  });
};

export const switchAvailable = (id: number) => {
  return http.request<Result>(
    "put",
    baseUrlApi(`menu/products/available/${id}`)
  );
};

export const getCategoryList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("menu/categories"), { data });
};

export const addCategory = (data: object) => {
  return http.request<Result>("post", baseUrlApi("menu/categories/new"), {
    data
  });
};

export const deleteCategory = (id: number) => {
  return http.request<Result>("delete", baseUrlApi(`menu/categories/${id}`));
};

export const editCategory = (id: number, data: object) => {
  return http.request<Result>("put", baseUrlApi(`menu/categories/${id}`), {
    data
  });
};
