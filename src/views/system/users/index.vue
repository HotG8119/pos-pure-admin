<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useUser } from "./utils/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";

const treeRef = ref();
const tableRef = ref();

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleReset,
  handleDelete,
  handleSwitchRole,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useUser(tableRef, treeRef);
</script>

<template>
  <div class="m-2">
    <PureTableBar title="使用者管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增使用者
        </el-button>
      </template>
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
          <template #operation="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              :icon="useRenderIcon(Role)"
              @click.prevent="handleSwitchRole(row)"
            >
              切換權限
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('修改', row)"
            >
              修改
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              :icon="useRenderIcon(Password)"
              @click.prevent="handleReset(row)"
            >
              重置密碼
            </el-button>
            <el-popconfirm
              :title="`是否刪除ID：${row.id} 的帳號?`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  刪除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
