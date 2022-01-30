import axios from 'axios';
import {AccountDetailedInfo} from 'src/providers/WalletContextProvider';

// const SERVER_URL = 'http://localhost:3002';
const SERVER_URL = 'https://api.swapper.tools';

const myAxios = axios.create({
  baseURL: SERVER_URL
});

myAxios.interceptors.response.use(
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

export const getConnectedWallet = () => {
  const myWallet = JSON.parse(localStorage.getItem("selectedAccount") ?? "null") as AccountDetailedInfo | null
  if(!myWallet){
    throw new Error("Please connect your wallet first.")
  }

  console.log("myWallet.address", myWallet.address)
  return myWallet.address;
}

export default myAxios;
