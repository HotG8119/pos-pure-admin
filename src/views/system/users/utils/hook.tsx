import "./reset.css";
//import dayjs from "dayjs";
// import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
//import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
// import croppingUpload from "../upload.vue";
//import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";
import { getKeyList, isAllEmpty } from "@pureadmin/utils";
import {
  getUserList,
  signUp,
  patchUserInfo,
  patchUserPassword,
  switchUserRole,
  deleteUser
} from "@/api/system";

import { ElForm, ElInput, ElFormItem, ElProgress } from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

import { REGEXP_PWD } from "./rule";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  // const avatarInfo = ref();
  // const switchLoadMap = ref({});
  // const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  //const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
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
      prop: "email"
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

    // {
    //   label: "用户头像",
    //   prop: "avatar",
    //   cellRenderer: ({ row }) => (
    //     <el-image
    //       fit="cover"
    //       preview-teleported={true}
    //       src={row.avatar}
    //       preview-src-list={Array.of(row.avatar)}
    //       class="w-[24px] h-[24px] rounded-full align-middle"
    //     />
    //   ),
    //   width: 90
    // },
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  // const roleOptions = ref([]);

  // function onChange({ row, index }) {
  //   ElMessageBox.confirm(
  //     `确认要<strong>${
  //       row.status === 0 ? "停用" : "启用"
  //     }</strong><strong style='color:var(--el-color-primary)'>${
  //       row.username
  //     }</strong>用户吗?`,
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
  //         message("已成功修改用户状态", {
  //           type: "success"
  //         });
  //       }, 300);
  //     })
  //     .catch(() => {
  //       row.status === 0 ? (row.status = 1) : (row.status = 0);
  //     });
  // }

  async function handleSwitchRole(row) {
    console.log("changeRole", row);
    if (row.name === "admin") {
      message("admin帳號不能切換權限", { type: "error" });
      return;
    }
    try {
      const res = await switchUserRole(row.id);
      console.log("切換權限", res);
      if (res.success) {
        message(`ID：${row.id} 權限切換成功`, { type: "success" });
        onSearch();
        return;
      }
      message(`ID：${row.id} 權限切換失敗`, { type: "error" });
    } catch (err) {
      message("切換權限錯誤", { type: "error" });
    }
  }

  function handleUpdate(row) {
    console.log(row);
  }

  async function handleDelete(row) {
    if (row.name === "admin") {
      message("admin帳號不能被刪除", { type: "error" });
      return;
    }
    try {
      const res = await deleteUser(row.id);
      if (res.success) {
        message(`ID：${row.id} 使用者刪除成功`, { type: "success" });
        return;
      }
      message(`ID：${row.id} 使用者刪除失敗`, { type: "error" });
    } catch (err) {
      message("使用者刪除錯誤", { type: "error" });
    }
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

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
  }

  async function onSearch() {
    loading.value = true;
    //const { data } = await getUserList(toRaw(form));
    const { data } = await getUserList(toRaw(pagination));
    dataList.value = data.list;
    dataList.value.forEach((item: any) => {
      item.isAdmin = item.isAdmin ? "是" : "否";
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
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}帳號`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          id: row?.id ?? 0,
          name: row?.name ?? "",
          email: row?.email ?? "",
          isAdmin: row?.isAdmin ? "是" : "否"
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了帳號名稱為 ${curData.name} 的資料`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              try {
                const res = await signUp(curData);
                if (res.success) {
                  chores();
                } else {
                  message(`新增失敗，${res.message}`, { type: "error" });
                }
              } catch (err) {
                console.error("signUp err", err);
              }
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              try {
                if (curData.name === "admin") {
                  message("帳號名稱不能被修改為 admin", { type: "error" });
                  return;
                }
                const res = await patchUserInfo(row.id, curData);
                if (res.success) {
                  chores();
                } else {
                  message(`修改失敗，${res.message}`, { type: "error" });
                  done();
                }
              } catch (err) {
                console.error("patch err", err);
              }
            }
          }
        });
      }
    });
  }
  // const cropRef = ref();
  /** 上传头像 */
  // function handleUpload(row) {
  //   addDialog({
  //     title: "裁剪、上传头像",
  //     width: "40%",
  //     draggable: true,
  //     closeOnClickModal: false,
  //     contentRenderer: () =>
  //       h(croppingUpload, {
  //         ref: cropRef,
  //         imgSrc: row.avatar,
  //         onCropper: info => (avatarInfo.value = info)
  //       }),
  //     beforeSure: done => {
  //       console.log("裁剪后的图片信息：", avatarInfo.value);
  //       // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
  //       done(); // 关闭弹框
  //       onSearch(); // 刷新表格数据
  //     },
  //     closeCallBack: () => cropRef.value.hidePopover()
  //   });
  // }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.name} 的密碼`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message:
                    "請輸入密碼格式應為8-18位數字、字母、符號的任意兩種組合的新密碼",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="請輸入新密碼"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(async valid => {
          if (!REGEXP_PWD.test(pwdForm.newPwd)) {
            message("密碼格式應為8-18位數字、字母、符號的任意兩種組合", {
              type: "error"
            });
            return;
          }
          if (valid) {
            // 表单规则校验通过

            try {
              // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
              const res = await patchUserPassword(row.id, {
                password: pwdForm.newPwd
              });
              if (!res.success) {
                message(`重置失敗，${res.message}`, { type: "error" });
                return;
              }

              message(`已成功重置 ${row.name} 的密碼`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } catch (err) {
              console.error("patchUserPassword err", err);
            }
          }
        });
      }
    });
  }

  /** 分配角色 */
  // async function handleRole(row) {
  //   // 选中的角色列表
  //   const ids = (await getRoleIds({ userId: row.id })).data ?? [];
  //   addDialog({
  //     title: `分配 ${row.username} 用户的角色`,
  //     props: {
  //       formInline: {
  //         username: row?.username ?? "",
  //         nickname: row?.nickname ?? "",
  //         roleOptions: roleOptions.value ?? [],
  //         ids
  //       }
  //     },
  //     width: "400px",
  //     draggable: true,
  //     fullscreenIcon: true,
  //     closeOnClickModal: false,
  //     contentRenderer: () => h(roleForm),
  //     beforeSure: (done, { options }) => {
  //       const curData = options.props.formInline as RoleFormItemProps;
  //       console.log("curIds", curData.ids);
  //       // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
  //       done(); // 关闭弹框
  //     }
  //   });
  // }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    // const { data } = await getDeptList();
    // higherDeptOptions.value = handleTree(data);
    // treeData.value = handleTree(data);
    // treeLoading.value = false;

    // 角色列表
    //roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    //treeData,
    //treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    //handleUpload,
    handleReset,
    //handleRole,
    handleSwitchRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
