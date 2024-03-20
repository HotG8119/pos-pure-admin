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

export const getCategoryList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("menu/categories"), { data });
};

export const addCategory = (data: object) => {
  return http.request<Result>("post", baseUrlApi("menu/categories/new"), {
    data
  });
};
