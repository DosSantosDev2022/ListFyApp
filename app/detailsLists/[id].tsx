import { useLocalSearchParams, Stack } from "expo-router";
import {
	View,
	Text,
	FlatList,
	Alert,
	Platform,
	KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useListStore } from "@/store/listStore";
import type { PurchaseItem } from "@/types";
import {
	AddItemForm,
	EditItemModal,
	PurchaseItemCard,
} from "@/components/tabs";
import { totalTabBarEffectiveHeight } from "../_layout";
import { useToast } from "@/components/ui/toast";

export default function ListDetailsScreen() {
	const { id } = useLocalSearchParams();
	const listId = typeof id === "string" ? id : undefined;

	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState<PurchaseItem | null>(
		null,
	);

	const {
		lists,
		addItemToList,
		updateItemInList,
		removeItemFromList,
	} = useListStore();
	const toast = useToast();

	const list = lists.find((l) => l.id === listId);

	// Funções adicionar item de lista
	const handleAddItem = (
		newItemData: Omit<PurchaseItem, "id" | "totalValueItem">,
	) => {
		if (!listId) {
			toast.showToast('ID da lista inválido. !', 'destructive')
			return;
		}
		addItemToList(listId, newItemData);
		toast.showToast('Item adicionado com sucesso !', 'success')
	};
	// função para revomer item da lista
	const handleRemoveItem = (itemId: string) => {
		if (listId) {
			removeItemFromList(listId, itemId);
			toast.showToast('Item removido com sucesso !', 'success')
		}
	};

	// funções para controle da abertura do modal
	const openEditModal = (item: PurchaseItem) => {
		setEditingItem(item);
		setIsEditModalVisible(true);
	};

	const closeEditModal = () => {
		setIsEditModalVisible(false);
		setEditingItem(null);
	};

	// função para salvar edição do item
	const handleSaveEditedItem = (
		itemId: string,
		updatedItemData: Partial<PurchaseItem>,
	) => {
		if (listId) {
			updateItemInList(listId, itemId, updatedItemData);
			toast.showToast('Item editado com sucesso !', 'success')
		}
	};

	if (!list) {
		return (
			<View className="flex-1 justify-center items-center bg-background">
				<Text className="text-xl font-bold text-destructive">
					Lista não encontrada!
				</Text>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			className="flex-1 bg-background"
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			style={{ paddingBottom: totalTabBarEffectiveHeight }}
		>
			<View className="flex-1 p-4 ">
				<Stack.Screen options={{
					title: '', headerStyle: {
						backgroundColor: 'hsl(226.2 30% 10%)',
					},
					headerTintColor: '#FFFFFF',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
				/>
				<View className="border border-border p-2 rounded-lg mb-2">
					<Text className="text-2xl font-bold text-foreground">
						{list.name}
					</Text>
					<Text className="text-md text-muted-foreground mb-2">
						Criada em:{" "}
						{new Date(list.dateCreation).toLocaleDateString()}
					</Text>
					<Text className="text-md text-muted-foreground">
						Valor Previsto: R${" "}
						{list.TotalExpectedValue?.toFixed(2) || "0.00"}
					</Text>
					<Text className="text-md text-muted-foreground">
						Status: {list.status}
					</Text>
					<Text className="text-md text-muted-foreground">
						Mercado: {list.marketName || "Não definido"}
					</Text>
				</View>

				{/* Componente para adicionar novo item */}
				<AddItemForm onAddItem={handleAddItem} />

				<Text className="text-xl font-semibold mb-3 text-foreground">
					Itens da Lista:
				</Text>
				<View className="flex-1">
					<View className="flex-1 border border-border p-3 rounded-lg">
						{list.items.length === 0 ? (
							<Text className="text-muted-foreground">
								Nenhum item nesta lista ainda.
							</Text>
						) : (
							<FlatList
								data={list.items}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<PurchaseItemCard
										item={item}
										onEdit={openEditModal}
										onRemove={handleRemoveItem}
									/>
								)}
							/>
						)}
					</View>
				</View>
			</View>

			{/* Componente Modal de Edição de Item */}
			<EditItemModal
				isVisible={isEditModalVisible}
				itemToEdit={editingItem}
				onSave={handleSaveEditedItem}
				onClose={closeEditModal}
			/>
		</KeyboardAvoidingView>
	);
}
