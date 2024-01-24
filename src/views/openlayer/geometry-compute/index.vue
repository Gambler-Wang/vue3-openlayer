<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerGeometryCompute"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>("116.3958,39.9219")
let isOpenDraw = ref<boolean>(false)
let drawType = ref<string>('LineString')
let drawTypeList = ref<any[]>([
  {
    value:'LineString',
    key:'LineString',
    label:'测距'
  },
  {
    value:'Polygon',
    key:'Polygon',
    label:'侧面'
  },
])

const loadMap = (type: any) => {
  OlMapRef.value?.initMap(type)
}
const handleSelectChange = (val: any) =>{
  if(!isOpenDraw.value) return
  OlMapRef.value?.computeDistance({},val)
}

const handleSwitchChange = (val:any)=>{
  if(val){
    OlMapRef.value?.computeDistance({},drawType.value)
  }else{
    OlMapRef.value?.closeDrawFn()
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
  <div class="geometry-compute-container">
    <div class="left-box">
      <el-divider> 测距/侧面 </el-divider>
      <div class="line">
        <el-switch inactive-text="关闭绘制" active-text="开启绘制"  v-model="isOpenDraw" @change="handleSwitchChange" />
      </div>
      <div class="line">
        <el-select
          v-model="drawType"
          placeholder="请选择要绘制图形"
          size="large"
          :disabled="!isOpenDraw"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in drawTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="line">
        <el-button type="primary" @click="clear">清空图层</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.geometry-compute-container {
  padding: 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  .left-box {
    width: 260px;
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
