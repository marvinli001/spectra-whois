# SpectraWHOIS

**中文** | [English](./README.md)

基于 Next.js 15 构建的现代化、高速 WHOIS 查询服务，采用 RDAP（注册数据访问协议）技术。具有精美的液体玻璃 UI 设计，并通过 Railway Node.js 插件支持传统 WHOIS 查询。

## 🚀 快速部署

### 部署到 Vercel（前端）

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmarvinli001%2Fspectra-whois)

1. **一键部署**：点击上方按钮部署到 Vercel
2. **环境变量**：可选择设置 `NEXT_PUBLIC_WHOIS_PLUGIN_URL` 以支持传统 WHOIS
3. **完成**：你的 WHOIS 查询服务已上线！

## ✨ 特性

- 🌍 **全球 TLD 支持**：通过 IANA 引导注册表支持所有 TLD
- 🌐 **IDN 支持**：完全支持国际化域名，包含 Punycode 转换
- 🔄 **双协议支持**：现代域名使用 RDAP + 传统 WHOIS 通过 Railway 插件
- ⚡ **IANA 发现**：动态 WHOIS 服务器发现，24 小时缓存
- 🎨 **液体玻璃 UI**：现代设计语言，配合 Framer Motion 动画
- 📱 **响应式设计**：在所有设备上完美运行
- 🔒 **隐私合规**：使用 RDAP 实现现代隐私标准
- 🚀 **Railway 插件**：原生 Node.js TCP 连接处理传统 WHOIS
- 🛠️ **开发者体验**：内置调试面板和环境检测

## 🏗️ 架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     前端        │───▶│   Railway API   │───▶│   WHOIS 服务器   │
│  (Next.js)      │    │   (Node.js)     │    │   (43端口)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   RDAP 服务器   │    │   IANA 发现     │
│  (HTTPS API)    │    │ whois.iana.org  │
└─────────────────┘    └─────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm、yarn 或 pnpm

### 前端设置

1. **克隆仓库：**
```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois
```

2. **安装依赖：**
```bash
npm install
```

3. **设置环境变量：**
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```bash
# WHOIS 插件支持（可选）
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

4. **运行开发服务器：**
```bash
npm run dev
```

### Railway 插件设置

1. **进入插件目录：**
```bash
cd whois-plugin
```

2. **安装依赖：**
```bash
npm install
```

3. **本地测试运行：**
```bash
npm run dev
```

4. **部署到 Railway：**
   - 将 GitHub 仓库连接到 Railway
   - Railway 会自动检测 Node.js 项目
   - 如需要，在 Railway 控制台设置环境变量

## 🔌 传统 WHOIS 插件（可选）

为了增强传统 WHOIS 查询功能，你可以选择部署 Railway 插件：

### 部署 WHOIS 插件到 Railway

[![在 Railway 上部署 WHOIS 插件](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

**设置说明：**
1. 点击上方的部署按钮
2. 在 Railway 控制台中设置 **根目录** 为 `whois-plugin`
3. 复制部署的 URL（例如：`https://your-app.railway.app`）
4. 添加到你的 Vercel 环境变量：`NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-app.railway.app/whois`

**📚 [插件文档](./whois-plugin/README_CN.md)** | **📚 [English Docs](./whois-plugin/README.md)**

## 📦 部署

### 前端（Vercel）

1. **连接到 Vercel：**
   - 在 Vercel 中导入你的 GitHub 仓库
   - Vercel 会自动检测 Next.js

2. **设置环境变量（可选）：**
   ```
   NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
   ```

3. **部署：**
   - 推送到主分支会触发自动部署

## 🎛️ 环境变量

### 前端（.env.local）

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_WHOIS_PLUGIN_URL` | Railway WHOIS 插件地址 | - | 可选* |
| `NEXT_PUBLIC_WHOIS_API_URL` | 备用插件地址 | - | 可选* |
| `DEBUG_ENV_CHECKER` | 显示环境调试日志 | `false` | 否 |

*仅传统 WHOIS 标签页功能需要

### Railway 插件

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `PORT` | 服务器端口 | `3001` | Railway 自动设置 |
| `NODE_ENV` | 环境模式 | `production` | Railway 自动设置 |
| `ALLOWED_ORIGINS` | CORS 源 | `*` | 否 |

## 🔧 配置

### WHOIS 标签页显示

传统 WHOIS 标签页在以下条件时出现：
1. ✅ 配置了 WHOIS 插件 URL
2. ✅ 域名支持 RDAP（这样可以显示两个标签页）
3. ✅ 前端可以访问 Railway 插件

### 调试面板（开发模式）

开发模式下，右下角会出现调试面板，显示：
- 配置状态（绿色 = 已配置，黄色 = 未配置）
- 环境变量检测
- 平台检测（本地/Vercel/其他）
- 配置建议

## 📡 API 接口

### WHOIS 插件（Railway）

#### 单域名查询
```http
GET /whois?domain=example.com
```

#### 批量查询
```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "github.com", "vercel.com"]
}
```

#### 健康检查
```http
GET /health
```

### 响应格式

#### 成功响应
```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM...",
  "parsedData": {
    "domain": "example.com",
    "registrar": "Reserved Domain",
    "registrationDate": "1995-08-14",
    "expirationDate": "2024-08-13",
    "nameServers": ["a.iana-servers.net", "b.iana-servers.net"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "domain": "example.com",
  "error": "Connection timeout",
  "source": "whois",
  "reason": "timeout",
  "troubleshooting": {
    "description": "查询等待响应超时",
    "suggestions": ["服务器可能正在经历高负载", "请稍后重试"]
  }
}
```

## 🛠️ 开发

### 项目结构

```
spectra-whois/
├── src/                          # Next.js 前端
│   ├── app/                      # App Router 页面
│   ├── components/               # React 组件
│   │   ├── debug/               # 调试面板
│   │   ├── ui/                  # UI 组件
│   │   └── whois/               # WHOIS 相关组件
│   ├── contexts/                # React 上下文
│   ├── services/                # API 服务
│   └── utils/                   # 工具函数
├── whois-plugin/                # Railway Node.js 插件
│   ├── lib/                     # WHOIS 客户端库
│   ├── server.js               # Express 服务器
│   ├── test.js                 # 基础测试
│   └── package.json            # 插件依赖
└── public/                      # 静态资源
```

### 测试

#### 前端
```bash
npm run build    # 测试构建
npm run lint     # 代码检查
npm run dev      # 开发服务器
```

#### WHOIS 插件
```bash
cd whois-plugin
npm test         # 运行基础测试
npm start        # 生产服务器
npm run dev      # 开发服务器（热重载）
```

## 🌟 核心技术

- **前端**：Next.js 15、React 18、Tailwind CSS、Framer Motion
- **后端**：Node.js、Express.js、原生 TCP Socket
- **部署**：Vercel（前端）+ Railway（后端）
- **协议**：RDAP（HTTPS）、传统 WHOIS（TCP 43 端口）
- **发现**：IANA 引导注册表

## 🤝 贡献

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [IANA](https://www.iana.org/) 维护 WHOIS 服务器注册表
- [Vercel](https://vercel.com/) 提供优秀的 Next.js 托管服务
- [Railway](https://railway.app/) 提供可靠的后端部署平台
- [Tailwind CSS](https://tailwindcss.com/) 提供实用优先的 CSS 框架
- [Framer Motion](https://www.framer.com/motion/) 提供精美的动画效果

---

**使用 Next.js 15 和 Railway 用心构建 ❤️**