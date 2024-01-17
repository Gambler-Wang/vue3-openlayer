<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import OlMap from "@/components/OlMap/index.vue"

</script>

<template>
  <div class="render-point-container">
    <div class="left-box">
      <el-divider>
        第三方地图
      </el-divider>
      <!-- <p>天地图和百度地图，高德地图，经纬度坐标需要相互转换;如果是在EPSG:4236上渲染的，还需要再通过openlayer提供方法转一次，一般在实际开发中，经纬度坐标系统一</p> -->
      <p>可以切换地图底图</p>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('tianditu')">天地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('gaode')">高德地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('baidu')">百度地图</el-button>
      </div>
      <div class="line">
        <el-button size="large" type="primary" @click="loadMap('custom')">自定义</el-button>
      </div>
    </div>
    <div class="right-box">
      <OlMap ref="OlMapRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
