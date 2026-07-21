import { create } from 'zustand';
import type { User } from '@/lib/api';
type State = { user: User | null; ready: boolean; setUser: (user: User | null) => void; setReady: () => void };
export const useAuthStore = create<State>((set) => ({ user: null, ready: false, setUser: user => set({user}), setReady: () => set({ready:true}) }));
