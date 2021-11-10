import { getRepository, In } from 'typeorm';
import Asset from '../db/entity/Asset';
import axios from 'axios';

export default class AssetService {
  async getAssetInfo(assetId: string | number) {
    try {
      const res = await axios.get<Asset>(`https://algoexplorerapi.io/v1/asset/${assetId}`);
      return res.data;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }

  async getMany(ids: number[]) {
    const assetModel = getRepository(Asset);
    const assets = await assetModel.find({ where: { id: In(ids) } });

    for (let i = 0; i < ids.length; i++) {
      try {
        const id = ids[i];
        const found = assets.some((item) => item.id === id);
        if (!found) {
          const newAsset = await this.getAssetInfo(id);
          assets.push(newAsset);
          await assetModel.insert(newAsset);
        }
      } catch (err) {}
    }

    return assets;
  }

  async getOne(codigo: number) {
    const asset = await this.getMany([codigo]);
    if (!asset.length) {
      return undefined;
    }
    return asset[0];
  }
}
