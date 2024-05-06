import { ref, onMounted } from "vue";
import { dayjs } from "./utils";
import GroupLine from "@iconify-icons/ri/group-line";
import Coin from "@iconify-icons/ri/coin-line";

import { getCloseoutOrders } from "@/api/order";

/** 需求人数、提问数量、解决数量、用户满意度 */
export function useCloseoutData() {
  const loading = ref(true);
  const timeValue = ref([new Date(), new Date()]);
  const periodOrdersData = ref([]);
  const productCountsArray = ref([]);
  const chartData = ref([]);
  const barChartData = ref([]);
  const tableData = ref([]);

  async function loadApiData() {
    try {
      loading.value = true;
      const { data } = await getCloseoutOrders({
        timeValue: timeValue.value
      });
      periodOrdersData.value = data.periodOrdersData;
      barChartData.value = data.dailyTotals;
      productCountsArray.value = data.productCountsArray;

      chartData.value = [
        {
          icon: GroupLine,
          bgColor: "#effaff",
          color: "#41b6ff",
          duration: 1000,
          name: "總單數",
          value: periodOrdersData.value.totalCount
        },
        {
          icon: Coin,
          bgColor: "#fff5f4",
          color: "#e85f33",
          duration: 1000,
          name: "總營業額",
          value: periodOrdersData.value.totalAmount
        },
        {
          icon: Coin,
          bgColor: "#fff5f4",
          color: "#e85f33",
          duration: 1000,
          name: "平均營業額",
          value:
            periodOrdersData.value.totalAmount /
              periodOrdersData.value.totalCount || 0
        }
      ];

      tableData.value = productCountsArray.value.map((item, index) => {
        return {
          no: index + 1,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          paidAt: dayjs(item.paidAt).format("MM-DD")
        };
      });
      loading.value = false;
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(() => {
    loadApiData();
  });

  return {
    loading,
    timeValue,
    chartData,
    barChartData,
    tableData,
    loadApiData
  };
}
