<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerIconLabel"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>("116.3958,39.9219")
const iconUrlInput = ref<string>("")

const loadMap = (type: any) => {
  OlMapRef.value?.initMap(type)
}
const renderPoint = () => {
  const pointData = getCoordinate()
  const style = {
    fillColor: "#409eff",
    strokeColor: "#fff",
    strokeWidth: 2,
    imageCircleRadius: 8,
    imageCircleFillColor: "#409eff"
  }
  OlMapRef.value?.renderGeometry("point", pointData, style)
}
const renderLine = () => {
  const pointData = getCoordinate()
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius: 0
  })
  const style = {
    fillColor: "#409eff",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  OlMapRef.value?.renderGeometry("line", pointData, style)
}
const renderPolygon = () => {
  const pointData = getCoordinate(3)
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius: 0
  })
  const style = {
    fillColor: "rgba(0,0,0,0.2)",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  OlMapRef.value?.renderGeometry("polygon", pointData, style)
}
const renderCircle = () => {
  const pointData = getCoordinate(500)
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius: 500000
  })
  const style = {
    fillColor: "rgba(0,0,0,0.2)",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  OlMapRef.value?.renderGeometry("circle", pointData, style)
}
const clear = () => {
  OlMapRef.value?.clearAll()
}

// 模拟经纬度点
function getCoordinate(num:number = 1000) {
  var minLat = -90
  var maxLat = 90
  var minLng = -180
  var maxLng = 180

  var latInterval = (maxLat - minLat) / 100
  var lngInterval = (maxLng - minLng) / 200

  var dataArray = []

  for (let i = 0; i < num; i++) {
    var randomLat = Math.random() * (maxLat - minLat + 1) + minLat
    var randomLng = Math.random() * (maxLng - minLng + 1) + minLng

    dataArray.push({ id: "id" + i, lng: randomLng, lat: randomLat, url: iconUrlInput.value || positionPic,radius:500000 })
  }
  return dataArray
}
onMounted(() => {
  loadMap("tianditu")
})
</script>

<template>
  <div class="render-vector-container">
    <div class="left-box">
      <el-divider> 几何渲染 </el-divider>
      <div class="line">
        <el-button type="primary" @click="renderPoint">渲染点</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="renderLine">渲染线</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="renderPolygon">渲染面</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="renderCircle">渲染圆</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="clear">清空</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.render-vector-container {
  padding: 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  .left-box {
    width: 260px;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    :deep(.el-divider__text) {
      padding: 0 14px;
    }
    .line {
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
