# Shoplazza MCP 安装指南

## 快速安装（推荐）

运行安装脚本：

```bash
cd /Users/xiqilin/Documents/Project/Shoplaza/shoplazza-mcps
./setup.sh
```

## 手动安装

如果自动安装脚本遇到问题，可以按照以下步骤手动安装：

### 1. 安装依赖

```bash
cd /Users/xiqilin/Documents/Project/Shoplaza/shoplazza-mcps
npm install
```

如果遇到网络问题，可以尝试：

```bash
# 使用官方 npm registry
npm install --registry https://registry.npmjs.org/

# 或者使用淘宝镜像
npm install --registry https://registry.npmmirror.com/
```

### 2. 构建项目

```bash
npm run build
```

### 3. 配置 MCP

#### 方式一：使用脚本自动配置

安装脚本会自动创建/更新 MCP 配置文件。

#### 方式二：手动配置

在以下位置创建或编辑 MCP 配置文件：

**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp-config.json`

配置文件内容：

```json
{
  "mcpServers": {
    "shoplazza-mcp": {
      "command": "node",
      "args": ["/Users/xiqilin/Documents/Project/Shoplaza/shoplazza-mcps/build/index.js"],
      "env": {}
    }
  }
}
```

### 4. 重启 Cursor

配置完成后，重启 Cursor 以使 MCP 工具生效。

## 验证安装

重启 Cursor 后，你可以在对话中测试：

```
请帮我获取 spz-accordion 组件的文档信息
```

如果 MCP 工具正常工作，AI 助手应该能够调用 `get-lessjs` 工具并返回组件文档。

## 故障排除

### 问题 1: npm install 失败

**症状**: 网络连接错误

**解决方案**:
- 检查网络连接
- 尝试切换 npm registry
- 使用代理或 VPN

### 问题 2: 构建失败

**症状**: `npm run build` 报错

**解决方案**:
- 确保已安装 Node.js (推荐 v18+)
- 检查 TypeScript 是否正确安装
- 查看错误信息并修复

### 问题 3: MCP 工具未响应

**症状**: 在 Cursor 中无法使用 MCP 工具

**解决方案**:
1. 检查配置文件路径是否正确
2. 确保 `build/index.js` 文件存在
3. 检查文件权限：`chmod +x build/index.js`
4. 查看 Cursor 的 MCP 日志（如果有）
5. 重启 Cursor

### 问题 4: 权限错误

**症状**: 无法执行 build/index.js

**解决方案**:
```bash
chmod +x /Users/xiqilin/Documents/Project/Shoplaza/shoplazza-mcps/build/index.js
```

## 项目结构

```
shoplazza-mcps/
├── src/
│   ├── index.ts          # MCP服务器主文件
│   └── extractor.ts      # HTML解析和数据提取
├── build/                # 编译后的文件（构建后生成）
│   └── index.js
├── package.json
├── tsconfig.json
├── setup.sh              # 自动安装脚本
└── INSTALL.md            # 本文件
```

## 使用示例

配置完成后，你可以在 Cursor 中直接使用：

- "请帮我获取 spz-accordion 组件的文档信息"
- "获取 spz-button 组件的属性和方法"
- "查看 spz-modal 组件的使用示例"

MCP 工具会自动从 Shoplazza LessJS 文档网站获取最新的组件信息。
