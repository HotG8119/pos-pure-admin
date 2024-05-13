import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  message?: string;
  success: boolean;
  data?: Array<any>;
};

// type ResultTable = {
//   success: boolean;
//   data?: {
//     /** 列表数据 */
//     list: Array<any>;
//     /** 总条目数 */
//     total?: number;
//     /** 每页显示条目个数 */
//     pageSize?: number;
//     /** 当前页数 */
//     currentPage?: number;
//   };
// };

/** 获取用户管理列表 */
// export const getUserList = (data?: object) => {
//   return http.request<ResultTable>("post", "/user", { data });
// };
export const getUserList = (data: object) => {
  return http.request<Result>("post", baseUrlApi("users"), { data });
};

export const signUp = (data: object) => {
  return http.request<Result>("post", baseUrlApi("signup"), { data });
};

export const switchUserRole = (id: number) => {
  return http.request<Result>("put", baseUrlApi(`users/role/${id}`));
};

export const patchUserInfo = (id: number, data: object) => {
  return http.request<Result>("put", baseUrlApi(`users/info/${id}`), {
    data
  });
};

export const patchUserPassword = (id: number, data: object) => {
  return http.request<Result>("put", baseUrlApi(`users/password/${id}`), {
    data
  });
};

export const deleteUser = (id: number) => {
  return http.request<Result>("delete", baseUrlApi(`users/${id}`));
};

// /** 用户管理-获取所有角色列表 */
// export const getAllRoleList = () => {
//   return http.request<Result>("get", "/list-all-role");
// };

// /** 用户管理-根据userId，获取对应角色id列表（userId：用户id） */
// export const getRoleIds = (data?: object) => {
//   return http.request<Result>("post", "/list-role-ids", { data });
// };

// /** 获取角色管理列表 */
// export const getRoleList = (data?: object) => {
//   return http.request<ResultTable>("post", "/role", { data });
// };

// /** 获取部门管理列表 */
// export const getDeptList = (data?: object) => {
//   return http.request<Result>("post", "/dept", { data });
// };

// /** 获取菜单管理列表 */
// export const getMenuList = (data?: object) => {
//   return http.request<Result>("post", "/menu", { data });
// };
