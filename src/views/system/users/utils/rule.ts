import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone, isEmail } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "使用者名稱為必填", trigger: "blur" }],
  // nickname: [{ required: true, message: "用户昵称为必填项", trigger: "blur" }],
  // username: [{ required: true, message: "用户名称为必填项", trigger: "blur" }],
  password: [{ required: true, message: "使用者密碼為必填", trigger: "blur" }],
  checkPassword: [
    {
      required: true,
      message: "確認密碼為必填",
      trigger: "blur"
    },
    {
      validator: (rule, value, callback, source) => {
        if (value !== source?.password) {
          callback(new Error("兩次輸入的密碼不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  // phone: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value === "") {
  //         callback();
  //       } else if (!isPhone(value)) {
  //         callback(new Error("请输入正确的手机号码格式"));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur"
  //     // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
  //   }
  // ],
  email: [
    {
      required: true,
      message: "使用者信箱為必填",
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("請輸入正確的信箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
