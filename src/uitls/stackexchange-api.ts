import axios, { AxiosRequestConfig } from 'axios';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { UserType } from '../interfaces/UserType';
import { isRenderer } from './is-renderer';

function buildStackOverflowUrl(path: string, parameters?: any) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString =
    parameters &&
    Object.keys(parameters)
      .map(function (key) {
        const value = parameters[key];
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

  if (queryString) {
    url = url + '?' + queryString;
  }

  return url;
}

const stackoverflow = {
  get: (url: string, parameters?: any, options?: AxiosRequestConfig) => {
    const token = isRenderer() ? localStorage.getItem('token') : parameters.token;

    // TODO refactor this
    if (parameters) {
      parameters.site = 'stackoverflow';
      parameters.key = 'bdFSxniGkNbU3E*jsj*28w((';
      parameters.access_token = token;
    }

    return axios(buildStackOverflowUrl(url, parameters), options).then((response) => response.data);
  },
  post: (url: string, data: object) => {
    const formData = new FormData();
    const payload: any = {
      site: 'stackoverflow',
      key: 'bdFSxniGkNbU3E*jsj*28w((',
      access_token: localStorage.getItem('token'),
      ...data
    };

    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    return axios.post(buildStackOverflowUrl(url), formData).then((response) => response.data);
  },

  // Aliases
  // =======

  // Used only on Main
  getLoggedInUser: (token: string): Promise<UserType> => {
    return stackoverflow.get('me', { token }).then((response: any) => response.items[0]);
  },

  // Used only on Main
  getSidebarCounts: async (userId: number, token: string): Promise<SidebarCountsType> => {
    const bookmarkCountResponse: any = await stackoverflow.get('me/favorites', { token, filter: 'total' });
    const questionCountResponse: any = await stackoverflow.get('me/questions', { token, filter: 'total' });
    const answerCountResponse: any = await stackoverflow.get('me/answers', { token, filter: 'total' });
    const tagCountResponse: any = await stackoverflow.get('me/tag-preferences', { token });

    return {
      bookmarks: bookmarkCountResponse.total,
      questions: questionCountResponse.total,
      answers: answerCountResponse.total,
      tags: tagCountResponse.items.length
    };
  }
};

export default stackoverflow;
