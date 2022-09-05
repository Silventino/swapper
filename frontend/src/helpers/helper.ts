import { useState } from 'react';
import { toast } from 'react-toastify';
import { AssetInfo } from 'src/providers/WalletContextProvider';
import CompleteTransaction from 'src/types/CompleteTransaction';
import TransactionReq from 'src/types/TransactionReq';
import { decodeAddress } from 'algosdk';
import { CID } from 'multiformats/cid';
import * as mfsha2 from 'multiformats/hashes/sha2';
import * as digest from 'multiformats/hashes/digest';
import { CIDVersion } from 'multiformats/types/src/cid';
import axios from 'axios';

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

    toast.error(message);
    return;
  }
  toast.error(err.message);
};

export const showNotification = (msg: string) => {
  toast.info(msg);
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
    }
  };

  return [storedValue, setValue];
}

export const ARC3_URL_SUFFIX = '#arc3';

export function resolveProtocol(asset: AssetInfo | null): string {
  if (!asset) return '';
  let url = asset.url;
  let reserveAddr = asset.reserveaddr ?? '';
  if (url.endsWith(ARC3_URL_SUFFIX)) url = url.slice(0, url.length - ARC3_URL_SUFFIX.length);

  let chunks = url.split('://');
  // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
  if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
    // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
    chunks[0] = 'ipfs';
    const cidComponents = chunks[1].split(':');
    if (cidComponents.length !== 5) {
      // give up
      return url;
    }
    const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents;

    // const cidVersionInt = parseInt(cidVersion) as CIDVersion
    if (cidHash.split('}')[0] !== 'sha2-256') {
      return url;
    }
    if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
      return url;
    }
    if (asaField !== 'reserve') {
      return url;
    }
    let cidCodecCode;
    if (cidCodec === 'raw') {
      cidCodecCode = 0x55;
    } else if (cidCodec === 'dag-pb') {
      cidCodecCode = 0x70;
    }

    // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
    const addr = decodeAddress(reserveAddr);
    const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey);

    const cid = CID.create(parseInt(cidVersion) as CIDVersion, cidCodecCode ?? 0, mhdigest);
    chunks[1] = cid.toString() + '/' + chunks[1].split('/').slice(1).join('/');
  }

  // No protocol specified, give up
  if (chunks.length < 2) return url;

  //Switch on the protocol
  switch (chunks[0]) {
    case 'ipfs': //Its ipfs, use the configured gateway
      return `https://ipfs.io/ipfs/${chunks[1]}`;

    case 'https': //Its already http, just return it
      return url;
    // TODO: Future options may include arweave or algorand
  }

  return url;
}

export const getAssetImage = async (asset: AssetInfo | null) => {
  try {
    if (!asset) {
      return 'https://jsvasconcelos.pt/images/Icon/imageNotFound.png';
    }

    let assetUrl = asset.url;

    if (assetUrl?.startsWith('template-ipfs')) {
      const assetDataUrl = resolveProtocol(asset);
      const json = await axios.get<{ image: string }>(assetDataUrl);
      assetUrl = json.data.image;
    }

    if (assetUrl?.startsWith('ipfs://')) {
      const code = assetUrl.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${code}`;
    }

    if (assetUrl?.endsWith('.png') || assetUrl?.endsWith('.jpg') || assetUrl?.endsWith('.jpeg')) {
      return assetUrl;
    }
    if (assetUrl?.startsWith('https') && assetUrl?.indexOf('ipfs') !== -1) {
      return assetUrl;
    } else {
      return `https://assets.algoexplorer.io/asset-logo-${asset.id}.image`;
    }
  } catch {
    return 'https://jsvasconcelos.pt/images/Icon/imageNotFound.png';
  }
};

export const getAssetLabel = (item: AssetInfo) => {
  if (!item) {
    return '';
  }
  if (item.id === 0) {
    return item.assetname;
  }

  return `${item.assetname} (${item.unitname} - ${item.id})`;
};

export const sleep = (x: number) =>
  new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, x);
  });
