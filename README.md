### 🤡Features
✔️ PV/UV 统计
✔️ 自定义埋点上报
✔️ 错误捕获
✔️ 性能指标上报

### 😎安装

方式一：推荐✨✨✨✨✨
```shell
npm i monitor-ztz
```

方式二：
npm run build后生成dist包，直接在项目中引入dist包下的index.js即可

### 🥳使用

```js
import Monitor, { reportTracker, setUserId } from "monitor-ztz"

new Monitor({
  appId: "你的项目id，用于区分项目",
  requestUrl: "上传地址",
  routerTracker: true, //是否开启pv/uv统计，注意：没有通过setUserId手动设置过只会统计pv
  domTracker: true, //是否开启鼠标事件比如click dbclick contextmenu的打点上报
  jsError: true, //是否开启错误捕获上报
  performanceTracker: true //是否开启性能指标上报
})
```

### 🧐reportTracker用于手动上报

reportTracker(data,type) data上传的数据 type上传的类型 

类型分为 "Mouse Event" | "UV" | "PV" | "Error" | "Performance"

### 😏点击事件上报方式

① 组件库支持属性透传时可使用 

```js
<Button tracker-key="tracker001">点击我自动上传埋点</Button>
```

目前已知不支持属性透传的组件库 vant

② 组件库不支持属性透传时可使用 reportTracker手动上报 

```js
  <Button onClick={selfTracker}>点击我手动上传埋点</Button>

  const selfTracker = () => {
    reportTracker(
      {
        data: "tracker002",
        event: "click"
      },
      "Mouse Event"
    )
  }
```

### 😍setUserId使用时机

① 如果用户未注册，可以在注册成功时设置

② 如果用户已注册，可以在登录时设置