// src/store/categoryStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category } from '@/types'; // Importe seu tipo Category

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
   deleteCategory: (id: string) => void;
   updateCategory: (category: Category) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [], // Inicia com um array vazio para categorias personalizadas
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      deleteCategory: (id) =>
         set((state) => ({ categories: state.categories.filter((cat) => cat.id !== id) })),
        updateCategory: (updatedCategory) =>
         set((state) => ({
           categories: state.categories.map((cat) =>
             cat.id === updatedCategory.id ? updatedCategory : cat
           ),
         })),
    }),
    {
      name: 'custom-categories-storage', // Nome único para o AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);