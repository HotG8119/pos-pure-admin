<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUser } from "./utils/hook";
import { message } from "@/utils/message";
import { storageLocal } from "@pureadmin/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { getUserList, switchUserRole, deleteUser } from "@/api/system";
import { initRouter } from "@/router/utils";

import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";

const treeRef = ref();
const tableRef = ref();

const { openDialog, handleReset } = useUser(tableRef, treeRef);

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

const userData = ref([]);
const dataLoading = ref(true);

const getUserListData = async () => {
  try {
    const { data } = await getUserList();
    userData.value = data.users;
    userData.value.forEach((item: any) => {
      item.isAdmin = item.isAdmin ? "是" : "否";
    });
    console.log("function內的userData: ", userData.value);
  } catch (error) {
    console.log("error", error);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

onMounted(() => {
  getUserListData();
});
console.log("userData", userData.value);
const columns: TableColumnList = [
  {
    label: "使用者ID",
    prop: "id",
    width: "130"
  },
  {
    label: "姓名",
    prop: "name",
    width: "260"
  },
  {
    label: "信箱",
    prop: "email",
    width: "390"
  },
  {
    label: "管理員權限",
    prop: "isAdmin",
    width: "130"
  },
  {
    label: "操作",
    width: "390",
    fixed: "right",
    slot: "operation"
  }
];

const changeRole = async (id: number) => {
  console.log("changeRole", id);
  //如果那排的姓名是admin就不能切換權限
  if (userData.value.find((item: any) => item.id === id).name === "admin") {
    message("admin帳號不能切換權限", { type: "error" });
    return;
  }
  try {
    const res = await switchUserRole(id);
    console.log("切換權限", res);
    if (res.success) {
      const index = userData.value.findIndex((item: any) => item.id === id);
      userData.value[index].isAdmin =
        userData.value[index].isAdmin === "是" ? "否" : "是";
      message(`ID：${id} 權限切換成功`, { type: "success" });

      //重置路由
      storageLocal().removeItem("async-routes");
      usePermissionStoreHook().clearAllCachePage();
      initRouter();

      return;
    }

    message(`ID：${id} 權限切換失敗`, { type: "error" });
  } catch (err) {
    message("切換權限錯誤", { type: "error" });
  }
};

const handleDelete = async row => {
  if (row.name === "admin") {
    message("admin帳號不能被刪除", { type: "error" });
    return;
  }
  try {
    const res = await deleteUser(row.id);
    if (res.success) {
      message(`ID：${row.id} 使用者刪除成功`, { type: "success" });
      const index = userData.value.findIndex((item: any) => item.id === row.id);
      userData.value.splice(index, 1);
      return;
    }

    message(`ID：${row.id} 使用者刪除失敗`, { type: "error" });
  } catch (err) {
    message("使用者刪除錯誤", { type: "error" });
  }
};
</script>

<template>
  <div class="m-2">
    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-button
        class="mb-4"
        style="width: 100%"
        :icon="useRenderIcon(AddFill)"
        @click="openDialog()"
      >
        新增員工
      </el-button>
      <pure-table :data="userData" :columns="columns" maxHeight="800">
        <template #operation="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            :icon="useRenderIcon(Role)"
            @click.prevent="changeRole(row.id)"
          >
            切換權限
          </el-button>
          <el-button
            class="reset-margin"
            link
            type="primary"
            size="small"
            :icon="useRenderIcon(EditPen)"
            @click="openDialog('修改', row)"
          >
            修改資料
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
            :title="`是否刪除ID：${row.id} 的使用者資料?`"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button
                class="reset-margin"
                link
                type="danger"
                size="small"
                :icon="useRenderIcon(Delete)"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>

          <!-- <el-button
            link
            type="danger"
            size="small"
            @click.prevent="deleteRow(row.id)"
          >
            刪除帳號
          </el-button> -->
        </template>
      </pure-table>

      <!-- <el-empty
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
        :description="`${searchValue} 产品不存在`"
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
              )"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <Card
              :product="product"
              @delete-item="handleDeleteItem"
              @manage-product="handleManageProduct"
            />
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
      </template> -->
    </div>
  </div>
</template>
