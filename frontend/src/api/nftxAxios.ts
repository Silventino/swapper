import axios from 'axios';

const nftxAxios = axios.create({
  baseURL: 'https://api.nftexplorer.app',
  headers: {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiM0lUSU1WSVBBQlBCS0ZUNUszNk5WMlhZWlUzWU5OQUNTWExOR1ZCSjRTSlZJTFpOVlJXWDJIRVNXUSIsInR5cGUiOjEwMCwiaWF0IjoxNjQ1NzMwNTY1LCJleHAiOjE2NDgzMjI1NjV9.va3rOmR7jZbjfKMmTw4ouln92Z6GkCyMD_eP_QzYFus'
  }
});

nftxAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (!error.response) {
      console.log('error', error);
      return Promise.reject(new Error("Couldn't connect to the server."));
    }

    return Promise.reject(new Error(error.response?.data ?? 'Unknown error.'));
  }
);

export default nftxAxios;
