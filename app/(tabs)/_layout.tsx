// app/(tabs)/_layout.tsx
import type React from "react";
import { Tabs } from "expo-router";
import {
	CustomTabBar,
	EXTRA_BOTTOM_SPACE,
	TAB_BAR_HEIGHT,
} from "@/components/tabs/CustomTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export let totalTabBarEffectiveHeight: number;

export default function TabLayout() {
	const insets = useSafeAreaInsets();

	totalTabBarEffectiveHeight =
		TAB_BAR_HEIGHT +
		insets.bottom +
		EXTRA_BOTTOM_SPACE / 2 +
		insets.bottom +
		60;

	return (
		<Tabs
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Despesas",
					headerTitle: "Minhas despesas",
					headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="markets"
				options={{
					title: "Mercados",
					headerTitle: "Mercados favoritos",
					headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="categories"
				options={{
					title: "Categorias",
					headerTitle: "Minhas categorias",
					headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="reports"
				options={{
					title: "Preços",
					headerTitle: "Comparação de preços",
					headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
					headerShadowVisible: false,
				}}
			/>
		</Tabs>
	);
}
