import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { Template, CreateTemplateRequest, ApiResponse } from '@/types/template.types';
import { getApiBaseUrl } from './envConfig';
import { ApiError, NetworkError, createApiError, TimeoutError } from '@/errors/ApiError';
import { API_CONFIG, ERROR_MESSAGES } from '@/constants';

const API_BASE_URL = getApiBaseUrl();

class TemplateApiService {
  private api: AxiosInstance;
  private requestCount = 0;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: API_CONFIG.TIMEOUT,
    });

    this.setupInterceptors();
  }

  /**
   * Setup axios request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - logging and request tracking
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.requestCount++;
        const requestId = `req-${Date.now()}-${this.requestCount}`;

        // Add request ID for tracking
        config.headers['X-Request-ID'] = requestId;

        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - error handling and transformation
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        // Transform axios errors into our custom error types
        const transformedError = this.transformError(error);

        return Promise.reject(transformedError);
      }
    );
  }

  /**
   * Transform axios errors into custom error types
   */
  private transformError(error: AxiosError): ApiError {
    // Network errors (no response received)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new TimeoutError('Request timeout', {
          originalError: error.message,
          url: error.config?.url,
        });
      }
      return new NetworkError(ERROR_MESSAGES.NETWORK_ERROR, {
        originalError: error.message,
        url: error.config?.url,
      });
    }

    // HTTP errors (response received with error status)
    const statusCode = error.response.status;
    const responseData = error.response.data as ApiResponse | undefined;
    const message = responseData?.error || error.message || ERROR_MESSAGES.GENERIC_ERROR;

    return createApiError(statusCode, message, responseData, {
      url: error.config?.url,
      method: error.config?.method,
      statusCode,
    });
  }

  /**
   * Get all templates
   */
  async getTemplates(): Promise<Template[]> {
    try {
      const response = await this.api.get<ApiResponse<Template[]>>(API_CONFIG.ENDPOINTS.TEMPLATES);
      return response.data.data || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.TEMPLATE_FETCH_FAILED);
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(template: CreateTemplateRequest): Promise<Template> {
    try {
      const response = await this.api.post<ApiResponse<Template>>(
        API_CONFIG.ENDPOINTS.TEMPLATES,
        template
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.error || ERROR_MESSAGES.TEMPLATE_CREATE_FAILED);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.TEMPLATE_CREATE_FAILED);
    }
  }

  /**
   * Update an existing template
   */
  async updateTemplate(template: CreateTemplateRequest): Promise<Template> {
    try {
      if (!template.id) {
        throw new ApiError(ERROR_MESSAGES.TEMPLATE_ID_REQUIRED, 400);
      }

      const response = await this.api.post<ApiResponse<Template>>(
        API_CONFIG.ENDPOINTS.TEMPLATES,
        template
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.error || ERROR_MESSAGES.TEMPLATE_UPDATE_FAILED);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.TEMPLATE_UPDATE_FAILED);
    }
  }

  /**
   * Delete a template by ID
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      const response = await this.api.delete<ApiResponse>(API_CONFIG.ENDPOINTS.TEMPLATE_BY_ID(id));

      if (!response.data.success) {
        throw new ApiError(response.data.error || ERROR_MESSAGES.TEMPLATE_DELETE_FAILED);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.TEMPLATE_DELETE_FAILED);
    }
  }
}

export const templateApi = new TemplateApiService();
