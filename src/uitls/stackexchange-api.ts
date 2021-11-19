import axios, { AxiosRequestConfig } from 'axios';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { UserType } from '../interfaces/UserType';

function buildStackOverflowUrl(path: string, parameters?: Record<string, string>) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString = parameters && new URLSearchParams(parameters).toString();
  if (queryString) {
    url = url + '?' + decodeURIComponent(queryString);
  }

  return url;
}

type StackOverflowResponse<T> = {
  items: T[];
  total: number;
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
};

const stackoverflow = {
  get tokens() {
    return {
      site: 'stackoverflow',
      key: 'bdFSxniGkNbU3E*jsj*28w((',
      access_token: localStorage.getItem('token')!
    };
  },
  get: <JSON = unknown>(url: string, parameters: Record<string, string> = {}, options?: AxiosRequestConfig) => {
    if (parameters) {
      parameters = {
        ...stackoverflow.tokens,
        ...parameters
      };
    }

    if (parameters.token) {
      parameters = {
        ...parameters,
        access_token: parameters.token
      };

      delete parameters.token;
    }

    return axios
      .get<StackOverflowResponse<JSON>>(buildStackOverflowUrl(url, parameters), options)
      .then((response) => response.data);
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

    return axios
      .post<StackOverflowResponse<JSON>>(buildStackOverflowUrl(url), formData)
      .then((response) => response.data);
  },

  // Aliases
  // =======

  // Used only on Main
  getLoggedInUser: (token: string): Promise<UserType> => {
    return stackoverflow.get<UserType>('me', { token }).then((response) => response.items[0]);
  },

  // Used only on Main
  getSidebarCounts: async (userId: number, token: string): Promise<SidebarCountsType> => {
    const bookmarkCountResponse = await stackoverflow.get('me/favorites', { token, filter: 'total' });
    const questionCountResponse = await stackoverflow.get('me/questions', { token, filter: 'total' });
    const answerCountResponse = await stackoverflow.get('me/answers', { token, filter: 'total' });
    const tagCountResponse = await stackoverflow.get('me/tag-preferences', { token });

    return {
      bookmarks: bookmarkCountResponse.total,
      questions: questionCountResponse.total,
      answers: answerCountResponse.total,
      tags: tagCountResponse.items.length
    };
  }
};

export default stackoverflow;
