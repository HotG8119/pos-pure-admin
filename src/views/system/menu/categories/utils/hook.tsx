import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getCategoryList,
  addCategory,
  deleteCategory,
  editCategory
} from "@/api/products";

import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useRole() {
  const form = reactive({
    name: "",
    rank: "",
    remark: "",
    createdAt: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "分類編號",
      prop: "id",
      minWidth: 100
    },
    {
      label: "分類名稱",
      prop: "name",
      minWidth: 120
    },
    {
      label: "備註",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "創建時間",
      minWidth: 180,
      prop: "createdAt"
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
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

  async function handleDelete(row) {
    const res = await deleteCategory(row.id);
    if (!res.success) return message(res.message, { type: "error" });
    message(`分類 ${row.name} 已被刪除`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    //const { data } = await getRoleList(toRaw(form));
    const { data } = await getCategoryList({
      form: toRaw(form),
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage
    });
    console.log(data);
    dataList.value = data.list;
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

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}分類`,
      props: {
        formInline: {
          name: row?.name ?? "",
          //rank: row?.rank ?? "",
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
          message(`您${title}了 ${curData.name} 的分類`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              try {
                const res = await addCategory(curData);
                if (!res.success)
                  return message(res.message, { type: "error" });
                chores();
              } catch (err) {
                return message("新增失败", { type: "error" });
              }
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              try {
                const res = await editCategory(row.id, curData);
                if (!res.success)
                  return message(res.message, { type: "error" });
                chores();
              } catch (err) {
                return message("新增失败", { type: "error" });
              }
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
    dataList,
    pagination,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
