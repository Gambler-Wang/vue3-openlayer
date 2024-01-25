import * as Control from "ol/control"
import {createStringXY} from 'ol/coordinate'

//缩放控件
const zoomSlider = function() {
  return new Control.ZoomSlider();
}
//鼠标位置控件
const mousePosition = (id: string,epsg: string) => new Control.MousePosition({
  coordinateFormat: createStringXY(4),
  className: 'mousePositionValue',
  target: document.getElementById(id) || undefined,
  projection:epsg
});

//比例尺控件
const scaleLine = () => new Control.ScaleLine({
  //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
  units: "metric"
})

//鹰眼控件
const overviewMap = (layers: any) => new Control.OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers,
  collapseLabel: '\u00AB',
  label: '\u00BB',
  collapsed: false
})


//导航控件
const zoomToExtent = (extent: any) => new Control.ZoomToExtent({
  // 投影范围
  extent,
})

export default {
  zoomSlider,
  mousePosition,
  scaleLine,
  overviewMap,
  zoomToExtent
}
