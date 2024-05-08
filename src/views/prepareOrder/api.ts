import { getPreparingOrders } from "@/api/order";

export function randomID(length = 6) {
  return Number(
    Math.random().toString().substr(3, length) + Date.now()
  ).toString(36);
}

const COLORS = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399"];

function getRandomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  return COLORS[getRandomNum(0, 4)];
}

export const getPrepareOrderList = async () => {
  try {
    const { data } = await getPreparingOrders();
    data.map((item: any) => {
      return {
        id: item.id,
        createdAt: item.createdAt,
        tableName: item.tableName,
        OrderProducts: item.OrderProducts,
        backgroundColor: randomColor()
      };
    });
    return data;
  } catch (err) {
    console.log("err", err);
  }
};
