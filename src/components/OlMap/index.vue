<script lang="ts" setup>
import "ol/ol.css";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import {getTileLayer,MapTypeProject,isMapEPSG3857} from './tileLayerConifg'
import OSM from "ol/source/OSM";
import { fromLonLat, Projection, transform } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { reactive, ref, watch,onMounted } from "vue"

defineOptions({
  // 命名当前组件
  name: "OlMap"
})
const props = defineProps({
  // mapType:{
  //   type: String, // 类型
  //   required: false, // 是否必传
  //   default: 'tianditu' //值 ‘gaode’,'baidu','tianditu','custom'
  // },
})
let OlMapObj:any = null;
const initMap = (mapType: string = 'tianditu') => {
  if(OlMapObj){
    // 如果存在地图，把前面的图层替换掉，无需重新加载
    OlMapObj.setLayers(getTileLayer(mapType));
    OlMapObj.setView(new View({
      center: (isMapEPSG3857(mapType))?fromLonLat([114.338252,30.532406]):[114.338252,30.532406],
      projection: MapTypeProject[mapType],
      zoom:18,
      maxZoom:19,
      minZoom:1
    }))
    return
  }
  OlMapObj = new Map({
    target: "map",
    layers: getTileLayer(mapType),
    view: new View({
      center: (isMapEPSG3857(mapType))?fromLonLat([114.338252,30.532406]):[114.338252,30.532406],
      projection: MapTypeProject[mapType],
      zoom:18,
      maxZoom:19,
      minZoom:1
    })
  });
}
onMounted(()=>{
  // initMap()
  // console.log(OlMapObj)
})

defineExpose({
  initMap
})
</script>

<template>
  <div class="olmap-container" id="map"></div>
</template>

<style lang="scss" scoped>
.olmap-container{
  width: 100%;
  height: 100%;
}
</style>
