<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    price: 0,
    description: "",
    isAvailable: 1,
    categoryId: 0,
    categoryOptions: []
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
  {{ newFormInline.categoryId }}
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="名稱" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="請輸入餐點名稱"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="價格" prop="price">
          <el-input-number
            v-model="newFormInline.price"
            :min="0"
            clearable
            placeholder="請輸入價格"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分類">
          <el-select
            v-model="newFormInline.categoryId"
            placeholder="請選擇餐點類別"
            class="w-full"
          >
            <el-option
              v-for="item in newFormInline.categoryOptions"
              :key="item.id as string"
              :label="String(item.name)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="提供狀態">
          <el-switch
            v-model="newFormInline.isAvailable"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="提供"
            inactive-text="缺貨"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="敘述">
          <el-input
            v-model="newFormInline.description"
            placeholder="請輸入餐點敘述"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
