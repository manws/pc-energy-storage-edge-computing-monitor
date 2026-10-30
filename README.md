# 多状态在线估计算法的边缘端硬件装置 · 监控系统

面向储能电池簇的边缘端监控前端。装置在边缘侧实时运行 SOC / SOE / SOP / SOH / 不一致性 / 预警等多状态在线估计算法，本项目是它的上位可视化界面：按 **装置 → 簇 → PACK → 单体** 三级下钻，展示实测值与算法估计值的对比。

- 界面语言：中文
- 目标形态：大屏 / 工控机横屏（1920×1080），固定视口不滚动
- 数据来源：优先真实边缘端 HTTP 接口，接口不可用时可切本地 mock

---

## 1. 技术栈

| 类别 | 选型                                         |
| ---- | -------------------------------------------- |
| 框架 | Vue 3（`<script setup>` + Composition API）  |
| 构建 | Vite 4（`@` → `src`，dev 端口 5174）         |
| 路由 | Vue Router 4（history 模式）                 |
| 状态 | Pinia（已引入，当前页面级状态用 `ref` 管理） |
| 请求 | Axios（统一 baseURL / 超时 / 拦截）          |
| 图表 | ECharts 5                                    |
| 规范 | ESLint + Prettier                            |

## 2. 快速开始

```bash
npm install
npm run dev      # 开发，http://localhost:5174
npm run build    # 构建产物输出 dist/
npm run preview  # 预览构建产物
npm run lint     # eslint + prettier 检查
npm run format   # prettier 格式化
```

根目录 `dist.zip` 是 `dist/` 的打包副本，可直接分发部署。

## 3. 目录结构

```
src/
├── api/           接口层
│   ├── http.js      axios 实例：baseURL、15s 超时、Bearer 注入、错误统一化
│   ├── client.js    mock / 真实接口开关（requestOrMock）
│   └── edge.js      业务接口 + 字段映射（mapPacks/mapDetail/mapEstimate…）
├── mock/
│   └── cluster.js   本地假数据：簇、PACK、单体、曲线、估计值
├── router/
│   └── index.js     路由表 + 页面标题
├── views/          9 个页面
├── components/
│   ├── StageFrame.vue    固定舞台外壳（含软键盘）
│   ├── SelectField.vue   下拉选择
│   ├── SoftKeyboard.vue  触控软键盘
│   └── charts/           GaugeChart / TrendChart / SocBarChart / CellGridChart / useEChart
├── composables/
│   └── useSoftKeyboard.js  输入框 ↔ 软键盘联动
├── charts/echarts.js     ECharts 按需注册
└── styles/
html/               早期静态设计稿原型（8 个页面，非运行代码）
```

## 4. 页面与路由

| 路径                                         | 页面                      | 说明                                                          |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------- |
| `/`                                          | MonitorView               | 边缘整体监控：全部电池簇卡片总览                              |
| `/cluster/:id`                               | ClusterView               | 簇监控：该簇下 8 个 PACK 卡片                                 |
| `/cluster/:clusterId/pack/:packId`           | BmsDetailView             | 查看详情：仪表盘 + 单体极值曲线                               |
| `/cluster/:clusterId/pack/:packId/algorithm` | AlgorithmView             | 算法估算：SOE/SOP/SOC/SOH + 单体 SOC + 曲线 + 不一致性 + 预警 |
| `/settings/soc`                              | SettingsSocView           | SOC 估算设置                                                  |
| `/settings/soe`                              | SettingsSoeView           | SOE 估算设置                                                  |
| `/settings/sop`                              | SettingsSopView           | SOP 估算设置                                                  |
| `/settings/inconsistency`                    | SettingsInconsistencyView | 不一致性估算设置                                              |
| `/settings/alert`                            | SettingsAlertView         | 预警估算设置                                                  |

兼容跳转：`/bms/:id` → `/cluster/:id`，`/bms/:id/algorithm` → `/cluster/:id/pack/1/algorithm`；未匹配路径重定向到首页。

### 页面功能明细

**① 边缘整体监控 `/`**

- 顶栏：装置名「多状态在线估计算法的边缘端硬件装置」+ 在线状态
- 簇卡片网格（当前 5 簇：`#1簇`…`#5簇`），卡片带巨大序号水印 `#N`
- 点击卡片进入该簇

**② 簇监控 `/cluster/:id`**

- 8 个 PACK 卡片：SOC（含进度条）、总电压、总电流、最高/最低单体电压、最高/最低温度
- 每个 PACK 两个入口：查看详情 / 算法估算

**③ 查看详情 `/cluster/:c/pack/:p`**

- 三仪表盘：总电压（V）、总电流（A）、SOC（%，附额定容量 280 Ah）
- 单体极值电压曲线：最高/最低单体随时间变化
- 单体极值温度曲线：最高/最低温度随时间变化

**④ 算法估算 `/cluster/:c/pack/:p/algorithm`**

- 顶部 5 张指标卡（真实值 vs 预测值）：
  - SOE 能量估算（kWh）
  - SOP 放电功率 / 充电功率瞬时峰值（kW）
  - SOC 荷电状态（%）
  - SOH 健康状态（平均，%）
- 52 个单体 SOC 网格，点击单体下方曲线跟随切换
- OCV 预测曲线（Q-V，真实 vs 预测 + 评价指标）
- 容量轨迹预测（循环次数-容量，附 MAPE）
- 不一致性：52 单体电压异常 / 温度异常色块图（13 列 × 4 行）
- 预警估算：故障列表（级别着色）+ 综合预警准确率摘要

**⑤ 系统设置（5 个子页）**
统一结构：顶栏（实时监控 / 系统设置）+ 5 个设置页签 + 面板 + 重置/保存。

