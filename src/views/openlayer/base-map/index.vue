<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import OlMap from "@/components/OlMap/index.vue"

defineOptions({
  // 命名当前组件
  name: "OpenLayerBaseMap"
})
</script>

<template>
  <div class="base-map-container">
    <div class="left-box">
      1
    </div>
    <div class="right-box">
      <OlMap />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-map-container{
  padding: 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  .left-box{
    width: 180px;
  }
  .right-box{
    flex: 1;
  }
}
</style>
