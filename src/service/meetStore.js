import {create} from 'zustand';
import {createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useMeetStorage = create()((set, get) => ({}), {
  name: 'live-meet-storage',
  storage: createJSONStorage(() => mmkvStorage),
});
