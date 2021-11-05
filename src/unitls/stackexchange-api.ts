import axios, { AxiosRequestConfig } from 'axios';

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
    if (parameters) {
      parameters.site = 'stackoverflow';
      parameters.key = 'bdFSxniGkNbU3E*jsj*28w((';
      parameters.access_token = localStorage.getItem('token');
    }

    return axios(buildStackOverflowUrl(url, parameters), options).then((response) => response.data);
  },
  getLoggedInUser: () => {
    return stackoverflow.get('me', {}).then((response: any) => response.items[0]);
  },
  post: (url: string, data: unknown) => {
    return axios.post(buildStackOverflowUrl(url), data);
  }
};

export default stackoverflow;
