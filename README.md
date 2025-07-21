# Shoplazza MCP 工具

这是一个用于Cursor的MCP (Model Context Protocol) 工具，可以获取Shoplazza LessJS组件的文档信息。

## 功能

- 获取LessJS组件的完整文档
- 提取组件的属性、方法、事件和示例代码
- 提供结构化的JSON格式输出

## 安装和配置

### 1. 构建项目

```bash
npm install
npm run build
```

### 2. 在Cursor中配置MCP

在Cursor中，你需要配置MCP服务器。有两种方式：

#### 方式一：通过Cursor设置界面

1. 打开Cursor
2. 进入设置 (Settings)
3. 搜索 "MCP" 或 "Model Context Protocol"
4. 添加新的MCP服务器配置：

```json
{
  "command": "node",
  "args": ["/path/to/your/shoplazza-mcp/build/index.js"],
  "env": {}
}
```

#### 方式二：通过配置文件

在你的Cursor配置目录中创建或编辑MCP配置文件：

**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp-config.json`
**Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp-config.json`
**Linux**: `~/.config/Cursor/User/globalStorage/mcp-config.json`

```json
{
  "mcpServers": {
    "shoplazza-mcp": {
      "command": "node",
      "args": ["/path/to/your/shoplazza-mcp/build/index.js"],
      "env": {}
    }
  }
}
```

### 3. 重启Cursor

配置完成后，重启Cursor以使MCP工具生效。

## 使用方法

配置完成后，你可以在Cursor的对话中直接使用以下工具：

### get-lessjs

获取LessJS组件的文档信息。

**参数:**
- `componentName` (string): LessJS组件名称

**使用示例:**
```
请帮我获取spz-accordion组件的文档信息
```

**返回数据:**
- 组件名称和描述
- 使用场景
- 属性列表（名称、类型、默认值、是否必需）
- 方法列表（名称、参数）
- 事件列表
- 代码示例


## 支持的组件

目前支持所有在 https://lessjs.shoplazza.com/latest/components/ 上可用的组件，包括但不限于：


## 故障排除

1. **工具未响应**: 确保路径正确且文件存在
2. **权限错误**: 确保build/index.js有执行权限
3. **网络错误**: 检查网络连接和API地址是否可访问

## 开发

### 项目结构

```
shoplazza-mcp/
├── src/
│   ├── index.ts          # MCP服务器主文件
│   └── extractor.ts      # HTML解析和数据提取
├── build/                # 编译后的文件
├── package.json
└── README.md
```

### 添加新功能

1. 在 `src/index.ts` 中添加新的工具定义
2. 在 `src/extractor.ts` 中添加相应的数据提取逻辑
3. 重新构建项目：`npm run build`
4. 重启Cursor
