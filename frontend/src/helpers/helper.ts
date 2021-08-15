import { toast } from 'react-toastify';
import CompleteTransaction from 'src/types/CompleteTransaction';
import TransactionReq from 'src/types/TransactionReq';

export const showError = (err: Error | any) => {
  if (err.response?.body?.message) {
    let message = err.response.body.message as string;
    if (message.search('overspend') !== -1) {
      message = 'Insufficient funds in one of the wallets.';
    }
    if (message.search('transaction already in ledger') !== -1) {
      message = 'Transaction already completed.';
    }

    toast(message);
    return;
  }
  toast(err.message);
};

export const showNotification = (msg: string) => {
  toast(msg);
};

export function makeTestID(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function fromCompleteTransaction(t: CompleteTransaction) {
  const newOne: TransactionReq = {
    ...t,
    note: t.note ? JSON.stringify(t.note) : undefined,
    group: t.group ? JSON.stringify(t.group) : undefined,
    blob: t.blob ? JSON.stringify(t.blob) : undefined
  };
  return newOne;
}

export function toCompleteTransaction(t: TransactionReq) {
  const newOne: CompleteTransaction = {
    ...t,
    note: t.note ? new Uint8Array(Object.values(JSON.parse(t.note)) as any) : undefined,
    group: t.group ? Buffer.from(JSON.parse(t.group).data) : undefined,
    blob: t.blob ? new Uint8Array(Object.values(JSON.parse(t.blob)) as any) : undefined
  };

  if (newOne.assetIndex === 0 || newOne.assetIndex === null) {
    newOne.assetIndex = undefined;
  }
  return newOne;
}