- SOC：时间窗（点数）、采样频率、是否参考当前 SOC（开关）
- SOE：时间窗、采样频率、估算参考电压值
- SOP：时间窗、采样频率、估算参考电压值
- 不一致性：时间窗、采样频率、特征分量数（PCA 保留维度）
- 预警：绝缘电阻异常检测（时间窗/采样频率/报警阈值 MΩ）+ 内阻异常检测（时间窗/采样频率/报警阈值）

> 输入框为只读 + 点击唤起 `SoftKeyboard`，适配触摸屏/无键盘工控机。

## 5. 数据来源与接口

### 5.1 开关

`src/api/client.js` 中 `requestOrMock(mockFactory, request)`：

- `VITE_USE_MOCK=true` → 走 `src/mock/cluster.js`
- 否则 → 走真实接口（生产默认走接口）

### 5.2 接口清单（全部 POST，body `{}`）

| 接口                                     | 用途      | 关键返回字段                                                                                                                                                                                 |
| ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/v1/Data/packList/{clusterId}`          | PACK 列表 | `packDataList[]`: `packId`、`SOC`、`Vol`、`Cur`、`CellVolMax/Min`、`TempMax/Min`                                                                                                             |
| `/v1/Data/realData/{clusterId}/{packId}` | 实时数据  | `realData[0]`: `Vol`、`Cur`、`SOC`、`TimeList`、`CellVolMaxList/MinList`、`TempMaxList/MinList`                                                                                              |
| `/v1/Data/algData/{clusterId}/{packId}`  | 算法估算  | `algData`: `SOEReal/SOEPre`、`SOPDiscargeReal`、`SOPDischargePre`、`SOPChargeReal/Pre`、`SOCReal/Pre`、`SOHReal/SOHPre`、`SOCList`、`IncCellVolList`、`IncTempList`、`AlarmList`、`strAlarm` |
| `/v1/Data/vqData/{c}/{p}/{cellId}`       | OCV 曲线  | `vqData`: `Q_Real_List`、`V_Real_List`、`Q_Pre_List`、`V_Pre_List`、`mape`                                                                                                                   |
| `/v1/Data/capData/{c}/{p}/{cellId}`      | 容量轨迹  | `capData`: `True_List`、`Pre_List`、`mape`                                                                                                                                                   |

鉴权：请求头 `Authorization: Bearer <token>`，token 取自 `sessionStorage.ess_token`。

### 5.3 指标含义

| 指标     | 含义                                                          | 单位 |
| -------- | ------------------------------------------------------------- | ---- |
| SOC      | 荷电状态，剩余容量占比                                        | %    |
| SOE      | 荷电能量，剩余可用电量（= 额定能量 × SOC × SOH 衰减修正）     | kWh  |
| SOP      | 功率状态，瞬时可充/可放峰值功率                               | kW   |
| SOH      | 健康状态，当前最大可用容量 / 额定容量（本项目取 52 单体均值） | %    |
| 不一致性 | 单体电压/温度偏离群体的异常分布                               | —    |
| 预警     | 绝缘、内阻等故障的提前告警及准确率统计                        | —    |

### 5.4 展示精度

- SOE / SOP / SOC：2 位小数
- SOH：**最多 4 位小数并去除尾零**（`92.1086` 原样显示，接口给 `97.86` 显示 `97.86` 不补 `00`），实现见 `AlgorithmView.vue` 的 `decimalText()`

### 5.5 Mock 关键常量（`src/mock/cluster.js`）

```js
PACK_COUNT = 8 // 每簇 PACK 数
CELL_COUNT = 52 // 每 PACK 单体数
SOE_REAL = 100.74 // SOE 真实值 kWh
SOE_PRE = 98.87 // SOE 估计值 kWh
SOH_REAL_AVG = 92.1086 // SOH 真实平均 %
SOH_PRE_AVG = 92.0602 // SOH 预估平均 %
```

> 注意：真实接口模式下以上常量不生效，页面显示的是 `algData` 下发的 `SOEReal/SOEPre/SOHReal/SOHPre`。

## 6. 环境变量

复制 `.env.example` 为 `.env.development` / `.env.production`：

| 变量                | 说明                       | 默认                        |
| ------------------- | -------------------------- | --------------------------- |
| `VITE_API_BASE_URL` | axios 前缀                 | `/api`                      |
| `VITE_API_PROXY`    | dev 代理目标（留空不启用） | `http://8.140.182.55:26116` |
| `VITE_USE_MOCK`     | 是否走本地 mock            | `false`                     |

## 7. 视觉规范

| 用途           | 色值                  |
| -------------- | --------------------- |
| 页面底色       | `#0f1d38`             |
| 顶栏 / 面板    | `#18294d`             |
| 卡片 / 抬升面  | `#243b66`             |
| 分隔线 / 描边  | `#2a3f68`             |
| 品牌青（强调） | `#29b6f6`             |
| 正常绿         | `#4caf50`             |
| 警示黄 / 橙    | `#f2c94c` / `#f59e0b` |
| 严重红         | `#ff5252`             |
| SOH 紫         | `#a78bfa`             |

字体：正文 `Noto Sans SC / PingFang SC`，数字 `JetBrains Mono`。圆角：卡片 12px、按钮 8px。

## 8. 近期变更

- 装置名统一改为「多状态在线估计算法的边缘端硬件装置」（顶栏、`document.title`、`index.html`、README）
- 簇序号格式改为 `#N簇`（首页卡片 + 水印、簇详情页、算法页、页面标题、告警文案）
- SOE / SOH 改为装置级标定值（100.74 / 98.87 kWh，92.1086% / 92.0602%），SOH 标签改为「真实平均值 / 预估平均值」
- SOH 数值展示改为最多 4 位小数并去尾零，修复接口返回两位小数时补零成 `97.8600` 的问题
