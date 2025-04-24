import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

// Create a class for the API client
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for adding auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling errors and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Get the refresh token
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
              // Redirect to login if no refresh token
              this.logout();
              return Promise.reject(error);
            }

            // Call refresh token endpoint
            const response = await axios.post(
              `${API_BASE_URL}/api/users/refresh-token`,
              {
                refresh_token: refreshToken,
              }
            );

            // Save new tokens
            const { access_token, refresh_token } = response.data;
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            // Update the header and retry the request
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Token refresh failed, logout the user
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Method to handle GET requests
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config
    );
    return response.data;
  }

  // Method to handle POST requests
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  // Method to handle PUT requests
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  // Method to handle DELETE requests
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config
    );
    return response.data;
  }

  // Method to handle the logout
  public logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to login page
    window.location.href = "/auth/login";
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
