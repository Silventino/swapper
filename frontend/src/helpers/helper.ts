import { useState } from 'react';
import { toast } from 'react-toastify';
import { AssetInfo } from 'src/components/WalletContextProvider';
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
    if (message.search('txn dead') !== -1) {
      message = 'This swap is not valid anymore because you took too long to complete it 😔 Please create a new one.';
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

export function useLocalStorage<T>(key: string, initialValue: T): [T, (obj: T) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export const getAssetImage = (asset: AssetInfo | null) => {
  if (!asset) {
    return 'https://jsvasconcelos.pt/images/Icon/imageNotFound.png';
  }
  if (asset.url?.startsWith('ipfs://')) {
    const code = asset.url.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${code}`;
  }

  if (asset.url?.endsWith('.png') || asset.url?.endsWith('.jpg') || asset.url?.endsWith('.jpeg')) {
    return asset.url;
  }
  if (asset.url?.startsWith('https://ipfs.io/') || asset.url?.startsWith('https://gateway.pinata.cloud/ipfs/')) {
    return asset.url;
  } else {
    return `https://algoexplorer.io/images/assets/big/light/${asset.id}.png`;
  }
};
