<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import OlMap from "@/components/OlMap/index.vue"

defineOptions({
  // 命名当前组件
  name: "OpenLayerBaseMap"
})
/** 滚动条内容元素的引用 */
const OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
onMounted(()=>{
  loadMap('tianditu')
})
</script>

<template>
  <div class="base-map-container">
    <div class="left-box">
      <el-divider>
        第三方地图
      </el-divider>
      <p>天地图和百度地图，高德地图，经纬度坐标需要相互转换;如果是在EPSG:4236上渲染的，还需要再通过openlayer提供方法转一次，一般在实际开发中，经纬度坐标系统一</p>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('tianditu')">天地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('gaode')">高德地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('baidu')">百度地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('custom')">自定义</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-map-container {
  padding: 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  .left-box {
    width: 260px;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    :deep(.el-divider__text){
      padding: 0 14px;
    }
    .line{
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .right-box {
    flex: 1;
    box-sizing: border-box;
    border: 1px solid var(--el-border-color);
    background-color: #fff;
  }
}
</style>


