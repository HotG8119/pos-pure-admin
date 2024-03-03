export default {
  path: "/products",
  redirect: "/products/index",
  meta: {
    icon: "material-symbols:cookie-outline",
    title: "產品目錄",
    //showLink: false,
    rank: 80
  },
  children: [
    {
      path: "/products/index",
      name: "產品目錄",
      component: () => import("@/views/products.vue"),
      meta: {
        title: "產品目錄"
      }
    }
  ]
} as RouteConfigsTable;
