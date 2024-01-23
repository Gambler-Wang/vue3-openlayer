<script lang="ts" setup>
import "ol/ol.css"
import Map from "ol/Map"
import Feature from 'ol/feature'
import View from "ol/View"
import * as Source from 'ol/source'
import * as OlStyle from 'ol/style'
import * as Geom from 'ol/geom'
import * as Layer from "ol/layer"
import * as Interaction from "ol/interaction"
import {createRegularPolygon,createBox} from "ol/interaction/draw"
import Overlay from 'ol/overlay'
import { getTileLayer, MapTypeProject, isMapEPSG3857 } from "./tileLayerConifg"
import { PointDataInterface,LabelStyleInterface,BaseStyleInterface } from "./customInterface"
import { ElMessage } from "element-plus"
import { fromLonLat, Projection, transform } from "ol/proj"
import { reactive, ref, watch, onMounted } from "vue"

defineOptions({
  // 命名当前组件
  name: "OlMap"
})
const props = defineProps({
  mapId:{
    type: String, // 类型
    required: false, // 是否必传
    default: 'map' //值 ‘gaode’,'baidu','tianditu','custom'
  },
})
let OlMapObj: any = ref(null)
let currentMapType:string = 'tianditu'
// 矢量图层
let vectorSource:any= new Source.Vector()
let vectorLayer:any= null
// 绘制对象
let drawObj:any = ref(null)
// 绘制矢量图层
let drawVectorSource:any= new Source.Vector()
let drawVectorLayer:any= null

// 初始化地图
const initMap = (mapType: string = "tianditu") => {
  currentMapType = mapType
  if (OlMapObj.value) {
    // 如果存在地图，把前面的图层替换掉，无需重新加载
    OlMapObj.value.setLayers(getTileLayer(currentMapType))
    OlMapObj.value.setView(
      new View({
        center: trCoordSystem([116.411794, 39.9068]),
        projection: MapTypeProject[currentMapType],
        zoom: 18,
        maxZoom: 19,
        minZoom: 1
      })
    )
    return OlMapObj.value
  }
  OlMapObj.value = new Map({
    target: props.mapId,
    layers: getTileLayer(currentMapType),
    view: new View({
      center: trCoordSystem([116.411794, 39.9068]),
      projection: MapTypeProject[currentMapType],
      zoom: 6,
      maxZoom: 19,
      minZoom: 1
    })
  })
  return OlMapObj.value
}

/**+
 * @description:增加图片标注
 * @param {*} arr - 渲染的点数据
 * @param {*} isClean - boolean 是否清除上次的
 * @return {*}
 */
