<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerPopupLabel"
})
/** 滚动条内容元素的引用 */
const OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
let popupText = ref<any>(null)
let OlMapObj:any = null
let popupOverlay:any = null
// 116.3958,39.9219
const loadMap = (type:any)=>{
  OlMapObj = OlMapRef.value?.initMap(type)
}
// 添加图片标注
const addPicLabel = (isClean:boolean) =>{
  const coordinate = [116.3958,39.9219]
  OlMapRef.value?.addPicLabel([{
    lng: Number(coordinate[0]),
    lat: Number(coordinate[1]),
    url: positionPic,
  }],isClean)
}
const openPopup =()=>{
  addPicLabel(true)
  const coordinate =  OlMapRef.value?.trCoordSystem([116.3958,39.9219])
  popupText.value= `
    <p style="width:120px">测试测试测试</p>
  `
  popupOverlay.setPosition(coordinate)
  OlMapObj.on('click',(evt: { pixel: any; })=>{
    mapClickEvent(evt)
  });
}
const closePopup = ()=>{
  popupOverlay.setPosition(undefined)
}

// 添加图文标注
const addMassiveTxtPic = (isClean:boolean)=>{
  const arr = getCoordinate()
  const style = {
    color:'blue'
  }
  // 可以这样=>会循环两次
  // OlMapRef.value?.addTextLabel(arr,style,isClean)
  // OlMapRef.value?.addPicLabel(arr,false)
  // 也可以合着一起写
  OlMapRef.value?.addTextPicLabel(arr,style,isClean)
}

// 给要素展示信息
const showPointPopup = ()=>{
  addMassiveTxtPic(true)
  OlMapObj.on('click',(evt: { pixel: any; })=>{
    mapClickEvent(evt)
  });
}
// 点击事件
function mapClickEvent (evt: { pixel: any; }) {
  //判断当前单击处是否有要素，捕获到要素时弹出popup
  var feature = OlMapObj.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) { return feature; });
  if (feature) {
    //清空popup的内容容器
    popupText.value = '';
    //在popup中加载当前要素的具体信息
    const obj = feature.getProperties().attribute;
    if(obj.id){
      popupText.value= `
        <p>id:${obj.id}</p>
        <p>lng:${obj.lng}</p>
        <p>lat:${obj.lat}</p>
        <p>name:${obj.name}</p>
        <p>pciUrl:${obj.url}</p>
      `
    }else{
      popupText.value= `
        <p style="width:120px">测试测试测试</p>
      `
    }
    const coordinate =  OlMapRef.value?.trCoordSystem([obj.lng,obj.lat])
    popupOverlay.setPosition(coordinate)
  }else{
    popupOverlay.setPosition(undefined)
  }
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

      dataArray.push({id:'id'+i,lng: randomLng,lat: randomLat,url: positionPic,name:'测试'+i});
  }
 return dataArray
}
onMounted(()=>{
  loadMap('tianditu')
  const dom = document.getElementById('popup')
  popupOverlay =  OlMapRef.value?.addPopupOverlay(dom)
})
</script>

<template>
  <div class="render-vector-container">
    <div class="left-box">
      <el-divider>
        弹窗标注
      </el-divider>
      <div class="line">
        <el-button size="large" type="primary" @click="openPopup">非要素弹窗标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="closePopup">非要素关闭弹窗</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="showPointPopup">要素内容展示弹窗</el-button>
      </div>
      <el-divider>
        图标可点击
      </el-divider>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" ></OlMap>
    </div>
    <div id="popup" class="ol-popup">
      <span id="popup-closer" class="ol-popup-closer" @click="closePopup" ></span>
      <div id="popup-content" v-html="popupText"></div>
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
  #popup{
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 38px;
    left: -48px;
    &:after {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-top-color: white;
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 8px;
      cursor: pointer;
    }
    #popup-content{
      :deep(p){
        margin: 10px 0 6px 0;
      }
    }
    .ol-popup-closer:after {
      content: "✖";
    }
  }
}
</style>


