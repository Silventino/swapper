import { AssetInfo } from 'src/components/WalletContextProvider';
import myAxios from './myAxios';

const PREFIX = 'api';
const ROUTE = 'asset';

class AssetApi {
  async getAsset(ids: string[] | number[]) {
    try {
      const res = await myAxios.post<AssetInfo[]>(`/${PREFIX}/${ROUTE}/get`, ids);
      const assets = res.data;
      return assets;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const swapApi = new AssetApi();
export default swapApi;
