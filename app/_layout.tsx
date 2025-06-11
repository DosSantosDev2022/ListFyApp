import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import CustomHeader from "@/components/layout/header";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
	EXTRA_BOTTOM_SPACE,
	TAB_BAR_HEIGHT,
} from "@/components/tabs/CustomTabBar";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export let totalTabBarEffectiveHeight: number;

export default function RootLayout() {
	const insets = useSafeAreaInsets();

	totalTabBarEffectiveHeight =
		TAB_BAR_HEIGHT + insets.bottom + EXTRA_BOTTOM_SPACE;
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<SafeAreaProvider>
	<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: true,
					header: () => <CustomHeader />,
					headerTitle: "",
				}}
			/>
			<Stack.Screen
				name="modal"
				options={{ presentation: "modal" }}
			/>
		</Stack>
		</SafeAreaProvider>
	
	);
}
