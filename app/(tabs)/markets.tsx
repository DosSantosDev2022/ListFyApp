import { BottomSheetModal, Button } from "@/components/ui";
import {
	Text,
	View,
	FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useToast } from "@/components/ui/toast";
import { EmptyStateMarkets, MarketListItem, MarketSearchModalContent } from '@/components/tabs';

// Importar o store Zustand
import { useMarketStore } from '@/store/favoriteMarkets';
import type { Market } from "@/types";
import { CenteredModal } from "@/components/ui/CenteredModal";


const Maps_API_KEY = process.env.EXPO_PUBLIC_Maps_API_KEY;

export default function MarketsScreen() {
	const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
	// NOVO ESTADO: Para o modal de confirmação de exclusão
	const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

	const [currentLocation, setCurrentLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(
		{ latitude: -23.55052, longitude: -46.633309 } // Padrão: São Paulo
	);
	const [selectedMarketIds, setSelectedMarketIds] = useState<string[]>([]);
	const toast = useToast();

	// Usar o store Zustand
	const favoriteMarkets = useMarketStore((state) => state.favoriteMarkets);
	const addFavoriteMarket = useMarketStore((state) => state.addFavoriteMarket);
	const removeFavoriteMarkets = useMarketStore((state) => state.removeFavoriteMarkets);

	// --- Efeito de Localização ---
	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				alert({
					title: "Permissão Necessária",
					textBody: "Para encontrar mercados próximos, precisamos da sua permissão de localização. Por favor, conceda-a nas configurações do aplicativo.",
					button: 'Entendi',
				});
				return;
			}
			try {
				const location = await Location.getCurrentPositionAsync({});
				setCurrentLocation({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});
			} catch (error) {
				console.error("Erro ao obter localização inicial:", error);
				toast.showToast("Não foi possível obter sua localização atual.", "destructive");
			}
		})();
	}, [toast]);

	// --- Adicionar mercado favorito ---
	const handleAddFavoriteMarket = (market: Market) => {
		addFavoriteMarket(market);
		toast.showToast(
			`"${market.name}" adicionado aos favoritos!`,
			"success",
		);
		setIsSearchModalVisible(false);
	};

	// --- Alternar seleção de um mercado ---
	const handleToggleSelectMarket = (id: string) => {
		setSelectedMarketIds((prevSelectedIds) =>
			prevSelectedIds.includes(id)
				? prevSelectedIds.filter((selectedId) => selectedId !== id)
				: [...prevSelectedIds, id],
		);
	};

	// --- Funções para o novo modal de confirmação de exclusão ---
	const handleOpenConfirmDeleteModal = () => {
		if (selectedMarketIds.length > 0) {
			setIsConfirmDeleteModalVisible(true);
		}
	};
	const handleCloseConfirmDeleteModal = () => {
		setIsConfirmDeleteModalVisible(false);
	};

	// --- Remover mercados selecionados (agora ativada pelo modal de confirmação) ---
	const handleConfirmRemoveSelectedMarkets = () => {
		removeFavoriteMarkets(selectedMarketIds);
		setSelectedMarketIds([]);
		toast.showToast(
			`${selectedMarketIds.length} mercado(s) removido(s) dos favoritos.`,
			"success",
		);
		handleCloseConfirmDeleteModal(); // Fecha o modal após a exclusão
	};

	return (

		<SafeAreaView className="flex-1 p-3 bg-background">
			<Text className="text-foreground text-2xl font-bold mb-4 text-center">
				Meus Supermercados Favoritos
			</Text>

			<Button
				onPress={() => {
					setIsSearchModalVisible(true);
				}}
				className="mb-4 flex gap-1 flex-row"
			>
				<MaterialCommunityIcons
					name="store-plus"
					size={20}
					color="white"
					className="mr-2"
				/>
				<Text className="text-primary-foreground font-bold">
					Adicionar Novo Mercado
				</Text>
			</Button>

			{selectedMarketIds.length > 0 && (
				<Button
					// Agora, este botão abre o modal de confirmação
					onPress={handleOpenConfirmDeleteModal}
					className="mb-4 bg-destructive flex flex-row gap-1"
				>
					<MaterialCommunityIcons
						name="trash-can-outline"
						size={20}
						color="white"
						className="mr-2"
					/>
					<Text className="text-primary-foreground font-bold">
						Excluir Selecionados ({selectedMarketIds.length})
					</Text>
				</Button>
			)}

			{favoriteMarkets.length === 0 ? (
				<EmptyStateMarkets />
			) : (
				<FlatList
					data={favoriteMarkets}
					renderItem={({ item }) => (
						<MarketListItem
							item={item}
							isSelected={selectedMarketIds.includes(item.id)}
							onToggleSelect={handleToggleSelectMarket}
						/>
					)}
					keyExtractor={(item) => item.id}
					className="w-full"
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			)}

			{/* Modal para Pesquisar e Adicionar Mercados (EXISTENTE) */}
			<BottomSheetModal
				visible={isSearchModalVisible}
				onClose={() => setIsSearchModalVisible(false)}
				title="Encontrar e Adicionar Mercado"
			>
				<MarketSearchModalContent
					Maps_API_KEY={Maps_API_KEY}
					onMarketSelected={handleAddFavoriteMarket}
					currentLocation={currentLocation}
					setCurrentLocation={setCurrentLocation}
				/>
			</BottomSheetModal>

			{/* NOVO MODAL: Para Confirmação de Exclusão de Mercados Favoritos */}
			<CenteredModal
				visible={isConfirmDeleteModalVisible}
				onClose={handleCloseConfirmDeleteModal}
				title="Confirmar Exclusão"
			>
				<View className="p-4 items-center">
					<Text className="text-foreground text-lg text-center mb-6">
						Tem certeza que deseja remover{" "}
						<Text className="font-bold text-destructive">
							{selectedMarketIds.length} mercado(s) favorito(s)
						</Text>
						?
					</Text>
					<View className="flex-row gap-x-3 w-full">
						<Button
							className="flex-1 bg-destructive"
							onPress={handleConfirmRemoveSelectedMarkets}
						>
							<Text className="text-primary-foreground font-bold">Remover</Text>
						</Button>
						<Button
							className="flex-1"
							variant="outline"
							onPress={handleCloseConfirmDeleteModal}
						>
							<Text className="text-foreground">Cancelar</Text>
						</Button>
					</View>
				</View>
			</CenteredModal>

		</SafeAreaView>

	);
}