<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"
import OlMap from "@/components/OlMap/index.vue"
import { reactive, ref, watch,onMounted } from "vue"
defineOptions({
  // 命名当前组件
  name: "Dashboard"
})
const userStore = useUserStore()
const isAdmin = userStore.roles.includes("admin")
const OlMapRef = ref<InstanceType<typeof OlMap> | null>(null)
const loadMap = (type:any)=>{
  OlMapRef.value?.initMap(type)
}
onMounted(()=>{
  loadMap('tianditu')
})
</script>

<template>
  <div class="home-container">
    <OlMap mapId="map-dashboard" ref="OlMapRef" />
  <!-- <component :is="isAdmin ? Admin : Editor" /> -->
  </div>
</template>

<style lang="scss" scoped>
  .home-container{
    padding: 10px;
    padding-bottom: 0;
    box-sizing: border-box;
    display: flex;
  }
</style>
