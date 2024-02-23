<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import OlMap from "../../../components/OlMap/index.vue"
import { getOtherLayer } from "../../../components/OlMap/tileLayerConifg"

defineOptions({
  // 命名当前组件
  name: "OpenLayerMapLayer"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
let OlMapObj:any = null
const coordinateInput = ref<string>("116.3958,39.9219")
let currentLayerList = ref<any[]>(['天地图矢量图层','天地图矢量注记图层','天地图影像图层','天地图影像注记图层'])
let layerList = ref<any[]>([
  {
    key:'1',
    label:'天地图矢量图层'
  },
  {
    key:'2',
    label:'天地图矢量注记图层'
  },
  {
    key:'3',
    label:'天地图影像图层'
  },
  {
    key:'4',
    label:'天地图影像注记图层'
  },
])

const loadMap = (type: any) => {
  OlMapObj = OlMapRef.value?.initMap(type)
  const layers = getOtherLayer()
  layers.forEach(layer => {
    OlMapObj.addLayer(layer)
  });
}

const checkboxChange = (val:any)=>{
  const layers = OlMapObj.getAllLayers()
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if(val.includes(layer.get('name'))){
      layer.setVisible(true)
    }else{
      layer.setVisible(false)
    }
  }
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
      <el-divider> 图层选择 </el-divider>
      <div class="line">
        <el-checkbox-group v-model="currentLayerList" @change="checkboxChange">
          <el-checkbox :label="item.label" :key="item.key" v-for="item in layerList" />
        </el-checkbox-group>
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
