/**
 * history中pushState和replaceState无法通过window.addEventListener监听到 所以重写两个方法
 * @param type
 * @returns
 */
const createRouterEvent = (type) => {
    const orgin = history[type];
    return function () {
        const res = orgin.apply(this, arguments);
        const event = new Event(type);
        window.dispatchEvent(event);
        return res;
    };
};

const _window$4 = window;
const reportTracker = (data, type) => {
    const params = Object.assign(Object.assign({}, data), { ua: _window$4.navigator.userAgent, type, addId: _window$4.Monitor._addId_, userId: _window$4.Monitor._userId_ || "" });
    if (navigator.sendBeacon) {
        // 支持sendBeacon的浏览器
        navigator.sendBeacon(_window$4.Monitor._requestUrl_, new Blob([JSON.stringify(params)]));
    }
    else {
        // 不支持sendBeacon的浏览器
        let oImage = new Image();
        oImage.src = `${_window$4.Monitor._requestUrl_}?logs=${JSON.stringify(params)}`;
    }
    console.log(params, "reportTracker params");
};

/**
 * @userId 用于统计UV
 */
const _window$3 = window;
const setUserId = (userId) => {
    // 上报UV数据
    _window$3.Monitor._userId_ = userId;
};

const _window$2 = window;
const jsError = () => {
    const originOnError = window.onerror;
    window.onerror = function (msg, url, row, col, error) {
        if (originOnError) {
            originOnError.call(_window$2, msg, url, row, col, error);
        }
        reportTracker({
            msg,
            url,
            row,
            col,
            error,
            type: "jsError",
        }, "Error");
    };
};
const promiseError = () => {
    window.addEventListener("unhandledrejection", (error) => {
        reportTracker({
            error: error,
            msg: error.reason,
            type: "promiseError",
        }, "Error");
    });
};
const resourceError = () => {
    window.addEventListener("error", (error) => {
        const target = error.target;
        const isElementTarget = target instanceof HTMLScriptElement ||
            target instanceof HTMLLinkElement ||
            target instanceof HTMLImageElement;
        // 只处理除了jsError的错误
        if (!isElementTarget) {
            return;
        }
        reportTracker({
            //@ts-ignore
            target: target.src || target.href,
            msg: target.tagName + "资源加载错误",
            type: "resourceError",
        }, "Error");
    }, true);
};

const _window$1 = window;
const listenDom = () => {
    const mouseEventArr = ["click", "dbclick", "contextmenu"];
    mouseEventArr.forEach((event) => {
        _window$1.addEventListener(event, (e) => {
            const target = e.target;
            const trackerKey = target.getAttribute("tracker-key");
            // 上报PV数据
            if (trackerKey) {
                reportTracker({
                    event,
                    trackerKey,
                    target,
                }, "Mouse Event");
            }
        });
    });
};

class ztzCollection {
    constructor() {
        this.perColection = {
            FP: 0,
            FCP: 0,
            TTFB: 0,
            TTI: 0,
            DCL: 0,
            ONLOAD: 0,
            DNS: 0,
            TCP: 0,
            DOM: 0,
        };
        this.onLoad();
    }
    onLoad() {
        this.getPerformance();
    }
    getPerformance() {
        let isFirstScreen = window.sessionStorage.getItem("ztz_firstScreen") == null;
        if (!isFirstScreen)
            return;
        if (window.performance && window.performance.getEntries) {
            var perfEntries = window.performance.getEntries();
            let t = perfEntries[0];
            this.perColection.DNS = Number((t.domainLookupEnd - t.domainLookupStart).toFixed(2));
            this.perColection.TCP = Number((t.connectEnd - t.connectStart).toFixed(2));
            this.perColection.TTFB = Number((t.responseStart - t.requestStart).toFixed(2));
            this.perColection.DOM = Number((t.domInteractive - t.responseEnd).toFixed(2));
            this.perColection.TTI = Number((t.domInteractive - t.fetchStart).toFixed(2));
            this.perColection.DCL = Number((t.domContentLoadedEventEnd - t.fetchStart).toFixed(2));
            this.perColection.ONLOAD = Number(t.loadEventStart.toFixed(2));
            for (var key in perfEntries) {
                if (perfEntries[key].name &&
                    perfEntries[key].name === "first-contentful-paint" &&
                    perfEntries[key].startTime) {
                    var fcp = Number(perfEntries[key].startTime.toFixed(2));
                    this.perColection.FCP = fcp;
                }
                if (perfEntries[key].name &&
                    perfEntries[key].name === "first-paint" &&
                    perfEntries[key].startTime) {
                    var fp = Number(perfEntries[key].startTime.toFixed(2));
                    this.perColection.FP = fp;
                }
            }
            window.sessionStorage.setItem("ztz_firstScreen", JSON.stringify(this.perColection));
            reportTracker({
                data: this.perColection,
            }, "Performance");
        }
    }
}

const _window = window;
class Monitor {
    constructor(options) {
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
            _window.addEventListener(item, (event) => {
                let currentPage = _window.location.href;
                if (currentPage === this.currentPage)
                    return;
                this.currentPage = currentPage;
                let stayTime = this.calcStayTime() / 1000;
                if (stayTime > 0.2) {
                    this.pageStartTime = this.getTime();
                    if (_window.Monitor._userId_) {
                        // 上报PV数据
                        reportTracker({
                            stayTime,
                            currentPage,
                            userId: _window.Monitor._userId_,
                        }, "UV");
                    }
                    else {
                        // 上报PV数据
                        reportTracker({
                            stayTime,
                            currentPage,
                        }, "PV");
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

export { Monitor as default, reportTracker, setUserId };
