/**
 * @requestUrl 上报地址
 * @routerTracker 是否开启路由上报
 * @domTracker 是否开启dom元素比如点击 双击 右键菜单等用户行为信息上报
 * @jsError 是否开启js错误时信息上报
 *
 */
export interface MonitorOptions {
  appId: string;
  requestUrl: string;
  routerTracker: boolean;
  domTracker: boolean;
  jsError: boolean;
  performanceTracker: boolean;
}

export interface Options extends Partial<MonitorOptions> {
  appId: string;
  requestUrl: string;
}

export enum MonitorConfig {
  version = "1.0.0",
}

export interface performanceOptions {
  FP: number;
  FCP: number;
  TTFB: number;
  TTI: number;
  DCL: number;
  ONLOAD: number;
  DNS: number;
  TCP: number;
  DOM: number;
}
