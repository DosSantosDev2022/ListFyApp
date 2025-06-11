import React from "react";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

const CustomButton = ({ size, color }) => {
	return (
		<View className="w-14 h-14 rounded-full bg-primary-foreground text-primary items-center justify-center mb-5">
			<Entypo color={color} size={size} />
		</View>
	);
};

export { CustomButton };
