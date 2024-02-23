import TileLayer from "ol/layer/Tile"
import * as Source from 'ol/source'
import TileGrid from 'ol/tilegrid/tileGrid'
import OSM from "ol/source/OSM";

// 地图类型常量
const MapType = {
  GD:'gaode',
  BD:'baidu',
  TDT:'tianditu',
  CUSTOM:'custom'
}

// 地图类型对应底图坐标系
export const MapTypeProject = {
  [MapType.GD]:'EPSG:3857',
  [MapType.BD]:'EPSG:3857',
  [MapType.TDT]:'EPSG:3857',
  [MapType.CUSTOM]:'EPSG:4326',
}

/**
 * @description: 判断是否为EPSG:3857
 * @param {*} type 地图类型 'gaode','baidu','tianditu','custom'
 * @return {*} boolean
 */
export const isMapEPSG3857 = (type = 'tianditu')=>{
  if(MapTypeProject[type]==='EPSG:3857'){
    return true
  }else{
    return false
  }
}

/**
 * @description: 获取地图的layer层
 * @param {*} type - string - 地图类型 'gaode','baidu','tianditu','custom'
 * @param {*} customObj - obj - 自定义数据
 * @return {*}
 */
export const getTileLayer = (type='tianditu',customObj=null)=>{
  let tileLayerArr:any[] = [];
  let tileLayer;
  switch (type) {
    case MapType.GD:
      tileLayer = new TileLayer({
        className:'underlay-map-container',
        source: new Source.XYZ({
          crossOrigin: 'Anonymous', //  "Anonymous"（即允许对未经过验证的图像进行跨源下载）
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
          wrapX: false
        })
      })
      tileLayerArr = [tileLayer];
      break;
    case MapType.BD:
      const baiduSource = getBaiduSource();
      tileLayer = new TileLayer({
        className:'underlay-map-container',
        source: baiduSource,
      })
      tileLayerArr = [tileLayer];
      break;
    case MapType.TDT:
      let tileLayerVec = new TileLayer({
        className:'underlay-map-container',
        source: new Source.XYZ({
          crossOrigin: 'Anonymous',
          // bc15a8dd532a9027225c6e572c73433c
          url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=50273c8649e44d54bad87d09042c1834',
          wrapX: false
        })
      })
      tileLayerVec.set('name','天地图矢量图层')
      let tileLayerCva = new TileLayer({
        className:'underlay-map-container2',
        source: new Source.XYZ({
          crossOrigin: 'Anonymous',
          // bc15a8dd532a9027225c6e572c73433c
          url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=50273c8649e44d54bad87d09042c1834',
          wrapX: false
        })
      })
      tileLayerCva.set('name','天地图矢量注记图层')
      tileLayerArr = [tileLayerVec,tileLayerCva];
      break;
    case MapType.CUSTOM:
      tileLayer = new TileLayer({
        className:'underlay-map-container',
        source: new Source.XYZ({
          crossOrigin: 'Anonymous', //  "Anonymous"（即允许对未经过验证的图像进行跨源下载）
          url: 'http://10.168.4.101:10002/spatio/wuhan/{z}/{x}/{y}.jpg',
          wrapX: false
        })
      })
      tileLayerArr = [tileLayer];
      break;
    default:
      tileLayer = new TileLayer({
        className:'underlay-map-container',
        source: new OSM()
      })
      tileLayerArr = [tileLayer];

  }
  return tileLayerArr;
}
/**
 * @description: 获取百度XYZ数据源
 * @return {*} 百度XYZ数据源
 */
const getBaiduSource = ()=>{
  const resolutions = [];
  for (var i = 0; i < 20; i++) {
    resolutions[i] = Math.pow(2, 18 - i);
  }
  const tilegrid = new TileGrid({
    origin: [0, 0],
    resolutions: resolutions,
    tileSize: [256, 256],
  });
  //拼接百度地图出图地址
  const baiduSource = new Source.TileImage({
    //设置坐标参考系
    projection:'EPSG:3857',
    //设置分辨率
    tileGrid: tilegrid,
    //出图基地址
    tileUrlFunction: (tileCoord, pixelRatio, proj) =>{
      if (!tileCoord) {
          return '';
      }
      let z:any = tileCoord[0];
      let x:any = tileCoord[1];
      let y:any = -tileCoord[2];

      if (x < 0) {
          x = "M" + (-x);
      }
      if (y < 0) {
          y = "M" + (-y);
      }
      return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
    }
  });
  return baiduSource
}

// 其它图层
export const getOtherLayer = ()=>{
  let tileLayerImg = new TileLayer({
    className:'underlay-map-container-tdtyxtc',
    source: new Source.XYZ({
      crossOrigin: 'Anonymous',
      // bc15a8dd532a9027225c6e572c73433c
      url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=50273c8649e44d54bad87d09042c1834',
      wrapX: false
    })
  })
  tileLayerImg.set('name','天地图影像图层')
  let tileLayerCia = new TileLayer({
    className:'underlay-map-container-tdtyxzjtc',
    source: new Source.XYZ({
      crossOrigin: 'Anonymous',
      // bc15a8dd532a9027225c6e572c73433c
      url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=50273c8649e44d54bad87d09042c1834',
      wrapX: false
    })
  })
  tileLayerCia.set('name','天地图影像注记图层')
  return [tileLayerImg,tileLayerCia];
}
