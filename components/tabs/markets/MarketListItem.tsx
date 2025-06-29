import type React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Market {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface MarketListItemProps {
  item: Market;
  isSelected: boolean; // Nova prop para o estado de seleção
  onToggleSelect: (id: string) => void; // Nova prop para alternar seleção
}

const MarketListItem: React.FC<MarketListItemProps> = ({ item, isSelected, onToggleSelect }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center p-3 my-1 bg-secondary/50 rounded-lg border border-border"
      onPress={() => onToggleSelect(item.id)} // Adiciona a função de alternar seleção
      activeOpacity={0.7} // Feedback visual ao tocar
    >
      {/* Ícone de seleção (checkbox) */}
      <MaterialCommunityIcons
        name={isSelected ? "checkbox-marked-outline" : "checkbox-blank-outline"}
        size={24}
        color={isSelected ? "green" : "white"} // Cor diferente para selecionado
        className="mr-3"
      />

      {/* Conteúdo do mercado */}
      <View className="flex-1 flex-shrink pr-2">
        <Text className="text-foreground text-lg font-medium">
          {item.name}
        </Text>
        <Text className="text-muted-foreground text-sm" numberOfLines={1} ellipsizeMode="tail">
          {item.address}
        </Text>
      </View>

      {/* Não há mais botão de lixeira aqui */}
    </TouchableOpacity>
  );
};

export { MarketListItem }; // Usar export default para facilitar importação