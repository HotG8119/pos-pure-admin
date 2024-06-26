<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, nextTick } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

import { getPrepareOrderList } from "./api";
import { putOrderProduct, updateOrder } from "@/api/order";
import error from "./error.png";
import loading from "./loading.png";
import "vue-waterfall-plugin-next/dist/style.css";
import backTop from "@/assets/svg/back_top.svg?component";
import { Waterfall } from "vue-waterfall-plugin-next";
import Empty from "./empty.svg?component";

import { socket } from "@/socket.js";

const options = reactive({
  // 唯一key值
  rowKey: "id",
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: true,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2
    }
  },
  // 动画效果 https://animate.style/
  animationEffect: "animate__zoomInUp",
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  // 背景色
  //backgroundColor: "#2C2E3A",
  // 图片字段选择器，如果层级较深，使用 xxx.xxx.xxx 方式
  imgSelector: "src.original",
  // 加载配置
  loadProps: {
    loading,
    error
  },
  align: "left"
  // 是否懒加载
  //lazyload: true
});

const loadingInstance = ref();
const orderList = ref([]);

async function handleLoad() {
  loadingInstance.value = ElLoading.service({
    target: ".content",
    background: "transparent",
    text: "載入中"
  });
  try {
    const res = await getPrepareOrderList();
    orderList.value = res;
    orderList.value.forEach(item => {
      item.OrderProducts.forEach(product => {
        if (product.status === "preparing") {
          product.isStriked = false;
        } else {
          product.isStriked = true;
        }
      });
    });
    nextTick(() => {
      loadingInstance.value.close();
    });
  } catch (error) {
    console.log(error);
  }
}

async function handleCompleted(item) {
  try {
    console.log("item.OrderProducts", item.OrderProducts);
    const isAllCompleted = item.OrderProducts.every(
      product => product.status === "completed"
    );

    if (!isAllCompleted) {
      await ElMessageBox.confirm(
        `還有商品未完成，確認要完成 桌號${item.tableName} 的訂單嗎？`,
        "提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }
      );
    }
    await updateOrder(item.id, { title: "完成" });
    socket.emit("completedOrder", item.id);
  } catch (error) {
    ElMessage({
      type: "info",
      message: "取消完成"
    });
  }
}

function handleFinishedProduct(row) {
  row.isStriked = !row.isStriked;
  row.status = row.isStriked ? "completed" : "preparing";

  putOrderProduct(row.id, { status: row.status });

  socket.emit("completedItem", row);
}

socket.on("completedItem", socketData => {
  //console.log("socketData", socketData);
  orderList.value.forEach(order => {
    const product = order.OrderProducts.find(
      product => product.id === socketData.id
    );
    if (product) {
      product.isStriked = socketData.isStriked; // 更新 isStriked 屬性
      product.status = socketData.status; // 可選：更新產品狀態
    }
  });
});

socket.on("completedOrder", itemId => {
  const index = orderList.value.findIndex(order => order.id === itemId);
  orderList.value.splice(index, 1);

  ElMessage({
    type: "success",
    message: `訂單：${itemId} 已完成`
  });
});

socket.on("newOrder", () => {
  ElMessage({
    type: "success",
    message: "有新訂單進來了！"
  });
  setTimeout(() => {
    handleLoad();
  }, 1000);
});

onMounted(() => {
  //console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  //console.log("VUE_APP_BACKEND_URL", VUE_APP_BACKEND_URL);
  handleLoad();
  socket.on();
});

onUnmounted(() => {
  socket.off();
});
</script>

<template>
  <el-scrollbar max-height="calc(100vh - 90px)" class="content">
    <Waterfall
      :list="orderList"
      v-bind="options"
      class="border-t border-b-gray-800"
    >
      <template #item="{ item }">
        <div
          class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
        >
          <div class="px-4 pt-2 pb-4">
            <div class="flex justify-between">
              <h1 class="text-gray-50">桌號：{{ item.tableName }}</h1>
              <h2 class="text-gray-50">{{ item.createdAt }}</h2>
            </div>
            <div class="py-2 bg-gray-900">
              <el-table
                :data="item.OrderProducts"
                style="width: 100%"
                @row-click="handleFinishedProduct"
                row-key="id"
              >
                <el-table-column prop="name" label="商品名" width="200">
                  <template #default="{ row }">
                    <span :class="{ 'line-through': row.isStriked }">{{
                      row.name
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="數量">
                  <template #default="{ row }">
                    <span :class="{ 'line-through': row.isStriked }">{{
                      row.quantity
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              class="pt-3 flex justify-between items-center border-t border-t-gray-600 border-opacity-50"
            >
              <h3 class="text-gray-50">訂單編號：{{ item.id }}</h3>
              <button
                class="px-3 h-7 rounded-full bg-red-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-red-600"
                @click.stop="handleCompleted(item)"
              >
                完成訂單
              </button>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>

    <el-empty
      description="暫無資料"
      :image-size="60"
      v-if="orderList.length === 0"
    >
      <template #image>
        <Empty />
      </template>
    </el-empty>
    <div class="flex justify-center py-10">
      <button
        class="px-5 py-2 rounded-full bg-gray-700 text-md text-white cursor-pointer hover:bg-gray-800 transition-all duration-300"
        @click="handleLoad"
      >
        重新載入
      </button>
    </div>

    <el-backtop
      title="回到最上方"
      :right="35"
      :visibility-height="400"
      target=".content .el-scrollbar__wrap"
    >
      <backTop />
    </el-backtop>

    <!-- 加载更多 -->
    <!-- <InfiniteLoading :firstload="false" @infinite="handleLoadMore" /> -->
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}

:deep(.el-loading-spinner .el-loading-text) {
  font-size: 24px;
}
</style>
