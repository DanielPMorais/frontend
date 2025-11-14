import useStoreUser from '@/hooks/use-store-user';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseUrl) {
  throw new Error('API_BASE_URL is not defined in environment variables');
}

export const apiClient = axios.create({
  baseURL: baseUrl,
});

type FetchOptions = {
  body?: unknown;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  method?: AxiosRequestConfig['method'];
  isFormData?: boolean;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');

      const { resetStore } = useStoreUser.getState();
      resetStore();

      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 5000);
    } else if (error.response && error.response.status === 403) {
      console.warn(
        'Interceptador: Acesso proibido (403). O usuário está logado, mas não tem permissão.',
      );
    }
    return Promise.reject(error);
  },
);

export const apiRequest = async <T>(
  endpoint: string,
  {
    body,
    withCredentials,
    headers,
    method,
    isFormData = false,
  }: FetchOptions = {},
): Promise<T> => {
  const devMode = process.env.NEXT_PUBLIC_DEVELOPMENT === 'true';

  try {
    const response = await apiClient<T>({
      url: endpoint,
      method: method || (body ? 'POST' : 'GET'),
      data: body,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      withCredentials: devMode ? false : (withCredentials ?? true),
    });

    return response.data;
  } catch (error: unknown) {
    // Trata erros do Axios especificamente
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const statusText = axiosError.response?.statusText;
      const data = axiosError.response?.data;
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String(data.message)
          : axiosError.message || 'Erro na requisição';

      // Para erros 401 (não autorizado), não logar como erro crítico
      // pois podem ser esperados quando o usuário não está autenticado
      const isUnauthorized = status === 401;

      if (isUnauthorized) {
        console.warn('[API Warning - Unauthorized]', {
          url,
          message: 'Requisição requer autenticação',
        });
      } else {
        console.error('[API Error]', {
          status,
          statusText,
          message,
          url,
          method: method || (body ? 'POST' : 'GET'),
          data,
          code: axiosError.code,
          request: axiosError.request ? 'Request made' : 'No request',
        });
      }

      // Cria um erro mais descritivo mantendo a estrutura do AxiosError
      const enhancedError = new Error(message) as Error & {
        status?: number;
        statusText?: string;
        response?: unknown;
        code?: string;
        isApiError?: boolean;
        isExpected?: boolean;
      };
      enhancedError.status = status;
      enhancedError.statusText = statusText;
      enhancedError.response = data;
      enhancedError.code = axiosError.code;
      enhancedError.isApiError = true;
      // Marca erros 401 como esperados (usuário não autenticado)
      enhancedError.isExpected = isUnauthorized;

      throw enhancedError;
    }

    // Trata outros tipos de erro
    if (error instanceof Error) {
      console.error('[API Error - Generic]', {
        message: error.message,
        url,
        error,
      });
      const genericError = error as Error & {
        isApiError?: boolean;
      };
      genericError.isApiError = true;
      throw genericError;
    }

    console.error('[API Error - Unknown]', { error, url });
    const unknownError = new Error('Erro inesperado na requisição') as Error & {
      isApiError?: boolean;
    };
    unknownError.isApiError = true;
    throw unknownError;
  }
};
