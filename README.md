# 面试排期看板

求职者的本地化面试管理工具，用看板、时间线、详情复盘和统计图表统一管理投递进展。

## 功能列表

- 五列面试看板：投递中、一面、二面、三面、Offer，支持拖拽移动职位阶段。
- 时间线回顾：按日期倒序查看所有面试事件、面试方式、反馈和关联职位。
- 职位详情：编辑职位信息，维护面试轮次、富文本笔记、反馈和复盘问题。
- 数据统计：投递漏斗、面试时间热力图、公司和行业分布图。
- 公司管理：新增、编辑、删除公司，并展开查看关联职位。
- 本地持久化：所有数据保存到浏览器 localStorage，支持 JSON 备份导入导出。
- 主题切换：亮色/暗色主题偏好自动保存。

## 快速启动

```bash
cd frontend
npm install
npm run dev
```

开发服务器端口为 `28311`，访问 `http://localhost:28311`。

构建与预览：

```bash
npm run build
npm run preview
```

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| UI 组件 | Naive UI |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 拖拽 | vuedraggable |
| 图表 | ECharts |
| 日期处理 | dayjs |
| 数据存储 | localStorage |

## 目录结构

```text
frontend/src/
├── api/         # 本地数据抽象
├── stores/      # Company / Position / Interview / Reflection / Theme
├── types/       # 核心模型与枚举
├── components/
│   ├── common/  # 通用业务组件
│   ├── board/   # 看板专用组件
│   └── charts/  # 图表组件
├── hooks/       # 本地存储、拖拽、主题、漏斗数据 hooks
├── pages/       # 看板、时间线、详情、统计、公司管理
├── router/      # 路由配置
├── styles/      # 主题变量和全局样式
└── utils/       # 存储、格式化、图表计算工具
```

## License

MIT
