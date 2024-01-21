/**
 * DO NOT change anything under ./autogen
 * Customize your API configs HERE
 */
import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
import { message } from 'antd';

import { Configuration, FeReportApi, UserApi } from './autogen';

const baseApiUrl = `${window.location.protocol}//${window.location.host}`;

export const urlGenerator = (rootPath: string) => {
  return `${baseApiUrl}${rootPath}`;
};

const configGenerator = (url: string) =>
  new Configuration({
    basePath: url,
    baseOptions: {
      // axios 配置在这儿
      withCredentials: true,
    },
  });

// url for different services
// IMPORTANT: remember to add new URL paths to proxy settings in vite.config.ts!
// axios config for app size config apis
const url = urlGenerator('');
const appConfig = configGenerator(url);

// axios config for monkey test apis
export const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(config => {
  const url = config.url?.replaceAll('+', '%2B');
  config.url = url;
  return config;
});

export const getHeaderAuthorization = (): string | undefined => {
  const accessToken = localStorage.getItem('access_token');

  return accessToken ? 'Bearer ' + accessToken : undefined;
};

axiosInstance.interceptors.request.use(config => {
  const authorization = getHeaderAuthorization();

  if (authorization) {
    config.headers.authorization = authorization;
  }
  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing: boolean = false;
const queue: PendingTask[] = [];
// global request error hint
axiosInstance.interceptors.response.use(
  response => {
    if (response.data.message) {
      const origin = window.location.origin;
      const path = response.config.url?.split('?')[0] || '';
      const pathName = path.replace(origin, '');
      message.error(`${pathName}: ${response.data.message}`);
      return Promise.reject(response.data.message);
    }
    return response;
  },
  async error => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const { config } = error.response;

    if (refreshing) {
      return new Promise(resolve => {
        queue.push({
          config,
          resolve,
        });
      });
    }
    if (error?.response?.status === HttpStatusCode.Unauthorized) {
      if (!config?.url.includes('/user/admin/refresh')) {
        const res = await refreshToken();

        refreshing = false;

        if (res.status === HttpStatusCode.Ok) {
          queue.forEach(({ config, resolve }) => {
            resolve(axiosInstance(config));
          });

          return axiosInstance(config);
        } else {
          message.error(res.data?.message);

          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      }
    }
    if (error?.response?.status >= HttpStatusCode.InternalServerError) {
      message.error('Network error');
    } else if (error.response?.data?.message) {
      message.error(error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token') || '';
  const res = await userApiInterface.userControllerAdminRefresh(refresh_token);

  localStorage.setItem('access_token', res.data.data?.accessToken || '');
  localStorage.setItem('refresh_token', res.data.data?.refreshToken || '');
  return res;
}

/**
 * import these API instances in your components to use the API methods
 */
export const feReportApiInterface = new FeReportApi(appConfig, undefined, axiosInstance);

export const userApiInterface = new UserApi(appConfig, undefined, axiosInstance);
