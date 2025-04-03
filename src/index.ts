#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { QueryClient } from "./client.js";

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "bitfactory-mcp",
    version: "0.0.1",
  },
  {
    capabilities: {
      // resources: {},
      tools: {},
      // prompts: {},
    },
  }
);


/**
 * Handler that lists available tools.
 * Exposes a single "create_note" tool that lets clients create new notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // {
      //   name: "hello",
      //   description: "hello",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       apiKey: {
      //         type: "string",
      //         description: "API key for authentication"
      //       },
      //       apiSecret: {
      //         type: "string",
      //         description: "header apiSecret"
      //       }
      //     },
      //     required: ["apiKey", "apiSecret"]
      //   }
      // },
      {
        name: "getAccount",
        description: "获取链上某个账户的信息",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            address: {
              type: "string",
              description: "账户地址"
            },
            domainid: {
              type: "string",
              description: "对应域节点的信息"
            },
            height: {
              type: "number",
              description: "选填，指定查询某一区块高度时的账户状态"
            },
            key: {
              type: "string",
              description: "查询账户中metadatas下的某个关键字数据"
            }
            
          },
          required: ["apiKey", "apiSecret", "address", "domainid", "height", "key"]
        }
      },
      {
        name: "getAccountBase",
        description: "获取账户的基础信息",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            address: {
              type: "string",
              description: "账户地址"
            },
            domainid: {
              type: "string",
              description: "对应域节点的信息"
            }
            
          },
          required: ["apiKey", "apiSecret", "address", "domainid"]
        }
      },
      {
        name: "getAccountMetaData",
        description: "获取指定账户下的metadata数据信息",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            address: {
              type: "string",
              description: "账户地址"
            },
            domainid: {
              type: "string",
              description: "对应域节点的信息"
            },
            key: {
              type: "string",
              description: "查询账户中metadatas下的某个关键字数据"
            }
            
          },
          required: ["apiKey", "apiSecret", "address", "domainid", "key"]
        }
      },
      {
        name: "getLedger",
        description: "获取区块信息数据",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            seq: {
              type: "number",
              description: "区块高度"
            },
            domainid: {
              type: "string",
              description: "对应域节点的信息"
            },
            with_validator: {
              type: "boolean",
              description: "pbft共识节点信息,默认false"
            },
            with_leader: {
              type: "boolean",
              description: "出块人信息,默认false"
            }
            
          },
          required: ["apiKey", "apiSecret", "seq", "domainid", "with_validator", "with_leader"]
        }
      },
      {
        name: "getTransactionHistory",
        description: "获取链上交易信息数据",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            domainid: {
              type: "string",
              description: "对应域节点的信息"
            },
            hash:{
              type: "string",
              description: "交易hash"
            },
            ledger_seq:{
              type: "number",
              description: "块高度"
            },
            start:{
              type: "number",
              description: "起始条数 默认0"
            },
            limit:{
              type: "number",
              description: "查询记录数默认10"
            }
          },
          required: ["apiKey", "apiSecret","domainid","hash","ledger_seq","start","limit"]
        }
      },
      {
        name: "query",
        description: "查询交易数据列表",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: {
              type: "string",
              description: "API key for authentication"
            },
            apiSecret: {
              type: "string",
              description: "header apiSecret"
            },
            bid:{
              type: "string",
              description: "bid"
            },
            hash:{
              type: "string",
              description: "hash"
            },
            tx_id:{
              type: "string",
              description: "tx_id"
            },
            start_time:{
              type: "string",
              description: "开始时间 yyyy-MM-dd HH:mm:ss 例2023-09-14 21:21:41"
            },
            end_time:{
              type: "string",
              description: "结束时间 yyyy-MM-dd HH:mm:ss 例2023-09-14 21:21:41"
            },
            tx_type:{
              type: "number",
              description: "交易类型 0- 基础交易 1- 增强交易 当bid或tx_id不为空时 此参数必填"
            },
            page:{
              type: "number",
              description: "页码"
            },
            page_size:{
              type: "number",
              description: "每页条数"
            },
            ledger_seq:{
              type: "number",
              description: "块高度"
          },
          required: ["apiKey", "apiSecret","bid","hash","tx_id","start_time",
            "end_time","tx_type","page","page_size","ledger_seq"]
        }
      }
    },
    {
      name: "getTransactionCache",
      description: "查询交易缓存池数据列表",
      inputSchema: {
        type: "object",
        properties: {
          apiKey: {
            type: "string",
            description: "API key for authentication"
          },
          apiSecret: {
            type: "string",
            description: "header apiSecret"
          },
          pool_type:{
            type: "number",
            description: "缓存池类型 0- 平台缓存 1- 底层链缓存"
          },
          domainid:{
            type: "string",
            description: "选填,默认为0,域ID"
          },
          limit:{
            type: "number",
            description: "选填 默认100 最小1 最大1000 结果中最多返回的交易数量"
          },
          hash:{
            type: "string",
            description: "选填,交易哈希,不填时默认返回交易池内所有交易"
          },
          address:{
            type: "string",
            description: "选填,交易的源地址"
          }
        },
        required: ["apiKey", "apiSecret","pool_type","domainid","limit","hash","address"]
      }
    },
    {
      name: "queryDiscard",
      description: "查询丢弃交易数据",
      inputSchema: {
        type: "object",
        properties: {
          apiKey: {
            type: "string",
            description: "API key for authentication"
          },
          apiSecret: {
            type: "string",
            description: "header apiSecret"
          },
          hash:{
            type: "string",
            description: "hash"
          },
          page:{
            type: "number",
            description: "页码 默认1"
          },
          page_size:{
            type: "number",
            description: "每页记录数 默认10"
          }
        },
        required: ["apiKey", "apiSecret","hash","page","page_size"]
      }
    },
    {
      name: "getTxCacheSize",
      description: "获取交易池中交易条数",
      inputSchema: {
        type: "object",
        properties: {
          apiKey: {
            type: "string",
            description: "API key for authentication"
          },
          apiSecret: {
            type: "string",
            description: "header apiSecret"
          }
        },
        required: ["apiKey", "apiSecret"]
      }
    }
    ]
  };
});

/**
 * Handler for the create_note tool.
 * Creates a new note with the provided title and content, and returns success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    // case "hello": {
    //   const args = request.params.arguments;
    //   if (!args || typeof args !== 'object') {
    //     throw new Error("Invalid arguments provided");
    //   }
      
    //   const apiKey = String(args.apiKey || "").trim();
    //   const apiSecret = String(args.apiSecret || "").trim();
      
    //   if (!apiKey) {
    //     throw new Error("apiKey is required");
    //   }
    
    //   const apiUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
    //   const queryClient = new QueryClient({ apiUrl });
      
    //   try {
    //     const result = await queryClient.hello({ apiSecret });
    //     const jsonResult = JSON.parse(result);
    //     return {
    //       content: [{
    //         type: "text",
    //         text: JSON.stringify(jsonResult, null, 2)
    //       }]
    //     };
    //   } catch (error: unknown) {
    //     if (error instanceof Error) {
    //       throw new Error(`Hello tool failed: ${error.message}`);
    //     }
    //     throw new Error('Hello tool failed: Unknown error');
    //   }
    // }

    case "getAccount": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const address = String(args.address || "").trim();
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;
      const height = args.height !== undefined ? Number(args.height) : undefined;
      const key = args.key !== undefined ? String(args.key) : undefined;

      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      if (!address) {
        throw new Error("address is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getAccount({apiSecret, address, domainid, height, key });
        const jsonResult = JSON.parse(result);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getAccountBase": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const address = String(args.address || "").trim();
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;

      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      if (!address) {
        throw new Error("address is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getAccountBase({apiSecret, address, domainid});
        const jsonResult = JSON.parse(result);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getAccountMetaData": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const address = String(args.address || "").trim();
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;
      const key = args.key !== undefined ? String(args.key) : undefined;
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      if (!address) {
        throw new Error("address is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getAccountMetaData({apiSecret, address, domainid, key});
        const jsonResult = JSON.parse(result);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getLedger": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const seq = args.seq !== undefined ? Number(args.seq) : undefined;
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;
      const with_validator = args.with_validator !== undefined ? Boolean(args.with_validator) : false;
      const with_leader = args.with_leader !== undefined ? Boolean(args.with_leader) : false;
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getLedger({apiSecret,seq,domainid,with_validator,with_leader});
        const jsonResult = JSON.parse(result);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getTransactionHistory": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;
      const hash = args.hash !== undefined ? String(args.hash) : undefined;
      const ledger_seq = args.ledger_seq !== undefined ? Number(args.ledger_seq) : undefined;
      const start = args.start !== undefined ? Number(args.start) : 0;
      const limit = args.limit !== undefined ? Number(args.limit) : 10;
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getTransactionHistory({apiSecret, domainid, hash, ledger_seq, start, limit});
        const jsonResult = JSON.parse(result);
        return {  
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "query": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const bid = args.bid !== undefined ? String(args.bid) : undefined;
      const hash = args.hash !== undefined ? String(args.hash) : undefined;
      const tx_id = args.tx_id !== undefined ? String(args.tx_id) : undefined;
      const start_time = args.start_time !== undefined ? String(args.start_time) : undefined;
      const end_time = args.end_time !== undefined ? String(args.end_time) : undefined;
      const tx_type = args.tx_type !== undefined ? Number(args.tx_type) : undefined;  
      const page = args.page !== undefined ? Number(args.page) : undefined;
      const page_size = args.page_size !== undefined ? Number(args.page_size) : undefined;
      const ledger_seq = args.ledger_seq !== undefined ? Number(args.ledger_seq) : undefined;
      
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      if (!page) {
        throw new Error("page is required");
      }
      if (!page_size) {
        throw new Error("page_size is required");
      }

      if (bid || tx_id) {
        if (!tx_type) {
          throw new Error("tx_type is required");
        }
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.query({apiSecret, bid, hash, tx_id, start_time, end_time, 
          tx_type, page, page_size, ledger_seq});
        const jsonResult = JSON.parse(result);
        return {  
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getTransactionCache": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const pool_type = args.pool_type !== undefined ? Number(args.pool_type) : undefined;
      const domainid = args.domainid !== undefined ? String(args.domainid) : undefined;
      const limit = args.limit !== undefined ? Number(args.limit) : 100;
      const hash = args.hash !== undefined ? String(args.hash) : undefined;
      const address = args.address !== undefined ? String(args.address) : undefined;
      
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      if (pool_type === undefined) {
        throw new Error("pool_type is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getTransactionCache({apiSecret, pool_type, domainid, limit, hash, address});
        const jsonResult = JSON.parse(result);
        return {  
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "queryDiscard": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      const hash = args.hash !== undefined ? String(args.hash) : undefined;
      const page = args.page !== undefined ? Number(args.page) : 1;
      const page_size = args.page_size !== undefined ? Number(args.page_size) : 10;
      
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.queryDiscard({apiSecret, hash, page, page_size});
        const jsonResult = JSON.parse(result);
        return {  
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    case "getTxCacheSize": {
      const args = request.params.arguments;
      if (!args || typeof args !== 'object') {
        throw new Error("Invalid arguments provided");
      }
      
      const apiKey = String(args.apiKey || "").trim();
      const apiSecret = String(args.apiSecret || "").trim();
      
      if (!apiKey) {
        throw new Error("apiKey is required");
      }
      
      const baseUrl = `https://bif-testnet.bitfactory.cn/base/${apiKey}`;
      const queryClient = new QueryClient({ apiUrl: baseUrl });
      
      try {
        const result = await queryClient.getTxCacheSize({apiSecret});
        const jsonResult = JSON.parse(result);
        return {  
          content: [{
            type: "text",
            text: JSON.stringify(jsonResult, null, 2)
          }]
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});


/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.exit(1);
});
