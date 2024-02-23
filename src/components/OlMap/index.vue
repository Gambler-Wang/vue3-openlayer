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
import {getArea, getLength} from 'ol/sphere';
import Overlay from 'ol/overlay'
import { ElMessage } from "element-plus"
import { fromLonLat,transformExtent,Projection, transform } from "ol/proj"
import { reactive, ref, watch, onMounted } from "vue"
import { getTileLayer, MapTypeProject, isMapEPSG3857 } from "./tileLayerConifg"
import { PointDataInterface,LabelStyleInterface,BaseStyleInterface,CircleFeaturePropertiesType} from "./customInterface"
import controlConfig  from './controlConfig'
import {pointAnimation,areaAinimation,trackMoveAnimation,initNextMoveTime} from './animation'
import RenderEvent from "ol/render/Event"

defineOptions({
  // 命名当前组件
  name: "OlMap"
})
const props = defineProps({
  mapId:{
    type: String,
    required: false,
    default: 'map'
  },
  extentRange:{
    type: Array,
    required: false, // 是否必传
    default: function(){
      return [116.30144842, 38.5285152, 120.45160558, 39.4366038]
    }
  }
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
// const segmentStyles = [createDistanceTipStyle()]
// 点动画方法集合
let pointAnimateEntryArr: any[]=[]
// 面动画方法集合
let areaAnimateEntryArr: any[]=[]
// 轨迹动画
let trackMoveFn: ((event: RenderEvent) => void) | null = null
// 聚合物数据源
let clusterVectorSource:any= null
// 初始化地图
/**
 * @description: 初始化地图
 * @param {*} mapType gaode baidu tianditu custom
 * @return {*} openlayer实例对象
 */

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

/**
 * @description: 设置中心店
 * @param {*} coordinate array 坐标
 * @param {*} zoom number 缩放级别
 * @return {*}
 */
const setMapCenter = (coordinate: any,zoom: any) =>{
  const mapView = OlMapObj.value.getView();
  if(!mapView) return
  mapView.animate(
    {
      center:trCoordSystem(coordinate),
    },
    {
      zoom,
    },

  )
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
 * @description: 聚合点渲染
 * @param {*} arr 点位数组
 * @param {*} isClean 渲染是否清空上次渲染
 * @return {*}
 */
const renderCluster = (arr: PointDataInterface[],isClean:boolean = false)=>{
  addPicLabel(arr,isClean)
  clusterVectorSource = new Source.Cluster({
    distance:40,
    source: vectorSource
  });
  var styleCache:any = {};
  //矢量标注图层
  vectorLayer.setSource(clusterVectorSource)
  vectorLayer.setStyle(function (feature: { get: (arg0: string) => { getProperties: () => any }[] }, resolution: any) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      const clusturStyle = new OlStyle.Style({
        image: new OlStyle.Circle({
          radius: 10,
          stroke: new OlStyle.Stroke({
            color: '#fff'
          }),
          fill: new OlStyle.Fill({
            color: '#3399CC'
          })
        }),
        text: new OlStyle.Text({
          text: size.toString(),
          fill: new OlStyle.Fill({
            color: '#fff'
          })
        })
      })
      if(size===1){
        const featureData = feature.get('features')[0].getProperties()
        style = [
          new OlStyle.Style({
            image:createIcon(featureData.attribute.url)
          })
        ];
      }else{
        style = [
          clusturStyle
        ];
      }
      styleCache[size] = style;
    }
    return style;
  })
  OlMapObj.value.updateSize()
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
    let sourceFeature = createPolygon(handleArr,data[0])
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
  drawVectorSource.addFeatures(sourceFeatureArr)
  //矢量标注图层
  if(!drawVectorLayer){
    drawVectorLayer = new Layer.Vector({
        source: drawVectorSource
    });
    OlMapObj.value.addLayer(drawVectorLayer);
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

/**
 * @description: 测距,测面
 * @param {*} lineStyle 画线样式
 * @param {*} type 画多边形还是直线 LineString | Polygon
 * @return {*}
 */
const computeDistance=(lineStyle:BaseStyleInterface,type:string)=>{
  closeDrawFn();
  const drawLineStyle = createDistanceLineStyle()
  const vectorLineStyle = createVectorStyle(lineStyle)
  const params = {
    type,
    freehand:false,
    geometryFunction:null,
    maxPoints:null,
    styleFn: (feature: { getGeometry: () => any })=>{ return distanceStyleCb(feature,drawLineStyle)},
  }
  drawObj.value = createInteraction(params)
  OlMapObj.value.addInteraction(drawObj.value)
  if(!drawVectorLayer){
    drawVectorLayer = new Layer.Vector({
        source: drawVectorSource,
        style: (feature: { getGeometry: () => any })=>{ return distanceStyleCb(feature,vectorLineStyle)}
    });
    OlMapObj.value.addLayer(drawVectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
}

type ControlType = 'zoomSlider' | 'mousePosition' | 'scaleLine' | 'overviewMap' | 'zoomToExtent';
/**
 * @description:添加缩放控件
 * @param {*} type ControlType 控件类型
 * @param {*} isOpen boolean 开启/关闭
 * @return {*}
 */
const setZommSlderControl = (type: ControlType,isOpen:boolean)=>{
  if(isOpen){
    let control = null
    if(type ==='mousePosition'){
      control = controlConfig[type]('mouse-position','EPSG:4326');
    }else if(type ==='overviewMap'){
      control = controlConfig[type](getTileLayer(currentMapType));
    }else if(type === 'zoomToExtent'){
      let numArr: number[] = props.extentRange.map(el=>{
        return Number(el)
      })
      const extentRange = trExtent(numArr)
      control = controlConfig[type](extentRange);
    }else{
      control = controlConfig[type]()
    }
    control.set('id',type);
    OlMapObj.value.addControl(control)
  }else{
    const control = getRemoveControl('id',type)
    OlMapObj.value.removeControl(control)
  }
}
/**
 * @description: 取消点预警
 * @param {*} isClean 是否清理点标注
 * @return {*}
 */
const cancelPointWarning = (isClean: Boolean)=>{
  if(vectorLayer){
    pointAnimateEntryArr.forEach(el=>{
      vectorLayer.un('postrender',el)
    })
    pointAnimateEntryArr=[]
    if(isClean){
      vectorSource.clear(true)
      OlMapObj.value.updateSize()
    }
  }
}
/**
 * @description: 通知点预警
 * @param {*} arr 点数组
 * @return {*}
 */
const notifyPointWarning = (arr:any)=>{
  cancelPointWarning(true)
  addPicLabel(arr,true)
  arr.forEach((el: { lng: any; lat: any },index: number) => {
    pointAnimateEntryArr[index]=(event: RenderEvent)=>{
      const coordinate = [el.lng,el.lat]
      const point = new Geom.Point(trCoordSystem(coordinate))
      pointAnimation(event,point,OlMapObj.value)
    }
    vectorLayer.on('postrender', pointAnimateEntryArr[index])
  });
}

/**
 * @description: 取消区域预警
 * @param {*} isClean 是否清理区域矢量
 * @return {*}
 */
 const cancelAreaWarning = (isClean: Boolean=true)=>{
  if(drawVectorLayer){
    areaAnimateEntryArr.forEach(el=>{
      drawVectorLayer.un('postrender',el)
    })
    areaAnimateEntryArr=[]
    if(isClean){
      drawVectorSource.clear(true)
      OlMapObj.value.updateSize()
    }
  }
}
// 通知区域预警
const notifyAreaWarning = (type: string,data:any[],style:BaseStyleInterface)=>{
  renderGeometry(type, data, style)
  const features = drawVectorSource.getFeatures()
  const filterFeatures = features.filter((el: { getProperties: () => any })=>{
    let oldObj = el.getProperties();
    return !oldObj.isRenderAnimation
  })
  const feature = filterFeatures[filterFeatures.length-1]
  console.log(filterFeatures)
  console.log(feature)
  const gemo = feature.getGeometry()
  areaAnimateEntryArr.push(
    (event: RenderEvent)=>{
      areaAinimation(event,gemo,OlMapObj.value)
    }
  )
  drawVectorLayer.on('postrender', areaAnimateEntryArr[areaAnimateEntryArr.length-1])
  feature.setProperties({isRenderAnimation:true})
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

const startMoveTrack = (trackLine: any,movePoint: any)=>{
  if(trackMoveFn) return
  trackMoveFn = (event: RenderEvent)=>{
    trackMoveAnimation(event,trackLine,movePoint,OlMapObj.value)
  }
  initNextMoveTime(Date.now())
  drawVectorLayer?.on("postrender",trackMoveFn);
  OlMapObj.value.render()
}
const endMoveTrack = (trackLine: any,movePoint: any)=>{
  drawVectorLayer?.un("postrender",trackMoveFn);
  trackMoveFn = null
}

/**
 * @description: 创建轨迹线
 * @param {*} arr 经纬度点位数组
 * @return {*}
 */
function createTrack(arr: any[]){
  const trackLine = createLine(arr)
  const startPoint = createPoint(arr[0])
  const endPoint = createPoint(arr[arr.length-1])
  const movePoint = createPoint(arr[0])
  movePoint.setStyle(createVectorStyle({
    imageCircleRadius:5,
    imageCircleFillColor:'#000'
  }))
  const featureArr = [trackLine,startPoint,endPoint,movePoint]
  //矢量标注的数据源
  drawVectorSource.addFeatures(featureArr)
  //矢量标注图层
  if(!drawVectorLayer){
    drawVectorLayer = new Layer.Vector({
        source: drawVectorSource
    });
    OlMapObj.value.addLayer(drawVectorLayer);
  }else{
    OlMapObj.value.updateSize()
  }
  return {trackLine,startPoint,endPoint,movePoint}
}

// 测距样式回调显示
function distanceStyleCb(feature: { getGeometry: () => any },lineStyle: OlStyle.Style){
  const arr = []
  const geometry =feature.getGeometry();
  const type = geometry.getType();
  let lastPoint = null;
  let label = null;
  let line = null;
  arr.push(lineStyle)
  if(type === 'LineString' ){
    lastPoint = new Geom.Point(geometry.getLastCoordinate());
    label = formatLength(geometry);
    line = geometry;
  }else if(type === 'Polygon'){
    lastPoint = geometry.getInteriorPoint();
    label = formatArea(geometry);
    line = new Geom.LineString(geometry.getCoordinates()[0]);
  }
  if(line){
    let count = 0;
    line.forEachSegment(function (a: number, b: number) {
      let distanceTipStyle = createDistanceTipStyle();
      const segment = new Geom.LineString([a, b]);
      const label = formatLength(segment);
      const segmentPoint = new Geom.Point(segment.getCoordinateAt(0.5));
      distanceTipStyle.setGeometry(segmentPoint);
      distanceTipStyle.getText().setText(label);
      arr.push(distanceTipStyle);
      // const segmentStyles = [createDistanceTipStyle()]
      // if (segmentStyles.length - 1 < count) {
      //   segmentStyles.push(distanceTipStyle);
      // }
      // const segmentPoint = new Geom.Point(segment.getCoordinateAt(0.5));
      // segmentStyles[count].setGeometry(segmentPoint);
      // segmentStyles[count].getText().setText(label);
      // arr.push(segmentStyles[count]);
      // count++;
    });
  }
  if (label) {
    let distanceTipStyle = createDistanceTipStyle();
    distanceTipStyle.setGeometry(lastPoint);
    distanceTipStyle.getText().setText(label);
    arr.push(distanceTipStyle);
  }
  return arr
}

// 测量长度
function formatLength (line: Geom.Geometry) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

// 测量面积
function formatArea (polygon: Geom.Geometry) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km²'
  } else {
    output = Math.round(area * 100) / 100 + ' m²';
  }
  return output;
};

// 关闭绘制功能
function closeDrawFn(){
  if(drawObj.value){
    OlMapObj.value.removeInteraction(drawObj.value);
  }
}

// 创建绘制类对象
function createInteraction(obj:any){
  return new Interaction.Draw({
      source: drawVectorSource,
      type: obj.type,
      freehand: obj.freehand,
      geometryFunction:obj.geometryFunction,
      maxPoints:obj.maxPoints,
      style: obj.styleFn,
  });
}

// 找到对应的空间并删除
function getRemoveControl(id: any,value: any){
  let control = undefined
  const controlList =OlMapObj.value.getControls()
  controlList.forEach((el: { get: (arg0: any) => any })=>{
    if(el.get(id)===value){
      control = el
    }
  })
  return control
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
function createCircle(arr:Array<number>,obj:CircleFeaturePropertiesType={
  radius:500000
}){
  return new Feature({
    geometry: new Geom.Circle(trCoordSystem(arr), obj.radius),
    attribute:obj
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

// 创建基本绘制矢量样式
function createVectorStyle(style:BaseStyleInterface = {}){
  return new OlStyle.Style({
    //填充色
    fill: new OlStyle.Fill({
      color: style.fillColor || 'rgba(0,0,0,.2)'
    }),
    //边线颜色
    stroke: new OlStyle.Stroke({
      color: style.strokeColor || '#409eff',
      width: style.strokeWidth || 2
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

// 创建测距tip样式
function createDistanceTipStyle(){
  return new OlStyle.Style({
    text: new OlStyle.Text({
      font: '12px Calibri,sans-serif',
      fill: new OlStyle.Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new OlStyle.Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textBaseline: 'bottom',
      offsetY: -12,
    }),
    image: new OlStyle.RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new OlStyle.Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
  });
}

// 创建测距划线样式
function createDistanceLineStyle(){
  return new OlStyle.Style({
      fill: new OlStyle.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new OlStyle.Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new OlStyle.Circle({
      radius: 5,
      stroke: new OlStyle.Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new OlStyle.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
    }),
  });
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
// 返回对应坐标系的范围
function trExtent (coordinate: number[]) {
  return isMapEPSG3857(currentMapType) ? transformExtent(coordinate,'EPSG:4326','EPSG:3857') : coordinate
}

onMounted(() => {
  // initMap()
  // console.log(OlMapObj)
})

defineExpose({
  initMap,
  setMapCenter,
  OlMapObj,
  addPicLabel,
  addTextLabel,
  addTextPicLabel,
  addPopupOverlay,
  renderCluster,
  renderGeometry,
  drawGeometry,
  closeDrawFn,
  computeDistance,
  setZommSlderControl,
  notifyPointWarning,
  cancelPointWarning,
  notifyAreaWarning,
  cancelAreaWarning,
  createTrack,
  endMoveTrack,
  startMoveTrack,
  trCoordSystem,
  clearAll,
})
</script>

<template>
  <div class="olmap-container" :id="mapId">
    <div id="mouse-position"></div>
  </div>
</template>

<style lang="scss" scoped>
.olmap-container {
  width: 100%;
  height: 100%;
  position: relative;
  #mouse-position {
    position: absolute;
    top: 5px;
    right: 0;
    width: 180px;
    height: 20px;
    z-index: 2000;
  }
  .custom-mouse-position {
    color: rgb(0,0,0);
    font-size: 16px;
    font-family: "微软雅黑";
  }
}
</style>
<style>
  /*=S 自定义鹰眼样式 */
  .ol-custom-overviewmap, .ol-custom-overviewmap.ol-uncollapsible {
    bottom: auto;
    left: auto;
    right: 0;
    bottom: 0;
  }
  /* 鹰眼控件展开时控件外框的样式 */
  .ol-custom-overviewmap:not(.ol-collapsed) {
      border: 1px solid black;
  }
  /* 鹰眼控件中地图容器样式 */
  .ol-custom-overviewmap .ol-overviewmap-map {
      border: none;
      width: 300px;
  }
  /* 鹰眼控件中显示当前窗口中主图区域的边框 */
  .ol-custom-overviewmap .ol-overviewmap-box {
      border: 2px solid red;
  }
  /* 鹰眼控件展开时其控件按钮图标的样式 */
  .ol-custom-overviewmap:not(.ol-collapsed) button {
      bottom: auto;
      left: auto;
      right: 1px;
      top: 1px;
  }
  /*=E 自定义鹰眼样式 */
</style>
