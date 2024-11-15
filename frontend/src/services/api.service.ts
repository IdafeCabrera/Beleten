// frontend/src/services/api.service.ts

// Interfaces
interface ApiConfig {
  baseURL: string;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Config
const getApiConfig = (): ApiConfig => {
  return {
    baseURL: '/api'
  };
};

class ApiService {
  private static instance: ApiService;
  private readonly config: ApiConfig;
  private controller: AbortController | null = null;

  private constructor() {
    this.config = getApiConfig();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${normalizedEndpoint}`;
  }

  private createError(message: string, status?: number, data?: any): ApiError {
    const error: ApiError = new Error(message);
    error.status = status;
    error.data = data;
    return error;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error en la respuesta del servidor'
      }));
      
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData
      });
      
      throw this.createError(
        errorData.message || `Error HTTP: ${response.status}`,
        response.status,
        errorData
      );
    }
  
    try {
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw this.createError('Error al procesar la respuesta', 500);
    }
  }
  

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Aquí puedes agregar headers adicionales como autenticación
    // const token = localStorage.getItem('token');
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }

    return headers;
  }

  public cancelRequest() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(this.buildUrl(endpoint), window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, value.toString());
          }
        });
      }
  
      console.log('Fetching:', url.toString());
      
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: this.controller.signal,
        credentials: 'include'
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('Solicitud cancelada', 499);
        }
        throw this.createError(error.message);
      }
      throw this.createError('Error desconocido');
    }
  }

  public async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: this.controller.signal,
        credentials: 'include'
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('Solicitud cancelada', 499);
        }
        throw this.createError(error.message);
      }
      throw this.createError('Error desconocido');
    }
  }

  public async delete<T = void>(endpoint: string): Promise<T> {
    try {
      this.controller = new AbortController();

      const response = await fetch(this.buildUrl(endpoint), {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: this.controller.signal,
        credentials: 'include'
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createError('Solicitud cancelada', 499);
        }
        throw this.createError(error.message);
      }
      throw this.createError('Error desconocido');
    }
  }

  // Método helper para crear una URL con query params
  public createUrlWithParams(endpoint: string, params?: QueryParams): string {
    const url = new URL(this.buildUrl(endpoint), window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }
}

export const apiService = ApiService.getInstance();