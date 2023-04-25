import { reportTracker } from "./reportTracker";
const _window = window as any;

export const listenDom = () => {
  const mouseEventArr = ["click", "dbclick", "contextmenu"] as string[];
  mouseEventArr.forEach((event) => {
    _window.addEventListener(event, (e: Event) => {
      const target = e.target as HTMLElement;
      const trackerKey =
        target.getAttribute("tracker-key") ||
        target.offsetParent?.getAttribute("tracker-key");
      // 上报PV数据
      if (trackerKey) {
        reportTracker(
          {
            event,
            trackerKey,
            target,
          },
          "Mouse Event"
        );
      }
    });
  });
};
