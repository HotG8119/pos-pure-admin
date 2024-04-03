<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../../hooks";
import { message } from "@/utils/message";

import axios from "axios";
import { genFileId } from "element-plus";
import type { UploadProps, UploadRawFile } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    name: "",
    price: 0,
    description: "",
    isAvailable: 1,
    categoryId: 0,
    categoryOptions: [],
    image: ""
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

const uploadRef = ref();
const files = ref([]);
const uploadSubmit = async options => {
  const formData = new FormData();
  formData.append("image", options["file"]);

  const res = await axios.post(
    "http://localhost:3001/api/menu/products/upload",
    formData
  );

  if (!res.data.success) {
    message(res.data.message, { type: "error" });
    return;
  }
  newFormInline.value.image = res.data.data;
  message("上傳成功", { type: "success" });
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};
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
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品名稱" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="請輸入餐點名稱"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品價格" prop="price">
          <el-input-number
            v-model="newFormInline.price"
            :min="0"
            clearable
            placeholder="請輸入價格"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="商品分類">
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
        <el-form-item label="商品敘述">
          <el-input
            v-model="newFormInline.description"
            placeholder="請輸入餐點敘述"
            type="textarea"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="商品圖片">
          <el-upload
            class="el-upload"
            list-type="picture-card"
            :show-file-list="false"
            ref="uploadRef"
            v-model:file-list="files"
            :http-request="uploadSubmit"
            :auto-upload="true"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <div v-if="newFormInline.image">
              <img :src="newFormInline.image" class="avatar" />
            </div>

            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style scoped>
.avatar img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>

<style>
.el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
