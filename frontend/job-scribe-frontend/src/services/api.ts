import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  User,
  UserCreate,
  LoginCredentials,
  Token,
  EmailGenerationResponse,
  ResumeUploadResponse
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL = 'http://localhost:8000'; // Adjust based on your backend URL

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/user/register', userData);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<Token> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response: AxiosResponse<Token> = await this.client.post('/user/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  // Resume endpoints
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response: AxiosResponse<ResumeUploadResponse> = await this.client.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Email endpoints
  async generateEmail(jobUrl: string): Promise<EmailGenerationResponse> {
    const response: AxiosResponse<EmailGenerationResponse> = await this.client.post('/email/generate-email', null, {
      params: { url: jobUrl }
    });
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiClient = new ApiClient();