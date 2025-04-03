import { log } from "console";

/**
* Query client for BitOps API interaction
*/
export class QueryClient {
    
private readonly apiUrl: string;

/**
   * Create a new Query client
   * @param apiUrl - The API URL
   */
constructor({ apiUrl }: { apiUrl: string }) {
    this.apiUrl = apiUrl;
  }

/**
   * Send a query request
   * @param apiSecret - The API secret (optional)
   * @returns The response from the API
   */
async sendQuery({ apiSecret, path, params }: { apiSecret?: string, path?: string, params?: Record<string, string | number | boolean> } = {}): Promise<string> {
    try {
      const headers: Record<string, string> = {
        'accept': '*/*'
      };

      if (apiSecret) {
        headers['api-secret'] = apiSecret.trim();
      }
      
      let url = this.apiUrl;
      if (path) {
        url += `/${path}`;
      }
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url, {
        method: "GET",
        headers
      });
    
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}\nResponse: ${responseText}`);
      }

      return responseText;
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Query request failed: ${error.message}`);
      }
      throw new Error('Query request failed: Unknown error');
    }
  }

  /**
   * Send a hello request
   * @param apiSecret - The API secret
   * @returns The response from the API
   */ 
  async hello({ apiSecret }: { apiSecret: string }): Promise<string> {
    try {
      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'hello'
      });
      return responseText;
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

/**
 * Get account information
 * @param apiSecret - The API secret
 * @param address - The account address
 * @param domainid - The domain ID
 * @param height - The block height
 * @param key - The key to query
 * @returns The account information
 */
