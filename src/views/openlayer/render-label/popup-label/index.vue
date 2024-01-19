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
const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
const openPopup =()=>{

}
const closePopup = ()=>{

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
      <div class="line">
        <el-button size="large" type="primary" @click="openPopup">弹窗标注</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="closePopup">关闭弹窗</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" ></OlMap>
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


