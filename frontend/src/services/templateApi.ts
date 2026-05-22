import axios, { type AxiosInstance } from 'axios';
import type { Template, CreateTemplateRequest, ApiResponse } from '@/types/template.types';
import { getApiBaseUrl } from './envConfig';

const API_BASE_URL = getApiBaseUrl();

class TemplateApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get all templates
   */
  async getTemplates(): Promise<Template[]> {
    const response = await this.api.get<ApiResponse<Template[]>>('/templates');
    return response.data.data || [];
  }

  /**
   * Create a new template
   */
  async createTemplate(template: CreateTemplateRequest): Promise<Template> {
    const response = await this.api.post<ApiResponse<Template>>('/templates', template);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create template');
    }
    return response.data.data;
  }

  /**
   * Update an existing template
   */
  async updateTemplate(template: CreateTemplateRequest): Promise<Template> {
    if (!template.id) {
      throw new Error('Template ID is required for updates');
    }
    const response = await this.api.post<ApiResponse<Template>>('/templates', template);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update template');
    }
    return response.data.data;
  }

  /**
   * Delete a template by ID
   */
  async deleteTemplate(id: string): Promise<void> {
    const response = await this.api.delete<ApiResponse>(`/templates/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete template');
    }
  }
}

export const templateApi = new TemplateApiService();
