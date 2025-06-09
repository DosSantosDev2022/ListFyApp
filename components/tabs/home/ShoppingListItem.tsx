import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/ui";
import type { ShoppingList } from "@/types"; // Importa o tipo ShoppingList

interface ShoppingListItemProps {
	item: ShoppingList;
	onRemove: (listId: string) => void;
}

const ShoppingListItem = ({
	item,
	onRemove,
}: ShoppingListItemProps) => {
	return (
		<View className="bg-white p-4 mb-3 rounded-lg shadow-md flex-row justify-between items-center">
			<Link
				href={{
					pathname: "/detailsLists/[id]",
					params: { id: item.id },
				}}
				asChild
			>
				<TouchableOpacity className="flex-1">
					<Text className="text-lg font-bold text-gray-800">
						{item.name}
					</Text>
					<Text className="text-sm text-gray-500">
						Criada em:{" "}
						{new Date(item.dateCreation).toLocaleDateString()}
					</Text>
					<Text className="text-sm text-gray-500">
						Total Previsto: R${" "}
						{item.TotalExpectedValue?.toFixed(2) || "0.00"}
					</Text>
					<Text className="text-sm text-gray-500 capitalize">
						Status: {item.status}
					</Text>
				</TouchableOpacity>
			</Link>
			<Button
				variant={"destructive"}
				onPress={() => onRemove(item.id)} // Chama a função onRemove passada via props
			>
				<Text className="text-foreground">Remover</Text>
			</Button>
		</View>
	);
};

export { ShoppingListItem };
