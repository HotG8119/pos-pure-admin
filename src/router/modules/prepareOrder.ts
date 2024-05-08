import { prepareOrder } from "@/router/enums";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "prepareOrder",
  component: Layout,
  redirect: "/prepareOrder",
  meta: {
    icon: "homeFilled",
    title: "準備訂單",
    rank: prepareOrder
  },
  children: [
    {
      path: "/prepareOrder",
      name: "prepareOrder",
      component: () => import("@/views/prepareOrder/index.vue"),
      meta: {
        title: "準備訂單",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
