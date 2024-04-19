import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { getTodayOrders, deleteOrder, updateOrder } from "@/api/order";
//import { getRoleList } from "@/api/system";
import { ElMessageBox } from "element-plus";
//import { usePublicHooks } from "../../../system/hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useRole() {
  const form = reactive({
    id: "",
    name: ""

    // name: "",
    // code: "",
    // status: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  //const switchLoadMap = ref({});
  //const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
    {
      label: "訂單編號",
      prop: "id",
      minWidth: 80
    },
    {
      label: "成立時間",
      prop: "createdAt",
      minWidth: 150
    },
    {
      label: "桌號",
      prop: "Table.name",
      minWidth: 120
    },
    {
      label: "狀態",
      prop: "status",
      minWidth: 150
    }
    // {
    //   label: "状态",
    //   minWidth: 130,
    //   cellRenderer: scope => (
    //     <el-switch
    //       size={scope.props.size === "small" ? "small" : "default"}
    //       loading={switchLoadMap.value[scope.index]?.loading}
    //       v-model={scope.row.status}
    //       active-value={1}
    //       inactive-value={0}
    //       active-text="已启用"
    //       inactive-text="已停用"
    //       inline-prompt
    //       style={switchStyle.value}
    //       onChange={() => onChange(scope as any)}
    //     />
    //   )
    // },
    // {
    //   label: "备注",
    //   prop: "remark",
    //   minWidth: 150
    // },
    // {
    //   label: "创建时间",
    //   minWidth: 180,
    //   prop: "createTime",
    //   formatter: ({ createTime }) =>
    //     dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    // },
    // {
    //   label: "操作",
    //   fixed: "right",
    //   width: 240,
    //   slot: "operation"
    // }
  ];

  const childColumns: TableColumnList = [
    {
      label: "餐點名稱",
      prop: "name"
    },
    {
      label: "數量",
      prop: "quantity"
    },
    {
      label: "價格",
      prop: "price"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });

  // function onChange({ row, index }) {
  //   ElMessageBox.confirm(
  //     `确认要<strong>${
  //       row.status === 0 ? "停用" : "启用"
  //     }</strong><strong style='color:var(--el-color-primary)'>${
  //       row.name
  //     }</strong>吗?`,
  //     "系统提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //       dangerouslyUseHTMLString: true,
  //       draggable: true
  //     }
  //   )
  //     .then(() => {
  //       switchLoadMap.value[index] = Object.assign(
  //         {},
  //         switchLoadMap.value[index],
  //         {
  //           loading: true
  //         }
  //       );
  //       setTimeout(() => {
  //         switchLoadMap.value[index] = Object.assign(
  //           {},
  //           switchLoadMap.value[index],
  //           {
  //             loading: false
  //           }
  //         );
  //         message(`已${row.status === 0 ? "停用" : "启用"}${row.name}`, {
  //           type: "success"
  //         });
  //       }, 300);
  //     })
  //     .catch(() => {
  //       row.status === 0 ? (row.status = 1) : (row.status = 0);
  //     });
  // }

  async function handleDelete(row) {
    try {
      await ElMessageBox.confirm(`確定要刪除訂單 ${row.id} 嗎？`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      });

      const res = await deleteOrder(row.id);
      if (!res.success) throw new Error(res.message);

      message(`您已經刪除編號 ${row.id} 的訂單`, { type: "success" });
      onSearch();
    } catch (error) {
      console.log("error", error);
      //message(error.message, { type: "error" });
    }
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await getTodayOrders();
    console.log("res", res);
    const { data } = await getTodayOrders(toRaw(form));
    //const { data } = await getRoleList(toRaw(form));
    console.log("data", data);
    dataList.value = data;
    dataList.value.forEach(item => {
      item.createdAt = dayjs(item.createdAt).format("HH:mm");
      item.completedAt = item.completedAt
        ? dayjs(item.completedAt).format("HH:mm")
        : "";
      item.paidAt = item.paidAt ? dayjs(item.paidAt).format("HH:mm") : "";
      if (!item.completedAt) {
        item.status = "未完成";
      } else if (!item.paidAt) {
        item.status = "未付款";
      } else {
        item.status = "已完成";
      }
    });
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function handleUpdateOrder(title, row) {
    console.log("title: ", title, "row: ", row);
    try {
      await ElMessageBox.confirm(`確定要${title}訂單 ${row.id} 嗎？`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      });

      const res = await updateOrder(row.id, { title });
      if (!res.success) throw new Error(res.message);

      message(`您已經${title}編號 ${row.id} 的訂單`, { type: "success" });
      onSearch();
    } catch (error) {
      console.log("error", error);
      //message(error.message, { type: "error" });
    }
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          code: row?.code ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  function handleMenu() {
    message("等菜单管理页面开发后完善");
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(() => {
    onSearch();
  });

  return {
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
    handleMenu,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
