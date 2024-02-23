<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerSetCenter"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>('116.3958,39.9219')

const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
// 设置中心点
const setCenter = () =>{
  const coordinate = coordinateInput.value.split(',')
  OlMapRef.value?.setMapCenter(coordinate,7)
}
const setMapCenter =(isClean:boolean) =>{
  const coordinate = coordinateInput.value.split(',')
  OlMapRef.value?.addPicLabel([{
    id: '1',
    lng: Number(coordinate[0]),
    lat: Number(coordinate[1]),
    url: positionPic,
  }],isClean)
  OlMapRef.value?.setMapCenter(coordinate,7)
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
      <div class="line">
        <el-button type="primary" @click="setCenter">平移至中心点</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="setMapCenter(false)">平移并标记</el-button>
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


