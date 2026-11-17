# ci-cd-demo：React + Node CI/CD 示例工程

## 项目结构

```
ci-cd-demo/
├── .github/workflows/
│   ├── ci.yml          # 双 job CI + push 到 main 后发布前端到 Pages
│   ├── static.yml      # 仅前端静态发布（对照用）
│   └── deploy-ecs.yml  # 实验四：构建前后端并部署阿里云 ECS
└── apps/
    ├── frontend/       # React 18 + Vite + TypeScript + Vitest
    └── backend/        # Node 22 + Express + TypeScript + Vitest/supertest
```

## 前端（apps/frontend）

| 命令 | 说明 |
|---|---|
| `npm ci` | 按 package-lock.json 安装依赖 |
| `npm run dev` | 开发服务器 http://localhost:5173，/api 代理到 3000 |
| `npm run lint` | ESLint 检查 |
| `npm run typecheck` | tsc --noEmit 类型检查 |
| `npm test` | Vitest + Testing Library（DOM 测试） |
| `npm run build` | 产出 dist/（Pages / ECS 部署用） |

## 后端（apps/backend）

| 命令 | 说明 |
|---|---|
| `npm ci` | 按 lock 文件安装依赖 |
| `npm run lint` | ESLint 检查 |
| `npm test` | Vitest + supertest 接口测试 |
| `npm run build` | tsc 编译到 dist/server.js |
| `npm start` | 运行编译产物，监听 127.0.0.1:3000 |

## 接口

- `GET /api/hello` → `{"message":"Hello from ECS backend"}`
- `GET /health` → `ok`（HTTP 200，供部署健康检查）
- `GET /api/version` → 版本号（可用环境变量 `APP_VERSION` 注入）

## 运行与验证顺序

```bash
# 后端
cd apps/backend && npm ci && npm run build && npm start
curl http://127.0.0.1:3000/api/hello   # 预期 {"message":"Hello from ECS backend"}

# 前端（新终端）
cd apps/frontend && npm ci && npm run dev
# 浏览器打开 http://localhost:5173，页面应显示后端消息与版本号
```

## 上线到阿里云 ECS（实验四）

1. 按 PPT/报告 8.3 初始化 ECS（Nginx、systemd、deploy 用户、sudoers 最小授权）。
2. 在 GitHub 仓库 Settings → Secrets and variables → Actions 配置 4 个 Secret：
   `ECS_HOST`、`ECS_USER`、`ECS_SSH_PRIVATE_KEY`、`ECS_SSH_KNOWN_HOSTS`。
3. `git push origin main` 触发 `Build and Deploy Full Stack to ECS`。
4. 验证：`curl http://ECS公网IP/health`、`curl http://ECS公网IP/api/hello`、浏览器访问首页。

## 给 AI 协作的约定

只改任务相关文件；不删除测试；不读取真实密钥；脚本不存在时先报告，不自动跳过；
完成时列出文件变化、实际运行命令、结果与未验证项。
