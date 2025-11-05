// API 基础配置
const BASE_URL = 'http://service.picasso.adesk.com/v1/vertical';

// 请求超时时间（毫秒）
const TIMEOUT = 10000;

// 请求头类型
interface RequestHeaders {
    'Content-Type': string;
    'Authorization'?: string;
    [key: string]: string | undefined;
}

// 请求配置类型
interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: RequestHeaders;
    body?: any;
    timeout?: number;
}

// 响应类型
interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
}

// 错误类型
interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

/**
 * 创建请求头
 */
const createHeaders = (customHeaders?: Partial<RequestHeaders>): RequestHeaders => {
    const defaultHeaders: RequestHeaders = {
        'Content-Type': 'application/json',
    };

    return { ...defaultHeaders, ...customHeaders };
};

/**
 * 处理响应
 */
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            message: response.statusText || '请求失败',
            status: response.status,
            data: errorData,
        } as ApiError;
    }

    const data = await response.json().catch(() => null);

    return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    };
};

/**
 * 创建超时 Promise
 */
const createTimeoutPromise = (timeout: number): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`请求超时 (${timeout}ms)`));
        }, timeout);
    });
};

/**
 * 核心请求方法
 */
const request = async <T = any>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
    const {
        method = 'GET',
        headers: customHeaders,
        body,
        timeout = TIMEOUT,
    } = config;

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = createHeaders(customHeaders);

    const requestConfig: RequestInit = {
        method,
        headers,
    };

    if (body && method !== 'GET') {
        requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
        const responsePromise = fetch(url, requestConfig);
        const timeoutPromise = createTimeoutPromise(timeout);

        const response = await Promise.race([responsePromise, timeoutPromise]);
        return await handleResponse<T>(response);
    } catch (error) {
        if (error instanceof Error) {
            throw {
                message: error.message,
                data: null,
            } as ApiError;
        }
        throw error;
    }
};

/**
 * GET 请求
 */
export const get = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) => {
    return request<T>(endpoint, { ...config, method: 'GET' });
};

/**
 * POST 请求
 */
export const post = <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
) => {
    return request<T>(endpoint, { ...config, method: 'POST', body: data });
};

/**
 * PUT 请求
 */
export const put = <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
) => {
    return request<T>(endpoint, { ...config, method: 'PUT', body: data });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) => {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
};

/**
 * PATCH 请求
 */
export const patch = <T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
) => {
    return request<T>(endpoint, { ...config, method: 'PATCH', body: data });
};

/**
 * 设置认证 token
 */
export const setAuthToken = (token: string) => {
    // 这里可以设置全局的认证 token
    // 例如存储在 AsyncStorage 中，或者在每次请求时添加到 headers
};

/**
 * 清除认证 token
 */
export const clearAuthToken = () => {
    // 清除认证 token
};

// 导出类型
export type { ApiError, ApiResponse, RequestConfig, RequestHeaders };

// 导出基础 URL（如果需要的话）
    export { BASE_URL };

