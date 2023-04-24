/**
FP: "FP", 首次绘制时间 白屏时间
FCP: "FCP", 首次内容绘制时间 首屏时间
TTFB: "TTFB", 收到第一字节耗时
TTI: "TTI", html加载耗时
DCL: "DCL", domContentLoaded
ONLOAD: "ONLOAD", onload
DNS: "DNS", DNS查询耗时
TCP: "TCP", TCP建立连接耗时
DOM: "DOM" DOM解析耗时
*/
import { performanceOptions } from "../types/index";
import { reportTracker } from "./reportTracker";
class ztzCollection {
  public perColection: performanceOptions;
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
    window.onload = () => {
      this.getPerformance();
    };
  }

  getPerformance() {
    let isFirstScreen =
      window.sessionStorage.getItem("ztz_firstScreen") == null;
    if (!isFirstScreen) return;
    if (window.performance && window.performance.getEntries) {
      var perfEntries = window.performance.getEntries();
      let t: any = perfEntries[0];
      this.perColection.DNS = Number(
        (t.domainLookupEnd - t.domainLookupStart).toFixed(2)
      );
      this.perColection.TCP = Number(
        (t.connectEnd - t.connectStart).toFixed(2)
      );
      this.perColection.TTFB = Number(
        (t.responseStart - t.requestStart).toFixed(2)
      );
      this.perColection.DOM = Number(
        (t.domInteractive - t.responseEnd).toFixed(2)
      );
      this.perColection.TTI = Number(
        (t.domInteractive - t.fetchStart).toFixed(2)
      );
      this.perColection.DCL = Number(
        (t.domContentLoadedEventEnd - t.fetchStart).toFixed(2)
      );
      this.perColection.ONLOAD = Number(t.loadEventStart.toFixed(2));
      for (var key in perfEntries) {
        if (
          perfEntries[key].name &&
          perfEntries[key].name === "first-contentful-paint" &&
          perfEntries[key].startTime
        ) {
          var fcp = Number(perfEntries[key].startTime.toFixed(2));
          this.perColection.FCP = fcp;
        }
        if (
          perfEntries[key].name &&
          perfEntries[key].name === "first-paint" &&
          perfEntries[key].startTime
        ) {
          var fp = Number(perfEntries[key].startTime.toFixed(2));
          this.perColection.FP = fp;
        }
      }
      window.sessionStorage.setItem(
        "ztz_firstScreen",
        JSON.stringify(this.perColection)
      );
      reportTracker(
        {
          data: this.perColection,
        },
        "Performance"
      );
    }
  }
}

export default ztzCollection;
