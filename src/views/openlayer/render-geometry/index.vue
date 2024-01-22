<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerIconLabel"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>('116.3958,39.9219')
const iconUrlInput = ref<string>('')

const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
// 添加图片标注
const addPicLabel = (isClean:boolean) =>{
  const coordinate = coordinateInput.value.split(',')
  OlMapRef.value?.addPicLabel([{
    id: '1',
    lng: Number(coordinate[0]),
    lat: Number(coordinate[1]),
    url: iconUrlInput.value || positionPic,
  }],isClean)
}

// 添加文字标注
const addMassivePic = (isClean:boolean)=>{
  const arr = getCoordinate()
  OlMapRef.value?.addPicLabel(arr,isClean)
}

// 模拟经纬度点
function getCoordinate () {
  var minLat = -90;
  var maxLat = 90;
  var minLng = -180;
  var maxLng = 180;

  var latInterval = (maxLat - minLat) / 100;
  var lngInterval = (maxLng - minLng) / 200;

  var dataArray = [];

  for(let i=0; i<1000; i++) {
      var randomLat = Math.random() * (maxLat - minLat + 1) + minLat;
      var randomLng = Math.random() * (maxLng - minLng + 1) + minLng;

      dataArray.push({id:'id'+i,lng: randomLng,lat: randomLat,url: iconUrlInput.value || positionPic,});
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
        标注渲染
      </el-divider>
      <div class="mt-3">
        <p class="mb-2">坐标：</p>
        <el-input v-model="coordinateInput"></el-input>
      </div>
      <div class="mt-3">
        <p class="mb-2">链接:</p>
        <el-input v-model="iconUrlInput"></el-input>
        <p class="break-words">参考：https://bpic.51yuansu.com/pic3/cover/03/59/43/5bd10c85191e6_610.jpg</p>
      </div>
      <div class="line">
        <el-button type="primary" @click="addPicLabel(false)">图片标注</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="addPicLabel(true)">图片标注,每次渲染前清空</el-button>
      </div>
      <el-divider></el-divider>
      <div class="line">
        <el-button type="primary" @click="addMassivePic(false)">海量图片标注</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="addMassivePic(true)">海量图片标注,每次渲染前清空</el-button>
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


