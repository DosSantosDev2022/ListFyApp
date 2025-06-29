import type React from "react";

export type Category = {
  id: string;               // UUID para identificar a categoria
  name: string;             // Nome da categoria (ex: "Hortifruti", "Limpeza")
  isPadrao: boolean;        // Se é uma categoria padrão do app ou criada pelo usuário
};


export type PurchaseItem = {
  id: string // UUID para identificar o item
  name: string // Nome o produto (ex: "Arroz")
  amount: number //   Quantidade (ex: 2)
  unit?: string // Opcional: unidade (ex: "kg", "un", "pacote")
  unitvalue?: number // Opcional: valor em R$ por unidade (pode ser add depois)
  totalValueItem?: number // Calculado: amount * unitvalue
  categoryId?: string // ID da categoria do item
  lastPricePaid?: string // Último preço pago por este item
  lastMarketId?: string // ID do mercado onde foi comprado pela última vez
  category?: Category // Categoria do item
}

export type ShoppingList = {
  id: string;               // UUID para identificar a lista
  name: string;             // Nome da lista (ex: "Compras do Mês - Junho")
  dateCreation: string;      // Data de criação da lista (ISO string)
  ExpectedPurchaseDate?: string; // Opcional: Data prevista para a compra
  marketId?: string;       // Opcional: ID do supermercado vinculado
  marketName?: string; // Opcional: Nome do supermercado vinculado
  TotalExpectedValue?: number; // Calculado: soma dos valorTotalItem dos itens
  items: PurchaseItem[];      // Array de itens na lista
  status: 'Todos' | 'Pendente' | 'Arquivado' | 'Concluída'; // Status da lista
}



export type Supermarket = {
  id: string;               // UUID
  name: string;             // Nome do supermercado
  address?: string;        // Endereço completo
  latitude?: number;        // Coordenadas para Google Maps
  longitude?: number;       // Coordenadas para Google Maps
  googleMapsId?: string;    // ID do lugar no Google Maps (para integração futura)
};

export interface Prediction {
  description: string;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{ offset: number; length: number }>;
    secondary_text_matched_substrings?: Array<{ offset: number; length: number }>;
  };
  terms: Array<{ offset: number; value: string }>;
  types: string[];
  matched_substrings?: Array<{ offset: number; length: number }>;
}

export interface Market {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface MarketSearchModalContentProps {
  Maps_API_KEY: string | undefined;
  onMarketSelected: (market: Market) => void;
  currentLocation: { latitude: number; longitude: number } | null;
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number } | null>>;
}
