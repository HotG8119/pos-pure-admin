import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export const getProducts = (data?: object) => {
  return http.request("get", baseUrlApi("products"), { data });
};
