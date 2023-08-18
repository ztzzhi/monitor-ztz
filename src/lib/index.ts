import { Options } from "../types/index";
import { createRouterEvent } from "../utils/createRouterEvent";
import { reportTracker } from "./reportTracker";
import { setUserId } from "./setUserId";
import { jsError, promiseError, resourceError } from "./errorReport";
import { listenDom } from "./domReport";
import ztzCollection from "./performance";
const _window = window as any;
class Monitor {
  public options: Options;
  public pageStartTime: number;
  public currentPage: string;
  constructor(options: Options) {
    this.options = options;
    _window.Monitor = {
      _requestUrl_: this.options.requestUrl,
      _addId_: this.options.appId,
    };
    this.pageStartTime = this.getTime();
    this.currentPage = _window.location.href;
    this.addEventListener();
    if (this.options.routerTracker) {
      this.installRouteTracker();
    }
    if (this.options.domTracker) {
      this.installDomTracker();
    }
    if (this.options.jsError) {
      this.installErrorTracker();
    }
    if (this.options.performanceTracker) {
      this.installPerformanceTracker();
    }
  }
  // 重写两个方法 添加全局监听事件
  addEventListener() {
    _window.history["pushState"] = createRouterEvent("pushState");
    _window.history["replaceState"] = createRouterEvent("replaceState");
  }
  // 监听路由变化统计pv
  installRouteTracker() {
    this.getStayTime();
  }
  // 监听鼠标事件操作
  installDomTracker() {
    listenDom();
  }
  installErrorTracker() {
    this.errorTrackerReport();
  }
  installPerformanceTracker() {
    new ztzCollection();
  }
  /**
   * 1.语法错误 比如少了一个单引号 开发编译阶段即可发现无需处理 【 x 】
   * 2.同步错误 比如使用的变量未定义 使用try catch即可捕获 开发编译阶段即可发现无需处理  【 x 】
   * 3.异步错误 无法被try catch捕获 使用 【 window.onerror 】来捕获处理 【 ✓ 】
   * 4.promise错误 对于没有使用try catch的全局监听 【 unhandledrejection 】进行兜底 【 ✓ 】
   * 5.资源加载错误 全局监听 【 error 】进行兜底 【 ✓ 】
   */
  errorTrackerReport() {
    jsError();
    promiseError();
    resourceError();
  }

  // 统计页面停留时长
  getStayTime() {
    ["hashchange", "pushState", "replaceState", "popstate"].forEach((item) => {
      _window.addEventListener(item, (event: Event) => {
        let currentPage = _window.location.href;
        let prePage = this.currentPage;
        if (currentPage === this.currentPage) return;
        this.currentPage = currentPage;
        let stayTime = this.calcStayTime() / 1000;
        if (stayTime > 0.2) {
          this.pageStartTime = this.getTime();
          if (_window.Monitor._userId_) {
            // 上报PV数据
            reportTracker(
              {
                stayTime,
                currentPage,
                prePage,
                userId: _window.Monitor._userId_,
              },
              "UV"
            );
          } else {
            // 上报PV数据
            reportTracker(
              {
                stayTime,
                currentPage,
                prePage
              },
              "PV"
            );
          }
        }
      });
    });
  }
  getTime() {
    return new Date().getTime();
  }
  calcStayTime() {
    return this.getTime() - this.pageStartTime;
  }
}

_window.Monitor = Monitor;
export default Monitor;
export { reportTracker, setUserId };
