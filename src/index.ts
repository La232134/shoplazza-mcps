import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { extractComponentDocumentation } from "./extractor.js";

// Create server instance
const server = new McpServer(
  {
    name: "shoplazza-mcp",
    version: "1.0.0",
  }
);

server.tool("get-lessjs", 
  {
    componentName: z.string()
  },
  async ({componentName}) => {

    const response = await fetch(
      `https://lessjs.shoplazza.com/latest/components/${componentName}/`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const docData = extractComponentDocumentation(html, componentName);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(docData, null, 2)
        }
      ]
    };
  }
);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Shoplazza MCP stdio 服务器已启动");
  } catch (error) {
    console.error("启动失败:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("运行出错:", error);
  process.exit(1);
});
