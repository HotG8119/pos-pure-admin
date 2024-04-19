import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  message?: string;
  success: boolean;
  data?: Array<any>;
};

export const getMenuList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("order/menuList"), { data });
};

export const postOrder = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("order"), { data });
};

export const getTodayOrders = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("order/today"), { data });
};

export const deleteOrder = (id?: string) => {
  return http.request<Result>("delete", baseUrlApi(`order/${id}`));
};

export const updateOrder = (id?: string, data?: object) => {
  return http.request<Result>("put", baseUrlApi(`order/${id}`), { data });
};

// export const getProductList = (data?: object) => {
//   return http.request<Result>("post", baseUrlApi("menu/products/list"), {
//     data
//   });
// };
