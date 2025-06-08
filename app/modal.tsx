import { StatusBar } from "expo-status-bar";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "react-native";

export default function ModalScreen() {
	return (
		<View className="">
			<Text className="">Modal</Text>
			<View className="" />
			<EditScreenInfo path="app/modal.tsx" />
			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar />
		</View>
	);
}
