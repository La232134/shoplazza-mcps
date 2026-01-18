# 更新日志

## [1.0.1] - 2025-01-17

### 修复
- **Bug 修复**: 修复了 `extractor.ts` 中硬编码组件名 'spz-accordion' 的问题，现在正确使用传入的 `componentName` 参数
- **安全更新**: 升级 `@modelcontextprotocol/sdk` 从 `^1.16.0` 到 `^1.25.2`，修复以下安全漏洞：
  - CVE-2025-66414: DNS 重绑定保护漏洞
  - CVE-2026-0621: ReDoS (正则表达式拒绝服务) 漏洞
- **依赖安全**: 通过 `npm audit fix` 修复了 body-parser 和 qs 模块的 DoS 相关漏洞

### 变更
- `extractComponentDocumentation` 函数现在接受 `componentName` 作为第二个参数
- `index.ts` 中调用 `extractComponentDocumentation` 时传递 `componentName` 参数

## [1.0.0] - 初始版本

### 功能
- 获取 Shoplazza LessJS 组件的完整文档
- 提取组件的属性、方法、事件和示例代码
- 提供结构化的 JSON 格式输出
