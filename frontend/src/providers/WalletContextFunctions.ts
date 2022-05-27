import CompleteTransaction from '../types/CompleteTransaction';
import algosdk, { TransactionLike } from 'algosdk';
import axios from 'axios';
import { TransactionInfoV2 } from './WalletContextProvider';

export const verifyGroup = async (parentTx: string, transactions: CompleteTransaction[]) => {
  let txgroup = algosdk.assignGroupID(transactions as TransactionLike[]);

  const groupID = txgroup[0].group;
  if (!groupID) {
    throw new Error('Error while verifying the group ID.');
  }

  const res = await axios.get<TransactionInfoV2>(`https://indexer.algoexplorerapi.io/v2/transactions/${parentTx}`);

  const note = atob(res.data?.transaction?.note);
  const registeredGroupID = Buffer.from(JSON.parse(note).data);

  const verified = txgroup.every((item) => item.group?.compare(registeredGroupID) === 0);

  if (!verified) {
    throw new Error('Could not verify the swap. Please do not sign the transactions.');
  }

  return verified;
};
