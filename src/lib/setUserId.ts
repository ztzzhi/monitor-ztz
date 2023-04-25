/**
 * @userId 用于统计UV
 */
const _window = window as any;
export const setUserId = (userId: string | number) => {
  // 上报UV数据
  _window.Monitor._userId_ = userId;
};
