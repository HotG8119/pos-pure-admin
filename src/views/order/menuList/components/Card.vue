<script setup lang="ts">
import { ref, computed, PropType } from "vue";

defineOptions({
  name: "ReCard"
});

interface CardProductType {
  type: number;
  id: number;
  image: string;
  Category: {
    id: number;
    name: string;
  };
  isAvailable: boolean;
  description: string;
  name: string;
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>
  }
});

const emit = defineEmits(["add-to-cart"]);

const quantity = ref(1);

const handleClickAddToCart = (
  product: CardProductType,
  orderQuantity: number
) => {
  emit("add-to-cart", { product, orderQuantity });
  quantity.value = 1;
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.product.isAvailable }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": !props.product.isAvailable }
]);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div :class="cardLogoClass">
          <el-avatar :size="50" :src="product.image" />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            type="info"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ product.Category.name }}
          </el-tag>
          <el-tag
            :color="product.isAvailable ? '#00a870' : '#eee'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ product.isAvailable ? "供應" : "缺貨" }}
          </el-tag>
        </div>
      </el-row>

      <p class="list-card-item_detail--name text-text_color_primary">
        {{ product.name }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ product.description }}
      </p>
      <div class="add-to-cart">
        <el-input-number
          class="mr-4"
          v-model="quantity"
          :min="1"
          :max="20"
          :disabled="!product.isAvailable"
        />

        <!-- 加入购物车按钮 -->
        <el-button
          type="info"
          @click="handleClickAddToCart(product, quantity)"
          :disabled="!product.isAvailable"
          >加入購物車</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      font-size: 32px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }

  .add-to-cart {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
