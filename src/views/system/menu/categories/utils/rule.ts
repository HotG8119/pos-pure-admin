import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "分類名稱為必填", trigger: "blur" }]
  // rank: [{ required: true, message: "必填分類順序", trigger: "blur" }],
});
