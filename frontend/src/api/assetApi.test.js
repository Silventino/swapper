import assetApi from "./assetApi";
import {YLDY_ASSET} from "../constants";

describe("assetApi", () => {
  it("should fetch one specific asset", async () => {
    const YLDY_ID = "226701642";
    const assetYLDY = await assetApi.getAssetInfo(YLDY_ID);
    expect(assetYLDY.unitname).toBe("YLDY");
  });

  it("should fetch many specific assets", async () => {
    const USDC_ID = "31566704";
    const ARCC_ID = "163650";
    const assets = await assetApi.getManyAssetInfo([USDC_ID, ARCC_ID]);

    expect(assets[0].unitname).toBe("USDC");
    expect(assets[1].unitname).toBe("ARCC");
  });
});
