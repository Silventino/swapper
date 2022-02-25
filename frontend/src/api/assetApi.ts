import { ALGO_ASSET } from 'src/constants';
import { AssetInfo } from 'src/providers/WalletContextProvider';
import myAxios from './myAxios';
import nftxAxios from './nftxAxios';

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

  async getAssetInfo(assetId: string | number) {
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

  // async checkIsVerifiedNft(assetId: string | number) {
  //   try {
  //     const res = await myAxios.post<boolean>(`/${PREFIX}/${ROUTE}/checkIsVerifiedNft`, { assetId });
  //     return res.data;
  //   } catch (err) {
  //     console.log('err', err);
  //     throw err;
  //   }
  // }

  async checkIsVerifiedNftOfficial(assetId: string | number) {
    try {
      if (assetId === ALGO_ASSET.id) {
        return {
          verified: false,
          collection: {
            url: '',
            name: '',
            artistName: ''
          }
        } as ResCheckVerification;
      }

      const res = await nftxAxios.get<ResCheckVerification>(`/v1/assets/verified`, { params: { assetId } });
      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }

      return res.data;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }
}

type ResCheckVerification = {
  verified: boolean;
  collection: {
    url: string;
    name: string;
    artistName: string;
  };
  error?: string;
};

const swapApi = new AssetApi();
export default swapApi;
