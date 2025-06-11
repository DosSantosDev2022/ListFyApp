import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, H4, P, BottomSheetModal, Input } from "@/components/ui";
import { useListStore } from "@/store/listStore";
import type { ShoppingList } from "@/types";
import { ShoppingListItem } from "@/components/tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { totalTabBarEffectiveHeight } from "./_layout";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
	const { lists, addList, removeList, renameList } = useListStore();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [nameList, setNameList] = useState('')

	const handleOpenModal = () => setIsModalVisible(true);
	const handleCloseModal = () => {
		setIsModalVisible(false);
		// Limpar o input quando o modal fechar, seja por salvar ou cancelar
		setNameList('');
	};

	// Função para adicionar uma nova lista
	const handleAddList = () => {
		if (nameList.trim() === '') {
			alert('O nome é obrigatório !')
			return;
		}
		addList({ name: nameList.trim() }); // Adiciona a lista ao store
		handleCloseModal(); // Fecha o modal e limpa o input
	};

	// Componente para renderizar cada item da lista (FlatList)
	const renderItem = ({ item }: { item: ShoppingList }) => (
		<ShoppingListItem item={item} onRemove={removeList} onRename={renameList} />
	);

	return (
		<View
			className="flex-1 p-3 bg-background"
			style={{ paddingBottom: totalTabBarEffectiveHeight }}
		>
			<View className="flex-row justify-between items-center px-3 py-4 border border-border rounded-lg">
				<H4 className="text-foreground">Adicionar nova lista</H4>
				{/* Botão para adicionar nova lista */}
				<Button
					variant={"default"}
					size={"icon"}
					onPress={handleOpenModal}
				>
					<MaterialCommunityIcons
						name="plus"
						size={24}
						color="white"
					/>
				</Button>
			</View>

			{/* Modal adiciona lista */}

			<BottomSheetModal
				visible={isModalVisible}
				onClose={handleCloseModal} // Passa a função de fechamento
				title="Adicionar lista" // Título específico para esta tela
			// modalHeight={280} // Opcional: defina uma altura fixa se quiser
			>
				{/* Conteúdo específico para este modal */}
				<View className="p-4 w-full items-center">
					{/* Campo de input para o novo nome */}
					<Input
						placeholder="Nome da lista"
						value={nameList}
						onChangeText={setNameList}
						autoFocus // Foca automaticamente no input ao abrir
					/>

					{/* Botões de Salvar e Cancelar */}
					<View className="flex-row gap-x-3 mt-2">
						<Button className="flex-1" onPress={handleAddList}>
							<Text className="text-primary-foreground font-bold">Salvar</Text>
						</Button>
						<Button className="flex-1" variant="outline" onPress={handleCloseModal}>
							<Text className="text-foreground">Cancelar</Text>
						</Button>
					</View>
				</View>
			</BottomSheetModal>

			{/* Renderiza as listas */}
			<View className="flex-1">
				{lists.length === 0 ? (
					<P className="text-center text-foreground mt-8">
						Você ainda não tem listas de compras. Adicione uma!
					</P>
				) : (
					<View className="bg-secondary/50 px-3 py-4 mb-4 mt-2 rounded-lg">
						<FlatList
							data={lists}
							keyExtractor={(item) => item.id}
							renderItem={renderItem}
							contentContainerStyle={{ paddingBottom: 10 }}
							showsVerticalScrollIndicator={true}
							className="mt-6"
						/>
					</View>
				)}
			</View>
		</View>
	);
}
