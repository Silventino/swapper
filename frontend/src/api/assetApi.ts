import {AssetInfo} from 'src/providers/WalletContextProvider';
import myAxios from './myAxios';

const PREFIX = 'api';
const ROUTE = 'asset';

class AssetApi {
  async getManyAssetInfo(ids: string[] | number[]) {
    try {
      const res = await myAxios.post<AssetInfo[]>(`/${PREFIX}/${ROUTE}/get`, ids);
      const assets = res.data;
      return assets;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAssetInfo(assetId: string | number){
    try {
      const data = await this.getManyAssetInfo([assetId] as any);
      if (data.length === 0) {
        throw new Error('Asset not found.');
      }
      return data[0];
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }
}

const swapApi = new AssetApi();
export default swapApi;
