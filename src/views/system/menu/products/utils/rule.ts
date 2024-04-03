import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "名稱為必填", trigger: "blur" }],
  price: [{ required: true, message: "價格為必填", trigger: "blur" }],
  categoryId: [{ required: true, message: "分類為必填", trigger: "change" }],
  categoryOptions: [
    { required: true, message: "分類為必填", trigger: "change" }
  ]
});
