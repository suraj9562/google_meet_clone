import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user_storage',
  encryptionKey: 'some-encryption-key',
});

export const mmkvStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
  },

  getItem: key => {
    const value = storage.get(key);
    return value ?? null;
  },

  removeItem: key => {
    storage.remove(key);
  },
};
