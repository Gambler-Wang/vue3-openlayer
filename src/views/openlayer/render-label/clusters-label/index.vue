<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerIconTextLabel"
})
/** 滚动条内容元素的引用 */
const OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const iconUrlInput = ref<string>('')
const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}

// 添加聚合点
const addMassivePoint = (isClean:boolean)=>{
  const arr = getCoordinate(9999)
  OlMapRef.value?.renderCluster(arr,isClean)
}
// 清空聚合点
const clear = ()=>{
  OlMapRef.value?.clearAll()
}

// 模拟经纬度点
function getCoordinate (num=1000) {
  var minLat = -90;
  var maxLat = 90;
  var minLng = -180;
  var maxLng = 180;

  var latInterval = (maxLat - minLat) / 100;
  var lngInterval = (maxLng - minLng) / 200;

  var dataArray = [];

  for(let i=0; i<num; i++) {
      var randomLat = Math.random() * (maxLat - minLat + 1) + minLat;
      var randomLng = Math.random() * (maxLng - minLng + 1) + minLng;

      dataArray.push({id:'id'+i,lng: randomLng,lat: randomLat,url: iconUrlInput.value || positionPic});
  }
 return dataArray
}
onMounted(()=>{
  loadMap('tianditu')
})
</script>

<template>
  <div class="render-vector-container">
    <div class="left-box">
      <el-divider>
        聚合物渲染
      </el-divider>
      <div class="line">
        标注点周围没有点位时，不会显示聚合点
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="addMassivePoint(true)">添加大量点,生成聚合点</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="clear()">清空聚合点</el-button>
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


