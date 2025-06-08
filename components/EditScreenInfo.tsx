import React from "react";
import { StyleSheet } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "react-native";

export default function EditScreenInfo({ path }: { path: string }) {
	return (
		<View>
			<View className="">
				<Text className="">Open up the code for this screen:</Text>

				<View className="">
					<MonoText>{path}</MonoText>
				</View>

				<Text className="">
					Change any of the text, save the file, and your app will
					automatically update.
				</Text>
			</View>

			<View className="">
				<ExternalLink href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
					<Text className="">
						Tap here if your app doesn't automatically update after
						making changes
					</Text>
				</ExternalLink>
			</View>
		</View>
	);
}
