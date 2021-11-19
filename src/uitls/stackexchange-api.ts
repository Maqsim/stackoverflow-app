import axios, { AxiosRequestConfig } from 'axios';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { UserType } from '../interfaces/UserType';
import { isRenderer } from './is-renderer';

type ParametersType = Record<string, string | number>;

function buildStackOverflowUrl(path: string, parameters?: ParametersType) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString = parameters && new URLSearchParams(parameters as any).toString();
  if (queryString) {
    url = url + '?' + decodeURIComponent(queryString);
  }

  return url;
}

type StackoverflowResponse<T> = {
  items: T[];
  total: number;
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
};

class StackoverflowApi {
  private tokens: {
    site: string;
    key: string;
    access_token: string;
  };

  constructor(token?: string) {
    this.tokens = {
      site: 'stackoverflow',
      key: 'bdFSxniGkNbU3E*jsj*28w((',
      access_token: isRenderer() ? localStorage.getItem('token')! : token!
    };
  }

  async get<JSON = unknown>(
    url: string,
    parameters?: ParametersType,
    options?: AxiosRequestConfig
  ): Promise<StackoverflowResponse<JSON>> {
    if (parameters) {
      parameters = {
        ...this.tokens,
        ...parameters
      };
    }

    return axios
      .get<StackoverflowResponse<JSON>>(buildStackOverflowUrl(url, parameters), options)
      .then((response) => response.data);
  }

  async post<JSON = unknown>(url: string, data: object): Promise<StackoverflowResponse<JSON>> {
    const formData = new FormData();
    const payload = {
      ...this.tokens,
      ...data
    };

    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    return axios
      .post<StackoverflowResponse<JSON>>(buildStackOverflowUrl(url), formData)
      .then((response) => response.data);
  }

  async getLoggedInUser(): Promise<UserType> {
    return this.get<UserType>('me', {}).then((response) => response.items[0]);
  }

  async getSidebarCounts(): Promise<SidebarCountsType> {
    const bookmarkCountResponse = await this.get('me/favorites', { filter: 'total' });
    const questionCountResponse = await this.get('me/questions', { filter: 'total' });
    const answerCountResponse = await this.get('me/answers', { filter: 'total' });
    const tagCountResponse = await this.get('me/tag-preferences', {});

    return {
      bookmarks: bookmarkCountResponse.total,
      questions: questionCountResponse.total,
      answers: answerCountResponse.total,
      tags: tagCountResponse.items.length
    };
  }
}

const stackoverflow = new StackoverflowApi();
export { stackoverflow };
export default StackoverflowApi;
