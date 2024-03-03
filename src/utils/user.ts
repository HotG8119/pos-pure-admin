import { http } from "@/utils/http";
import { baseUrlApi } from "../api/utils";

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<any>("post", baseUrlApi("login"), { data });
};
