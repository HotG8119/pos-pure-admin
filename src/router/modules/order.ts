export default {
  path: "/order",
  redirect: "/order/menu",
  meta: {
    icon: "lets-icons:order",
    title: "訂單"
    // showLink: false,
    //rank: 9
  },
  children: [
    {
      path: "/order/menu",
      name: "點餐",
      component: () => import("@/views/order/menu/index.vue"),
      meta: {
        icon: "mdi:order-bool-ascending",
        title: "點餐"
      }
    },
    {
      path: "/order/orders",
      name: "全部訂單",
      component: () => import("@/views/order/menu/index.vue"),
      meta: {
        icon: "fe:list-order",
        title: "全部訂單"
      }
    }
  ]
} as RouteConfigsTable;
