import axios, { AxiosRequestConfig } from 'axios';
import { UserType } from '../interfaces/UserType';

function buildStackOverflowUrl(path: string, parameters?: Record<string, string>) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString = parameters && new URLSearchParams(parameters).toString();
  if (queryString) {
    url = url + '?' + decodeURIComponent(queryString);
  }

  return url;
}

type ResponseInUser = {
  items: UserType[];
};

const stackoverflow = {
  get tokens() {
    return {
      site: 'stackoverflow',
      key: 'bdFSxniGkNbU3E*jsj*28w((',
      access_token: localStorage.getItem('token')!
    };
  },
  get: <JSON = unknown>(url: string, parameters?: Record<string, string>, options?: AxiosRequestConfig) => {
    if (parameters) {
      parameters = {
        ...stackoverflow.tokens,
        ...parameters
      };
    }

    return axios.get<JSON>(buildStackOverflowUrl(url, parameters), options).then((response) => response.data);
  },
  getLoggedInUser: () => {
    return stackoverflow.get<ResponseInUser>('me', {}).then((response) => response.items[0]);
  },
  post: <JSON = unknown>(url: string, data: object) => {
    const formData = new FormData();
    const payload = {
      ...stackoverflow.tokens,
      ...data
    };

    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    return axios.post<JSON>(buildStackOverflowUrl(url), formData).then((response) => response.data);
  }
};

export default stackoverflow;
