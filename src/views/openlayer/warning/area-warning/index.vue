<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
import { getVectorContext } from 'ol/render'
defineOptions({
  // 命名当前组件
  name: "OpenLayerAreaWarning"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>('116.3958,39.9219')
const iconUrlInput = ref<string>('')

const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}

/**
 * @description: 传入点位,增加动画预警,预警动画封装固定
 * @return {*}
 */
const addAreaWarning = (isClean: Boolean = true)=>{
  OlMapRef.value?.cancelAreaWarning(isClean)
  const pointData = getCoordinate(2)
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius:500000
  })
  pointData.unshift({
    lng: 116.3958,
    lat: 39.9219,
    id: "---12",
    url: "----",
    radius:500000
  })
  const style = {
    fillColor: "rgba(0,0,0,0.2)",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  OlMapRef.value?.notifyAreaWarning("Polygon", pointData, style)
}

// 多区域预警
const addMassiveAreaWarning = (isClean: Boolean = true)=>{
  OlMapRef.value?.cancelAreaWarning(isClean)
  const pointData = getCoordinate(2)
  const pointData1 = getCoordinate(2)
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius:500000
  })
  pointData.unshift({
    lng: 116.3958,
    lat: 39.9219,
    id: "---12",
    url: "----",
    radius:500000
  })
  pointData1.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius:500000
  })
  pointData1.unshift({
    lng: 116.3958,
    lat: 39.9219,
    id: "---12",
    url: "----",
    radius:500000
  })
  const style = {
    fillColor: "rgba(0,0,0,0.2)",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  OlMapRef.value?.notifyAreaWarning("Polygon", pointData, style)
  OlMapRef.value?.notifyAreaWarning("Polygon", pointData1, style)
}


/**
 * @description: 传入圆形点位,增加动画预警,预警动画封装固定
 * @return {*}
 */
 const addCircleWarning = (isClean: Boolean = true)=>{
  OlMapRef.value?.cancelAreaWarning(isClean)
  const pointData = getCoordinate(10)
  pointData.push({
    lng: 116.3958,
    lat: 39.9219,
    id: "---",
    url: "----",
    radius:500000
  })
  const style = {
    fillColor: "rgba(0,0,0,0.2)",
    strokeColor: "#409eff",
    strokeWidth: 2
  }
  pointData.forEach(el=>{
    OlMapRef.value?.notifyAreaWarning("Circle", [el], style)
  })
}

// 清除预警
const clearWarning = (isClean: Boolean)=>{
  OlMapRef.value?.cancelAreaWarning(isClean)
}

// 模拟经纬度点
function getCoordinate (num=1000) {
  var minLat = -90;
  var maxLat = 90;
  var minLng = -180;
  var maxLng = 180;

  var dataArray = [];

  for(let i=0; i<num; i++) {
      var randomLat = Math.random() * (maxLat - minLat + 1) + minLat;
      var randomLng = Math.random() * (maxLng - minLng + 1) + minLng;

      dataArray.push({id:'id'+i,lng: randomLng,lat: randomLat,url: iconUrlInput.value || positionPic,radius:500000});
  }
 return dataArray
}

onMounted(()=>{
  loadMap('tianditu')
})
</script>

<template>
  <div class="area-warning-container">
    <div class="left-box">
      <el-divider>
        区域预警
      </el-divider>
      <div class="mt-3">
        <p class="mb-2">区域一角坐标：</p>
        <el-input v-model="coordinateInput"></el-input>
      </div>
      <div class="line">
        <el-button type="primary" @click="addAreaWarning()">随机指定区域预警</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="addMassiveAreaWarning()">多区域预警</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="addCircleWarning()">圆形区域预警</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="clearWarning(true)">完全清除预警</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="clearWarning(false)">清除预警动画保留点位</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.area-warning-container {
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


