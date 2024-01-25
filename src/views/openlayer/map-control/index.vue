<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerMapControl"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>("116.3958,39.9219")
let isOpenDraw = ref<boolean>(false)
let controlList = ref<any[]>([
  {
    value:false,
    key:'zoomSlider',
    label:'缩放'
  },
  {
    value:false,
    key:'mousePosition',
    label:'鼠标位置'
  },
  {
    value:false,
    key:'scaleLine',
    label:'比例尺'
  },
  {
    value:false,
    key:'overviewMap',
    label:'鹰眼'
  },
  {
    value:false,
    key:'zoomToExtent',
    label:'导航'
  },
])

const loadMap = (type: any) => {
  OlMapRef.value?.initMap(type)
}

const handleSwitchChange = (val:any,item: any)=>{
  // if(item.key === 'zoomSlider' ){
    OlMapRef.value?.setZommSlderControl(item.key,val)
  // }
}

const clear = () => {
  OlMapRef.value?.clearAll()
}


onMounted(() => {
  loadMap("tianditu")
})
</script>

<template>
  <div class="map-control-container">
    <div class="left-box">
      <el-divider> 控件添加 </el-divider>
      <div class="line" v-for="item in controlList" :key="item.key">
        <el-switch :inactive-text="'关闭'+item.label" :active-text="'开启'+item.label" v-model="item.value" @change="handleSwitchChange($event,item)" />
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-control-container {
  padding: 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  .left-box {
    width: 300px;
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
