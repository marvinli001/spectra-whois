# SpectraWHOIS 插件

**中文** | [English](./README.md)

SpectraWHOIS 的传统 WHOIS 查询服务 - 为 Railway 部署而设计的 Node.js 实现。此插件使用原生 TCP 连接处理不支持 RDAP 的域名 WHOIS 查询。

[![部署到 Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

## ✨ 特性

- 🔍 **IANA 服务器发现** - 自动发现权威 WHOIS 服务器
- 🔄 **查询语法回退** - 尝试多种查询格式以提高兼容性
- 🏃‍♂️ **快速缓存** - 发现的 WHOIS 服务器 24 小时缓存
- 🛡️ **错误处理** - 全面的错误分类和故障排除
- 📊 **批量查询** - 支持多个域名查询
- 🌐 **Railway 就绪** - 为 Railway 部署优化
- 🔒 **安全** - 内置 CORS、Helmet 和压缩中间件
- 📈 **健康监控** - 健康检查端点用于正常运行时间监控

## 🚀 快速部署

### 一键 Railway 部署

[![部署到 Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

**重要提示**：在 Railway 上部署时，请确保：
1. 将 **根目录** 设置为 `whois-plugin`
2. Railway 会自动检测 Node.js 项目
3. 无需额外的环境变量

### 手动部署

1. **克隆仓库：**
```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois/whois-plugin
```

2. **安装依赖：**
```bash
npm install
```

3. **本地运行：**
```bash
npm start        # 生产模式
npm run dev      # 开发模式（热重载）
```

4. **测试服务：**
```bash
npm test         # 运行基础测试
```

## 📡 API 接口

### 单域名查询
```http
GET /whois?domain=example.com
```

**响应：**
```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM\nRegistrar: ...",
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

### 批量查询
```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "github.com", "vercel.com"]
}
```

**响应：**
```json
{
  "success": true,
  "batch": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "results": [
    {
      "domain": "example.com",
      "success": true,
      "data": { ... },
      "error": null
    }
  ]
}
```

### 健康检查
```http
GET /health
```

**响应：**
```json
{
  "status": "healthy",
  "service": "spectra-whois-plugin",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.567
}
```

### 服务信息
```http
GET /
```

## 🛠️ 配置

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `PORT` | 服务器端口 | `3001` | Railway 自动设置 |
| `NODE_ENV` | 环境模式 | `production` | Railway 自动设置 |
| `ALLOWED_ORIGINS` | CORS 源（逗号分隔） | 所有源 | 否 |
| `RATE_LIMIT` | 每分钟每IP请求数 | `60` | 否 |
| `WHOIS_TIMEOUT` | WHOIS 查询超时（毫秒） | `10000` | 否 |
| `IANA_TIMEOUT` | IANA 查询超时（毫秒） | `8000` | 否 |

### CORS 配置

对于生产环境，在 `server.js` 中更新 CORS 源：

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://your-vercel-app.vercel.app'
  ]
}))
```

## 🏗️ 架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     前端        │───▶│   Railway API   │───▶│   WHOIS 服务器   │
│ (SpectraWHOIS)  │    │   (Node.js)     │    │   (43端口)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   IANA 发现     │
                       │ whois.iana.org  │
                       └─────────────────┘
```

## 🔍 工作原理

1. **服务器发现**：首先查询 IANA 以找到每个 TLD 的权威 WHOIS 服务器
2. **缓存**：将发现的服务器缓存 24 小时以提高性能
3. **查询回退**：尝试多种查询格式：
   - `domain example.com`（用于 Verisign 服务器）
   - `=example.com`（备用格式）
   - `example.com`（裸域名）
4. **TCP 连接**：使用原生 Node.js `net.Socket` 进行正确握手
5. **错误处理**：对错误进行分类并提供故障排除建议

## 🌟 相比 Cloudflare Workers 的优势

- ✅ **无网络限制** - Railway 允许到 WHOIS 服务器的出站 TCP 连接
- ✅ **更好的兼容性** - 标准 Node.js net.Socket 而不是 Workers TCP API
- ✅ **无速率限制** - Cloudflare 的出口节点经常被 WHOIS 服务器阻止
- ✅ **完全控制** - 对网络堆栈和错误处理的完全控制
- ✅ **更好的调试** - 全面的日志记录和错误分类

## 🧪 测试

### 基础测试
```bash
npm test
```

### 手动测试
```bash
# 启动服务器
npm run dev

# 测试单域名查询
curl "http://localhost:3001/whois?domain=google.com"

# 测试批量查询
curl -X POST http://localhost:3001/whois/batch \
  -H "Content-Type: application/json" \
  -d '{"domains": ["google.com", "github.com"]}'

# 测试健康检查
curl http://localhost:3001/health
```

## 📦 与前端集成

部署到 Railway 后，更新前端环境变量：

```bash
# Next.js 项目中的 .env.local
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

前端会自动检测插件并为支持的域名显示 WHOIS 标签页。

## 🐛 错误处理

服务将错误分为以下类别：

- `connection_refused` - WHOIS 服务器不可用
- `timeout` - 查询超时
- `server_not_found` - DNS 解析失败
- `empty_response` - 服务器未返回数据
- `iana_discovery_failed` - 找不到权威服务器

每个错误都包含故障排除建议：

```json
{
  "success": false,
  "error": "Connection timeout",
  "reason": "timeout",
  "troubleshooting": {
    "description": "查询等待响应超时",
    "suggestions": [
      "服务器可能正在经历高负载",
      "请稍后重试",
      "考虑使用手动 WHOIS 查询"
    ]
  }
}
```

## 📈 性能

- **冷启动**：~100毫秒
- **WHOIS 查询**：1-3 秒（取决于服务器）
- **缓存查询**：~50毫秒
- **批量查询**：并行处理
- **内存使用**：~50MB 基线

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 使用 `npm test` 测试更改
4. 提交更改 (`git commit -m 'Add some amazing feature'`)
5. 推送到分支 (`git push origin feature/amazing-feature`)
6. 提交拉取请求

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

---

**为 SpectraWHOIS 用心构建 ❤️**