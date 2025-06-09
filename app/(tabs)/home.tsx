import React from "react";
import { View, Text, FlatList } from "react-native";
import { Button } from "@/components/ui";
import { useListStore } from "@/store/listStore";
import type { ShoppingList } from "@/types";
import { ShoppingListItem } from "@/components/tabs";

export default function HomeScreen() {
	const { lists, addList, removeList } = useListStore();

	// Função para adicionar uma nova lista
	const handleAddList = () => {
		const newListName = `Lista de Compra ${lists.length + 1}`;
		addList({ name: newListName });
	};

	// Componente para renderizar cada item da lista (FlatList)
	const renderItem = ({ item }: { item: ShoppingList }) => (
		<ShoppingListItem item={item} onRemove={removeList} />
	);

	return (
		<View className="flex-1 p-4 bg-gray-100">
			<Text className="text-2xl font-bold mb-6 text-center text-primary">
				Minhas Listas de Compras
			</Text>

			{/* Botão para adicionar nova lista */}
			<Button onPress={handleAddList}>
				<Text className="text-primary-foreground">
					Adicionar Nova Lista
				</Text>
			</Button>

			{/* Renderiza as listas */}
			{lists.length === 0 ? (
				<Text className="text-center text-muted mt-8">
					Você ainda não tem listas de compras. Adicione uma!
				</Text>
			) : (
				<FlatList
					data={lists}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					className="mt-6"
				/>
			)}
		</View>
	);
}
