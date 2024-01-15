<script lang="ts" setup>
import "ol/ol.css";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { reactive, ref, watch,onMounted } from "vue"

defineOptions({
  // 命名当前组件
  name: "OlMap"
})
const gaodeMapLayer = new TileLayer({
    title: "高德地图",
    source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false
    })
});
const initMap = () => {
  const map = new Map({
    target: "map",
    layers: [

      gaodeMapLayer
    ],
    view: new View({
      center: [1, 0],
      projection: 'EPSG:3857',
      zoom: 1,
      minZoom:1
    })
  });
  return map;
}
onMounted(()=>{
  initMap()
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
