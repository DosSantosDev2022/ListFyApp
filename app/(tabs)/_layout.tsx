import type React from "react";
import { Link, Tabs } from "expo-router";
import {
	ClipboardList,
	Store,
	Tag,
	Info,
	DollarSign,
} from "lucide-react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarActiveTintColor: "hsl(0 0% 100%)",
				tabBarInactiveTintColor: "hsl(0 0% 100%)",
				tabBarItemStyle: {
					backgroundColor: "hsl(203 64% 24%)",
					borderRadius: 8, // Borda arredondada para o background da aba
					marginHorizontal: 4, // Espaçamento entre os itens da aba
					marginVertical: 8, // Margem vertical para dar espaço
					// O background da aba ativa será definido no 'options' de cada Tabs.Screen
				},
				tabBarStyle: {
					backgroundColor: "hsl(203 64% 24%)",
					borderTopWidth: 1,
					borderTopColor: "hsl(203 20% 82)",
					height: 85,
					paddingBottom: 5,
					paddingTop: 5,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "bold",
				},
				tabBarIconStyle: {
					// Ajuste o estilo do ícone se necessário, mas Lucide já tem bom padrão
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Minhas despesas",
					tabBarIcon: ({ color, size }) => (
						<Store color={color} size={size} />
					),
					headerStyle: {
						backgroundColor: "hsl(203 64% 100%)",
						borderBottomWidth: 2,
						borderBottomColor: "hsl(203 0% 90%)",
					},
					headerTintColor: "hsl(203 64% 24%)",
					headerTitleStyle: {
						fontWeight: "bold",
						fontSize: 22,
					},
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="markets"
				options={{
					title: "Mercados",
					tabBarIcon: ({ color, size }) => (
						<Store color={color} size={size} />
					),
					headerStyle: {
						backgroundColor: "hsl(203 64% 100%)",
						borderBottomWidth: 2,
						borderBottomColor: "hsl(203 0% 90%)",
					},
					headerTintColor: "hsl(203 64% 24%)",
					headerTitleStyle: {
						fontWeight: "bold",
						fontSize: 22,
					},
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="categories"
				options={{
					title: "Categorias",
					tabBarIcon: ({ color, size }) => (
						<Tag color={color} size={size} />
					),
					headerStyle: {
						backgroundColor: "hsl(203 64% 100%)",
						borderBottomWidth: 2,
						borderBottomColor: "hsl(203 0% 90%)",
					},
					headerTintColor: "hsl(203 64% 24%)",
					headerTitleStyle: {
						fontWeight: "bold",
						fontSize: 22,
					},
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="reports"
				options={{
					title: "Preços",
					tabBarIcon: ({ color, size }) => (
						<DollarSign color={color} size={size} />
					),
					headerStyle: {
						backgroundColor: "hsl(203 64% 100%)",
						borderBottomWidth: 2,
						borderBottomColor: "hsl(203 0% 90%)",
					},
					headerTintColor: "hsl(203 64% 24%)",
					headerTitleStyle: {
						fontWeight: "bold",
						fontSize: 22,
					},
					headerShadowVisible: false,
				}}
			/>
		</Tabs>
	);
}
