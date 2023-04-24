/**
 * @requestUrl 上报地址
 * @routerTracker 是否开启路由上报
 * @domTracker 是否开启dom元素比如点击 双击 右键菜单等用户行为信息上报
 * @jsError 是否开启js错误时信息上报
 *
 */
interface MonitorOptions {
    appId: string;
    requestUrl: string;
    routerTracker: boolean;
    domTracker: boolean;
    jsError: boolean;
    performanceTracker: boolean;
}
interface Options extends Partial<MonitorOptions> {
    appId: string;
    requestUrl: string;
}

/**
 * @data 上传的数据
 * @type 上传的数据类型 用户点击 / user view / page view / 错误捕获 / 性能指标
 */
type IType = "Mouse Event" | "UV" | "PV" | "Error" | "Performance";
declare const reportTracker: <T>(data: T, type?: IType) => void;

declare const setUserId: (userId: string | number) => void;

declare class Monitor {
    options: Options;
    pageStartTime: number;
    currentPage: string;
    constructor(options: Options);
    addEventListener(): void;
    installRouteTracker(): void;
    installDomTracker(): void;
    installErrorTracker(): void;
    installPerformanceTracker(): void;
    /**
     * 1.语法错误 比如少了一个单引号 开发编译阶段即可发现无需处理 【 x 】
     * 2.同步错误 比如使用的变量未定义 使用try catch即可捕获 开发编译阶段即可发现无需处理  【 x 】
     * 3.异步错误 无法被try catch捕获 使用 【 window.onerror 】来捕获处理 【 ✓ 】
     * 4.promise错误 对于没有使用try catch的全局监听 【 unhandledrejection 】进行兜底 【 ✓ 】
     * 5.资源加载错误 全局监听 【 error 】进行兜底 【 ✓ 】
     */
    errorTrackerReport(): void;
    getStayTime(): void;
    getTime(): number;
    calcStayTime(): number;
}

export { Monitor as default, reportTracker, setUserId };
