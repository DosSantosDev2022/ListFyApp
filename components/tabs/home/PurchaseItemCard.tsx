import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui";
import type { PurchaseItem } from "@/types";

interface PurchaseItemCardProps {
	item: PurchaseItem;
	onEdit: (item: PurchaseItem) => void;
	onRemove: (itemId: string) => void;
}

const PurchaseItemCard = ({
	item,
	onEdit,
	onRemove,
}: PurchaseItemCardProps) => {
	return (
		<TouchableOpacity
			className="bg-white p-3 mb-2 rounded shadow-sm flex-row justify-between items-center"
			onPress={() => onEdit(item)}
		>
			<View className="flex-1">
				<Text className="font-medium text-gray-700">
					{item.name} ({item.amount} {item.unit || ""})
				</Text>
				{item.unitvalue !== undefined && (
					<Text className="text-sm text-gray-500">
						R$ {item.unitvalue?.toFixed(2)}/un. - Total: R${" "}
						{item.totalValueItem?.toFixed(2)}
					</Text>
				)}
			</View>
			<Button
				variant={"destructive"}
				onPress={() => onRemove(item.id)}
			>
				<Text>X</Text>
			</Button>
		</TouchableOpacity>
	);
};

export { PurchaseItemCard };
