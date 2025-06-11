import React, { useEffect, useRef, useState } from "react";
import { View, Text, Alert, Animated } from "react-native";
import { Input, Button } from "@/components/ui";
import type { PurchaseItem } from "@/types";
import UnitSelect from "@/components/unit-select";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AddItemFormProps {
	onAddItem: (
		newItem: Omit<PurchaseItem, "id" | "totalValueItem">,
	) => void;
}

const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const [newItemName, setNewItemName] = useState("");
	const [newItemAmount, setNewItemAmount] = useState("");
	const [newItemUnit, setNewItemUnit] = useState("");
	const [newItemUnitValue, setNewItemUnitValue] = useState("");

	useEffect(() => {
		Animated.timing(rotateAnim, {
			toValue: isOpen ? 1 : 0, // Anima para 1 (aberto) ou 0 (fechado)
			duration: 300, // Duração da animação em ms
			useNativeDriver: true, // Use o driver nativo para performance
		}).start();
	}, [isOpen, rotateAnim]);

	const chevronRotation = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg'], // Gira 180 graus (para cima quando 'isOpen' é true)
	});

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

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
		<View className="bg-background border border-border p-4 rounded-lg shadow-md mb-6 flex flex-col gap-2">
			<View className="flex-row justify-between items-center">
				<Text className="text-xl font-semibold mb-3 text-foreground">
					Adicionar Novo Item
				</Text>
				<Button className="" size={'icon'} onPress={handleToggle}>
					<Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
						<MaterialCommunityIcons name="chevron-down" size={24} color="white" />
					</Animated.View>
				</Button>
			</View>
			{isOpen && (
				<>
					<View className="flex flex-col gap-2">
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
						<UnitSelect
							value={newItemUnit}
							onValueChange={setNewItemUnit}
							placeholder="Selecione a Unidade"
						/>
						<Input
							placeholder="Valor Unitário (Opcional, ex: 5.50)"
							keyboardType="numeric"
							value={newItemUnitValue}
							onChangeText={setNewItemUnitValue}
						/>
					</View>
					<Button onPress={handleAddItem}>
						<Text className="text-foreground">Adicionar Item</Text>
					</Button>
				</>
			)}

		</View>
	);
};

export { AddItemForm };
