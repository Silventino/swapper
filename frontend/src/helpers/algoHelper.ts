import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';

export const waitForConfirmation = async function (algodClient: AlgodClient, txID: string, timeout: number) {
  if (algodClient == null || txID == null || timeout < 0) {
    throw new Error('Bad arguments');
  }

  const status = await algodClient.status().do();
  if (status === undefined) {
    throw new Error('Unable to get node status');
  }

  const startround = status['last-round'] + 1;
  let currentround = startround;

  while (currentround < startround + timeout) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txID).do();
    if (pendingInfo !== undefined) {
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        //Got the completed Transaction
        return pendingInfo;
      } else {
        if (pendingInfo['pool-error'] != null && pendingInfo['pool-error'].length > 0) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error('Transaction ' + txID + ' rejected - pool error: ' + pendingInfo['pool-error']);
        }
      }
    }
    await algodClient.statusAfterBlock(currentround).do();
    currentround++;
  }

  throw new Error('Transaction ' + txID + ' not confirmed after ' + timeout + ' rounds!');
};
