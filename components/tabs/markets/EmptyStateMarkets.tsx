import type React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyStateMarkets: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <MaterialCommunityIcons
        name="store-search-outline"
        size={80}
        color="gray"
      />
      <Text className="text-muted-foreground text-lg mt-4 text-center">
        Nenhum mercado favoritado ainda. {"\n"} Clique em
        "Adicionar Novo Mercado" para começar!
      </Text>
    </View>
  );
};

export { EmptyStateMarkets };