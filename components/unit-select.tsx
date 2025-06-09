import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	FlatList,
} from "react-native";
import { cn } from "@/lib/utils"; // Assumindo que você tem um utilitário para className merging
import { ChevronDown } from "lucide-react-native"; // Ícone para indicar dropdown

interface UnitSelectProps {
	value: string;
	onValueChange: (newValue: string) => void;
	placeholder?: string;
	className?: string;
}

const units = [
	{ label: "Unidade (un)", value: "un" },
	{ label: "Quilograma (kg)", value: "kg" },
	{ label: "Grama (g)", value: "g" },
];

export default function UnitSelect({
	value,
	onValueChange,
	placeholder = "Selecione a Unidade",
	className,
}: UnitSelectProps) {
	const [modalVisible, setModalVisible] = useState(false);

	const selectedLabel =
		units.find((unit) => unit.value === value)?.label || placeholder;

	return (
		<View className={cn("relative", className)}>
			<TouchableOpacity
				className="flex-row items-center justify-between border border-gray-300 p-3 rounded-md mb-3 text-gray-800 bg-white"
				onPress={() => setModalVisible(true)}
			>
				<Text
					className={cn("text-gray-800", !value && "text-gray-500")}
				>
					{selectedLabel}
				</Text>
				<ChevronDown size={20} color="#6B7280" />
			</TouchableOpacity>

			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					className="flex-1 justify-center items-center bg-black/50"
					onPress={() => setModalVisible(false)} // Fecha modal ao tocar fora
				>
					<View className="bg-white p-4 rounded-lg w-11/12 max-h-[50%] shadow-xl">
						<Text className="text-xl font-bold mb-4 text-gray-800">
							Selecione a Unidade
						</Text>
						<FlatList
							data={units}
							keyExtractor={(item) => item.value}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="py-3 px-2 border-b border-gray-200 last:border-b-0"
									onPress={() => {
										onValueChange(item.value);
										setModalVisible(false);
									}}
								>
									<Text className="text-lg text-gray-700">
										{item.label}
									</Text>
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity
							className="mt-4 bg-gray-200 py-3 rounded-md items-center"
							onPress={() => setModalVisible(false)}
						>
							<Text className="text-gray-700 font-semibold">
								Fechar
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}
