import { getVectorContext } from 'ol/render'
import { linear } from 'ol/easing'
import * as OlStyle from 'ol/style'
import RenderEvent from 'ol/render/Event'
let nowDate = Date.now()


const warningSpeed = 800 // 预警闪烁速度
const trackMoveSpeed = 0.1 // 轨迹线移动速度
let trackDistance = 0 // 轨迹线距离
let nextMoveTime:number = 0 // 下次移动的时间
/**
 * @description: 点动画
 * @param {RenderEvent} event
 * @param {any} point
 * @param {any} mapObj
 * @return {*}
 */
export const pointAnimation = (event: RenderEvent,point:any,mapObj:any)=>{
  const frameState = event.frameState
  if(!frameState) return
  const elapsed = frameState.time - nowDate
  let radius = 18
  let opcatity = 0.6

  if (elapsed > warningSpeed) {
    radius = 18
    opcatity = 0.6
    nowDate = Date.now()
  } else {
    radius = linear(elapsed / warningSpeed) * 30
    opcatity = opcatity * linear(1 - elapsed / warningSpeed)
  }

  const geom = point.clone()
  const geom2 = point.clone()
  const geom3 = point.clone()
  let vectorContext = getVectorContext(event)
  vectorContext.setStyle(getPointWarningStyle(radius, opcatity * 2.5))
  vectorContext.drawGeometry(geom)

  vectorContext.setStyle(getPointWarningStyle(radius * 1.5, opcatity * 1.5))
  vectorContext.drawGeometry(geom2)

  vectorContext.setStyle(getPointWarningStyle(radius * 2.5, opcatity))
  vectorContext.drawGeometry(geom3)
  mapObj.render()
}
/**
 * @description: 面动画
 * @param {RenderEvent} event
 * @param {any} polygonGeom
 * @param {any} mapObj
 * @return {*}
 */
export const areaAinimation = (event: RenderEvent,polygonGeom:any,mapObj:any)=>{
  const vectorContext = getVectorContext(event)
  const frameState = event.frameState
  if(!frameState) return
  const elapsed = frameState.time - nowDate
  let scale = 1
  let opcatity = 1
  let time = elapsed
  if (elapsed > warningSpeed) {
    scale = 1
    opcatity = 1
    nowDate = Date.now()
  } else {
    opcatity = opcatity * linear(1 - elapsed / warningSpeed)
    if (time < warningSpeed) {
      time = warningSpeed * 1
    }
    scale = linear(time / warningSpeed) * 1
  }

  const geom = polygonGeom.clone()
  geom.setProperties({
    type:'warningAreaClone'
  })
  geom.scale(scale, scale)

  vectorContext.setStyle(getAreaWarningStyle(opcatity))
  vectorContext.drawGeometry(geom)

  mapObj.render()
}
/**
 * @description: 轨迹动画
 * @param {RenderEvent} event
 * @param {any} trackLine
 * @param {any} movePoint
 * @param {any} mapObj
 * @return {*}
 */
export const trackMoveAnimation = (event: RenderEvent,trackLine:any,movePoint:any,mapObj:any) =>{
  let time: number = event && event.frameState && event.frameState.time || 0;
  trackDistance =
    (trackDistance + (trackMoveSpeed * (time - nextMoveTime)) / 1000) % 1; //%2表示：起止止起；%1表示：起止起止
  nextMoveTime = time as number; // Type assertion to ensure time is of type number
  const currentCoordinate = trackLine.getGeometry().getCoordinateAt(
    trackDistance > 1 ? 2 - trackDistance : trackDistance
  );
  movePoint.getGeometry().setCoordinates(currentCoordinate);
  const vectorContext = getVectorContext(event);
  vectorContext.setStyle(getTrackPointStyle(10,'red'))
  vectorContext.drawGeometry(movePoint.getGeometry());
  mapObj.render()
}
/**
 * @description: 重置轨迹动画开始时间
 * @param {number} startTime
 * @return {*}
 */
export const initNextMoveTime = (startTime:number)=>{
  nextMoveTime=startTime
}

/**
 * @description: 报警点样式
 * @param {number} startTime
 * @return {*}
 */
function getPointWarningStyle(radius:any, opcatity:any) {
  return new OlStyle.Style({
    image: new OlStyle.Circle({
      radius: radius,
      fill: new OlStyle.Fill({
        color: `rgba(255,0,0,${opcatity})`,
      }),
    }),
  })
}

/**
 * @description: 报警面样式
 * @param {number} startTime
 * @return {*}
 */
function getAreaWarningStyle(opcatity: number) {
  return new OlStyle.Style({
    stroke: new OlStyle.Stroke({
      color: `rgba(255,0,0,${opcatity})`,
      // lineDash: [7, 10],
      width: 4,
    }),
    fill: new OlStyle.Fill({
      color: 'rgba(250,0,0,0.3)',
    }),
  })
}


/**
 * @description: 轨迹点样式样式
 * @param {number} startTime
 * @return {*}
 */
function getTrackPointStyle(radius: number,color: string) {
  return new OlStyle.Style({
    image: new OlStyle.Circle({
      radius: radius,
      fill: new OlStyle.Fill({
        color,
      }),
    }),
  })
}
