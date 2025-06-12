// src/store/listStore.ts (ou onde quer que seu useListStore esteja)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Importe persist e createJSONStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage
import type { ShoppingList, PurchaseItem } from '@/types/index';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface ListState {
  lists: ShoppingList[];
  addList: (list: Omit<ShoppingList, 'id' | 'dateCreation' | 'items' | 'status' | 'TotalExpectedValue'>) => void;
  addItemToList: (listId: string, item: Omit<PurchaseItem, 'id' | 'valueTotalItem'>) => void;
  updateItemInList: (listId: string, itemId: string, updateItem: Partial<PurchaseItem>) => void;
  updateListTotal: (listId: string) => void;
  updateList: (listId: string, updateList: Partial<ShoppingList>) => void;
  removeList: (listId: string) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  renameList: (listId: string, newName: string) => void;
  archieList: (listId: string) => void;
}

export const useListStore = create<ListState>()( // O persist middleware envolve a definição do store
  persist(
    (set, get) => ({
      lists: [],

      addList: (newListData) => {
        const newList: ShoppingList = {
          ...newListData,
          id: uuidv4(),
          dateCreation: new Date().toISOString(),
          items: [],
          status: 'Pendente',
          TotalExpectedValue: 0, // inicia com 0
        };
        set((state) => ({ lists: [...state.lists, newList] }));
      },

      addItemToList: (listId, newItemData) => {
        let calculatedTotal = 0;
        const itemAmount = newItemData.amount || 0;
        const itemUnitValue = newItemData.unitvalue || 0;

        // Se a unidade for 'un', multiplica quantidade * valor unitário
        // caso contrário, considera o valor unitário ja como o total para a quantidade
        if (newItemData.unit === 'un') {
          calculatedTotal = itemAmount * itemUnitValue;
        } else {
          // Para kg, lt, pct, etc
          calculatedTotal = itemUnitValue;
        }

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: [
                    ...list.items,
                    {
                      id: uuidv4(),
                      totalValueItem: calculatedTotal,
                      ...newItemData,
                    },
                  ],
                }
              : list
          ),
        }));
        // Re-calcular o valor total da lista após adicionar um item
        get().updateListTotal(listId);
      },

      updateItemInList: (listId, itemId, updatedItemData) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) => {
                    if (item.id === itemId) {
                      const currentAmount = updatedItemData.amount !== undefined ? updatedItemData.amount : item.amount || 0;
                      const currentUnitValue = updatedItemData.unitvalue !== undefined ? updatedItemData.unitvalue : item.unitvalue || 0;

                      return {
                        ...item,
                        ...updatedItemData,
                        totalValueItem: currentAmount * currentUnitValue,
                      };
                    }
                    return item;
                  }),
                }
              : list
          ),
        }));
        get().updateListTotal(listId);
      },

      updateList: (listId, updatedListData) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, ...updatedListData } : list
          ),
        }));
      },

      removeList: (listId) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
        }));
      },

      removeItemFromList: (listId, itemId) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                }
              : list
          ),
        }));
        // Re-calcular o valor total da lista após remover um item
        get().updateListTotal(listId);
      },

      renameList: (listId: string, newName: string) => {
        get().updateList(listId, { name: newName });
      },

      // Função auxiliar para recalcular o valor total de uma lista
      updateListTotal: (listId: string) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id === listId) {
              const calculatedTotalExpected = list.items.reduce((sum, item) => sum + (item.totalValueItem || 0), 0);
              return { ...list, TotalExpectedValue: calculatedTotalExpected };
            }
            return list;
          }),
        }));
      },

      archieList: (listId: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, status: 'Arquivado' } // Altera o status para 'arquivado'
              : list
          ),
        }));
      },
    }),
    {
      name: 'shopping-lists-storage', // Nome único para o armazenamento das listas
      storage: createJSONStorage(() => AsyncStorage), // Usar AsyncStorage para persistência
    }
  )
);