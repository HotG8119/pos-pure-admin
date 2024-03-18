<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    higherDeptOptions: [],
    name: "",
    email: "",
    isAdmin: "",
    password: ""
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  {{ newFormInline }}
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="名稱" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="請輸入使用者名稱"
          />
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="信箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="請輸入信箱"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-if="newFormInline.title === '新增'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="newFormInline.password"
            type="password"
            clearable
            placeholder="請輸入使用者密碼"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-if="newFormInline.title === '新增'"
        :value="24"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="管理員權限" prop="isAdmin">
          <el-switch
            v-model="newFormInline.isAdmin"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
