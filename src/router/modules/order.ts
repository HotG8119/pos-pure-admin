import { order } from "@/router/enums";

export default {
  path: "/order",
  meta: {
    icon: "lets-icons:order",
    title: "訂單",
    // showLink: false,
    rank: order
  },
  children: [
    {
      path: "/order/menuList",
      name: "點餐",
      component: () => import("@/views/order/menuList/index.vue"),
      meta: {
        icon: "mdi:order-bool-ascending",
        title: "點餐"
      }
    },
    {
      path: "/order/todayOrders",
      name: "今日訂單",
      component: () => import("@/views/order/todayOrders/index.vue"),
      meta: {
        icon: "fe:list-order",
        title: "今日訂單"
      }
    }
  ]
} satisfies RouteConfigsTable;
