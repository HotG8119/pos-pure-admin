<script setup lang="ts">
import Card from "./components/Card.vue";
import { getMenuList } from "@/api/order";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, reactive, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { postOrder } from "@/api/order";

import { Refresh, Delete, Search } from "@element-plus/icons-vue";

defineOptions({
  name: "點餐"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const pagination = ref({ current: 1, pageSize: 24, total: 0 });

const productList = ref([]);
const categoryOptions = ref([]);
const tableOptions = ref([]);
const dataLoading = ref(true);

const getCardListData = async () => {
  try {
    const { data } = await getMenuList();
    productList.value = data.products;
    pagination.value = {
      ...pagination.value,
      total: data.products.length
    };
    categoryOptions.value = data.categories;
    tableOptions.value = data.tables;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

onMounted(() => {
  getCardListData();
});

const searchValue = ref("");
const searchCategory = ref("");
const cartItems = reactive([]);
const selectTableNumber = ref("");

const resetSearchValue = () => {
  searchValue.value = "";
  searchCategory.value = "";
};

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
};
const onCurrentChange = (current: number) => {
  pagination.value.current = current;
};

const handleCartItem = order => {
  message(`${order.product.name}  成功加入購物車！`, { type: "success" });
  //檢查order.product是否已經存在於cartItems中
  const index = cartItems.findIndex(v => v.product.id === order.product.id);
  if (index > -1) {
    cartItems[index].orderQuantity += order.orderQuantity;
    return;
  }
  cartItems.push(order);
};

const cartDrawer = ref(false);

const resetCart = () => {
  cartItems.splice(0, cartItems.length);
  selectTableNumber.value = "";
};

const removeItem = (index, cartItem) => {
  ElMessageBox.confirm(`確定要刪除 ${cartItem.product.name} 嗎？`, "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    cartItems.splice(index, 1);
  });
};

const totalAmount = computed(() => {
  return cartItems.reduce(
    (acc, cur) => acc + cur.product.price * cur.orderQuantity,
    0
  );
});

const confirmClick = () => {
  if (!selectTableNumber.value)
    return message("請選擇桌號！", { type: "warning" });
  if (!cartItems.length) return message("購物車是空的！", { type: "warning" });

  const data = {
    tableId: selectTableNumber.value,
    cartItems,
    totalAmount: totalAmount.value
  };

  ElMessageBox.confirm("確定要送出訂單嗎？", "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const res = await postOrder(data);
    if (!res.success) return message(res.message, { type: "error" });
    cartDrawer.value = false;
    resetCart();
    message("訂單已送出！", { type: "success" });
  });
};
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <el-form
        ref="formRef"
        :inline="true"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item prop="name">
          <el-input
            v-model="searchValue"
            style="width: 300px"
            placeholder="請輸入查詢名稱"
            clearable
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item prop="categoryId">
          <el-select
            v-model="searchCategory"
            placeholder="請選擇分類"
            clearable
            class="!w-[180px]"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetSearchValue()">
            重置
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            style="margin-left: 16px"
            @click="cartDrawer = true"
          >
            購物車
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-drawer v-model="cartDrawer" direction="rtl">
        <template #header>
          <h4>購物車清單</h4>
        </template>
        <template #default>
          <el-select
            v-model="selectTableNumber"
            placeholder="請選擇桌號"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in tableOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-table :data="cartItems" stripe style="width: 100%">
            <el-table-column prop="product.name" label="名稱" width="180" />
            <el-table-column prop="product.price" label="單價" width="100" />
            <el-table-column prop="orderQuantity" label="數量">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.orderQuantity"
                  :min="1"
                  :max="20"
                />
                <el-button
                  type="text"
                  :icon="Delete"
                  circle
                  @click="removeItem(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <hr />
          <h3 style="text-align: right">總金額：{{ totalAmount }}</h3>
        </template>
        <template #footer>
          <div
            style="display: flex; justify-content: space-between; width: 100%"
          >
            <div>
              <el-button type="danger" @click="resetCart">清空餐點</el-button>
            </div>
            <div>
              <el-button @click="cartDrawer = false">關閉</el-button>
              <el-button type="primary" @click="confirmClick">
                送出訂單
              </el-button>
            </div>
          </div>
        </template>
      </el-drawer>
    </div>

    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-empty
        v-show="
          productList
            .slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current
            )
            .filter(v =>
              v.name.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0
        "
        :description="`${searchValue} 不存在`"
      />
      <template v-if="pagination.total > 0">
        <el-row :gutter="16">
          <el-col
            v-for="(product, index) in productList
              .slice(
                pagination.pageSize * (pagination.current - 1),
                pagination.pageSize * pagination.current
              )
              .filter(v =>
                v.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .filter(v =>
                searchCategory ? v.Category.id === searchCategory : true
              )"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <Card :product="product" @add-to-cart="handleCartItem" />
          </el-col>
        </el-row>
        <el-pagination
          v-model:currentPage="pagination.current"
          class="float-right"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </div>
  </div>
</template>
