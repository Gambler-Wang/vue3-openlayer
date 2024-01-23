<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import positionPic from "@/assets/map/position.png?url"
import OlMap from "@/components/OlMap/index.vue"
defineOptions({
  // 命名当前组件
  name: "OpenLayerGeometryDraw"
})
/** 滚动条内容元素的引用 */
let OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const coordinateInput = ref<string>("116.3958,39.9219")
let isOpenDraw = ref<boolean>(false)
let drawType = ref<string>('LineString')
let drawTypeList = ref<any[]>([
  {
    value:'Point',
    key:'Point',
    isFreehand:true,
    label:'点'
  },
  {
    value:'LineString',
    key:'LineString',
    isFreehand:true,
    label:'自由线'
  },
  {
    value:'Polygon',
    key:'Polygon',
    isFreehand:true,
    label:'自由多边形'
  },
  {
    value:'Circle',
    key:'Circle',
    isFreehand:true,
    label:'圆'
  },
  {
    value:'_LineString',
    key:'_LineString',
    isFreehand:false,
    label:'标准直线'
  },
  {
    value:'_Polygon',
    key:'_Polygon',
    isFreehand:false,
    label:'标准多边形'
  },
  {
    value:'Rectangle',
    key:'Rectangle',
    isFreehand:false,
    label:'矩形'
  },
  {
    value:'Square',
    key:'Square',
    isFreehand:false,
    label:'正方形'
  },
])

const loadMap = (type: any) => {
  OlMapRef.value?.initMap(type)
}
const handleSelectChange = (val: any) =>{
  if(!isOpenDraw.value) return
  const obj = drawTypeList.value.find(el=>{
    return el.value === val
  })
  const params = {
    type:val,
    freehand:obj.isFreehand
  }
  OlMapRef.value?.drawGeometry(params)
}

const handleSwitchChange = (val:any)=>{
  if(val){
    const obj = drawTypeList.value.find(el=>{
      return el.value === drawType.value
    })
    const params = {
      type:obj.value,
      freehand:obj.isFreehand
    }
    OlMapRef.value?.drawGeometry(params)
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
  <div class="geometry-draw-container">
    <div class="left-box">
      <el-divider> 几何绘制 </el-divider>
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
.geometry-draw-container {
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
