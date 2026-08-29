# SpectraWHOIS WHOIS 插件

<div align="center">

为 SpectraWHOIS 提供传统 WHOIS 查询能力的独立 Node.js 服务。

[返回主项目](../README.md) · [简体中文](./README.md) · [English](./README_EN.md)

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-ready-0B0D0E?logo=railway&logoColor=white)

</div>

该插件使用 Node.js 原生 `net.Socket` 连接权威 WHOIS 服务器的 TCP 43 端口，并通过 HTTP API 把结果提供给 SpectraWHOIS 前端。它适用于通常缺少 RDAP 支持的顶级域，以及 RDAP 查询失败后的可选回退路径。

> 这是可选服务。SpectraWHOIS 的 RDAP 查询不依赖本插件。

## 目录

- [功能](#功能)
- [架构与工作流程](#架构与工作流程)
- [快速开始](#快速开始)
- [配置](#配置)
- [API 参考](#api-参考)
- [错误处理](#错误处理)
- [测试](#测试)
- [部署到 Railway](#部署到-railway)
- [接入前端](#接入前端)
- [生产部署检查](#生产部署检查)
- [项目结构](#项目结构)
- [许可证](#许可证)

## 功能

- 通过 `whois.iana.org` 发现顶级域对应的权威 WHOIS 服务器。
- 将服务发现结果在进程内缓存 24 小时。
- 针对不同服务器依次尝试裸域名、`=domain` 和 `domain domain` 查询格式。
- 通过原生 TCP Socket 执行 WHOIS 请求，并使用 10 秒固定超时。
- 解析常见的注册商、日期、域名服务器、状态和联系人字段。
- 提供单域名查询、最多 10 个域名的并行批量查询和健康检查接口。
- 使用 Helmet、CORS、响应压缩和 1 MB JSON/表单请求体限制。
- 对常见网络错误进行分类，并返回排查建议。

## 架构与工作流程

```text
SpectraWHOIS / API 客户端
          │ HTTP
          ▼
  Express WHOIS 插件
          │
          ├── 1. 查询进程内缓存
          ├── 2. 向 IANA 发现权威 WHOIS 服务
          ├── 3. 尝试多种查询语法
          ├── 4. 连接权威服务器 TCP 43
          └── 5. 清洗并解析响应
```

如果 IANA 服务发现失败，客户端会对 `.com`、`.net`、`.org` 使用内置后备服务器，其他顶级域回退到 `whois.iana.org`。

## 快速开始

### 环境要求

- Node.js `>=18.0.0`
- npm
- 可进行 DNS 解析并访问外部 TCP 43 端口的网络

### 安装与运行

```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois/whois-plugin
npm install
npm run dev
```

默认服务地址为 [http://localhost:3001](http://localhost:3001)。

检查服务：

```bash
curl http://localhost:3001/health
curl "http://localhost:3001/whois?domain=example.com"
```

## 配置

### 环境变量

当前源码实际读取以下变量：

| 变量 | 用途 | 默认值 |
| --- | --- | --- |
| `PORT` | HTTP 监听端口 | `3001` |
| `NODE_ENV` | 运行环境；设为 `production` 时启用生产 CORS 允许列表 | `development` |

可以在 `whois-plugin/.env` 中设置：

```dotenv
PORT=3001
NODE_ENV=development
```

查询超时固定为 10 秒，服务发现缓存固定为 24 小时；当前版本没有为这些值提供环境变量。

### CORS

开发环境允许以下来源：

- `http://localhost:3000`
- `http://127.0.0.1:3000`

生产环境允许项目内预设的 SpectraWHOIS Vercel 地址、占位自定义域名和 `*.vercel.app`。如果前端使用自定义域名，请在 [`server.js`](./server.js) 的 CORS `origin` 列表中替换或追加真实来源后重新部署。

当前版本不会读取 `ALLOWED_ORIGINS` 环境变量。

## API 参考

### 服务信息

```http
GET /
```

返回服务名称、版本、可用端点和运行环境。

### 健康检查

```http
GET /health
```

示例响应：

```json
{
  "status": "healthy",
  "service": "spectra-whois-plugin",
  "version": "1.0.0",
  "timestamp": "2026-08-29T00:00:00.000Z",
  "uptime": 120.5
}
```

### 单域名查询

```http
GET /whois?domain=example.com
```

成功响应：

```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM\n...",
  "parsedData": {
    "domain": "example.com",
    "registrar": "RESERVED-Internet Assigned Numbers Authority",
    "registrarUrl": null,
    "registrarEmail": null,
    "registrarPhone": null,
    "registrationDate": "1995-08-14T04:00:00Z",
    "expirationDate": "2027-08-13T04:00:00Z",
    "updatedDate": "2026-08-24T07:01:39Z",
    "nameServers": ["a.iana-servers.net", "b.iana-servers.net"],
    "status": ["client delete prohibited"],
    "registrant": {},
    "admin": {},
    "tech": {},
    "billing": {}
  },
  "timestamp": "2026-08-29T00:00:00.000Z"
}
```

缺少 `domain` 参数时返回 `400`。直接调用插件时，应传入 ASCII/Punycode 域名；SpectraWHOIS 前端会在调用前完成规范化。

### 批量查询

```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "example.org"]
}
```

单次请求最多接受 10 个域名。每个结果独立返回：

```json
{
  "success": true,
  "batch": true,
  "timestamp": "2026-08-29T00:00:00.000Z",
  "results": [
    {
      "domain": "example.com",
      "success": true,
      "data": {
        "success": true,
        "domain": "example.com"
      },
      "error": null
    }
  ]
}
```

批量请求并行执行，`success: true` 表示任务 Promise 已完成；调用方仍应检查嵌套 `data.success`，以判断实际 WHOIS 查询是否成功。

## 错误处理

WHOIS 客户端可能返回以下 `reason`：

| 原因 | 含义 |
| --- | --- |
| `connection_refused` | 服务器拒绝 TCP 连接 |
| `timeout` | 连接或查询超时 |
| `server_not_found` | WHOIS 主机名无法解析 |
| `empty_response` | 已连接，但服务器未返回有效内容 |
| `iana_discovery_failed` | 无法从 IANA 发现权威服务器 |
| `unknown` | 未归类错误 |

示例：

```json
{
  "success": false,
  "domain": "example.invalid",
  "error": "Query timeout after 10000ms",
  "source": "whois",
  "reason": "timeout",
  "restricted": false,
  "manualCheckUrl": null,
  "timestamp": "2026-08-29T00:00:00.000Z",
  "troubleshooting": {
    "description": "Query timed out waiting for response",
    "suggestions": [
      "Server may be experiencing high load",
      "Network connectivity issues",
      "Try again with shorter timeout"
    ]
  }
}
```

注意：单域名路由会直接返回客户端的 `success: false` 结果，通常仍为 HTTP `200`；调用方必须同时检查 HTTP 状态与 JSON 中的 `success` 字段。

## 测试

运行仓库自带的冒烟脚本：

```bash
npm test
```

脚本会实时查询 `google.com`、`github.com` 和 `example.org`。它依赖外网、IANA、第三方 WHOIS 服务和 TCP 43 端口，不是隔离的单元测试，也不对每个结果执行自动断言。

手动验证：

```bash
npm run dev

curl "http://localhost:3001/whois?domain=example.com"

curl -X POST http://localhost:3001/whois/batch \
  -H "Content-Type: application/json" \
  -d '{"domains":["example.com","example.org"]}'

curl http://localhost:3001/health
```

## 部署到 Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

### 使用模板

1. 点击上方按钮创建 Railway 服务。
2. 确认服务的根目录为 `whois-plugin`。
3. Railway 会根据 `package.json` 与 `Procfile` 启动 `npm start`。
4. 部署后访问 `/health` 和 `/whois?domain=example.com` 验证 HTTP 与 TCP 查询。
5. 如前端使用自定义域名，更新 `server.js` 中的生产 CORS 来源并重新部署。

### 手动部署

将 GitHub 仓库导入 Railway，并使用以下设置：

| 设置 | 值 |
| --- | --- |
| Root Directory | `whois-plugin` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Railway 通常会注入 `PORT` 和 `NODE_ENV`。请同时确认所选运行环境允许访问外部 TCP 43 端口。

## 接入前端

将完整查询地址写入 SpectraWHOIS 根目录的 `.env.local` 或前端部署平台环境变量：

```dotenv
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-plugin.example.com/whois
```

然后重新启动或重新部署前端。该地址会进入浏览器可见的构建产物，不应包含密钥。

## 生产部署检查

公开部署前，至少应确认：

- 已把生产 CORS 允许列表限制到真实前端来源。
- 已在网关、反向代理或平台层配置速率限制与滥用防护。
- 已根据风险决定是否增加身份认证；当前服务没有内置认证。
- 已限制或收集适量日志，避免无意保留不必要的查询数据。
- 已验证运行环境的 DNS、出站 TCP 43、超时和重启行为。
- 已理解进程内缓存会在重新部署或进程重启后清空。

## 项目结构

```text
whois-plugin/
├── lib/
│   └── whois-client.js     # IANA 发现、TCP 查询、解析与错误分类
├── server.js               # Express 应用、CORS 和 API 路由
├── test.js                 # 实时网络冒烟脚本
├── package.json            # 依赖、命令与 Node.js 版本要求
├── Procfile                # Railway/进程启动声明
└── README.md               # 中文主文档
```

## 许可证

`package.json` 当前声明 `MIT`，但上级仓库尚未包含正式的 `LICENSE` 文件。在维护者补充并确认许可证文本前，不应把包元数据视为完整授权。
