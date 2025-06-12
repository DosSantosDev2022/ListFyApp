import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui";
import type { PurchaseItem } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";

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
			className="p-4 mb-3 bg-secondary rounded-lg border border-border flex-row justify-between items-center"
			onPress={() => onEdit(item)}
		>
			<View className="flex-1">
				<Text className="font-medium text-muted-foreground">
					{item.name} ({item.amount} {item.unit || ""})
				</Text>
				{item.unitvalue !== undefined && (
					<Text className="text-sm text-muted-foreground">
						R$ {item.unitvalue?.toFixed(2)}/un. - Total: R${" "}
						{item.totalValueItem?.toFixed(2)}
					</Text>
				)}
				<Text className="font-medium text-muted-foreground">
					{item.category?.name || 'Sem categoria'}
				</Text>
			</View>
			<Button
				size={"icon"}
				variant={"destructive"}
				onPress={() => onRemove(item.id)}
			>
				<MaterialIcons name="delete" size={22} color={"#fff"} />
			</Button>
		</TouchableOpacity>
	);
};

export { PurchaseItemCard };