async getAccount({apiSecret, address, domainid, height, key }: 
  { apiSecret: string, address: string, domainid?: string, height?: number, key?: string }): Promise<string> {
    try {
      if (!address) {
        throw new Error("Account address is required");
      }

      const params: Record<string, string | number> = {
        address
      };
      
      if (domainid !== undefined) {
        params.domainid = domainid;
      }
      if (height !== undefined) {
        params.height = height;
      }
      if (key !== undefined) {
        params.key = key;
      }

      const responseText = await this.sendQuery({
        apiSecret: apiSecret, 
        path: 'getAccount',
        params
      });
      return responseText;
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

  /**
   * Get account base information 
   * @param apiSecret - The API secret
   * @param address - The account address
   * @param domainid - The domain ID
   * @returns The account base information
   */
  async getAccountBase({apiSecret, address, domainid }: 
    { apiSecret: string, address: string, domainid?: string }): Promise<string> {
      try {
        if (!address) {
          throw new Error("Account address is required");
        }
  
        const params: Record<string, string | number> = {
          address
        };
        
        if (domainid !== undefined) {
          params.domainid = domainid;
        }
  
        const responseText = await this.sendQuery({
          apiSecret: apiSecret, 
          path: 'getAccountBase',
          params
        });
        return responseText;
        
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Get chain account failed: ${error.message}`);
        }
        throw new Error('Get chain account failed: Unknown error');
      }
    }

  /**
   * Get account metadata
   * @param apiSecret - The API secret
   * @param address - The account address
   * @param domainid - The domain ID
   * @param key - The key to query
   * @returns The account metadata
   */
  async getAccountMetaData({ apiSecret, address, domainid, key }:
    { apiSecret: string, address: string, domainid?: string, key?: string }): Promise<string> {
    try {
      if (!address) {
        throw new Error("Account address is required");
      }

      const params: Record<string, string | number> = {
        address
      };

      if (domainid !== undefined) {
        params.domainid = domainid;
      }
      if (key !== undefined) {
        params.key = key;
      }

      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'getAccountMetaData',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }
  /**
   * Get ledger information
   * @param apiSecret - The API secret
   * @param seq - The block height
   * @param domainid - The domain ID
   * @param with_validator - The validator
   * @param with_leader - The leader
   * @returns The ledger information
   */
  async getLedger({ apiSecret, seq, domainid, with_validator, with_leader }:
    { apiSecret: string, seq: number|undefined, domainid?: string, with_validator?: boolean, with_leader?: boolean }): Promise<string> {
    try {

      const params: Record<string, string | number | boolean> = {};
      if (seq !== undefined) {
        params.seq = seq;
      }
      if (domainid !== undefined) {
        params.domainid = domainid;
      }
      if (with_validator !== undefined) {
        params.with_validator = with_validator;
      }
      if (with_leader !== undefined) {
        params.with_leader = with_leader;
      }

      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'getLedger',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }
  /**
   * Get transaction history
   * @param apiSecret - The API secret
   * @param domainid - The domain ID
   * @param hash - The hash
   * @param ledger_seq - The ledger sequence
   * @param start - The start
   * @param limit - The limit
   * @returns The transaction history
   */
  async getTransactionHistory ({ apiSecret,domainid, hash, ledger_seq, start, limit }:
    { apiSecret: string, domainid: string|undefined, hash: string|undefined, ledger_seq: number|undefined, start?: number|undefined, limit?: number|undefined }): Promise<string> {
    try {

      const params: Record<string, string | number> = {};
      if (domainid !== undefined) {
        params.domainid = domainid;
      }
      if (hash !== undefined) {
        params.hash = hash;
      }
      if (ledger_seq !== undefined) {
        params.ledger_seq = ledger_seq;
      } 
      if (start !== undefined) {
        params.start = start;
      }
      if (limit !== undefined) {
        params.limit = limit;
      }

      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'getTransactionHistory',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

  /**
   * Query transaction data list
   * @param apiSecret - The API secret
   * @param bid - The bid
   * @param hash - The hash
   * @param tx_id - The transaction ID    
   * @param start_time - The start time
   * @param end_time - The end time
   * @param tx_type - The transaction type
   * @param page - The page
   * @param page_size - The page size
   * @param ledger_seq - The ledger sequence
   * @returns The transaction data list
   */ 
  async query ({ apiSecret,bid, hash, tx_id, start_time, end_time, tx_type, page, page_size, ledger_seq }:
    { apiSecret: string, bid: string|undefined, hash: string|undefined, tx_id: string|undefined, start_time: string|undefined, end_time: string|undefined, tx_type: number|undefined, page: number, page_size: number, ledger_seq: number|undefined }): Promise<string> {
    try {

      const params: Record<string, string | number> = {
        page: page,
        page_size:page_size
      };
      if (bid !== undefined) {
        params.bid = bid;
      }
      if (hash !== undefined) {
        params.hash = hash;
      }     
      if (tx_id !== undefined) {
        params.tx_id = tx_id;
      }
      if (start_time !== undefined) {
        params.start_time = start_time;
      }
      if (end_time !== undefined) {
        params.end_time = end_time;
      }
      if (tx_type !== undefined) {
        params.tx_type = tx_type;
      }
      if (ledger_seq !== undefined) {
        params.ledger_seq = ledger_seq;
      }
      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'query',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

  /**
   * Get transaction cache
   * @param apiSecret - The API secret
   * @param pool_type - The pool type
   * @param domainid - The domain ID
   * @param limit - The limit
   * @param hash - The hash
   * @param address - The address
   * @returns The transaction cache
   *
   */
  async getTransactionCache ({ apiSecret,pool_type, domainid, limit, hash, address }:
    { apiSecret: string, pool_type: number, domainid: string|undefined, limit: number, hash: string|undefined, address: string|undefined }): Promise<string> {
    try {

      const params: Record<string, string | number> = {
        pool_type: pool_type
      };
      if (domainid !== undefined) {
        params.domainid = domainid;
      }
      if (limit !== undefined) {
        params.limit = limit;
      }
      if (hash !== undefined) { 
        params.hash = hash;
      }
      if (address !== undefined) {
        params.address = address;
      }
      
      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'getTransactionCache',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

  /**
   * Query discard transaction data
   * @param apiSecret - The API secret
   * @param hash - The hash
   * @param page - The page
   * @param page_size - The page size
   * @returns The discard transaction data
   */
  async queryDiscard ({ apiSecret,hash, page, page_size }:
    { apiSecret: string, hash: string|undefined, page: number, page_size: number }): Promise<string> {
    try {

      const params: Record<string, string | number> = {
        page: page,
        page_size: page_size
      };
      if (hash !== undefined) {
        params.hash = hash;
      }
      
      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'query/discard',
        params
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }

  /**
   * Get transaction cache size
   * @param apiSecret - The API secret
   * @returns The transaction cache size
   */
  async getTxCacheSize ({ apiSecret }:{ apiSecret: string}): Promise<string> {
    try {
      const responseText = await this.sendQuery({
        apiSecret: apiSecret,
        path: 'getTxCacheSize'
      });
      return responseText;

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Get chain account failed: ${error.message}`);
      }
      throw new Error('Get chain account failed: Unknown error');
    }
  }
}