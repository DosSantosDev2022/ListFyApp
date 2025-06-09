import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Input, Button } from "@/components/ui";
import type { PurchaseItem } from "@/types";

interface AddItemFormProps {
	onAddItem: (
		newItem: Omit<PurchaseItem, "id" | "totalValueItem">,
	) => void;
}

const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
	const [newItemName, setNewItemName] = useState("");
	const [newItemAmount, setNewItemAmount] = useState("");
	const [newItemUnit, setNewItemUnit] = useState("");
	const [newItemUnitValue, setNewItemUnitValue] = useState("");

	const handleAddItem = () => {
		if (!newItemName.trim()) {
			Alert.alert("Erro", "O nome do item não pode ser vazio.");
			return;
		}

		const amount = parseFloat(newItemAmount.replace(",", ".")) || 0;
		const unitValue =
			parseFloat(newItemUnitValue.replace(",", ".")) || 0;

		const newItem: Omit<PurchaseItem, "id" | "totalValueItem"> = {
			name: newItemName.trim(),
			amount: amount,
			unit: newItemUnit.trim() || undefined,
			unitvalue: unitValue === 0 ? undefined : unitValue,
		};

		onAddItem(newItem); // Chama a função passada via prop

		// Limpar os campos após adicionar
		setNewItemName("");
		setNewItemAmount("");
		setNewItemUnit("");
		setNewItemUnitValue("");
	};

	return (
		<View className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col gap-2">
			<Text className="text-xl font-semibold mb-3 text-gray-800">
				Adicionar Novo Item
			</Text>
			<Input
				placeholder="Nome do Item"
				value={newItemName}
				onChangeText={setNewItemName}
			/>
			<Input
				placeholder="Quantidade (ex: 2)"
				keyboardType="numeric"
				value={newItemAmount}
				onChangeText={setNewItemAmount}
			/>
			<Input
				placeholder="Unidade (ex: kg, un)"
				value={newItemUnit}
				onChangeText={setNewItemUnit}
			/>
			<Input
				placeholder="Valor Unitário (Opcional, ex: 5.50)"
				keyboardType="numeric"
				value={newItemUnitValue}
				onChangeText={setNewItemUnitValue}
			/>
			<Button onPress={handleAddItem}>
				<Text className="text-foreground">Adicionar Item</Text>
			</Button>
		</View>
	);
};

export { AddItemForm };
