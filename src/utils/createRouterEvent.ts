/**
 * history中pushState和replaceState无法通过window.addEventListener监听到 所以重写两个方法
 * @param type 
 * @returns 
 */
export const createRouterEvent = <T extends keyof History>(type: T) => {
  const orgin = history[type];
  return function (this: any) {
    const res = orgin.apply(this, arguments);
    const event = new Event(type);
    window.dispatchEvent(event);
    return res;
  };
};
