import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type FetchOptions = {
  body?: unknown;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  method?: AxiosRequestConfig['method'];
  isFormData?: boolean;
};

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
  const isClient = typeof window !== 'undefined';
  const isDev = process.env.NODE_ENV === 'development';

  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API_BASE_URL is not defined in environment variables');
  }

  // Remove barra final da baseUrl se existir
  baseUrl = baseUrl.trim().replace(/\/+$/, '');

  // Garante que o endpoint começa com /
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  // Em desenvolvimento no cliente, usa proxy do Next.js para evitar CORS
  // O proxy está configurado em next.config.ts
  const useProxy = isClient && isDev;
  const url = useProxy
    ? `/api/proxy${normalizedEndpoint}`
    : `${baseUrl}${normalizedEndpoint}`;

  console.log('[API Request]', {
    method: method || (body ? 'POST' : 'GET'),
    url,
    baseUrl: useProxy ? 'via proxy (/api/proxy)' : baseUrl,
    endpoint: normalizedEndpoint,
    usingProxy: useProxy,
  });

  try {
    const response = await axios<T>({
      url: url,
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
