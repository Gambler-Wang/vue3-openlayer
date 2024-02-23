
<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
import { getVectorContext } from 'ol/render'
defineOptions({
  // 命名当前组件
  name: "OpenLayerTrackPlay"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
// 轨迹线相关的对象
let trackObj:any = {}

const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
  OlMapRef.value?.setMapCenter([111.5, 16.9],7)
}
const createTrack = ()=>{
  let arr = [
    [115.62, 14.82],
    [112.79, 14.82],
    [114.6636, 18.2977],
    [111.687, 18.897],
    [110.3014, 15.063]
  ]
  trackObj = OlMapRef.value?.createTrack(arr)
}
const startMove = ()=>{
  const { trackLine, movePoint } = trackObj;
  OlMapRef.value?.startMoveTrack(trackLine,movePoint)
}

const endMove = ()=>{
  const { trackLine,movePoint } = trackObj;
  OlMapRef.value?.endMoveTrack(trackLine,movePoint)
}

onMounted(()=>{
  loadMap('tianditu')
  createTrack()
})
</script>

<template>
  <div class="track-play-container">
    <div class="left-box">
      <el-divider>
        轨迹回放
      </el-divider>
      <div class="line">
        <el-button type="primary" @click="startMove()">开始</el-button>
      </div>
      <div class="line">
        <el-button type="primary" @click="endMove()">暂停</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.track-play-container {
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


