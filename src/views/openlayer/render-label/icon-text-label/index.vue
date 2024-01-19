<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerIconTextLabel"
})
/** 滚动条内容元素的引用 */
const OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>('116.3958,39.9219')
const textInput = ref<string>('测试')
const iconUrlInput = ref<string>('')
const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
// 添加图片标注
const addPicLabel = () =>{
  const coordinate = coordinateInput.value.split(',')
  OlMapRef.value?.addPicLabel({
    id: '1',
    name: textInput.value || '测试',
    lng: Number(coordinate[0]),
    lat: Number(coordinate[1]),
    url: iconUrlInput || positionPic,
  })
}
// 添加文字标注
const addTxtLabel = ()=>{

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
      <p>可以切换查看渲染</p>
      <div class="line">
        坐标：
        <el-input v-model="coordinateInput"></el-input>
      </div>
      <div class="line">
        文字：
        <el-input v-model="textInput"></el-input>
      </div>
      <div class="line">
        点链接:
        <el-input v-model="iconUrlInput"></el-input>
      </div>
      <div class="line">
        <el-button type="primary" @click="addPicLabel">图片标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="addTxtLabel">文字标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('baidu')">图文标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('custom')">聚合标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('custom')">popup弹出窗</el-button>
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


