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
    console.log('ALOU CHEGUEI!', error);
    if (!error.response) {
      // console.log('Não foi possível conectar com servidor.');
      return Promise.reject(
        new Error('Não foi possível estabelecer a conexão com o servidor. \nPor favor, entre em contato com o suporte.')
      );
    }

    return Promise.reject(new Error(error.response?.data ?? 'Unknown error.'));
  }
);

export default myAxios;
