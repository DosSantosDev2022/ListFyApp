import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Market } from '@/components/tabs/markets';

interface MarketState {
  favoriteMarkets: Market[];
  addFavoriteMarket: (market: Market) => void;
  removeFavoriteMarkets: (ids: string[]) => void;
  // Opcional: Para resetar o store para testes ou logout
  clearFavoriteMarkets: () => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      favoriteMarkets: [], // Estado inicial vazio

      addFavoriteMarket: (market) => {
        set((state) => {
          // Verifica se o mercado já existe para evitar duplicatas
          if (state.favoriteMarkets.some((m) => m.id === market.id)) {
            return state; // Não faz nada se já existir
          }
          return { favoriteMarkets: [...state.favoriteMarkets, market] };
        });
      },

      removeFavoriteMarkets: (ids) => {
        set((state) => ({
          favoriteMarkets: state.favoriteMarkets.filter(
            (market) => !ids.includes(market.id)
          ),
        }));
      },

      clearFavoriteMarkets: () => set({ favoriteMarkets: [] }),
    }),
    {
      name: 'favorite-markets-storage', // Nome único para o item no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Usar AsyncStorage como storage
    }
  )
);