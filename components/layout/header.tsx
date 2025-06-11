// components/CustomHeader.tsx
import type React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserCircle2 } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage, Button, H1, H4, SideSheetModal } from "../ui";
import { useState } from "react";
import { Link } from "expo-router";
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge"; // Certifique-se de importar twMerge
import { useColorScheme } from "nativewind";
import { appColors } from "@/theme/appColors";

const CustomHeader: React.FC = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { colorScheme } = useColorScheme(); // Isso te dá 'light' ou 'dark'
	// Obtenha as cores baseadas no tema atual
	const currentThemedColors = appColors[colorScheme || 'light'];


	const handleOpenModal = () => setIsModalVisible(true);
	const handleCloseModal = () => {
		setIsModalVisible(false);
	};

	return (
		<SafeAreaView className="bg-background border-b border-border">
			<View className="flex-row items-center justify-between p-4">
				{/* Logo do App / Nome do App */}
				<View className="flex-row items-center">
					<H1 className="text-foreground text-2xl">ListFy App</H1>
				</View>
				<View className="ml-auto">
					<Button size={'icon'} variant={"default"} onPress={handleOpenModal}>
						<FontAwesome6 name="bars-staggered" size={24} color={currentThemedColors.foreground} />
					</Button>
				</View>

				<SideSheetModal
					title=""
					visible={isModalVisible}
					onClose={handleCloseModal}
					modalWidth={300} // Largura do modal
				>
					{/* Conteúdo do SideSheetModal */}
					<View className="flex-1 w-full"> {/* Ocupa a largura total do modal */}
						{/* Seção do Perfil/Login */}
						<View className="mb-8"> {/* Adiciona margem inferior para separar do menu */}
							<View className="flex-row items-center justify-between p-4">
								<H4 className="text-secondary-foreground text-lg">Olá, Juliano Santos</H4> {/* Tamanho e cor do fallback */}
								{/* Se houver foto de perfil, exiba-a aqui também */}
								<Avatar alt="user-profile-avatar-modal" className="w-12 h-12">
									<AvatarImage
										source={{
											uri: "https://avatars.githubusercontent.com/u/66306912?v=4",
										}}
									/>
									<AvatarFallback>
										<Text className="text-secondary-foreground text-lg">UN</Text> {/* Tamanho e cor do fallback */}
									</AvatarFallback>
								</Avatar>
							</View>
							<Button
								variant={'secondary'} // Fundo secundário para destacar
								className="w-full h-24 flex-row items-center gap-4 p-4 rounded-lg" // Ajuste o padding e gap
								onPress={() => {
									// Lógica para ir para a tela de login/perfil
									handleCloseModal(); // Fecha o modal ao navegar
								}}
							>
								<H4 className="text-secondary-foreground text-xl">Fazer login</H4>
							</Button>
						</View>

						{/* Seção de Links/Configurações */}
						<View className="border border-border rounded-lg p-2"> {/* Borda e padding para a seção */}
							{/* Item de Link: Configurações */}
							<Link href={'/home'} className="p-3 flex-row items-center gap-3 w-full rounded-md active:bg-secondary">
								<FontAwesome name="gear" size={24} color={currentThemedColors.foreground} /> {/* Cor do ícone */}
								<Text className="text-foreground text-xl">Configurações</Text>
							</Link>

							{/* Item de Link: Remover Propagandas */}
							<Link href={'/home'} className="p-3 flex-row items-center gap-3 w-full rounded-md active:bg-secondary">
								<FontAwesome name="dollar" size={24} color={currentThemedColors.foreground} /> {/* Exemplo de outro ícone */}
								<Text className="text-foreground text-xl">Remover propagandas</Text>
							</Link>

							{/* Item de Link: Ajuda e Feedback */}
							<Link href={'/home'} className="p-3 flex-row items-center gap-3 w-full rounded-md active:bg-secondary">
								<FontAwesome name="question-circle" size={24} color={currentThemedColors.foreground} /> {/* Exemplo de outro ícone */}
								<Text className="text-foreground text-xl">Ajuda e feedback</Text>
							</Link>

							{/* Item de Link:Curtir aplicativo */}
							<Link href={'/home'} className="p-3 flex-row items-center gap-3 w-full rounded-md active:bg-secondary">
								<AntDesign name="like1" size={24} color={currentThemedColors.foreground} />
								<Text className="text-foreground text-xl">Curtiu o aplicativo ?</Text>
							</Link>
						</View>
					</View>
				</SideSheetModal>
			</View>
		</SafeAreaView>
	);
};

export default CustomHeader;