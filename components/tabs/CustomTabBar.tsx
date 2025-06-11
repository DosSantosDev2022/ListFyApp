// components/CustomTabBar.tsx
import type React from "react";
import {
	View,
	Text,
	Pressable,
	Platform, // Importe Platform para estilos específicos de sombra
} from "react-native";
import { useColorScheme } from "nativewind";
import { appColors } from "@/theme/appColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
	ClipboardList,
	Store,
	Tag,
	DollarSign,
	// PlusCircle, // Removendo PlusCircle pois o botão "Novo" será removido
} from "lucide-react-native";
import { twMerge } from "tailwind-merge";

// Mapeamento de nomes de rota para ícones
const icons = {
	home: ClipboardList,
	markets: Store,
	// Novo: PlusCircle, // Removendo a rota "Novo" do mapeamento
	categories: Tag,
	reports: DollarSign,
};

// Define a altura base da tab bar. Ajustado para ter espaço para os botões.
export const TAB_BAR_HEIGHT = 28;
export const MIDDLE_BUTTON_OFFSET = 30;
export const EXTRA_BOTTOM_SPACE = 1;

const CustomTabBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	const insets = useSafeAreaInsets();
	const { colorScheme } = useColorScheme(); // Isso te dá 'light' ou 'dark'
	// Obtenha as cores baseadas no tema atual
	const currentThemedColors = appColors[colorScheme || 'light'];

	return (
		<View
			className="absolute bottom-0 left-0 right-0 px-2"
			style={{
				paddingBottom: insets.bottom + EXTRA_BOTTOM_SPACE,
			}}
		>
			<View
				className={twMerge(`
          flex-row
          justify-around items-center
          px-2 py-3
          bg-background
					border border-border
          rounded-3xl
          overflow-visible
          ${Platform.OS === "ios" ? "shadow-black shadow-offset-[0px_-4px] shadow-opacity-20 shadow-radius-[5px]" : "elevation-8"}
        `)}
				style={{
					// Ajuste a altura da barra principal. Não precisa mais do MIDDLE_BUTTON_OFFSET
					height: TAB_BAR_HEIGHT + insets.bottom,
				}}
			>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					/* const label =
						options.tabBarLabel !== undefined
							? (options.tabBarLabel as string)
							: options.title !== undefined
								? options.title
								: route.name; */

					const isFocused = state.index === index;
					const IconComponent =
						icons[route.name as keyof typeof icons];

					const iconColor = isFocused
						? currentThemedColors.primary.foreground
						: currentThemedColors.muted.foreground;

					return (
						<Pressable
							key={route.key}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.title}
							onPress={() => {
								const event = navigation.emit({
									type: "tabPress",
									target: route.key,
									canPreventDefault: true,
								});

								if (!isFocused && !event.defaultPrevented) {
									navigation.navigate(route.name as never);
								}
							}}
							className={twMerge(`
                flex-1
                items-center justify-center
                mx-1
                py-4
                min-h-[56px]
                ${isFocused ? "bg-primary" : "bg-transparent"}
                ${isFocused ? "rounded-full" : "rounded-xl"}
              `)}
						>
							{IconComponent && (
								<IconComponent
									color={iconColor}
									size={24} // Tamanho fixo do ícone, pois não há mais botão do meio
								/>
							)}
							{/* {label && (
								<Text
									className={twMerge(`
                    text-[8px]
                    font-bold
                    mt-1
                    text-primary-foreground
                  `)}
								>
									{label as string}
								</Text>
							)} */}
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export { CustomTabBar };
