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
				className="flex-row items-center justify-between p-3 rounded-md  text-muted-foreground border border-input/20 bg-input/10"
				onPress={() => setModalVisible(true)}
			>
				<Text
					className={cn(
						"text-muted-foreground",
						!value && "text-muted-foreground",
					)}
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
					<View className="bg-secondary p-4 rounded-lg w-11/12 max-h-[50%] shadow-xl">
						<Text className="text-xl font-bold mb-4 text-foreground">
							Selecione a Unidade
						</Text>
						<FlatList
							data={units}
							keyExtractor={(item) => item.value}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="py-3 px-2 border-b border-border last:border-b-0"
									onPress={() => {
										onValueChange(item.value);
										setModalVisible(false);
									}}
								>
									<Text className="text-lg text-muted-foreground">
										{item.label}
									</Text>
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity
							className="mt-4 bg-primary py-3 rounded-md items-center"
							onPress={() => setModalVisible(false)}
						>
							<Text className="text-foreground font-semibold">
								Fechar
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}