const addPicLabel = (arr: PointDataInterface[],isClean:boolean = false) => {
  let featureArr: Feature<Geom.Point>[] = [];
  arr.forEach(el => {
    // 增加openlayer图片标注的代码
    const pointCoord:Array<number> = [el.lng, el.lat]
    // 矢量标注要素
    let iconFeature = createPoint(pointCoord,el)
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
    OlMapObj.value.addLayer(vectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
  console.log(vectorSource.getFeatures());
}
/**
 * @description:
 * @param {*} arr 渲染的点数据
 * @param {*} style 文字样式
 * @param {*} isClean boolean 是否清除上次的
 */
const addTextLabel = (arr: PointDataInterface[],style:LabelStyleInterface,isClean:boolean = false) => {
  let featureArr: Feature<Geom.Point>[] = [];
  arr.forEach(el => {
    // 增加openlayer图片标注的代码
    const pointCoord:Array<number> = [el.lng, el.lat]
    // 矢量标注要素
    let iconFeature = createPoint(pointCoord,el)
    let labelStyle =  new OlStyle.Style({
      text:createText(style,el.name)
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
    OlMapObj.value.addLayer(vectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }

}
/**
 * @description:增加点icon和点text
 * @param {*} arr 渲染的点数据
 * @param {*} style 文字样式
 * @param {*} isClean boolean 是否清除上次的
 */
const addTextPicLabel = (arr: PointDataInterface[],style:LabelStyleInterface,isClean:boolean = false) => {
  // 直接调用会循环两次
  // addTextLabel(arr,style,isClean)
  // addPicLabel(arr,false)
  let featureArr: Feature<Geom.Point>[] = [];
  arr.forEach(el => {
    // 增加openlayer图片标注的代码
    const pointCoord:Array<number> = [el.lng, el.lat]
    // 矢量标注要素
    let iconFeature = createPoint(pointCoord,el)
    let labelStyle =  new OlStyle.Style({
      image:createIcon(el.url),
      text:createText(style,el.name)
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
    OlMapObj.value.addLayer(vectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
}
/**
 * @description: 绘制图形
 * @param {*} type <string> Point,LineString,Polygon,Circle,Rectangle,Square
 * @param {*} data <array> 渲染数据
 * @param {*} style 样式对象
 * @return {*}
 */
const renderGeometry = (type: string,data:any[],style:BaseStyleInterface)=>{
  let sourceFeatureArr = []
  if(type === 'Point'){
    data.forEach(el=>{
      const pointCoord:Array<number> = [el.lng, el.lat]
      let sourceFeature = createPoint(pointCoord)
      const styleObj = createVectorStyle(style)
      sourceFeature.setStyle(styleObj)
      sourceFeatureArr.push(sourceFeature)
    })
  }
  else if(type === 'LineString' ){
    if(data.length<2){
      ElMessage.warning('设置点位小于2个，无法连线')
      return
    }
    const lastIndex = data.length - 1
    const handleArr = [[data[0].lng,data[1].lat],[data[lastIndex].lng,data[lastIndex].lat]]
    let sourceFeature = createLine(handleArr)
    const styleObj = createVectorStyle(style)
    sourceFeature.setStyle(styleObj)
    sourceFeatureArr.push(sourceFeature)
  }
  else if(type === 'Polygon'){
    // 多边形
    if(data.length<3){
      ElMessage.warning('设置点位小于3个，无法绘制多边形')
      return
    }
    let handleArr: any[] = [];
    data.forEach(el=>{
      let arr = [el.lng,el.lat]
      handleArr.push(arr)
    })
    let sourceFeature = createPolygon(handleArr)
    const styleObj = createVectorStyle(style)
    sourceFeature.setStyle(styleObj)
    sourceFeatureArr.push(sourceFeature)
  }
  else if(type === 'Circle'){
    data.forEach(el=>{
      let sourceFeature = createCircle([el.lng,el.lat],el)
      const styleObj = createVectorStyle(style)
      sourceFeature.setStyle(styleObj)
      sourceFeatureArr.push(sourceFeature)
    })
  }else{
    return
  }
  //矢量标注的数据源
  vectorSource.addFeatures(sourceFeatureArr)
  //矢量标注图层
  if(!vectorLayer){
    vectorLayer = new Layer.Vector({
        source: vectorSource
    });
    OlMapObj.value.addLayer(vectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
}

/**
 * @description: 绘制自由点线面圆
 * @param {*} type 绘制类型
 * @return {*}
 */
const drawGeometry=(obj:any)=>{
  let {type,freehand}=obj
  let geometryFunction,maxPoints;
  closeDrawFn();
  if(type === '_LineString'){
    type = 'LineString'
  }else if(type === '_Polygon'){
    type = 'Polygon'
  }else if(type === 'Rectangle'){
    type = 'LineString';
    maxPoints = 2;
    geometryFunction = createBox()
  }else if(type === 'Square'){
    type = 'Circle';
    geometryFunction = createRegularPolygon(4)
  }
  drawObj.value = createInteraction({ type, freehand, geometryFunction, maxPoints })
  OlMapObj.value.addInteraction(drawObj.value)
  if(!drawVectorLayer){
    drawVectorLayer = new Layer.Vector({
        source: drawVectorSource
    });
    OlMapObj.value.addLayer(drawVectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
}

// 增加弹窗
const addPopupOverlay = (dom: any) =>{
  const popup = createPopup(dom)
  OlMapObj.value.addOverlay(popup)
  return popup
}

// 清空标注
const clearAll = ()=>{
  vectorSource.clear(true)
  OlMapObj.value.removeLayer(vectorLayer)
  drawVectorSource.clear(true)
  OlMapObj.value.removeLayer(drawVectorLayer)
}

// 关闭绘制功能
function closeDrawFn(){
  if(drawObj.value){
    OlMapObj.value.removeInteraction(drawObj.value);
  }
}

// 创建自由绘制类对象
function createInteraction(obj:any){
  return new Interaction.Draw({
      source: drawVectorSource,
      type: obj.type,
      freehand: obj.freehand,
      geometryFunction:obj.geometryFunction,
      maxPoints:obj.maxPoints
  });
}

// 创建点要素
function createPoint (arr:Array<number>,obj:any={}){
  return new Feature({
    geometry: new Geom.Point(trCoordSystem(arr)),
    attribute:obj
  });
}

// 创建线要素
function createLine (arr: any[],obj:any={}){
  const handleArr = arr.map((el: number[])=>{
    return trCoordSystem(el)
  })
  return new Feature({
    geometry: new Geom.LineString(handleArr),
    attribute:obj
  });
}

// 创建多边形要素
function createPolygon(arr: any[],obj:any={}){
  const handleArr = arr.map((el: number[])=>{
    return trCoordSystem(el)
  })
  return new Feature({
    geometry: new Geom.Polygon([handleArr]),
    attribute:obj
  });
}

// 创建圆要素
function createCircle(arr:Array<number>,obj:any={}){
  return new Feature({
    geometry: new Geom.Circle(trCoordSystem(arr), obj.radius)
  });
}

// 创建文字标注以及文字样式
function createText (style:LabelStyleInterface,text: any){
  return new OlStyle.Text({
    //位置
    textAlign: style.textAlign || 'center',
    //基准线
    textBaseline: style.textBaseline||'middle',
    //文字样式
    font: style.font || 'normal 14px 微软雅黑',
    //文本内容
    text: text || '测试',
    //文本填充样式（即文字颜色）
    fill: new OlStyle.Fill({ color: style.fontColor || '#aa3300' }),
    stroke: new OlStyle.Stroke({ color: style.strokeColor || '#ffcc33', width:style.strokeWidth || 2 })
  })
}

// 创建样式
function createVectorStyle(style:BaseStyleInterface){
  return new OlStyle.Style({
    //填充色
    fill: new OlStyle.Fill({
      color: style.fillColor
    }),
    //边线颜色
    stroke: new OlStyle.Stroke({
      color: style.strokeColor,
      width: style.strokeWidth
    }),
    //形状
    image: new OlStyle.Circle({
      radius: style.imageCircleRadius || 1,
      fill: new OlStyle.Fill({
          color: style.imageCircleFillColor || '#000'
      })
    })
  })
}

// 创建图标标注
function createIcon(url:any) {
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

// 创建弹窗
function createPopup(dom: any){
  return new Overlay({
      //要转换成overlay的HTML元素
      element: dom,
      //Popup放置的位置
      positioning: 'bottom-center',
      //是否应该停止事件传播到地图窗口
      stopEvent: false,
      //当前窗口可见
      autoPan: {
        animation:{
          duration: 250
        }
      },
  });
}

// 返回对应坐标系的点位
function trCoordSystem (coordinate: Array<number>) {
  return isMapEPSG3857(currentMapType) ? fromLonLat(coordinate) : coordinate
}

onMounted(() => {
  // initMap()
  // console.log(OlMapObj)
})

defineExpose({
  initMap,
  OlMapObj,
  addPicLabel,
  addTextLabel,
  addTextPicLabel,
  addPopupOverlay,
  renderGeometry,
  drawGeometry,
  closeDrawFn,
  trCoordSystem,
  clearAll,
})
</script>

<template>
  <div class="olmap-container" :id="mapId"></div>
</template>

<style lang="scss" scoped>
.olmap-container {
  width: 100%;
  height: 100%;
}
</style>
.
