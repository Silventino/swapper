import { getRepository, In } from 'typeorm';
import Asset from '../db/entity/Asset';
import axios from 'axios';
import puppeteer from 'puppeteer';
import moment from 'moment';

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

  async checkIsVerifiedNft(assetId: string) {
    const assetModel = getRepository(Asset);
    const asset = await assetModel.findOne({ where: { id: assetId } });
    if (!asset) {
      return false;
    }
    const verificationTime = moment(asset.verifiedNftTime, 'YYYYMMDD');
    const today = moment();
    if (verificationTime.isValid() && Math.abs(verificationTime.diff(today, 'days')) < 15) {
      return asset.verifiedNft ?? false;
    }

    const res = await this.checkIsVerifiedNftPuppeteer(assetId);
    await assetModel.update({ id: asset.id }, { verifiedNft: res, verifiedNftTime: today.format('YYYYMMDD') });
    return res;
  }

  async checkIsVerifiedNftPuppeteer(assetId: string) {
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.goto('https://www.nftexplorer.app/asset/' + assetId, { waitUntil: 'networkidle2' });

      await page.waitForSelector('div[class="display-6"]', { timeout: 5000 });

      // page.on('console', async (msg) => {
      //     const msgArgs = msg.args();
      //     for (let i = 0; i < msgArgs.length; ++i) {
      //         console.log(await msgArgs[i].jsonValue());
      //     }
      // });

      const result = await page.evaluate(() => {
        // @ts-ignore
        const verified = document.querySelector(
          'div[title="This creator has been validated by nftexplorer (however, please do your own due diligence, we take no responsibility)"]'
        );
        if (!verified) {
          return false;
        }
        return true;
      });

      browser.close();
      return result;
    } catch (err) {
      browser.close();
      return false;
    }
  }
}
