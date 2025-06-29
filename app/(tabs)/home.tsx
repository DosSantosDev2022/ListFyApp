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
import { useMarketStore } from "@/store/favoriteMarkets";
import type { Market } from "@/types";

type FilterOption = 'Pendente' | 'Arquivado' | 'Concluída' | 'Todos';

export default function HomeScreen() {
	const { lists, addList, removeList, renameList, archieList } = useListStore();
	const { favoriteMarkets } = useMarketStore(); // Acessar os mercados favoritos

	const [isCreateListModalVisible, setIsCreateListModalVisible] = useState(false); // Renomeado para clareza
	const [isSelectMarketModalVisible, setIsSelectMarketModalVisible] = useState(false); // Novo estado para o modal de seleção de mercado

	const [nameList, setNameList] = useState('');
	const [selectedMarket, setSelectedMarket] = useState<Market | null>(null); // Novo estado para o mercado selecionado

	const [filterStatus, setFilterStatus] = useState<FilterOption>('Todos');
	const toast = useToast();

	const handleOpenCreateListModal = () => setIsCreateListModalVisible(true);
	const handleCloseCreateListModal = () => {
		setIsCreateListModalVisible(false);
		setNameList('');
		setSelectedMarket(null); // Limpa o mercado selecionado ao fechar
	};

	const handleOpenSelectMarketModal = () => setIsSelectMarketModalVisible(true);
	const handleCloseSelectMarketModal = () => setIsSelectMarketModalVisible(false);

	// Função para adicionar uma nova lista
	const handleAddList = () => {
		if (nameList.trim() === '') {
			toast.showToast('O nome da lista é obrigatório!', 'destructive');
			return;
		}

		addList({
			name: nameList.trim(),
			marketId: selectedMarket?.id,    // Passa o ID do mercado selecionado
			marketName: selectedMarket?.name, // Passa o nome do mercado selecionado
		});

		toast.showToast('Lista adicionada com sucesso!', 'success');
		handleCloseCreateListModal(); // Fecha o modal principal e limpa
	};

	// Lógica para selecionar um mercado no modal de seleção
	const handleSelectMarket = (market: Market) => {
		setSelectedMarket(market);
		handleCloseSelectMarketModal(); // Fecha o modal de seleção de mercado
	};

	// Logica de filtragem e ordenação 
	const filteredAndSortedList = useMemo(() => {
		let currentLists = [...lists];

		if (filterStatus !== 'Todos') {
			currentLists = currentLists.filter(list => list.status === filterStatus);
		}

		currentLists.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
		return currentLists;
	}, [lists, filterStatus]);

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
					onPress={handleOpenCreateListModal} // Abre o modal principal
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

			{/* Modal principal para ADICIONAR LISTA */}
			<BottomSheetModal
				visible={isCreateListModalVisible}
				onClose={handleCloseCreateListModal}
				title="Adicionar nova lista"
			>
				<View className="p-4 w-full">
					{/* Campo de input para o nome da lista */}
					<Input
						placeholder="Nome da lista"
						value={nameList}
						onChangeText={setNameList}
						autoFocus
						className="mb-3"
					/>

					{/* Botão/Seletor de Mercado Favorito */}
					<TouchableOpacity
						className="flex-row items-center justify-between p-3 border border-border rounded-lg bg-input h-12 mb-4"
						onPress={handleOpenSelectMarketModal} // Abre o modal de seleção de mercado
					>
						<Text className="text-muted-foreground text-base flex-1">
							{selectedMarket ? selectedMarket.name : "Vincular a um Mercado (Opcional)"}
						</Text>
						<MaterialCommunityIcons
							name="chevron-right"
							size={24}
							color="gray"
						/>
					</TouchableOpacity>


					{/* Botões de Salvar e Cancelar */}
					<View className="flex-row gap-x-3 mt-2">
						<Button className="flex-1" onPress={handleAddList}>
							<Text className="text-primary-foreground font-bold">Salvar Lista</Text>
						</Button>
						<Button className="flex-1" variant="outline" onPress={handleCloseCreateListModal}>
							<Text className="text-foreground">Cancelar</Text>
						</Button>
					</View>
				</View>
			</BottomSheetModal>

			{/* Modal SECUNDÁRIO para SELECIONAR MERCADO FAVORITO */}
			<BottomSheetModal
				visible={isSelectMarketModalVisible}
				onClose={handleCloseSelectMarketModal}
				title="Escolha um Mercado Favorito"
				modalHeight={400} // Altura ajustada para a lista de mercados
			>
				<View className="flex-1 p-4 w-full">
					{favoriteMarkets.length === 0 ? (
						<View className="flex-1 justify-center items-center">
							<Text className="text-center text-muted-foreground">
								Você ainda não tem mercados favoritos.{"\n"}Adicione-os na tela de Mercados!
							</Text>
						</View>
					) : (
						<FlatList
							data={favoriteMarkets}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="flex-row items-center p-3 my-1 bg-secondary/50 rounded-lg border border-border"
									onPress={() => handleSelectMarket(item)}
								>
									<MaterialCommunityIcons name="store-outline" size={20} color="white" className="mr-2" />
									<View className="flex-1 pr-2">
										<Text className="text-foreground text-lg font-medium">{item.name}</Text>
										<Text className="text-muted-foreground text-sm" numberOfLines={1} ellipsizeMode="tail">{item.address}</Text>
									</View>
									{selectedMarket?.id === item.id && (
										<MaterialCommunityIcons name="check-circle" size={24} color="green" />
									)}
								</TouchableOpacity>
							)}
							contentContainerStyle={{ paddingBottom: 20 }}
						/>
					)}
				</View>
			</BottomSheetModal>

			{/* Renderiza as listas */}
			<View className="flex-1">
				{filteredAndSortedList.length === 0 ? (
					<Text className="text-center text-foreground mt-8">
						{filterStatus === 'Todos'
							? 'Você ainda não tem listas de compras. Adicione uma!'
							: `Não há listas "${filterStatus}" para exibir.`}
					</Text>
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