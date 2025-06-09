import { create } from 'zustand';
import type { ShoppingList, PurchaseItem } from '@/types/index';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface ListState {
  lists: ShoppingList[]
  addList: (list:Omit<ShoppingList, 'id' | 'dateCreation' | 'items' | 'status' | 'TotalExpectedValue'>) => void
  addItemToList: (listId: string, item: Omit<PurchaseItem, 'id' | 'valueTotalItem'>) => void;
  updateItemInList: (listId: string, itemId: string, updateItem: Partial<PurchaseItem>) => void
  updateListTotal: (listId: string) => void
  updateList: (listId: string, updateList: Partial<ShoppingList>) => void
  removeList:(listId: string) => void
  removeItemFromList: (listId: string, itemId: string) => void
}

export const useListStore = create<ListState>((set,get) => ({
  lists: [],

  addList: (newListData) => {
    const newList : ShoppingList = {
      ...newListData,
      id: uuidv4(),
      dateCreation: new Date().toISOString(),
      items: [],
      status: 'pendente',
      TotalExpectedValue: 0, // inicia com 0
    }
    set((state) => ({lists: [...state.lists, newList]}))
  },

  addItemToList: (listId, newItemData) => {
   let calculatedTotal = 0
   const itemAmount = newItemData.amount || 0
   const itemUnitValue = newItemData.unitvalue || 0
    
   // Se a unidade for 'un', multiplica quantidade * valor unitário
   // caso contrário, considera o valor unitário ja como o total para a quantidade
   if( newItemData.unit === 'un') {
    calculatedTotal = itemAmount * itemUnitValue
   } else {
     // Para kg, lt, pct, etc
     calculatedTotal = itemUnitValue
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
                  // Valores a serem usados no cálculo
                  // Prioriza o valor de 'updatedItemData', senão usa o valor 'item' existente.
                  // Garante que 'undefined' ou 'null' resultem em 0 para o cálculo.
                  const currentAmount = updatedItemData.amount !== undefined ? updatedItemData.amount : item.amount || 0;
                  const currentUnitValue = updatedItemData.unitvalue !== undefined ? updatedItemData.unitvalue : item.unitvalue || 0; // CORRIGIDO: de 'unitvalue' para 'unitValue', e de 'totalValueItem' para 'unitValue' no fallback.

                  return {
                    ...item,
                    ...updatedItemData,
                    totalValueItem: currentAmount * currentUnitValue, // CORRIGIDO: de 'valueTotalItem' para 'totalValueItem'
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
  }
}))