import axios, { AxiosRequestConfig } from 'axios';
import { SidebarCountsType } from '../interfaces/SidebarCountsType';
import { UserType } from '../interfaces/UserType';
import { isRenderer } from './is-renderer';
import { defaults } from 'lodash';

function buildStackOverflowUrl(path: string, params?: any) {
  let url = `https://api.stackexchange.com/2.3/${path}`;

  const queryString = new URLSearchParams(params);

  if (queryString) {
    url = url + '?' + queryString;
  }

  return url;
}

const stackoverflow = {
  get: (url: string, params?: any, options?: AxiosRequestConfig, includeSite = true) => {
    const token = isRenderer() ? localStorage.getItem('token') : params.token;

    const _params = defaults(params, {
      key: 'bdFSxniGkNbU3E*jsj*28w((',
      access_token: token
    });

    if (includeSite) {
      _params.site = 'stackoverflow';
    }

    return axios(buildStackOverflowUrl(url, _params), options).then((response) => response.data);
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
    return stackoverflow
      .get('me', {
        token,
        filter: '!0Z-LvgkK6tuZ6JSTI64262DuR'
      })
      .then((response: any) => response.items[0]);
  },

  // Used only on Main
  getSidebarCounts: async (userId: number, token: string): Promise<Pick<SidebarCountsType, 'bookmarks' | 'tags'>> => {
    const bookmarkCountResponse: any = await stackoverflow.get('me/favorites', { token, filter: 'total' });
    const tagCountResponse: any = await stackoverflow.get('me/tag-preferences', { token });

    return {
      bookmarks: bookmarkCountResponse.total,
      tags: tagCountResponse.items.length
    };
  }
};

export default stackoverflow;
