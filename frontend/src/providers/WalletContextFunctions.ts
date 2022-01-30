import assetApi from "../api/assetApi";
import CompleteTransaction from "../types/CompleteTransaction";
import algosdk, {TransactionLike} from "algosdk";
import axios from "axios";
import {TESTNET, TransactionInfo} from "./WalletContextProvider";

export const getManyAssetInfo = async (assetIds: string[] | number[]) => {
  try {
    const data = await assetApi.getAsset(assetIds);
    return data;
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};

export const getAssetInfo = async (assetId: string | number) => {
  try {
    const data = await assetApi.getAsset([assetId] as any);
    if (data.length === 0) {
      throw new Error('Asset not found.');
    }
    return data[0];
  } catch (err) {
    console.log('err', err);
    throw err;
  }
}

export const verifyGroup = async (parentTx: string, transactions: CompleteTransaction[]) => {
  let txgroup = algosdk.assignGroupID(transactions as TransactionLike[]);

  const groupID = txgroup[0].group;
  if (!groupID) {
    throw new Error('Error while verifying the group ID.');
  }

  const res = await axios.get<TransactionInfo>(
    TESTNET
      ? `https://testnet.algoexplorerapi.io/v1/transaction/${parentTx}`
      : `https://algoexplorerapi.io/v1/transaction/${parentTx}`
  );

  const note = atob(res.data.noteb64);
  const registeredGroupID = Buffer.from(JSON.parse(note).data);

  const verified = txgroup.every((item) => item.group?.compare(registeredGroupID) === 0);

  if (!verified) {
    throw new Error('Could not verify the swap. Please do not sign the transactions.');
  }

  return verified;
}
