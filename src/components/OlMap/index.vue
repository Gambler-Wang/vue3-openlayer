<script lang="ts" setup>
import "ol/ol.css"
import Map from "ol/Map"
import Feature from 'ol/feature'
import View from "ol/View"
import * as Source from 'ol/source'
import * as OlStyle from 'ol/style'
import * as Geom from 'ol/geom'
import * as Layer from "ol/layer"
import { getTileLayer, MapTypeProject, isMapEPSG3857 } from "./tileLayerConifg"
import { PointDataInterface } from "./customInterface"
import { fromLonLat, Projection, transform } from "ol/proj"
import { reactive, ref, watch, onMounted } from "vue"

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
let OlMapObj: any = null
let currentMapType:string = 'tianditu'
let vectorSource:any= new Source.Vector()
let vectorLayer:any= null

// 初始化地图
const initMap = (mapType: string = "tianditu") => {
  currentMapType = mapType
  if (OlMapObj) {
    // 如果存在地图，把前面的图层替换掉，无需重新加载
    OlMapObj.setLayers(getTileLayer(currentMapType))
    OlMapObj.setView(
      new View({
        center: trCoordSystem([116.411794, 39.9068]),
        projection: MapTypeProject[currentMapType],
        zoom: 18,
        maxZoom: 19,
        minZoom: 1
      })
    )
    return
  }
  OlMapObj = new Map({
    target: "map",
    layers: getTileLayer(currentMapType),
    view: new View({
      center: trCoordSystem([116.411794, 39.9068]),
      projection: MapTypeProject[currentMapType],
      zoom: 5,
      maxZoom: 19,
      minZoom: 1
    })
  })
}
// 增加图片标注
const addPicLabel = (arr: Array<PointDataInterface>,isClean:boolean = false) => {
  let featureArr: Feature<Geom.Point>[] = [];
  arr.forEach(el => {
    // 增加openlayer图片标注的代码
    const pointCoord:Array<number> = [el.lng, el.lat]
    // 矢量标注要素
    let iconFeature = createPoint(pointCoord)
    let labelStyle =  new OlStyle.Style({
      image:createIcon(el.url)
    })
    iconFeature.setStyle(labelStyle);
    featureArr.push(iconFeature);
  });
  if(isClean){
    vectorSource.clear(true)
  }
  //矢量标注的数据源
  vectorSource.addFeatures(featureArr)
  //矢量标注图层
  if(!vectorLayer){
    vectorLayer = new Layer.Vector({
        source: vectorSource
    });
    OlMapObj.addLayer(vectorLayer);
  }else{
    OlMapObj.updateSize()
  }
}

// 清空标注
const clearAll = ()=>{

}

// 创建点数据
var createPoint = (arr:Array<number>)=>{
  return new Feature({
    geometry: new Geom.Point(trCoordSystem(arr))
  });
}

// 创建图标
var createIcon = (url:any) => {
 return new OlStyle.Icon({
    anchor: [0.5,1],
    anchorOrigin: "top-right",
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    offsetOrigin: "top-right",
    //透明度
    opacity: 0.75,
    //图标的url
    src: url
  })
}

// 返回对应坐标系的点位
var trCoordSystem = (coordinate: Array<number>) => {
  return isMapEPSG3857(currentMapType) ? fromLonLat(coordinate) : coordinate
}

onMounted(() => {
  // initMap()
  // console.log(OlMapObj)
})

defineExpose({
  initMap,
  addPicLabel,
  clearAll
})
</script>

<template>
  <div class="olmap-container" id="map"></div>
</template>

<style lang="scss" scoped>
.olmap-container {
  width: 100%;
  height: 100%;
}
</style>
.
