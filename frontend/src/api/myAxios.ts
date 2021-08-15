import axios from 'axios';

const SERVER_URL = 'http://localhost:3002';

const myAxios = axios.create({
  baseURL: SERVER_URL
});

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (!error.response) {
      // console.log('Não foi possível conectar com servidor.');
      return Promise.reject(new Error("Couldn't connect to the server."));
    }

    return Promise.reject(new Error(error.response?.data ?? 'Unknown error.'));
  }
);

export default myAxios;
