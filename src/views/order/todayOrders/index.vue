<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import Check from "@iconify-icons/ep/check";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Cash from "@iconify-icons/ep/coin";

defineOptions({
  name: "SystemRole"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  childColumns,
  dataList,
  pagination,
  dialogTableVisible,
  checkOrderData,
  // buttonClass,
  onSearch,
  resetForm,
  handleUpdateOrder,
  //handleMenu,
  handleDelete,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleCheckOrder,
  handlePayMent
} = useRole();

// const dialogTableVisible = ref(false);
// const checkOrderData = ref({});
// const handleCheckOrder = row => {
//   dialogTableVisible.value = true;
//   checkOrderData.value = row;
// };
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="訂單狀態：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="請選擇狀態"
          clearable
          class="!w-[180px]"
        >
          <el-option label="未完成" value="未完成" />
          <el-option label="未付款" value="未付款" />
          <el-option label="已完成" value="已完成" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜尋
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="今日訂單" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #expand="{ row }">
            {{ row }}
            {{ row.completedAt }}
            <div class="m-4">
              <h3>餐點資訊</h3>
              <pure-table :data="row.cartItems" :columns="childColumns" />
              <hr />
              <h4 class="total mr-4">總價: {{ row.totalAmount }}</h4>

              <h3 class="mt-4">訂單資訊</h3>
              <p class="mb-2">完成時間: {{ row.completedAt }}</p>
              <p class="mb-2">付款時間: {{ row.paidAt }}</p>
              <p class="mb-4">付款方式: {{ row.paymentMethod }}</p>

              <el-row justify="space-between">
                <div>
                  <el-button
                    type="danger"
                    :icon="useRenderIcon(Delete)"
                    @click="handleDelete(row)"
                  >
                    刪除
                  </el-button>
                </div>
                <div>
                  <el-button
                    v-if="row.status === '未完成'"
                    class="complete-btn"
                    type="primary"
                    :icon="useRenderIcon(Check)"
                    :disabled="!!row.completedAt"
                    @click="handleUpdateOrder('完成', row)"
                  >
                    完成餐點
                  </el-button>

                  <el-button
                    v-if="row.status === '未付款'"
                    class="reset-btn"
                    type="primary"
                    :icon="useRenderIcon(Cash)"
                    :disabled="!!row.paidAt"
                    @click="handleCheckOrder(row)"
                  >
                    付款
                  </el-button>
                </div>
              </el-row>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog v-model="dialogTableVisible" title="結帳" width="800">
      <h3>桌號：{{ checkOrderData.Table.name }}</h3>
      <el-table :data="checkOrderData.cartItems">
        <el-table-column property="name" label="名稱" width="250" />
        <el-table-column property="quantity" label="數量" width="150" />
        <el-table-column property="price" label="單價" width="150" />
        <el-table-column
          :formatter="item => item.quantity * item.price"
          label="總價"
          width="150"
        />
      </el-table>
      <h3 class="flex flex-row-reverse mr-10 mb-10">
        總金額：{{ checkOrderData.totalAmount }}
      </h3>
      <div class="flex justify-end m-3">
        <el-button
          v-model="checkOrderData.completedAt"
          type="primary"
          @click="handlePayMent('現金', checkOrderData)"
          >現金</el-button
        >
        <!-- <el-button
        type="primary"
        @click="handlePayMent('LinePay', checkOrderData)"
        >Line Pay</el-button
      > -->
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.total {
  text-align: right;
}
</style>
