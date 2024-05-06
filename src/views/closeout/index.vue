<script setup lang="ts">
import { ref, watch } from "vue";
import { useCloseoutData } from "./data";

import ReCol from "@/components/ReCol";
import { useDark } from "./utils";
import PureTable from "./components/table/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { barChart } from "./components/chart";
import Segmented, { type OptionsType } from "@/components/ReSegmented";

defineOptions({
  name: "Closeout"
});

const { loading, timeValue, chartData, barChartData, tableData, loadApiData } =
  useCloseoutData();

const size = ref("default");
const dynamicSize = ref();
const { isDark } = useDark();
const dataSelect = ref(0); // 0營業額、1單量
const optionsBasis: Array<OptionsType> = [
  { label: "全部" },
  { label: "營業額" },
  { label: "單量" }
];

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

//一打開就直接handleCloseoutOrders才渲染出圖表

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-evenly">
      <re-col class="mb-[18px]" :value="24">
        <p class="mb-2 mt-4">選擇訂單時間</p>
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          class="!w-[240px]"
          unlink-panels
          range-separator="至"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
          :disabled-date="disabledDate"
          :default-value="[new Date(), new Date()]"
          :popper-options="{
            placement: 'bottom-start' // 下拉面板出现的位置，或 'top-start'、'bottom-end'、'top-end' 等，具体看 https://popper.js.org/docs/v2/constructors/#options
          }"
          :size="dynamicSize"
          :disabled="size === 'disabled'"
        />
        <el-button @click="loadApiData">查詢</el-button>
      </re-col>
      <re-col
        v-loading="loading"
        v-for="(item, index) in chartData"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="8"
        :md="12"
        :sm="12"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'3em'"
                :startVal="0"
                :endVal="item.value"
              />
            </div>
          </div>
        </el-card>
      </re-col>
      <re-col
        v-loading="loading"
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card class="bar-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">訂單量表</span>
            <Segmented v-model="dataSelect" :options="optionsBasis" />
          </div>
          <div class="flex justify-between items-start mt-3">
            <barChart
              :dataSelect="dataSelect"
              :dateData="barChartData.dateData"
              :amountData="barChartData.amountData"
              :countData="barChartData.countData"
            />
          </div>
        </el-card>
      </re-col>
      <!-- {{ tableData }} -->
      <re-col
        v-loading="loading"
        v-motion
        class="mb-[18px]"
        :value="18"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <el-card shadow="never" class="h-[580px]">
          <div class="flex justify-between">
            <span class="text-md font-medium">餐點統計</span>
          </div>
          <PureTable :tableData="tableData" class="mt-3" />
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
