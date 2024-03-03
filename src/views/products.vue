<script setup lang="ts">
import { ref, toRefs, onMounted } from "vue";
import { getProducts } from "@/api/products";

// 一進頁面就拿到產品資訊
onMounted(() => {
  getProductsHandle();
});

const getProductsHandle = async () => {
  try {
    const res = await getProducts();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <h1>Products</h1>
  <button @click="getProductsHandle">拿到產品</button>
</template>

<style lang="scss" scoped></style>
