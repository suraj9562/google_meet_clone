import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useUserStorage = create()(
  persist((set, get) => ({}), {
    name: 'user-storage',
    storage: createJSONStorage(() => mmkvStorage),
  }),
);
