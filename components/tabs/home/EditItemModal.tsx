import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Modal,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Button } from "@/components/ui";
import type { PurchaseItem } from "@/types";

interface EditItemModalProps {
	isVisible: boolean;
	itemToEdit: PurchaseItem | null;
	onSave: (
		itemId: string,
		updatedItem: Partial<PurchaseItem>,
	) => void;
	onClose: () => void;
}

const EditItemModal = ({
	isVisible,
	itemToEdit,
	onSave,
	onClose,
}: EditItemModalProps) => {
	const [editItemName, setEditItemName] = useState("");
	const [editItemAmount, setEditItemAmount] = useState("");
	const [editItemUnit, setEditItemUnit] = useState("");
	const [editItemUnitValue, setEditItemUnitValue] = useState("");

	useEffect(() => {
		if (itemToEdit) {
			setEditItemName(itemToEdit.name);
			setEditItemAmount(itemToEdit.amount?.toString() || "");
			setEditItemUnit(itemToEdit.unit || "");
			// Verifique se unitValue existe antes de chamar toFixed
			setEditItemUnitValue(
				itemToEdit.unitvalue !== undefined &&
					itemToEdit.unitvalue !== null
					? itemToEdit.unitvalue.toFixed(2)
					: "",
			);
		} else {
			// Limpar os estados quando o modal não está visível ou não há item para editar
			setEditItemName("");
			setEditItemAmount("");
			setEditItemUnit("");
			setEditItemUnitValue("");
		}
	}, [itemToEdit]);

	const handleSave = () => {
		if (!itemToEdit) return;

		const amount = parseFloat(editItemAmount.replace(",", ".")) || 0;
		const unitValue =
			parseFloat(editItemUnitValue.replace(",", ".")) || 0;

		const updatedItem: Partial<PurchaseItem> = {
			name: editItemName.trim(),
			amount: amount,
			unit: editItemUnit.trim() || undefined,
			unitvalue: unitValue === 0 ? undefined : unitValue,
		};
		onSave(itemToEdit.id, updatedItem);
		onClose();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				className="flex-1 justify-center items-center bg-black/50"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View className="bg-white p-6 rounded-lg w-11/12 shadow-xl">
					<Text className="text-2xl font-bold mb-5 text-primary text-start">
						Editar Item
					</Text>
					<TextInput
						className="border border-gray-300 p-3 rounded-md mb-3 text-gray-800"
						placeholder="Nome do Item"
						value={editItemName}
						onChangeText={setEditItemName}
					/>
					<TextInput
						className="border border-gray-300 p-3 rounded-md mb-3 text-gray-800"
						placeholder="Quantidade"
						keyboardType="numeric"
						value={editItemAmount}
						onChangeText={setEditItemAmount}
					/>
					<TextInput
						className="border border-gray-300 p-3 rounded-md mb-3 text-gray-800"
						placeholder="Unidade"
						value={editItemUnit}
						onChangeText={setEditItemUnit}
					/>
					<TextInput
						className="border border-gray-300 p-3 rounded-md mb-4 text-gray-800"
						placeholder="Valor Unitário"
						keyboardType="numeric"
						value={editItemUnitValue}
						onChangeText={setEditItemUnitValue}
					/>
					<View className="flex-row justify-end gap-2">
						<Button variant={"secondary"} onPress={handleSave}>
							<Text>Salvar</Text>
						</Button>
						<Button variant={"destructive"} onPress={onClose}>
							<Text>Cancelar</Text>
						</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export { EditItemModal };
