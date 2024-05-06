import { useCloseoutData } from "../../data";

import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import Empty from "./empty.svg?component";

export function useColumns() {
  const { tableData } = useCloseoutData();
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      //sortable: true,
      label: "銷售名次",
      prop: "no"
    },
    {
      //sortable: true,
      label: "產品名稱",
      prop: "name"
    },
    {
      //sortable: true,
      label: "產品單價",
      prop: "price"
    },
    {
      //sortable: true,
      label: "銷售數量",
      prop: "quantity",
      filterMultiple: false,
      filterClassName: "pure-table-filter",
      filters: [
        { text: "≥50", value: "more" },
        { text: "<50", value: "less" }
      ],
      filterMethod: (value, { quantity }) => {
        return value === "more" ? quantity >= 50 : quantity < 50;
      }
    },
    {
      //sortable: true,
      label: "最後銷售日期",
      prop: "paidAt"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
  });

  function onCurrentChange(page: number) {
    console.log("onCurrentChange", page);
    loading.value = true;
    delay(300).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    dataList.value = tableData.value;
    pagination.total = dataList.value.length;
    console.log("pagination", pagination);
    loading.value = false;
  });

  return {
    Empty,
    loading,
    columns,
    dataList,
    pagination,
    onCurrentChange
  };
}
