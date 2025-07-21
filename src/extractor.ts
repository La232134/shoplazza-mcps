// 定义数据结构
interface ComponentDoc {
  name: string;           // 组件名称
  title: string;          // 页面标题
  description: string;    // 组件描述
  usage: string[];        // 使用场景
  properties: any; // 属性列表
  methods: any;      // 方法列表
  events: any;        // 事件列表
  examples: any;    // 代码示例
}

interface Property {
  name: string;
  description: string;
  type: string;
  defaultValue: string;
  required: boolean;
}

interface Method {
  name: string;
  description: string;
  parameters: Parameter[];
}

interface Event {
  name: string;
  description: string;
  data?: any;
}

// 1. 移除HTML标签，提取纯文本
function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// 2. 提取标题和描述
function extractTitleAndDescription(html: string) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
  
  return {
    title: titleMatch ? titleMatch[1] : '',
    description: descriptionMatch ? descriptionMatch[1] : ''
  };
}

// 3. 提取使用场景
function extractUsage(html: string): string[] {
  const usageSection = html.match(/<h2[^>]*>何时使用<\/h2>.*?<ul>(.*?)<\/ul>/s);
  if (!usageSection) return [];
  
  const listItems = usageSection[1].match(/<li>(.*?)<\/li>/g);
  return listItems ? listItems.map(item => extractText(item)) : [];
}

// 4. 提取属性表格
function extractProperties(html: string) {
  const tableMatch = html.match(/<h2[^>]*>属性<\/h2>.*?<table>(.*?)<\/table>/s);
  if (!tableMatch) return [];
  
  const rows = tableMatch[1].match(/<tr>(.*?)<\/tr>/g);
  if (!rows || rows.length < 2) return [];
  
  // 跳过表头，从第二行开始
  return rows.slice(1).map(row => {
    const cells = row.match(/<td>(.*?)<\/td>/g);
    if (!cells || cells.length < 5) return null;
    
    return {
      name: extractText(cells[0]),
      description: extractText(cells[1]),
      type: extractText(cells[2]),
      defaultValue: extractText(cells[3]),
      required: extractText(cells[4]) === '是'
    };
  }).filter(Boolean);
}

// 5. 提取方法信息
function extractMethods(html: string) {
  const methodsSection = html.match(/<h2[^>]*>方法<\/h2>(.*?)<h2[^>]*>事件<\/h2>/s);
  if (!methodsSection) return [];
  
  const methodBlocks = methodsSection[1].match(/<h3[^>]*>(.*?)<\/h3>.*?<table>(.*?)<\/table>/gs);
  
  return methodBlocks ? methodBlocks.map(block => {
    const nameMatch = block.match(/<h3[^>]*>(.*?)<\/h3>/);
    const tableMatch = block.match(/<table>(.*?)<\/table>/s);
    
    if (!nameMatch || !tableMatch) return null;
    
    const rows = tableMatch[1].match(/<tr>(.*?)<\/tr>/g);
    const parameters = rows ? rows.slice(1).map(row => {
      const cells = row.match(/<td>(.*?)<\/td>/g);
      if (!cells || cells.length < 5) return null;
      
      return {
        name: extractText(cells[0]),
        description: extractText(cells[1]),
        type: extractText(cells[2]),
        defaultValue: extractText(cells[3]),
        required: extractText(cells[4]) === '是'
      };
    }).filter(Boolean) : [];
    
    return {
      name: extractText(nameMatch[1]),
      description: '', // 可以从方法描述中提取
      parameters
    };
  }).filter(Boolean) : [];
}

// 6. 提取代码示例
function extractExamples(html: string): Example[] {
  const examples = html.match(/<h3[^>]*>(.*?)<\/h3>.*?<pre[^>]*>(.*?)<\/pre>/gs);
  
  return examples ? examples.map(example => {
    const titleMatch = example.match(/<h3[^>]*>(.*?)<\/h3>/);
    const codeMatch = example.match(/<pre[^>]*>(.*?)<\/pre>/s);
    
    return {
      title: titleMatch ? extractText(titleMatch[1]) : '',
      code: codeMatch ? extractText(codeMatch[1]) : ''
    };
  }) : [];
}

// 7. 提取事件信息
function extractEvents(html: string) {
  const eventsSection = html.match(/<h2[^>]*>事件<\/h2>(.*?)<h2[^>]*>方法<\/h2>/s);
  if (!eventsSection) return [];

  const eventBlocks = eventsSection[1].match(/<h3[^>]*>(.*?)<\/h3>.*?<table>(.*?)<\/table>/gs);

  return eventBlocks ? eventBlocks.map(block => {
    const nameMatch = block.match(/<h3[^>]*>(.*?)<\/h3>/);
    const tableMatch = block.match(/<table>(.*?)<\/table>/s);

    if (!nameMatch || !tableMatch) return null;

    const rows = tableMatch[1].match(/<tr>(.*?)<\/tr>/g);
    const description = rows ? rows.slice(1).map(row => extractText(row)).join('') : '';

    return {
      name: extractText(nameMatch[1]),
      description: description
    };
  }).filter(Boolean) : [];
}

// 8. 提取参数信息
interface Parameter {
  name: string;
  description: string;
  type: string;
  defaultValue: string;
  required: boolean;
}

// 9. 提取示例信息
interface Example {
  title: string;
  code: string;
}

// 10. 提取完整组件文档
export function extractComponentDocumentation(html: string): ComponentDoc {
  return {
    name: 'spz-accordion',
    ...extractTitleAndDescription(html),
    usage: extractUsage(html),
    properties: extractProperties(html),
    methods: extractMethods(html),
    events: extractEvents(html),
    examples: extractExamples(html)
  };
}