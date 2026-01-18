#!/bin/bash

# Shoplazza MCP 安装脚本

echo "🚀 开始安装 Shoplazza MCP 工具..."

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. 安装依赖
echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，请检查网络连接或 npm 配置"
    echo "💡 提示：你可以尝试："
    echo "   - 检查网络连接"
    echo "   - 使用 npm config set registry https://registry.npmjs.org/"
    echo "   - 或者使用代理"
    exit 1
fi

# 1.1. 修复安全漏洞
echo "🔒 正在修复安全漏洞..."
npm audit fix --force 2>/dev/null || npm audit fix || echo "⚠️  部分漏洞可能需要手动修复，请运行 'npm audit' 查看详情"

# 2. 构建项目
echo "🔨 正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 3. 检查构建结果
if [ ! -f "build/index.js" ]; then
    echo "❌ 构建文件不存在"
    exit 1
fi

# 4. 设置执行权限
chmod +x build/index.js

# 5. 创建 MCP 配置文件
echo "⚙️  正在配置 MCP..."

MCP_CONFIG_DIR="$HOME/Library/Application Support/Cursor/User/globalStorage"
MCP_CONFIG_FILE="$MCP_CONFIG_DIR/mcp-config.json"
BUILD_PATH="$SCRIPT_DIR/build/index.js"

# 确保目录存在
mkdir -p "$MCP_CONFIG_DIR"

# 读取现有配置或创建新配置
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo "📝 发现现有 MCP 配置文件，正在更新..."
    # 使用 node 来更新 JSON 文件
    node <<EOF
const fs = require('fs');
const path = require('path');

const configPath = "$MCP_CONFIG_FILE";
const buildPath = "$BUILD_PATH";

let config = {};
try {
    const content = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(content);
} catch (e) {
    config = {};
}

if (!config.mcpServers) {
    config.mcpServers = {};
}

config.mcpServers['shoplazza-mcp'] = {
    "command": "node",
    "args": [buildPath],
    "env": {}
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ MCP 配置已更新');
EOF
else
    echo "📝 创建新的 MCP 配置文件..."
    node <<EOF
const fs = require('fs');
const path = require('path');

const configPath = "$MCP_CONFIG_FILE";
const buildPath = "$BUILD_PATH";

const config = {
    "mcpServers": {
        "shoplazza-mcp": {
            "command": "node",
            "args": [buildPath],
            "env": {}
        }
    }
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ MCP 配置文件已创建');
EOF
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "📋 下一步："
echo "   1. 重启 Cursor 以使 MCP 工具生效"
echo "   2. 重启后，你可以在对话中使用："
echo "      '请帮我获取 spz-accordion 组件的文档信息'"
echo ""
echo "📁 配置文件位置："
echo "   $MCP_CONFIG_FILE"
echo ""
echo "🔧 构建文件位置："
echo "   $BUILD_PATH"
echo ""
