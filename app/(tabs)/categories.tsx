import { CategoryItem } from "@/components/tabs/categories/categoryItem";
import { BottomSheetModal, Button, H4, Input } from "@/components/ui";
import { categories } from "@/enums/categories";
import { useCategoryStore } from "@/store/categoryStore";
import type { Category } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { totalTabBarEffectiveHeight } from "../_layout";
import { useToast } from "@/components/ui/toast";

export default function CategoriesScreen() {
	const toast = useToast();
	const { categories: customCategories, addCategory, deleteCategory, updateCategory } = useCategoryStore();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");

	// Combina categorias padrão e personalizadas
	const allCategories = [
		...categories.map(cat => ({
			id: cat.value, // Usando value como id para categorias padrão
			name: cat.label,
			isPadrao: true,
			icon: undefined, // Defina um ícone padrão se tiver, ou deixe undefined
			color: undefined, // Defina uma cor padrão se tiver, ou deixe undefined
		})),
		...customCategories,
	];

	const handleAddCustomCategory = () => {
		if (!newCategoryName.trim()) {
			toast.showToast('O nome da categoria é obrigatório !', 'destructive')
			return;
		}

		// Você precisará de uma forma de escolher ícones e cores
		// Por enquanto, vamos usar valores placeholder
		const newCategory: Category = {
			id: `custom-${Date.now()}`, // Gerar um ID único
			name: newCategoryName.trim(),
			isPadrao: false, // É uma categoria personalizada
		};

		addCategory(newCategory);
		toast.showToast('Categoria adicionada com sucesso !', 'success')
		setNewCategoryName("");
		setIsModalVisible(false);
	};


	return (
		<View className="flex-1 p-3 bg-background"
			style={{ paddingBottom: totalTabBarEffectiveHeight }}
		>
			{/* Cabeçalho e botão de adicionar categoria */}
			<View className="flex-row justify-between items-center px-3 py-4 border border-border rounded-lg mb-4">
				<H4 className="text-foreground">Minhas Categorias</H4>
				<Button
					variant={"default"}
					size={"icon"}
					onPress={() => setIsModalVisible(true)}
				>
					<MaterialCommunityIcons
						name="plus"
						size={24}
						color="white"
					/>
				</Button>
			</View>

			{/* Lista de Categorias */}
			<View className="flex-1 max-h-[520px] ">
				{allCategories.length === 0 ? (
					<Text className="text-foreground text-center mt-8">
						Você ainda não tem categorias.
					</Text>
				) : (
					<View className="bg-secondary/40 px-3 py-4 mb-4 mt-2 rounded-lg">
						<FlatList
							data={allCategories}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <CategoryItem onEdit={updateCategory} onDelete={deleteCategory} category={item} />}
							contentContainerStyle={{ paddingBottom: 20 }}
						/>

					</View>

				)}
			</View>

			{/* Modal para Adicionar Categoria */}
			<BottomSheetModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				title="Adicionar Nova Categoria"
			>
				<View className="p-4 w-full items-center">
					<Input
						placeholder="Nome da Categoria"
						value={newCategoryName}
						onChangeText={setNewCategoryName}
						className="mb-3"
					/>
					<View className="flex-row gap-x-3 w-full">
						<Button className="flex-1" onPress={handleAddCustomCategory}>
							<Text className="text-primary-foreground font-bold">Salvar</Text>
						</Button>
						<Button className="flex-1" variant="outline" onPress={() => setIsModalVisible(false)}>
							<Text className="text-foreground">Cancelar</Text>
						</Button>
					</View>
				</View>
			</BottomSheetModal>
		</View>
	);
}
