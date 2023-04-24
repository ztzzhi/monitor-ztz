/**
 * @data 上传的数据
 * @type 上传的数据类型 用户点击 / user view / page view / 错误捕获 / 性能指标
 */
export type IType = "Mouse Event" | "UV" | "PV" | "Error" | "Performance";
const _window = window as any;
export const reportTracker = <T>(data: T, type?: IType) => {
  const params = {
    ...data,
    ua: _window.navigator.userAgent,
    type,
    addId: _window.Monitor._addId_,
    userId: _window.Monitor._userId_ || "",
  };
  if (navigator.sendBeacon) {
    // 支持sendBeacon的浏览器
    navigator.sendBeacon(
      _window.Monitor._requestUrl_,
      new Blob([JSON.stringify(params)])
    );
  } else {
    // 不支持sendBeacon的浏览器
    let oImage = new Image();
    oImage.src = `${_window.Monitor._requestUrl_}?logs=${JSON.stringify(
      params
    )}`;
  }
  console.log(params, "reportTracker params");
};
