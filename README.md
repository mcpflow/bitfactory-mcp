# BitFactory MCP

BitFactory MCP 是一个基于 Model Context Protocol (MCP) 的服务器实现，专门用于简化和标准化与 BitFactory API 的交互。

## 项目概述

本项目提供了一个轻量级且类型安全的接口层，使开发者能够轻松地与 BitFactory 的区块链服务进行交互。通过 TypeScript 的实现，提供了完整的类型支持和现代化的开发体验。

## 核心功能

### API 集成
- **基础服务调用**: 支持 BitFactory 基础 API 服务
- **链上数据查询**: 提供区块链账户信息查询功能
- **类型安全**: 完整的 TypeScript 类型定义
- **错误处理**: 统一的错误处理机制

### 技术特点
- 基于 MCP (Model Context Protocol) 协议
- 支持标准输入输出(stdio)通信
- 模块化设计，易于扩展
- 内置调试支持

## 快速开始

### 安装依赖
```bash
npm install
```

### 构建项目
```bash
npm run build
```

### 开发模式
```bash
npm run watch
```

### 调试工具
```bash
npm run inspector
```

## 配置说明

### Claude Desktop 配置
Windows 配置路径：`%APPDATA%/Claude/claude_desktop_config.json`
MacOS 配置路径：`~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bitfactory-mcp": {
      "command": "/path/to/bitfactory-mcp/build/index.js"
    }
  }
}
```

## 技术栈
- Node.js
- TypeScript
- MCP SDK 0.6.0+


## 版本信息
当前版本：0.1.0

## 许可说明
私有软件，保留所有权利
