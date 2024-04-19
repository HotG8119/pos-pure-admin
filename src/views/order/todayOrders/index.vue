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
  // buttonClass,
  onSearch,
  resetForm,
  openDialog,
  handleUpdateOrder,
  //handleMenu,
  handleDelete,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入角色名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="角色标识：" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入角色标识"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已启用" value="1" />
          <el-option label="已停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
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
                    type="text"
                    :icon="useRenderIcon(Delete)"
                    circle
                    @click="handleDelete(row)"
                  >
                    刪除
                  </el-button>
                </div>
                <div>
                  <el-button
                    type="text"
                    :icon="useRenderIcon(Check)"
                    circle
                    @click="handleUpdateOrder('完成', row)"
                  >
                    完成餐點
                  </el-button>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    icon="iconoir:hand-cash"
                    @click="openDialog('修改', row)"
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
