export interface PointDataInterface {
  id?: string,
  lng: number,
  lat: number,
  [key: string]: any;
}
export  interface LabelStyleInterface {
  textAlign?:any,
  textBaseline?:any,
  font?:any,
  fontColor?:any,
  strokeColor?:any,
  strokeWidth?:any,
  [key: string]: any;
}

export  interface BaseStyleInterface {
  // 填充色
  fillColor?:string,
  // 边线颜色
  strokeColor?:string,
  // 边线宽度
  strokeWidth?:number,
  // 圆样式半径
  imageCircleRadius?:number
  // 圆样式填充样式
  imageCircleFillColor?:string
  // 其他
  [key: string]: any;
}

export type CircleFeaturePropertiesType = {
  radius: number;
  [key: string]: any;
};
