import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button, H4, P, BottomSheetModal, Input } from "@/components/ui";
import { useListStore } from "@/store/listStore";
import type { ShoppingList } from "@/types";
import { ShoppingListItem } from "@/components/tabs";
import { totalTabBarEffectiveHeight } from "./_layout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "@/components/ui/toast";
import { twMerge } from "tailwind-merge";

type FilterOption = 'Pendente' | 'Arquivado' | 'Concluída' | 'Todos';

export default function HomeScreen() {
	const { lists, addList, removeList, renameList, archieList } = useListStore();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [nameList, setNameList] = useState('')
	const [filterStatus, setFilterStatus] = useState<FilterOption>('Todos');
	const toast = useToast();

	const handleOpenModal = () => setIsModalVisible(true);
	const handleCloseModal = () => {
		setIsModalVisible(false);
		// Limpar o input quando o modal fechar, seja por salvar ou cancelar
		setNameList('');
	};

	// Função para adicionar uma nova lista
	const handleAddList = () => {
		if (nameList.trim() === '') {
			toast.showToast('O nome é obrigatório !', 'destructive')
			return;
		}
		addList({ name: nameList.trim() }); // Adiciona a lista ao store
		toast.showToast('Lista adicionada com sucesso !', 'success')
		handleCloseModal(); // Fecha o modal e limpa o input
	};

	// Logica de filtragem e ordenação 

	const filteredAndSortedList = useMemo(() => {
		let currentLists = [...lists] // cria uma cópia para não modificar o array original

		if (filterStatus !== 'Todos') {
			currentLists = currentLists.filter(list => list.status === filterStatus)
		}

		currentLists.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
		return currentLists
	}, [lists, filterStatus])


	// Componente para renderizar cada item da lista (FlatList)
	const renderItem = ({ item }: { item: ShoppingList }) => (
		<ShoppingListItem item={item} onRemove={removeList} onRename={renameList} archieList={archieList} />
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
			{/* Seção de filtros para lista */}
			<View className="flex-row justify-around items-center mt-4 p-2 bg-secondary/50 rounded-lg">
				<TouchableOpacity
					className={twMerge(
						"py-2 px-4 rounded-md",
						filterStatus === 'Todos' ? "bg-primary" : "bg-transparent"
					)}
					onPress={() => setFilterStatus('Todos')}
				>
					<Text className={twMerge(
						"text-sm font-medium",
						filterStatus === 'Todos' ? "text-primary-foreground" : "text-foreground"
					)}>Todas</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className={twMerge(
						"py-2 px-4 rounded-md",
						filterStatus === 'Pendente' ? "bg-primary" : "bg-transparent"
					)}
					onPress={() => setFilterStatus('Pendente')}
				>
					<Text className={twMerge(
						"text-sm font-medium",
						filterStatus === 'Pendente' ? "text-primary-foreground" : "text-foreground"
					)}>Pendentes</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className={twMerge(
						"py-2 px-4 rounded-md",
						filterStatus === 'Arquivado' ? "bg-primary" : "bg-transparent"
					)}
					onPress={() => setFilterStatus('Arquivado')}
				>
					<Text className={twMerge(
						"text-sm font-medium",
						filterStatus === 'Arquivado' ? "text-primary-foreground" : "text-foreground"
					)}>Arquivadas</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className={twMerge(
						"py-2 px-4 rounded-md",
						filterStatus === 'Concluída' ? "bg-primary" : "bg-transparent"
					)}
					onPress={() => setFilterStatus('Concluída')}
				>
					<Text className={twMerge(
						"text-sm font-medium",
						filterStatus === 'Concluída' ? "text-primary-foreground" : "text-foreground"
					)}>Concluídas</Text>
				</TouchableOpacity>

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
				{filteredAndSortedList.length === 0 ? (
					<P className="text-center text-foreground mt-8">
						{filterStatus === 'Todos'
							? 'Você ainda não tem listas de compras. Adicione uma!'
							: `Não há listas "${filterStatus}" para exibir.`}
					</P>
				) : (
					<View className="bg-secondary/50 px-3 py-4 mb-4 mt-2 rounded-lg">
						<FlatList
							data={filteredAndSortedList}
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
