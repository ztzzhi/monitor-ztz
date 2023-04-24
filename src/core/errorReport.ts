import { reportTracker } from "./reportTracker";
const _window = window as any;

export const jsError = () => {
  const originOnError = window.onerror;
  window.onerror = function (msg, url, row, col, error) {
    if (originOnError) {
      originOnError.call(_window, msg, url, row, col, error);
    }
    reportTracker(
      {
        msg,
        url,
        row,
        col,
        error,
        type: "jsError",
      },
      "Error"
    );
  };
};
export const promiseError = () => {
  window.addEventListener("unhandledrejection", (error) => {
    reportTracker(
      {
        error: error,
        msg: error.reason,
        type: "promiseError",
      },
      "Error"
    );
  });
};

export const resourceError = () => {
  window.addEventListener(
    "error",
    (error) => {
      const target = error.target;
      const isElementTarget =
        target instanceof HTMLScriptElement ||
        target instanceof HTMLLinkElement ||
        target instanceof HTMLImageElement;
      // 只处理除了jsError的错误
      if (!isElementTarget) {
        return;
      }
      reportTracker(
        {
          //@ts-ignore
          target: target.src || target.href,
          msg: target.tagName + "资源加载错误",
          type: "resourceError",
        },
        "Error"
      );
    },
    true
  );
};
